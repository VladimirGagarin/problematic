import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMoreHorizontal,
  FiZap,
  FiLock,
  FiAlertTriangle,
  FiFlag,
  FiEyeOff,
  FiCheck
} from 'react-icons/fi'
import CommentPanel from './CommentPanel'
import DiscussionActions from './DiscussionActions'
import { formatTypeLabel } from '../data/types'
import { formatCategoryLabel } from '../data/categories'
import { getComments } from '../data/samplePosts'
import { formatTimeAgo } from '../utils/time'
import { useInteractions } from '../context/interactions'
import './PostCard.css'

const REVEAL_ENABLED = false

function PostCard({ post }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [reported, setReported] = useState(false)
  const menuRef = useRef(null)
  const closeComments = useCallback(() => setShowComments(false), [])
  const { hidePost } = useInteractions()

  const isUnsolved = post.solutionStatus === 'unsolved'
  const handle = `@${(post.author || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '')}`

  const cta = post.type?.includes('proof')
    ? 'Can you prove it?'
    : post.type?.includes('puzzle') || post.type?.includes('problem')
      ? 'Think it through'
      : 'Let\u2019s discuss'

  useEffect(() => {
    if (!openMenu) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  const latestComment = getComments(post.id)[0]

  return (
    <article className="x-post" data-post-id={post.id}>
      <div className="x-avatar" aria-hidden="true">
        {post.author?.charAt(0) || '?'}
      </div>

      <div className="x-body">
        <header className="x-head">
          <div className="x-user">
            <span className="x-name">{post.author}</span>
            <span className="x-handle">{handle}</span>
            <span className="x-time">· {formatTimeAgo(post.createdAt, { short: true })}</span>
          </div>
          <div className="x-overflow" ref={menuRef}>
            <button
              type="button"
              className="x-icon-btn"
              aria-label="More options"
              aria-expanded={openMenu}
              title="More options"
              onClick={() => setOpenMenu((v) => !v)}
            >
              <FiMoreHorizontal size={18} />
            </button>
            {openMenu && (
              <div className="x-overflow-menu" role="menu">
                <Link
                  to={`/post/${post.id}`}
                  className="menu-item"
                  role="menuitem"
                  onClick={() => setOpenMenu(false)}
                >
                  Open post
                </Link>
                <button
                  type="button"
                  className="menu-item"
                  role="menuitem"
                  disabled={reported}
                  onClick={() => setReported(true)}
                >
                  {reported ? <FiCheck size={15} /> : <FiFlag size={15} />}
                  {reported ? 'Reported — thanks' : 'Report'}
                </button>
                <button
                  type="button"
                  className="menu-item menu-item-danger"
                  role="menuitem"
                  onClick={() => {
                    hidePost(post.id)
                    setOpenMenu(false)
                  }}
                >
                  <FiEyeOff size={15} />
                  Not interested
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="x-tags">
          {post.type && <span className="x-tag">{formatTypeLabel(post.type)}</span>}
          {post.category && <span className="x-tag">{formatCategoryLabel(post.category)}</span>}
          {post.secondaryCategories?.slice(0, 1).map((cat) => (
            <span key={cat} className="x-tag x-tag-muted">
              {formatCategoryLabel(cat)}
            </span>
          ))}
          {post.difficulty && (
            <span className="x-tag x-tag-muted">
              {post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
            </span>
          )}
          {isUnsolved && (
            <span className="x-tag x-tag-unsolved">
              <FiAlertTriangle size={12} /> Unsolved
            </span>
          )}
        </div>

        <h2 className="x-title">{post.title}</h2>

        <div className="x-problem">
          <span className="x-cta">{cta}</span>
          <div className="x-problem-text">{post.problem}</div>
        </div>

        <div className="x-reveal">
          <button
            type="button"
            className={`x-chip ${showHints ? 'active' : ''}`}
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
          >
            <FiZap size={15} />
            {post.hints?.length || 0} hint{post.hints?.length !== 1 ? 's' : ''}
          </button>
          {REVEAL_ENABLED && !isUnsolved && (
            <button
              type="button"
              className={`x-chip ${showAnswer ? 'active' : ''}`}
              onClick={() => setShowAnswer((v) => !v)}
              aria-expanded={showAnswer}
            >
              <FiLock size={15} />
              {showAnswer ? 'Hide answer' : 'Reveal answer'}
            </button>
          )}
        </div>

        {showHints && post.hints && post.hints.length > 0 && (
          <div className="x-panel">
            <h3>Hints</h3>
            <ul>
              {post.hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {REVEAL_ENABLED && showAnswer && !isUnsolved && (
          <div className="x-panel">
            <h3>Answer</h3>
            <div className="x-answer-value">{post.answer}</div>
            {post.solution && (
              <>
                <h3>Solution</h3>
                <p className="x-solution">{post.solution}</p>
              </>
            )}
            {post.formula && (
              <>
                <h3>Formula</h3>
                <div className="x-answer-value">{post.formula}</div>
              </>
            )}
          </div>
        )}

        <DiscussionActions post={post} onOpenComments={() => setShowComments(true)} />

        {latestComment && (
          <div className="x-preview">
            <p className="x-preview-text">
              <span className="x-preview-author">{latestComment.author}:</span>{' '}
              {latestComment.text}
            </p>
            <button type="button" className="x-preview-open" onClick={() => setShowComments(true)}>
              Open the full discussion
            </button>
          </div>
        )}

        <CommentPanel post={post} open={showComments} onClose={closeComments} />
      </div>
    </article>
  )
}

export default PostCard