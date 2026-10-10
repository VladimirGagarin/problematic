import { useCallback, useMemo, useState } from 'react'
import { InteractionContext } from './interactions'

function InteractionProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => new Set())
  const [followingIds, setFollowingIds] = useState(() => new Set())

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

  const value = useMemo(
    () => ({
      savedIds,
      followingIds,
      toggleSaved,
      toggleFollowing
    }),
    [savedIds, followingIds, toggleSaved, toggleFollowing]
  )

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  )
}

export default InteractionProvider