import { useCallback, useMemo, useRef, useState } from 'react'
import { InteractionContext } from './interactions'
import { useAuth } from './auth'
import { samplePosts } from '../data/samplePosts'
import { sampleNotifications } from '../data/sampleNotifications'
import {
  isRemote,
  recordShare,
  createReport,
  recordProfileView,
  insertNotification,
  broadcastNotification,
  markNotificationReadRemote,
  markAllNotificationsReadRemote
} from '../lib/api'
import { CURRENT_USER_ID, nameFromUserId } from '../data/users'
import { getInteractions, saveInteractions } from '../lib/userStore'
import {
  createNotification,
  matchesViewer,
  notificationIdOf,
  notificationTimeOf,
  isNotificationRead,
  notificationContentOf,
  requestBrowserPermission,
  browserPermissionState,
  showBrowserNotification,
  NOTIFICATION_ACTION,
  NOTIFICATION_TYPES,
  PROBLEMATIC_TEAM
} from '../utils/notifications'

function toSets(data) {
  return {
    liked: new Set(data.liked || []),
    saved: new Set(data.saved || []),
    following: new Set(data.following || [])
  }
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage may be unavailable or full; state still works in memory
  }
}

function getViewerId() {
  try {
    let id = localStorage.getItem('problematic:viewer-id')
    if (!id) {
      id = `u-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
      localStorage.setItem('problematic:viewer-id', id)
    }
    return id
  } catch {
    return 'local-member'
  }
}

const EMPTY_FEED = { pushed: [], read: {}, dismissed: [] }

function InteractionProvider({ children }) {
  const { user, isAuthenticated, isPremium, openSignIn } = useAuth()
  const userId = user?.id || null
  const viewerId = useMemo(() => getViewerId(), [])
  const shareViewsRef = useRef(new Set(loadJson('problematic:share-views', [])))
  const [shareCounts, setShareCounts] = useState(() => loadJson('problematic:shares', {}))
  const [interactions, setInteractions] = useState(() => toSets(getInteractions(userId)))
  const [interactionsUserId, setInteractionsUserId] = useState(userId)
  const { liked: likedIds, saved: savedIds, following: followingIds } = interactions

  if (interactionsUserId !== userId) {
    setInteractionsUserId(userId)
    setInteractions(toSets(getInteractions(userId)))
  }

  const toggleCollection = useCallback(
    (key, postId) => {
      setInteractions((prev) => {
        const nextSet = new Set(prev[key])
        if (nextSet.has(postId)) {
          nextSet.delete(postId)
        } else {
          nextSet.add(postId)
        }
        const next = { ...prev, [key]: nextSet }
        if (userId) {
          saveInteractions(userId, {
            liked: [...next.liked],
            saved: [...next.saved],
            following: [...next.following]
          })
        }
        return next
      })
    },
    [userId]
  )

  const [notificationFeed, setNotificationFeed] = useState(() =>
    loadJson('problematic:notification-feed', EMPTY_FEED)
  )
  const [browserPermission, setBrowserPermission] = useState(() => browserPermissionState())
  const [reports, setReports] = useState(() => loadJson('problematic:reports', []))
  const profileViewsRef = useRef(new Set(loadJson('problematic:profile-views', [])))
  const [replyNotifyIds, setReplyNotifyIds] = useState(() => new Set())
  const [hiddenIds, setHiddenIds] = useState(() => new Set())
  const [drafts, setDrafts] = useState(() => loadJson('problematic:drafts', []))
  const [dynamicPosts, setDynamicPosts] = useState(() => loadJson('problematic:posts', []))

  const toggleSaved = useCallback(
    (postId) => toggleCollection('saved', postId),
    [toggleCollection]
  )

  const toggleFollowing = useCallback(
    (postId) => toggleCollection('following', postId),
    [toggleCollection]
  )

  const toggleLike = useCallback(
    (postId) => toggleCollection('liked', postId),
    [toggleCollection]
  )

  const toggleReplyNotify = useCallback((postId) => {
    setReplyNotifyIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }, [])

  const hidePost = useCallback((postId) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      next.add(postId)
      return next
    })
  }, [])

  const updateFeed = useCallback((updater) => {
    setNotificationFeed((prev) => {
      const next = updater(prev || EMPTY_FEED)
      persist('problematic:notification-feed', next)
      return next
    })
  }, [])

  // ---- push a notification (in-app, persisted, and remote when configured) ----
  const pushNotification = useCallback(
    (input, { remote = true } = {}) => {
      const notification = createNotification(input)
      updateFeed((prev) => ({
        ...prev,
        pushed: [notification, ...(prev.pushed || [])].slice(0, 200)
      }))
      if (isRemote && remote) insertNotification(notification).catch(() => {})
      return notification
    },
    [updateFeed]
  )

  // Legacy alias used by the comment panel.
  const addNotification = useCallback(
    (notif) => pushNotification({ to: 'me', ...notif }),
    [pushNotification]
  )

  const dismissNotification = useCallback(
    (id) => {
      updateFeed((prev) => ({
        ...prev,
        dismissed: Array.from(new Set([...(prev.dismissed || []), id]))
      }))
    },
    [updateFeed]
  )

  const markNotificationRead = useCallback(
    (id) => {
      const readAt = new Date().toISOString()
      updateFeed((prev) => ({ ...prev, read: { ...(prev.read || {}), [id]: readAt } }))
      if (isRemote) markNotificationReadRemote(id).catch(() => {})
    },
    [updateFeed]
  )

  const browserSupported = browserPermission !== 'unsupported'

  const sendBrowserThankYou = useCallback(() => {
    const notification = pushNotification({
      type: NOTIFICATION_TYPES.SYSTEM,
      from: PROBLEMATIC_TEAM,
      to: 'me',
      notification_Content: {
        text: 'Thank you for enabling notifications',
        additional_text: 'You will now see updates from Problematic right in your browser.',
        tagline: 'All set'
      },
      action: { type: NOTIFICATION_ACTION.SEND_THANKS, label: 'Send an example notification' }
    })
    showBrowserNotification('Thank you for enabling notifications', {
      body: 'You will now see updates from Problematic right here.',
      tag: notificationIdOf(notification)
    })
    return notification
  }, [pushNotification])

  const enableBrowserNotifications = useCallback(async () => {
    const result = await requestBrowserPermission()
    setBrowserPermission(result)
    if (result === 'granted') {
      sendBrowserThankYou()
    }
    return result
  }, [sendBrowserThankYou])

  const runNotificationAction = useCallback(
    (notification) => {
      const action = notification.action
      if (!action) return
      switch (action.type) {
        case NOTIFICATION_ACTION.SIGN_IN:
          openSignIn()
          break
        case NOTIFICATION_ACTION.ENABLE_BROWSER:
          enableBrowserNotifications().then((result) => {
            if (result === 'granted') dismissNotification(notificationIdOf(notification))
          })
          break
        case NOTIFICATION_ACTION.SEND_THANKS:
          sendBrowserThankYou()
          break
        case NOTIFICATION_ACTION.DISMISS:
          dismissNotification(notificationIdOf(notification))
          break
        default:
          break
      }
    },
    [openSignIn, enableBrowserNotifications, sendBrowserThankYou, dismissNotification]
  )

  // ---- Problematic Team broadcasts to a segment (all / premium / reported) ----
  const sendBroadcast = useCallback(
    ({ audience = 'all', text, additionalText = '', tagline = '', link = '', action = null }) => {
      const notification = pushNotification(
        {
          type: NOTIFICATION_TYPES.BROADCAST,
          from: PROBLEMATIC_TEAM,
          to: audience,
          audience,
          notification_Content: { text, additional_text: additionalText, tagline, link },
          action
        },
        { remote: false }
      )
      if (isRemote) broadcastNotification(notification).catch(() => {})
      return notification
    },
    [pushNotification]
  )

  const canBroadcast = Boolean(isAuthenticated && (user?.isTeam || user?.isPremium))

  const isReported = useMemo(
    () =>
      reports.some(
        (r) =>
          (r.targetUserId === (userId || CURRENT_USER_ID)) && r.status !== 'dismissed'
      ),
    [reports, userId]
  )

  const viewer = useMemo(
    () => ({ userId, viewerId, isPremium, isReported }),
    [userId, viewerId, isPremium, isReported]
  )

  const notifications = useMemo(() => {
    const feed = notificationFeed || EMPTY_FEED
    const dismissed = new Set(feed.dismissed || [])
    const readMap = feed.read || {}
    const merged = [...(feed.pushed || []), ...sampleNotifications]
    const seen = new Set()
    const list = []
    for (const raw of merged) {
      const id = notificationIdOf(raw)
      if (!id || seen.has(id) || dismissed.has(id)) continue
      seen.add(id)
      if (!matchesViewer(raw, viewer)) continue
      const read = readMap[id] ? true : isNotificationRead(raw)
      list.push({ ...raw, notification_id: id, read })
    }
    list.sort((a, b) => new Date(notificationTimeOf(b)) - new Date(notificationTimeOf(a)))
    return list
  }, [notificationFeed, viewer])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const markAllNotificationsRead = useCallback(() => {
    const readAt = new Date().toISOString()
    updateFeed((prev) => {
      const read = { ...(prev.read || {}) }
      for (const n of notifications) read[notificationIdOf(n)] = readAt
      return { ...prev, read }
    })
    if (isRemote) markAllNotificationsReadRemote().catch(() => {})
  }, [notifications, updateFeed])

  const reportContent = useCallback((report) => {
    const entry = {
      id: `report-${Date.now()}`,
      reporterId: CURRENT_USER_ID,
      targetType: report.targetType,
      targetId: String(report.targetId),
      targetUserId: report.targetUserId || null,
      reason: report.reason,
      details: report.details || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    setReports((prev) => {
      const next = [entry, ...prev]
      persist('problematic:reports', next)
      return next
    })
    if (isRemote) createReport(entry).catch(() => {})
    return entry
  }, [])

  const registerProfileView = useCallback(
    (ownerId, viewerUid, viewerName) => {
      if (!ownerId || !viewerUid || ownerId === viewerUid) return
      const key = `${ownerId}:${viewerUid}`
      if (profileViewsRef.current.has(key)) return
      profileViewsRef.current.add(key)
      persist('problematic:profile-views', [...profileViewsRef.current])
      pushNotification({
        type: NOTIFICATION_TYPES.PROFILE_VIEW,
        from: viewerUid,
        to: ownerId,
        notification_Content: {
          text: `${viewerName || nameFromUserId(viewerUid)} viewed your profile.`,
          tagline: 'Profile view'
        }
      })
      if (isRemote) recordProfileView(ownerId, viewerUid).catch(() => {})
    },
    [pushNotification]
  )

  const createDraft = useCallback((fields) => {
    const draft = {
      id: fields.id || `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...fields
    }
    setDrafts((prev) => {
      const next = [draft, ...prev]
      persist('problematic:drafts', next)
      return next
    })
    return draft.id
  }, [])

  const updateDraft = useCallback((id, fields) => {
    setDrafts((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, ...fields, updatedAt: new Date().toISOString() } : d
      )
      persist('problematic:drafts', next)
      return next
    })
  }, [])

  const deleteDraft = useCallback((id) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id)
      persist('problematic:drafts', next)
      return next
    })
  }, [])

  const publishDraft = useCallback(
    (draftOrId) => {
      const draft =
        typeof draftOrId === 'string' ? drafts.find((d) => d.id === draftOrId) : draftOrId
      if (!draft) return null
      const post = {
        id: draft.id,
        title: draft.title,
        type: draft.type,
        category: draft.category,
        difficulty: draft.difficulty || 'medium',
        problem: draft.problem,
        hints: draft.hints || [],
        solution: draft.solution || '',
        author: user?.name || 'You',
        createdAt: new Date().toISOString(),
        voteCount: 0,
        commentCount: 0,
        shareCount: 0,
        solutionStatus: draft.solution ? 'solved' : 'unsolved'
      }
      setDynamicPosts((prev) => {
        const next = [post, ...prev]
        persist('problematic:posts', next)
        return next
      })
      if (typeof draftOrId === 'string') {
        setDrafts((prev) => {
          const next = prev.filter((d) => d.id !== draftOrId)
          persist('problematic:drafts', next)
          return next
        })
      }
      return post.id
    },
    [drafts, user]
  )

  const allPosts = useMemo(() => [...dynamicPosts, ...samplePosts], [dynamicPosts])

  const getPostOf = useCallback(
    (key) => allPosts.find((post) => post.id === key),
    [allPosts]
  )

  const getShareCount = useCallback(
    (post) => shareCounts[post.id] ?? post.shareCount ?? 0,
    [shareCounts]
  )

  const createShareLink = useCallback(
    (postId) => {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const sharerId = isAuthenticated ? viewerId : 'guest'
      return `${origin}/post/${postId}?from_share=true&user_id=${encodeURIComponent(sharerId)}`
    },
    [isAuthenticated, viewerId]
  )

  const registerShareView = useCallback(
    (postId, sharerId) => {
      if (!isAuthenticated) return
      if (sharerId && sharerId === viewerId) return
      const key = `${postId}:${viewerId}`
      if (shareViewsRef.current.has(key)) return
      shareViewsRef.current.add(key)
      persist('problematic:share-views', [...shareViewsRef.current])
      setShareCounts((prev) => {
        const next = { ...prev, [postId]: (prev[postId] || 0) + 1 }
        persist('problematic:shares', next)
        return next
      })
      if (isRemote) recordShare(postId).catch(() => {})
    },
    [isAuthenticated, viewerId]
  )

  const value = useMemo(
    () => ({
      likedIds,
      savedIds,
      followingIds,
      toggleLike,
      toggleSaved,
      toggleFollowing,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      pushNotification,
      sendBroadcast,
      canBroadcast,
      browserPermission,
      browserSupported,
      enableBrowserNotifications,
      runNotificationAction,
      notificationContentOf,
      replyNotifyIds,
      toggleReplyNotify,
      hiddenIds,
      hidePost,
      addNotification,
      drafts,
      dynamicPosts,
      createDraft,
      updateDraft,
      deleteDraft,
      publishDraft,
      allPosts,
      getPostOf,
      viewerId,
      shareCounts,
      getShareCount,
      createShareLink,
      registerShareView,
      reports,
      reportContent,
      registerProfileView
    }),
    [
      likedIds,
      savedIds,
      followingIds,
      toggleLike,
      toggleSaved,
      toggleFollowing,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
      dismissNotification,
      pushNotification,
      sendBroadcast,
      canBroadcast,
      browserPermission,
      browserSupported,
      enableBrowserNotifications,
      runNotificationAction,
      replyNotifyIds,
      toggleReplyNotify,
      hiddenIds,
      hidePost,
      addNotification,
      drafts,
      dynamicPosts,
      createDraft,
      updateDraft,
      deleteDraft,
      publishDraft,
      allPosts,
      getPostOf,
      viewerId,
      shareCounts,
      getShareCount,
      createShareLink,
      registerShareView,
      reports,
      reportContent,
      registerProfileView
    ]
  )

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  )
}

export default InteractionProvider
