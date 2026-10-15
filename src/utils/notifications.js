// Canonical notification model.
//
// Persisted fields use snake_case (matching the Supabase `notifications`
// table) while the UI reads through the helpers below, so components never
// have to care about the storage shape.
//
// Shape:
// {
//   notification_id: 'ntf-...',
//   notification_TimeSent: '2026-10-15T00:00:00.000Z',
//   notification_Content: { text, additional_text, tagline, link },
//   from: 'problematicTeam' | <user id>,
//   to: <user id> | 'guest' | 'all' | 'premium' | 'reported',
//   audience: 'none' | 'all' | 'premium' | 'reported',
//   type: 'system' | 'welcome' | ...,
//   read: false,
//   action: { type, label, payload } | null
// }

export const PROBLEMATIC_TEAM = 'problematicTeam'

export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  WELCOME: 'welcome',
  BROWSER_PERMISSION: 'browser_permission',
  NEW_COMMENT: 'new_comment',
  NEW_REPLY: 'new_reply',
  DISCUSSION_INVITATION: 'discussion_invitation',
  PROFILE_VIEW: 'profile_view',
  BROADCAST: 'broadcast'
}

export const NOTIFICATION_ACTION = {
  SIGN_IN: 'sign_in',
  ENABLE_BROWSER: 'enable_browser_notifications',
  SEND_THANKS: 'send_thanks',
  DISMISS: 'dismiss'
}

// Segments the Problematic Team can broadcast to.
export const NOTIFICATION_AUDIENCES = [
  { value: 'all', label: 'Everyone' },
  { value: 'premium', label: 'Premium members' },
  { value: 'reported', label: 'Reported users' }
]

const AUDIENCE_TOKENS = new Set(['all', 'premium', 'reported'])

let sequence = 0
export function newNotificationId(prefix = 'ntf') {
  sequence += 1
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`
}

export function normalizeContent(value) {
  if (!value) return { text: '', additional_text: '', tagline: '', link: '' }
  if (typeof value === 'string') {
    return { text: value, additional_text: '', tagline: '', link: '' }
  }
  return {
    text: value.text || '',
    additional_text: value.additional_text || value.additionalText || '',
    tagline: value.tagline || '',
    link: value.link || ''
  }
}

// Builds a canonical notification from loose input (legacy or new fields).
export function createNotification(input = {}) {
  const content = normalizeContent(input.notification_Content || input.content)
  if (!content.text && input.text) content.text = input.text
  if (!content.text && input.message) content.text = input.message
  if (!content.additional_text && input.additionalText) content.additional_text = input.additionalText
  if (!content.additional_text && input.additional_text) content.additional_text = input.additional_text
  if (!content.tagline && input.tagline) content.tagline = input.tagline
  if (!content.link && input.link) content.link = input.link
  if (!content.link && input.postId) content.link = `/post/${input.postId}`

  const time =
    input.notification_TimeSent || input.sentAt || input.createdAt || new Date().toISOString()
  const read = input.read != null ? Boolean(input.read) : Boolean(input.readAt)
  const to = input.to || input.recipientId || 'me'
  let audience = input.audience
  if (!audience) audience = AUDIENCE_TOKENS.has(input.to) ? input.to : 'none'

  return {
    notification_id: input.notification_id || input.notificationId || input.id || newNotificationId(),
    notification_TimeSent: time,
    notification_Content: content,
    from: input.from || PROBLEMATIC_TEAM,
    to,
    audience,
    type: input.type || NOTIFICATION_TYPES.SYSTEM,
    read,
    action: input.action || null,
    postId: input.postId || null,
    commentId: input.commentId || null,
    dismissible: input.dismissible !== false,
    meta: input.meta || {}
  }
}

export const notificationIdOf = (n) => n.notification_id || n.id
export const notificationTimeOf = (n) =>
  n.notification_TimeSent || n.sentAt || n.createdAt || new Date(0).toISOString()
export const isNotificationRead = (n) => (n.read != null ? Boolean(n.read) : Boolean(n.readAt))

export function notificationContentOf(n) {
  if (n.notification_Content) return normalizeContent(n.notification_Content)
  if (n.content) return normalizeContent(n.content)
  return normalizeContent({
    text: n.message,
    additional_text: n.additional_text,
    tagline: n.tagline,
    link: n.link || (n.postId ? `/post/${n.postId}` : '')
  })
}

export const notificationLinkOf = (n) => {
  const content = notificationContentOf(n)
  return content.link || n.link || (n.postId ? `/post/${n.postId}` : '')
}

// True when a notification should be shown to the given viewer.
export function matchesViewer(n, viewer = {}) {
  const { userId, isPremium, isReported, viewerId } = viewer
  if (n.audience === 'all') return true
  if (n.audience === 'premium') return Boolean(isPremium)
  if (n.audience === 'reported') return Boolean(isReported)

  const to = n.to
  if (!to || to === 'all') return true
  if (to === 'guest') return !userId
  if (to === 'premium') return Boolean(isPremium)
  if (to === 'reported') return Boolean(isReported)
  if (to === 'me') return Boolean(userId)
  return to === userId || (viewerId ? to === viewerId : false)
}

// ---------------------------------------------------------------------------
// Browser (Web) notification helpers
// ---------------------------------------------------------------------------
export function browserNotificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function browserPermissionState() {
  if (!browserNotificationsSupported()) return 'unsupported'
  return window.Notification.permission
}

export async function requestBrowserPermission() {
  if (!browserNotificationsSupported()) return 'unsupported'
  try {
    return await window.Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export function showBrowserNotification(title, options = {}) {
  if (!browserNotificationsSupported() || window.Notification.permission !== 'granted') {
    return false
  }
  try {
    const note = new window.Notification(title, { badge: undefined, ...options })
    return Boolean(note)
  } catch {
    return false
  }
}
