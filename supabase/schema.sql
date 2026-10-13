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

create policy "profiles are readable" on public.profiles for select using (true);
create policy "users edit own profile" on public.profiles for update to authenticated using (id = auth.uid());

create policy "posts are readable" on public.posts for select using (true);
create policy "authenticated create posts" on public.posts for insert to authenticated with check (author_id = auth.uid());

create policy "votes are readable" on public.votes for select using (true);
create policy "users manage own votes" on public.votes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "comments are readable" on public.comments for select using (true);
create policy "users create comments" on public.comments for insert to authenticated with check (author_id = auth.uid());

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

  return query select * from public.posts where id = p_post_id;
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
begin
  if v_user is null then
    raise exception 'must be authenticated';
  end if;

  if not exists (select 1 from public.shares where user_id = v_user and post_id = p_post_id) then
    insert into public.shares (user_id, post_id) values (v_user, p_post_id);
    update public.posts set share_count = share_count + 1 where id = p_post_id;
  end if;

  return query select * from public.posts where id = p_post_id;
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