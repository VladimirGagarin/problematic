import './WelcomeModal.css'

function WelcomeModal({ open, onSignIn, onContinueAsGuest }) {
  if (!open) return null

  return (
    <div className="welcome-overlay" role="presentation">
      <div className="welcome-card" role="dialog" aria-modal="true" aria-label="Welcome to Problematic">
        <span className="welcome-mark" aria-hidden="true">∑</span>
        <h2 className="welcome-title">Welcome to Problematic</h2>
        <p className="welcome-body">
          A community for curious minds — proofs, puzzles and open problems. Sign in to like,
          comment and save. Or look around as a guest.
        </p>
        <div className="welcome-actions">
          <button type="button" className="btn btn-accent welcome-primary" onClick={onSignIn}>
            Sign in
          </button>
          <button type="button" className="btn btn-ghost" onClick={onContinueAsGuest}>
            Continue as guest
          </button>
        </div>
        <p className="welcome-note">
          Guests can read posts but can&apos;t interact or see comments. You can sign in anytime.
        </p>
      </div>
    </div>
  )
}

export default WelcomeModal
