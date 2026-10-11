import { useCallback, useMemo, useState } from 'react'
import { InteractionContext } from './interactions'
import { useAuth } from './auth'
import { samplePosts } from '../data/samplePosts'
import { sampleNotifications } from '../data/sampleNotifications'

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

function InteractionProvider({ children }) {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState(() => new Set())
  const [followingIds, setFollowingIds] = useState(() => new Set())
  const [notifications, setNotifications] = useState(() => sampleNotifications)
  const [replyNotifyIds, setReplyNotifyIds] = useState(() => new Set())
  const [hiddenIds, setHiddenIds] = useState(() => new Set())
  const [drafts, setDrafts] = useState(() => loadJson('problematic:drafts', []))
  const [dynamicPosts, setDynamicPosts] = useState(() => loadJson('problematic:posts', []))

  const toggleSaved = useCallback((postId) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }, [])

  const toggleFollowing = useCallback((postId) => {
    setFollowingIds((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }, [])

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
    setNotifications((prev) => [
      {
        id: `local-${Date.now()}`,
        recipientId: 'me',
        createdAt: new Date().toISOString(),
        readAt: null,
        ...notif
      },
      ...prev
    ])
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n))
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
    )
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.readAt).length,
    [notifications]
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

  const value = useMemo(
    () => ({
      savedIds,
      followingIds,
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
      getPostOf
    }),
    [
      savedIds,
      followingIds,
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
      getPostOf
    ]
  )

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  )
}

export default InteractionProvider