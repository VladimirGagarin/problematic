import { useCallback, useMemo, useRef, useState } from 'react'
import { InteractionContext } from './interactions'
import { useAuth } from './auth'
import { samplePosts } from '../data/samplePosts'
import { sampleNotifications } from '../data/sampleNotifications'
import { isRemote, recordShare, createReport, recordProfileView } from '../lib/api'
import { CURRENT_USER_ID, nameFromUserId } from '../data/users'
import { getInteractions, saveInteractions } from '../lib/userStore'

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

function InteractionProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
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
  const [allNotifications, setAllNotifications] = useState(() => sampleNotifications)
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

  const addNotification = useCallback((notif) => {
    setAllNotifications((prev) => [
      {
        id: `local-${Date.now()}`,
        recipientId: CURRENT_USER_ID,
        createdAt: new Date().toISOString(),
        readAt: null,
        ...notif
      },
      ...prev
    ])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n))
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
    )
  }, [])

  const notifications = useMemo(
    () =>
      allNotifications.filter(
        (n) => !n.recipientId || n.recipientId === CURRENT_USER_ID || n.recipientId === 'me'
      ),
    [allNotifications]
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.readAt).length,
    [notifications]
  )

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

  const registerProfileView = useCallback((ownerId, viewerId, viewerName) => {
    if (!ownerId || !viewerId || ownerId === viewerId) return
    const key = `${ownerId}:${viewerId}`
    if (profileViewsRef.current.has(key)) return
    profileViewsRef.current.add(key)
    persist('problematic:profile-views', [...profileViewsRef.current])
    setAllNotifications((prev) => [
      {
        id: `local-${Date.now()}`,
        recipientId: ownerId,
        type: 'profile_view',
        viewerId,
        createdAt: new Date().toISOString(),
        readAt: null,
        message: `${viewerName || nameFromUserId(viewerId)} viewed your profile.`
      },
      ...prev
    ])
    if (isRemote) recordProfileView(ownerId, viewerId).catch(() => {})
  }, [])

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
      replyNotifyIds,
      toggleReplyNotify,
      hiddenIds,
      hidePost,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
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
      replyNotifyIds,
      toggleReplyNotify,
      hiddenIds,
      hidePost,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
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