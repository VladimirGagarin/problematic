import { samplePosts } from './samplePosts'

export const CURRENT_USER_ID = 'me'
export const CURRENT_USER_NAME = 'Current Member'
export const CURRENT_USER_HANDLE = '@member'

export function slugify(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function userIdFromName(name) {
  return slugify(name) || 'member'
}

export function nameFromUserId(id) {
  if (!id) return 'Member'
  if (id === CURRENT_USER_ID) return CURRENT_USER_NAME
  return id
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function postsByUserId(posts, id) {
  if (!id) return []
  if (id === CURRENT_USER_ID) {
    return posts.filter(
      (post) => post.author === CURRENT_USER_NAME || post.author === 'You'
    )
  }
  return posts.filter((post) => userIdFromName(post.author) === id)
}

export function getUserById(id, posts = samplePosts) {
  const authored = postsByUserId(posts, id)
  const name =
    id === CURRENT_USER_ID ? CURRENT_USER_NAME : authored[0]?.author || nameFromUserId(id)
  return {
    id,
    name,
    handle: `@${slugify(name) || 'member'}`,
    bio:
      id === CURRENT_USER_ID
        ? 'Curious about patterns, proofs and open questions. Here for the maths.'
        : 'Member of the Problematic community.',
    posts: authored
  }
}
