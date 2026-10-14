import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import AuthPrompt from '../components/AuthPrompt'
import { checkUserEligibility } from '../lib/api'
import {
  CURRENT_USER_ID,
  CURRENT_USER_NAME,
  CURRENT_USER_HANDLE
} from '../data/users'

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [eligible, setEligible] = useState(false)
  const [prompt, setPrompt] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    checkUserEligibility(CURRENT_USER_ID)
      .then((ok) => {
        if (!active) return
        if (!ok) {
          setIsAuthenticated(false)
          setIsPremium(false)
          setPrompt('ineligible')
        } else {
          setEligible(true)
        }
      })
      .catch(() => {
        if (active) setEligible(false)
      })
    return () => {
      active = false
    }
  }, [isAuthenticated])

  const openPrompt = useCallback((type) => setPrompt(type), [])
  const closePrompt = useCallback(() => setPrompt(null), [])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      setPrompt('signin')
      return false
    }
    return true
  }, [isAuthenticated])

  const requireEligible = useCallback(() => {
    if (!isAuthenticated) {
      setPrompt('signin')
      return false
    }
    if (!eligible) {
      setPrompt('ineligible')
      return false
    }
    return true
  }, [isAuthenticated, eligible])

  const requirePremium = useCallback(() => {
    if (!isAuthenticated) {
      setPrompt('signin')
      return false
    }
    if (!eligible) {
      setPrompt('ineligible')
      return false
    }
    if (!isPremium) {
      setPrompt('premium')
      return false
    }
    return true
  }, [isAuthenticated, eligible, isPremium])

  const value = useMemo(
    () => ({
      user: isAuthenticated
        ? {
            id: CURRENT_USER_ID,
            name: CURRENT_USER_NAME,
            handle: CURRENT_USER_HANDLE,
            eligible
          }
        : null,
      isAuthenticated,
      isPremium,
      eligible,
      openPrompt,
      closePrompt,
      requireAuth,
      requireEligible,
      requirePremium,
      signIn: () => {
        setEligible(false)
        setIsAuthenticated(true)
        setPrompt(null)
      },
      signOut: () => {
        setIsAuthenticated(false)
        setIsPremium(false)
        setEligible(false)
      },
      upgrade: () => {
        setIsPremium(true)
        setPrompt(null)
      }
    }),
    [
      isAuthenticated,
      isPremium,
      eligible,
      openPrompt,
      closePrompt,
      requireAuth,
      requireEligible,
      requirePremium
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthPrompt type={prompt} onClose={closePrompt} />
    </AuthContext.Provider>
  )
}

export default AuthProvider
