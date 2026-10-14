import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../context/auth'
import { isRemote } from '../lib/api'
import { providerLabel } from '../lib/authClient'
import './SignInModal.css'

function MicrosoftIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 23 23" width={size} height={size} aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  )
}

function SignInModal({ open, onClose }) {
  const { signInWithProvider, signInAs } = useAuth()
  const [step, setStep] = useState('choose')
  const [provider, setProvider] = useState('google')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [wasOpen, setWasOpen] = useState(open)

  if (open && !wasOpen) {
    setWasOpen(true)
    setStep('choose')
    setError('')
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const chooseProvider = async (next) => {
    setProvider(next)
    setError('')
    if (isRemote) {
      try {
        await signInWithProvider(next)
      } catch {
        setError('Could not start sign-in. Please try again.')
      }
      return
    }
    setStep('demo')
  }

  const submitDemo = (event) => {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Enter a valid email address.')
      return
    }
    signInAs({
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      authFrom: provider,
      avatar: null
    })
    onClose()
  }

  return (
    <div
      className="signin-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="signin-card" role="dialog" aria-modal="true" aria-label="Sign in to Problematic">
        <button type="button" className="signin-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <span className="signin-brand" aria-hidden="true">∑</span>
        <h2 className="signin-title">Sign in to Problematic</h2>
        <p className="signin-subtitle">
          Join the community to like, comment and save problems.
        </p>

        {step === 'choose' ? (
          <div className="signin-providers">
            <button
              type="button"
              className="signin-provider"
              onClick={() => chooseProvider('google')}
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              className="signin-provider"
              onClick={() => chooseProvider('microsoft')}
            >
              <MicrosoftIcon size={18} />
              <span>Continue with Microsoft</span>
            </button>
          </div>
        ) : (
          <form className="signin-form" onSubmit={submitDemo}>
            <p className="signin-demo-note">
              {providerLabel(provider)} demo sign-in — no live provider is configured, so enter any
              account.
            </p>
            <div className="signin-switch" role="group" aria-label="Choose provider">
              <button
                type="button"
                className={`signin-chip ${provider === 'google' ? 'active' : ''}`}
                onClick={() => setProvider('google')}
              >
                <FcGoogle size={16} />
                Google
              </button>
              <button
                type="button"
                className={`signin-chip ${provider === 'microsoft' ? 'active' : ''}`}
                onClick={() => setProvider('microsoft')}
              >
                <MicrosoftIcon size={14} />
                Microsoft
              </button>
            </div>

            <label className="signin-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={provider === 'microsoft' ? 'bob@outlook.com' : 'bob@gmail.com'}
                autoFocus
              />
            </label>

            <label className="signin-field">
              <span>Display name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Bob"
              />
            </label>

            {error && <p className="signin-error">{error}</p>}

            <button type="submit" className="btn btn-accent signin-submit">
              Continue
            </button>
            <button type="button" className="signin-back" onClick={() => setStep('choose')}>
              ← Back
            </button>
          </form>
        )}

        <button type="button" className="signin-guest" onClick={onClose}>
          Continue as guest
        </button>
      </div>
    </div>
  )
}

export default SignInModal
