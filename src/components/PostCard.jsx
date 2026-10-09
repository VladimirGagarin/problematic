import { useState } from 'react'
import { FiMoreHorizontal, FiUser, FiArrowUp, FiMessageSquare, FiEye, FiBookmark, FiStar, FiShare2, FiZap, FiLock } from 'react-icons/fi'
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
            <FiUser size={22} />
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
        <button type="button" className="more-options" aria-label="More options" title="More options">
          <FiMoreHorizontal size={18} />
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
          title={`${post.hints?.length || 0} hint${post.hints?.length !== 1 ? 's' : ''} available`}
        >
          <FiZap size={16} />
          <span className="status-text">{post.hints?.length || 0} hint{post.hints?.length !== 1 ? 's' : ''}</span>
        </button>
        <button
          type="button"
          className="status-btn"
          onClick={() => setShowAnswer(!showAnswer)}
          aria-expanded={showAnswer}
          title={showAnswer ? 'Answer revealed' : 'Answer hidden'}
        >
          <FiLock size={16} />
          <span className="status-text">{showAnswer ? 'Revealed' : 'Hidden'}</span>
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
        <button type="button" className="action-btn" title="Upvote">
          <FiArrowUp size={18} />
          <span className="action-text">{post.votes}</span>
        </button>
        <button type="button" className="action-btn" title="Comments">
          <FiMessageSquare size={18} />
          <span className="action-text">{formatCompactNumber(post.comments)}</span>
        </button>
        <button type="button" className="action-btn" title="Views">
          <FiEye size={18} />
          <span className="action-text">{formatCompactNumber(post.views)}</span>
        </button>
      </section>

      <section className="secondary-actions">
        <button type="button" className="secondary-btn" title="Save">
          <FiBookmark size={18} />
        </button>
        <button type="button" className="secondary-btn" title="More like this">
          <FiStar size={18} />
        </button>
        <button type="button" className="secondary-btn" title="Share">
          <FiShare2 size={18} />
        </button>
      </section>

      {post.comments > 0 && (
        <section className="discussion-preview">
          <div className="discussion-text" title="View all discussions">
            <FiMessageSquare size={16} />
            <span>View all {post.comments} discussion{post.comments !== 1 ? 's' : ''}</span>
          </div>
        </section>
      )}
    </article>
  )
}

export default PostCard
