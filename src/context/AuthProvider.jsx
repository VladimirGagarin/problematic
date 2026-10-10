import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import AuthPrompt from '../components/AuthPrompt'

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [prompt, setPrompt] = useState(null)

  const openPrompt = useCallback((type) => setPrompt(type), [])
  const closePrompt = useCallback(() => setPrompt(null), [])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      setPrompt('signin')
      return false
    }
    return true
  }, [isAuthenticated])

  const requirePremium = useCallback(() => {
    if (!isAuthenticated) {
      setPrompt('signin')
      return false
    }
    if (!isPremium) {
      setPrompt('premium')
      return false
    }
    return true
  }, [isAuthenticated, isPremium])

  const value = useMemo(
    () => ({
      user: isAuthenticated ? { name: 'Current Member', handle: '@member' } : null,
      isAuthenticated,
      isPremium,
      openPrompt,
      closePrompt,
      requireAuth,
      requirePremium,
      signIn: () => {
        setIsAuthenticated(true)
        setPrompt(null)
      },
      signOut: () => {
        setIsAuthenticated(false)
        setIsPremium(false)
      },
      upgrade: () => {
        setIsPremium(true)
        setPrompt(null)
      }
    }),
    [isAuthenticated, isPremium, openPrompt, closePrompt, requireAuth, requirePremium]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthPrompt type={prompt} onClose={closePrompt} />
    </AuthContext.Provider>
  )
}

export default AuthProvider