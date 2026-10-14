import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiX, FiUserPlus, FiStar, FiAlertOctagon } from 'react-icons/fi'
import { useAuth } from '../context/auth'
import './AuthPrompt.css'

const CONTENT = {
  signin: {
    title: 'Welcome to Problematic',
    body: 'Sign in to comment, vote, save posts and follow discussions.',
    primary: 'Sign in',
    secondary: 'Create account'
  },
  premium: {
    title: 'Premium gives you more',
    body: 'Posting and publishing mathematical content requires a premium account.',
    primary: 'Go premium',
    secondary: 'Not now'
  },
  ineligible: {
    title: 'Account restricted',
    body: 'You were signed out because this account breached our community guidelines. Review our policy to understand the rules and how to appeal.',
    primary: 'Read the policy',
    secondary: 'Close'
  },
  post: {
    title: 'The composer is coming',
    body: 'Problem publishing arrives with the Premium posting milestone. VA BENE 9.',
    primary: 'Got it',
    secondary: null
  }
}

function AuthPrompt({ type, onClose }) {
  const { signIn, upgrade } = useAuth()
  const navigate = useNavigate()
  const content = CONTENT[type] || null

  useEffect(() => {
    if (!type) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [type, onClose])

  if (!content) return null

  const handlePrimary = () => {
    if (type === 'signin') signIn()
    if (type === 'premium') upgrade()
    if (type === 'ineligible') {
      onClose()
      navigate('/policy')
    }
    if (type === 'post') onClose()
  }

  return (
    <div
      className="auth-prompt-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="auth-prompt-card" role="dialog" aria-modal="true" aria-label={content.title}>
        <button type="button" className="auth-prompt-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>
        <span className="auth-prompt-icon" aria-hidden="true">
          {type === 'premium' ? (
            <FiStar />
          ) : type === 'ineligible' ? (
            <FiAlertOctagon />
          ) : (
            <FiUserPlus />
          )}
        </span>
        <h2 className="auth-prompt-title">{content.title}</h2>
        <p className="auth-prompt-body">{content.body}</p>
        <div className="auth-prompt-actions">
          <button type="button" className="btn btn-primary" onClick={handlePrimary}>
            {content.primary}
          </button>
          {content.secondary && (
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {content.secondary}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPrompt