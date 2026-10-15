-- Problematic schema for Supabase (Postgres).
-- Run in the Supabase SQL editor, or with psql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles: 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Member',
  handle text unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, handle)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(coalesce(new.email, 'member@problematic.app'), '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'handle', 'member-' || substr(new.id::text, 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Posts: engagements start at 0 via default values
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id text primary key,
  title text not null,
  type text not null,
  category text not null,
  secondary_categories text[] not null default '{}',
  difficulty text not null default 'medium',
  problem text not null,
  author text not null default 'Member',
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  hints text[] not null default '{}',
  solution text not null default '',
  answer text not null default '',
  formula text not null default '',
  solution_status text not null default 'unsolved',
  vote_count integer not null default 0,
  comment_count integer not null default 0,
  share_count integer not null default 0
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_type_idx on public.posts (type);
create index if not exists posts_category_idx on public.posts (category);

-- ---------------------------------------------------------------------------
-- Votes: one row per (user, post) = natural dedup
-- ---------------------------------------------------------------------------
create table if not exists public.votes (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id text not null references public.posts (id) on delete cascade,
  direction smallint not null check (direction in (1, -1)),
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ---------------------------------------------------------------------------
-- Comments: parent_id gives reply threads
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references public.posts (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  author text not null default 'Member',
  text text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Shares: one row per (user, post) = dedup; count tracked on posts
-- ---------------------------------------------------------------------------
create table if not exists public.shares (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id text not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: public reads, users manage their own writes
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.votes enable row level security;
alter table public.comments enable row level security;
alter table public.shares enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
drop policy if exists "users edit own profile" on public.profiles;
create policy "profiles are readable" on public.profiles for select using (true);
create policy "users edit own profile" on public.profiles for update to authenticated using (id = auth.uid());

drop policy if exists "posts are readable" on public.posts;
drop policy if exists "authenticated create posts" on public.posts;
create policy "posts are readable" on public.posts for select using (true);
create policy "authenticated create posts" on public.posts for insert to authenticated with check (author_id = auth.uid());

drop policy if exists "votes are readable" on public.votes;
drop policy if exists "users manage own votes" on public.votes;
create policy "votes are readable" on public.votes for select using (true);
create policy "users manage own votes" on public.votes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "comments are readable" on public.comments;
drop policy if exists "users create comments" on public.comments;
drop policy if exists "authors edit own comments" on public.comments;
drop policy if exists "authors delete own comments" on public.comments;
create policy "comments are readable" on public.comments for select using (true);
create policy "users create comments" on public.comments for insert to authenticated with check (author_id = auth.uid());
create policy "authors edit own comments" on public.comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "authors delete own comments" on public.comments for delete to authenticated using (author_id = auth.uid());

drop policy if exists "shares are readable" on public.shares;
drop policy if exists "users create shares" on public.shares;
create policy "shares are readable" on public.shares for select using (true);
create policy "users create shares" on public.shares for insert to authenticated with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RPC: atomic engagement actions (single round-trip, counters stay in sync)
-- ---------------------------------------------------------------------------
create or replace function public.toggle_vote(p_post_id text, p_direction smallint)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_existing smallint;
  v_post public.posts;
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;

  select direction into v_existing
  from public.votes
  where user_id = v_user and post_id = p_post_id;

  if v_existing is null then
    insert into public.votes (user_id, post_id, direction)
    values (v_user, p_post_id, p_direction);
    update public.posts
    set vote_count = vote_count + p_direction
    where id = p_post_id;
  elsif v_existing = p_direction then
    delete from public.votes
    where user_id = v_user and post_id = p_post_id;
    update public.posts
    set vote_count = vote_count - p_direction
    where id = p_post_id;
  else
    update public.votes
    set direction = p_direction
    where user_id = v_user and post_id = p_post_id;
    update public.posts
    set vote_count = vote_count - v_existing + p_direction
    where id = p_post_id;
  end if;

  select * into v_post from public.posts where id = p_post_id;
  return v_post;
end;
$$;

create or replace function public.record_share(p_post_id text)
returns public.posts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_post public.posts;
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;

  if not exists (select 1 from public.shares where user_id = v_user and post_id = p_post_id) then
    insert into public.shares (user_id, post_id) values (v_user, p_post_id);
    update public.posts set share_count = share_count + 1 where id = p_post_id;
  end if;

  select * into v_post from public.posts where id = p_post_id;
  return v_post;
end;
$$;

create or replace function public.add_comment(p_post_id text, p_text text, p_parent_id uuid)
returns public.comments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_comment public.comments;
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;

  insert into public.comments (post_id, parent_id, author_id, author, text)
  values (
    p_post_id,
    p_parent_id,
    v_user,
    coalesce((select name from public.profiles where id = v_user), 'Member'),
    p_text
  )
  returning * into v_comment;

  update public.posts set comment_count = comment_count + 1 where id = p_post_id;

  return v_comment;
end;
$$;

grant execute on function public.toggle_vote(text, smallint) to authenticated;
grant execute on function public.record_share(text) to authenticated;
grant execute on function public.add_comment(text, text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Eligibility: every user starts ineligible until the check runs
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists eligible boolean not null default false;

-- ---------------------------------------------------------------------------
-- Reports: users flag posts, comments or profiles that break the guidelines
-- ---------------------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users (id) on delete set null,
  target_type text not null check (target_type in ('post', 'comment', 'profile')),
  target_id text not null,
  target_user_id uuid references auth.users (id) on delete set null,
  reason text not null,
  details text not null default '',
  status text not null default 'pending' check (status in ('pending', 'upheld', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists reports_target_user_idx on public.reports (target_user_id, status);

-- ---------------------------------------------------------------------------
-- Profile views: alerts an owner that someone opened their profile
-- ---------------------------------------------------------------------------
create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  viewer_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists profile_views_owner_idx on public.profile_views (owner_id, created_at desc);

alter table public.reports enable row level security;
alter table public.profile_views enable row level security;

drop policy if exists "users create reports" on public.reports;
drop policy if exists "reporters read own reports" on public.reports;
create policy "users create reports" on public.reports
  for insert to authenticated with check (reporter_id = auth.uid());
create policy "reporters read own reports" on public.reports
  for select to authenticated using (reporter_id = auth.uid() or target_user_id = auth.uid());

drop policy if exists "owners read profile views" on public.profile_views;
drop policy if exists "users record profile views" on public.profile_views;
create policy "owners read profile views" on public.profile_views
  for select to authenticated using (owner_id = auth.uid());
create policy "users record profile views" on public.profile_views
  for insert to authenticated with check (viewer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RPC: eligibility check + profile-view tracking
-- ---------------------------------------------------------------------------
create or replace function public.check_eligibility()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_reports integer;
  v_eligible boolean;
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;

  select count(*) into v_reports
  from public.reports
  where target_user_id = v_user and status <> 'dismissed';

  v_eligible := v_reports < 3;

  update public.profiles set eligible = v_eligible where id = v_user;

  return v_eligible;
end;
$$;

create or replace function public.record_profile_view(p_owner_id uuid, p_viewer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;
  if p_owner_id = p_viewer_id then
    return;
  end if;

  insert into public.profile_views (owner_id, viewer_id)
  values (p_owner_id, p_viewer_id);
end;
$$;

grant execute on function public.check_eligibility() to authenticated;
grant execute on function public.record_profile_view(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Notifications: personal messages + Problematic Team broadcasts
--
-- `to_user_id` targets one member; `audience` targets a segment
-- ('all' | 'premium' | 'reported'). Guests receive the guest/system
-- notifications locally (they have no auth row).
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists is_premium boolean not null default false;
alter table public.profiles
  add column if not exists is_team boolean not null default false;

create table if not exists public.notifications (
  id text primary key default gen_random_uuid()::text,
  to_user_id uuid references auth.users (id) on delete cascade,
  audience text not null default 'none'
    check (audience in ('none', 'all', 'premium', 'reported')),
  type text not null default 'system',
  from_user text not null default 'problematicTeam',
  from_user_id uuid references auth.users (id) on delete set null,
  content jsonb not null default '{}'::jsonb,
  link text not null default '',
  action jsonb,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists notifications_to_user_idx
  on public.notifications (to_user_id, sent_at desc);
create index if not exists notifications_audience_idx
  on public.notifications (audience, sent_at desc);

create table if not exists public.notification_reads (
  notification_id text not null references public.notifications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

create index if not exists notification_reads_user_idx
  on public.notification_reads (user_id, read_at desc);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

drop policy if exists "read own or segment notifications" on public.notifications;
create policy "read own or segment notifications" on public.notifications
  for select to authenticated using (
    to_user_id = auth.uid()
    or audience = 'all'
    or (
      audience = 'premium'
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_premium
      )
    )
    or (
      audience = 'reported'
      and exists (
        select 1 from public.reports r
        where r.target_user_id = auth.uid() and r.status <> 'dismissed'
      )
    )
  );

drop policy if exists "team sends notifications" on public.notifications;
create policy "team sends notifications" on public.notifications
  for insert to authenticated with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_team)
  );

drop policy if exists "users manage own reads" on public.notification_reads;
create policy "users manage own reads" on public.notification_reads
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RPC: send / broadcast notifications
-- ---------------------------------------------------------------------------
create or replace function public.send_notification(
  p_to uuid,
  p_type text,
  p_content jsonb,
  p_link text default '',
  p_action jsonb default null
)
returns public.notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team boolean;
  v_row public.notifications;
begin
  select is_team into v_team from public.profiles where id = auth.uid();
  if not coalesce(v_team, false) then
    raise exception 'only Problematic Team members can send notifications';
  end if;

  insert into public.notifications (to_user_id, audience, type, from_user, from_user_id, content, link, action)
  values (p_to, 'none', p_type, 'problematicTeam', auth.uid(), p_content, p_link, p_action)
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.broadcast_notification(
  p_audience text,
  p_type text,
  p_content jsonb,
  p_link text default '',
  p_action jsonb default null
)
returns public.notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team boolean;
  v_row public.notifications;
begin
  if p_audience not in ('all', 'premium', 'reported') then
    raise exception 'invalid audience: %', p_audience;
  end if;

  select is_team into v_team from public.profiles where id = auth.uid();
  if not coalesce(v_team, false) then
    raise exception 'only Problematic Team members can broadcast';
  end if;

  insert into public.notifications (to_user_id, audience, type, from_user, from_user_id, content, link, action)
  values (null, p_audience, p_type, 'problematicTeam', auth.uid(), p_content, p_link, p_action)
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.mark_notification_read(p_notification_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;
  insert into public.notification_reads (notification_id, user_id)
  values (p_notification_id, auth.uid())
  on conflict (notification_id, user_id) do nothing;
end;
$$;

create or replace function public.mark_all_notifications_read()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;
  insert into public.notification_reads (notification_id, user_id)
  select n.id, v_user
  from public.notifications n
  where n.to_user_id = v_user
    or n.audience = 'all'
    or (n.audience = 'premium' and exists (select 1 from public.profiles p where p.id = v_user and p.is_premium))
    or (n.audience = 'reported' and exists (select 1 from public.reports r where r.target_user_id = v_user and r.status <> 'dismissed'))
  on conflict (notification_id, user_id) do nothing;
end;
$$;

grant execute on function public.send_notification(uuid, text, jsonb, text, jsonb) to authenticated;
grant execute on function public.broadcast_notification(text, text, jsonb, text, jsonb) to authenticated;
grant execute on function public.mark_notification_read(text) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;

-- ---------------------------------------------------------------------------
-- Default system notifications (idempotent seeds)
-- ---------------------------------------------------------------------------
insert into public.notifications (id, to_user_id, audience, type, from_user, content, link, action)
values
  (
    'ntf-welcome-member', null, 'all', 'system', 'problematicTeam',
    '{"text":"Glad you are here","additional_text":"Reply to a discussion or follow a topic and we will keep you posted on what is new.","tagline":"Welcome back"}'::jsonb,
    '', null
  ),
  (
    'ntf-browser-permission', null, 'all', 'browser_permission', 'problematicTeam',
    '{"text":"Turn on browser notifications","additional_text":"Get pinged the moment someone replies, mentions you or invites you to a discussion.","tagline":"Stay in the loop"}'::jsonb,
    '', '{"type":"enable_browser_notifications","label":"Enable browser notifications"}'::jsonb
  )
on conflict (id) do nothing;