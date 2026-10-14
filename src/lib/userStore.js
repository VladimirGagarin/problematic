// Local identity + interaction store.
//
// Supabase-ready: every read/write goes through the small functions here, so
// swapping the localStorage calls for `supabase.from('app_users')` /
// `supabase.from('app_interactions')` (with RLS on author_id) is a contained
// change. Until a Supabase project is configured the app runs fully offline.

const USERS_KEY = 'problematic:users'
const SESSION_KEY = 'problematic:session'
const WELCOME_KEY = 'problematic:welcome-seen'
const interactionsKey = (userId) => `problematic:interactions:${userId}`

const EMPTY_INTERACTIONS = { liked: [], saved: [], following: [] }

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable or full; in-memory state still works
  }
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function baseId(email, authFrom) {
  const local = slugify((email.split('@')[0] || 'user').replace(/\./g, '-'))
  return `${authFrom || 'local'}-${local || 'user'}`
}

export function loadUsers() {
  return readJson(USERS_KEY, [])
}

export function findUser(email, authFrom) {
  const target = normalizeEmail(email)
  return (
    loadUsers().find(
      (u) => normalizeEmail(u.email) === target && u.authFrom === authFrom
    ) || null
  )
}

export function getCurrentUser() {
  const id = readJson(SESSION_KEY, null)
  if (!id) return null
  return loadUsers().find((u) => u.id === id) || null
}

export function setCurrentUser(user) {
  writeJson(SESSION_KEY, user ? user.id : null)
}

// Find an existing user by (email, authFrom) and refresh their provider
// details, otherwise create a new community member. Returns the user record.
export function findOrCreateUser(profile) {
  const authFrom = profile.authFrom || 'google'
  const email = normalizeEmail(profile.email)
  const users = loadUsers()
  const existing = users.find(
    (u) => normalizeEmail(u.email) === email && u.authFrom === authFrom
  )
  const now = new Date().toISOString()

  if (existing) {
    const refreshed = {
      ...existing,
      name: profile.name || existing.name,
      avatar: profile.avatar ?? existing.avatar,
      lastLoginAt: now
    }
    writeJson(
      USERS_KEY,
      users.map((u) => (u.id === existing.id ? refreshed : u))
    )
    setCurrentUser(refreshed)
    return { user: refreshed, isNew: false }
  }

  const base = baseId(email, authFrom)
  let id = base
  let suffix = 2
  while (users.some((u) => u.id === id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }

  const created = {
    id,
    email,
    name: profile.name || email.split('@')[0] || 'Member',
    handle: `@${slugify(profile.name || email.split('@')[0]) || 'member'}`,
    avatar: profile.avatar || null,
    authFrom,
    eligible: true,
    isPremium: false,
    createdAt: now,
    lastLoginAt: now
  }
  writeJson(USERS_KEY, [...users, created])
  setCurrentUser(created)
  return { user: created, isNew: true }
}

export function signOutUser() {
  setCurrentUser(null)
}

export function getWelcomeSeen() {
  return readJson(WELCOME_KEY, false)
}

export function setWelcomeSeen(seen) {
  writeJson(WELCOME_KEY, Boolean(seen))
}

export function getInteractions(userId) {
  if (!userId) return { ...EMPTY_INTERACTIONS }
  const stored = readJson(interactionsKey(userId), null)
  if (!stored) return { ...EMPTY_INTERACTIONS }
  return {
    liked: Array.isArray(stored.liked) ? stored.liked : [],
    saved: Array.isArray(stored.saved) ? stored.saved : [],
    following: Array.isArray(stored.following) ? stored.following : []
  }
}

export function saveInteractions(userId, data) {
  if (!userId) return
  writeJson(interactionsKey(userId), {
    liked: data.liked || [],
    saved: data.saved || [],
    following: data.following || []
  })
}
