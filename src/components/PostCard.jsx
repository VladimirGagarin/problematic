import { useState } from 'react'
import './PostCard.css'

function PostCard({ post }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHints, setShowHints] = useState(false)

  const formatCompactNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num
  }

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'recently'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getPostTypeLabel = () => {
    if (post.type === 'sequence-puzzle') return 'Original puzzle'
    if (post.type === 'proof') return 'Proof'
    return 'Post'
  }

  const getCategoryLabels = () => {
    const labels = []
    if (post.type === 'sequence-puzzle') labels.push('Sequence Puzzle')
    if (post.category === 'number-theory') labels.push('Number Theory')
    if (post.category === 'algebra') labels.push('Algebra')
    labels.push(`${post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)} Difficulty`)
    return labels
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <div className="author-info">
          <div className="author-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="author-details">
            <div className="author-name">{post.author}</div>
            <div className="post-meta">
              <span>{getPostTypeLabel()}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button type="button" className="more-options" aria-label="More options">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </header>

      <section className="post-title-section">
        <h1 className="post-title">{post.title}</h1>
      </section>

      <section className="category-labels">
        {getCategoryLabels().map((label, idx) => (
          <span key={idx} className="category-label">{label}</span>
        ))}
      </section>

      <section className="problem-display">
        <div className="problem-cta">CAN YOU FIND THE PATTERN?</div>
        <div className="problem-text">{post.problem}</div>
        <div className="problem-subtext">What number comes next, and why?</div>
      </section>

      <section className="hint-answer-status">
        <button
          type="button"
          className="status-btn"
          onClick={() => setShowHints(!showHints)}
          aria-expanded={showHints}
        >
          <span className="status-icon">💡</span>
          <span>{post.hints?.length || 0} hint{post.hints?.length !== 1 ? 's' : ''} available</span>
        </button>
        <button
          type="button"
          className="status-btn"
          onClick={() => setShowAnswer(!showAnswer)}
          aria-expanded={showAnswer}
        >
          <span className="status-icon">🔒</span>
          <span>{showAnswer ? 'Answer revealed' : 'Answer hidden'}</span>
        </button>
      </section>

      {showHints && post.hints && post.hints.length > 0 && (
        <section className="hints-section">
          <h2>Hints</h2>
          <ul>
            {post.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </section>
      )}

      {showAnswer && (
        <section className="answer-section">
          <h2>Answer</h2>
          <div className="answer-text">{post.answer}</div>
          {post.solution && (
            <>
              <h2>Solution</h2>
              <p className="solution-text">{post.solution}</p>
            </>
          )}
          {post.formula && (
            <>
              <h2>Formula</h2>
              <div className="formula-text">{post.formula}</div>
            </>
          )}
        </section>
      )}

      <section className="engagement-actions">
        <button type="button" className="action-btn">
          <span className="action-icon">↑</span>
          <span>Upvote: {post.votes}</span>
        </button>
        <button type="button" className="action-btn">
          <span className="action-icon">💬</span>
          <span>Comments: {formatCompactNumber(post.comments)}</span>
        </button>
        <button type="button" className="action-btn">
          <span className="action-icon">👁</span>
          <span>Views: {formatCompactNumber(post.views)}</span>
        </button>
      </section>

      <section className="secondary-actions">
        <button type="button" className="secondary-btn">
          <span className="secondary-icon">🔖</span>
          <span>Save</span>
        </button>
        <button type="button" className="secondary-btn">
          <span className="secondary-icon">✨</span>
          <span>More like this</span>
        </button>
        <button type="button" className="secondary-btn">
          <span className="secondary-icon">↗</span>
          <span>Share</span>
        </button>
      </section>

      {post.comments > 0 && (
        <section className="discussion-preview">
          <div className="discussion-text">
            💬 View all {post.comments} discussion{post.comments !== 1 ? 's' : ''}
          </div>
        </section>
      )}
    </article>
  )
}

export default PostCard
