import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth'
import AuthPrompt from '../components/AuthPrompt'
import SignInModal from '../components/SignInModal'
import WelcomeModal from '../components/WelcomeModal'
import { checkUserEligibility, isRemote } from '../lib/api'
import { fetchSessionProfile, signOutRemote, startOAuth } from '../lib/authClient'
import {
  findOrCreateUser,
  getCurrentUser,
  getWelcomeSeen,
  setWelcomeSeen,
  signOutUser
} from '../lib/userStore'

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [isPremium, setIsPremium] = useState(() => Boolean(getCurrentUser()?.isPremium))
  const [eligible, setEligible] = useState(() => Boolean(getCurrentUser()))
  const [prompt, setPrompt] = useState(null)
  const [signInOpen, setSignInOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(
    () => !getCurrentUser() && !getWelcomeSeen()
  )

  const isAuthenticated = Boolean(user)
  const isGuest = !isAuthenticated

  useEffect(() => {
    if (!isAuthenticated || !isRemote) return
    let active = true
    checkUserEligibility(user.id)
      .then((ok) => {
        if (!active) return
        if (!ok) {
          setIsPremium(false)
          setEligible(false)
          setPrompt('ineligible')
          signOutUser()
          setUser(null)
        } else {
          setEligible(true)
        }
      })
      .catch(() => {
        if (active) setEligible(true)
      })
    return () => {
      active = false
    }
  }, [isAuthenticated, user])

  const openSignIn = useCallback(() => {
    setShowWelcome(false)
    setSignInOpen(true)
  }, [])

  const closeSignIn = useCallback(() => setSignInOpen(false), [])
  const openPrompt = useCallback((type) => {
    if (type === 'signin') {
      setShowWelcome(false)
      setSignInOpen(true)
      return
    }
    setPrompt(type)
  }, [])
  const closePrompt = useCallback(() => setPrompt(null), [])

  const signInWithProvider = useCallback((provider) => startOAuth(provider), [])

  const signInAs = useCallback((profile) => {
    const { user: nextUser } = findOrCreateUser(profile)
    setUser(nextUser)
    setIsPremium(Boolean(nextUser.isPremium))
    setEligible(true)
    setWelcomeSeen(true)
    setShowWelcome(false)
    setSignInOpen(false)
    return nextUser
  }, [])

  // After a real Supabase OAuth redirect, map the returned session to our store.
  useEffect(() => {
    if (!isRemote) return
    let active = true
    fetchSessionProfile()
      .then((profile) => {
        if (active && profile) signInAs(profile)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [signInAs])

  const continueAsGuest = useCallback(() => {
    setWelcomeSeen(true)
    setShowWelcome(false)
  }, [])

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      openSignIn()
      return false
    }
    return true
  }, [isAuthenticated, openSignIn])

  const requireEligible = useCallback(() => {
    if (!isAuthenticated) {
      openSignIn()
      return false
    }
    if (!eligible) {
      setPrompt('ineligible')
      return false
    }
    return true
  }, [isAuthenticated, eligible, openSignIn])

  const requirePremium = useCallback(() => {
    if (!isAuthenticated) {
      openSignIn()
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
  }, [isAuthenticated, eligible, isPremium, openSignIn])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isGuest,
      isPremium,
      eligible,
      openPrompt,
      closePrompt,
      openSignIn,
      closeSignIn,
      continueAsGuest,
      signInWithProvider,
      signInAs,
      requireAuth,
      requireEligible,
      requirePremium,
      signIn: openSignIn,
      signOut: () => {
        signOutUser()
        signOutRemote()
        setUser(null)
        setIsPremium(false)
        setEligible(false)
      },
      upgrade: () => {
        setIsPremium(true)
        setPrompt(null)
      }
    }),
    [
      user,
      isAuthenticated,
      isGuest,
      isPremium,
      eligible,
      openPrompt,
      closePrompt,
      openSignIn,
      closeSignIn,
      continueAsGuest,
      signInWithProvider,
      signInAs,
      requireAuth,
      requireEligible,
      requirePremium
    ]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthPrompt type={prompt} onClose={closePrompt} />
      <SignInModal open={signInOpen} onClose={closeSignIn} />
      <WelcomeModal
        open={showWelcome}
        onSignIn={openSignIn}
        onContinueAsGuest={continueAsGuest}
      />
    </AuthContext.Provider>
  )
}

export default AuthProvider
