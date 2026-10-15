import { shuffleArray } from './shuffle'

const SIGNAL_WEIGHT = { saved: 3, liked: 2, following: 1 }
const DISCOVERY_SIZE = 5

function categoriesOf(post) {
  return [post.category, ...(post.secondaryCategories || [])].filter(Boolean)
}

function signalPosts(ids, byId) {
  if (!ids) return []
  return [...ids].map((id) => byId.get(id)).filter(Boolean)
}

function dedupe(posts) {
  const seen = new Set()
  const out = []
  for (const post of posts) {
    if (!post || seen.has(post.id)) continue
    seen.add(post.id)
    out.push(post)
  }
  return out
}

// Builds a "For You" feed: the first few cards are personalised around the
// viewer's latest interactions and freshest posts, then the tail is a random
// discovery stream. Falls back to newest + random for guests.
export function buildForYouFeed(pool, { likedIds, savedIds, followingIds } = {}) {
  if (!pool || pool.length === 0) return []

  const byId = new Map(pool.map((post) => [post.id, post]))

  // Set iteration order is oldest -> newest, so reversing puts the freshest first.
  const newestFirst = (posts) => [...posts].reverse()
  const liked = signalPosts(likedIds, byId)
  const saved = signalPosts(savedIds, byId)
  const following = signalPosts(followingIds, byId)

  // Weighted affinity per category, built from everything the viewer engaged with.
  const affinity = new Map()
  const addAffinity = (posts, weight) => {
    for (const post of posts) {
      for (const cat of categoriesOf(post)) {
        affinity.set(cat, (affinity.get(cat) || 0) + weight)
      }
    }
  }
  addAffinity(saved, SIGNAL_WEIGHT.saved)
  addAffinity(liked, SIGNAL_WEIGHT.liked)
  addAffinity(following, SIGNAL_WEIGHT.following)

  const topCategories = [...affinity.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat]) => cat)
  const isOnTopic = (post) =>
    topCategories.length > 0 &&
    categoriesOf(post).some((cat) => topCategories.includes(cat))

  const byNewest = [...pool].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const recentSignals = dedupe([
    ...newestFirst(liked),
    ...newestFirst(saved),
    ...newestFirst(following)
  ])

  const used = new Set()
  const discovery = []
  const add = (post) => {
    if (post && !used.has(post.id)) {
      used.add(post.id)
      discovery.push(post)
    }
  }

  // 1. The most recent thing the viewer touched.
  const seed = recentSignals[0] || null
  add(seed)

  // 2. A sibling of that signal (shared category), else a top-interest pick.
  const seedCategories = seed ? new Set(categoriesOf(seed)) : null
  add(
    pool.find(
      (post) =>
        !used.has(post.id) &&
        (seedCategories
          ? categoriesOf(post).some((cat) => seedCategories.has(cat))
          : isOnTopic(post))
    )
  )

  // 3. The newest post, so the feed never goes stale.
  add(byNewest.find((post) => !used.has(post.id)))

  // 4. Something the viewer saved — their own favourite.
  add(newestFirst(saved).find((post) => !used.has(post.id)))

  // 5. One more on-topic pick, then top up with freshest posts.
  add(pool.find((post) => !used.has(post.id) && isOnTopic(post)))
  while (discovery.length < DISCOVERY_SIZE) {
    const next = byNewest.find((post) => !used.has(post.id))
    if (!next) break
    add(next)
  }

  // The rest is cleared for a random discovery stream.
  const rest = shuffleArray(pool.filter((post) => !used.has(post.id)))
  return [...discovery, ...rest]
}
