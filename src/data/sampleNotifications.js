import { createNotification, NOTIFICATION_ACTION, NOTIFICATION_TYPES } from '../utils/notifications'

// Canonical notification seed. `to` is 'guest', a user id, 'me' (the current
// signed-in member) or a broadcast segment ('all' | 'premium' | 'reported').
export const sampleNotifications = [
  createNotification({
    notification_id: 'ntf-welcome-guest',
    notification_TimeSent: '2026-10-10T09:00:00Z',
    type: NOTIFICATION_TYPES.WELCOME,
    from: 'problematicTeam',
    to: 'guest',
    notification_Content: {
      text: 'Welcome to Problematic',
      additional_text:
        'Sign in to save problems, follow discussions and get notified the moment someone replies.',
      tagline: 'New here?',
      link: '/notifications'
    },
    action: { type: NOTIFICATION_ACTION.SIGN_IN, label: 'Sign in to get notified' }
  }),
  createNotification({
    notification_id: 'ntf-welcome-member',
    notification_TimeSent: '2026-10-10T09:01:00Z',
    type: NOTIFICATION_TYPES.SYSTEM,
    from: 'problematicTeam',
    to: 'me',
    notification_Content: {
      text: 'Glad you are here',
      additional_text:
        'Reply to a discussion or follow a topic and we will keep you posted on what is new.',
      tagline: 'Welcome back'
    }
  }),
  createNotification({
    notification_id: 'ntf-browser-permission',
    notification_TimeSent: '2026-10-10T09:02:00Z',
    type: NOTIFICATION_TYPES.BROWSER_PERMISSION,
    from: 'problematicTeam',
    to: 'all',
    audience: 'all',
    notification_Content: {
      text: 'Turn on browser notifications',
      additional_text:
        'Get pinged the moment someone replies, mentions you or invites you to a discussion.',
      tagline: 'Stay in the loop'
    },
    action: {
      type: NOTIFICATION_ACTION.ENABLE_BROWSER,
      label: 'Enable browser notifications'
    }
  }),
  createNotification({
    notification_id: 'ntf-n1',
    notification_TimeSent: '2026-10-10T08:00:00Z',
    type: NOTIFICATION_TYPES.NEW_COMMENT,
    from: 'problematicTeam',
    to: 'me',
    postId: 'f8e7a620-9c4d-4b82-8f61-2d7e5ac03b94',
    commentId: 'c4',
    notification_Content: {
      text: 'New comment on "The Next Number".',
      additional_text: 'Maya and others are comparing methods.',
      tagline: 'Join the discussion',
      link: '/post/f8e7a620-9c4d-4b82-8f61-2d7e5ac03b94'
    }
  }),
  createNotification({
    notification_id: 'ntf-n2',
    notification_TimeSent: '2026-10-10T06:30:00Z',
    type: NOTIFICATION_TYPES.DISCUSSION_INVITATION,
    from: 'problematicTeam',
    to: 'me',
    postId: 'a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    notification_Content: {
      text: 'The author of "Do All Paths Reach One?" invited the community to continue the discussion.',
      tagline: 'Jump back in',
      link: '/post/a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
    }
  }),
  createNotification({
    notification_id: 'ntf-n3',
    notification_TimeSent: '2026-10-09T14:00:00Z',
    type: NOTIFICATION_TYPES.NEW_REPLY,
    from: 'problematicTeam',
    to: 'me',
    read: true,
    postId: '7c2b5d81-6e4a-4f09-8a3c-7e1d6f0c25ab',
    commentId: 'c7',
    notification_Content: {
      text: "Someone replied to a comment in a discussion you're following.",
      link: '/post/7c2b5d81-6e4a-4f09-8a3c-7e1d6f0c25ab'
    }
  })
]
