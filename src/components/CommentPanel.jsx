import { useEffect, useRef, useState } from 'react'
import { FiX, FiSend, FiUser, FiHeart, FiCornerUpLeft, FiFlag, FiBell } from 'react-icons/fi'
import { getComments } from '../data/samplePosts'
import { fetchComments, addComment, isRemote } from '../lib/api'
import { formatTimeAgo } from '../utils/time'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import ReportDialog from './ReportDialog'
import './CommentPanel.css'

function CommentPanel({ post, open, onClose }) {
  const { requireAuth } = useAuth()
  const { replyNotifyIds, toggleReplyNotify, addNotification } = useInteractions()
  const subscribed = replyNotifyIds.has(post.id)
  const [comments, setComments] = useState(() => getComments(post.id))
  const [draft, setDraft] = useState('')
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [sortMode, setSortMode] = useState('newest')
  const [replyTo, setReplyTo] = useState(null)
  const [reportTarget, setReportTarget] = useState(null)
  const [visibleCount, setVisibleCount] = useState(4)
  const inputRef = useRef(null)

  useEffect(() => {
    if (replyTo) inputRef.current?.focus()
  }, [replyTo])

  useEffect(() => {
    if (!isRemote) return
    let active = true
    fetchComments(post.id)
      .then((list) => {
        if (active) setComments(list)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [post.id])

  if (!open) return null

  const effectiveLikes = (comment) => comment.likes + (likedIds.has(comment.id) ? 1 : 0)

  const sortList = (list) => {
    const arr = [...list]
    if (sortMode === 'relevant') {
      arr.sort(
        (a, b) =>
          effectiveLikes(b) - effectiveLikes(a) ||
          new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return arr
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!requireAuth()) {
      setDraft('')
      setReplyTo(null)
      return
    }
    const text = draft.trim()
    if (!text) return
    const parentId = replyTo?.id
    const created = {
      id: `local-${Date.now()}`,
      author: 'You',
      text,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId
    }
    setComments((prev) => [created, ...prev])
    if (isRemote) {
      addComment(post.id, { text, parentId }).catch(() => {})
    }
    if (subscribed) {
      addNotification({
        type: parentId ? 'new_reply' : 'new_comment',
        postId: post.id,
        message: parentId
          ? `Someone replied in "${post.title}".`
          : `New comment on "${post.title}".`
      })
    }
    setDraft('')
    setReplyTo(null)
  }

  const toggleLike = (commentId) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (next.has(commentId)) {
        next.delete(commentId)
      } else {
        next.add(commentId)
      }
      return next
    })
  }

  const startReply = (comment) => {
    if (!requireAuth()) return
    setReplyTo({ id: comment.id, author: comment.author })
    setDraft(`@${comment.author} `)
  }

  const cancelReply = () => {
    setReplyTo(null)
    setDraft('')
  }

  const parentOf = (comment) => comments.find((c) => c.id === comment.parentId)

  const renderComment = (comment, depth) => {
    const replies = sortList(comments.filter((c) => c.parentId === comment.id))
    const parent = parentOf(comment)
    return (
      <article key={comment.id} className={`comment-item ${depth > 0 ? 'comment-item-reply' : ''}`}>
        <div className="comment-avatar">
          <FiUser size={16} />
        </div>
        <div className="comment-body">
          <div className="comment-meta">
            <span className="comment-author">{comment.author}</span>
            {parent && (
              <span className="comment-parent">to @{parent.author}</span>
            )}
            <span className="comment-time">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
          <div className="comment-actions">
            <button
              type="button"
              className={`comment-action ${likedIds.has(comment.id) ? 'liked' : ''}`}
              onClick={() => toggleLike(comment.id)}
              title={likedIds.has(comment.id) ? 'Unlike' : 'Like'}
            >
              <FiHeart size={14} />
              <span>{effectiveLikes(comment)}</span>
            </button>
            <button
              type="button"
              className="comment-action"
              onClick={() => startReply(comment)}
              title="Reply"
            >
              <FiCornerUpLeft size={14} />
              <span>Reply</span>
            </button>
            <button
              type="button"
              className="comment-action comment-action-report"
              onClick={() => setReportTarget(comment)}
              title="Report"
            >
              <FiFlag size={14} />
              <span>Report</span>
            </button>
          </div>
        </div>
        {replies.length > 0 && (
          <div className="comment-replies">{replies.map((r) => renderComment(r, depth + 1))}</div>
        )}
      </article>
    )
  }

  const topLevelAll = sortList(comments.filter((c) => !c.parentId))
  const topLevel = topLevelAll.slice(0, visibleCount)
  const remaining = topLevelAll.length - topLevel.length

  return (
    <section className="comment-panel" aria-label={`Discussion on ${post.title}`}>
      <header className="comment-panel-header">
        <h2 className="comment-panel-title">
          Discussion
          <span className="comment-panel-count">{comments.length}</span>
        </h2>
        <div className="comment-panel-header-right">
          <label
            className={`comment-notify ${subscribed ? 'active' : ''}`}
            title="Send me a notification when someone replies"
          >
            <input
              type="checkbox"
              checked={subscribed}
              onChange={() => toggleReplyNotify(post.id)}
            />
            <FiBell size={14} />
            <span>Notify me when someone replies</span>
          </label>
          <div className="comment-sort" role="group" aria-label="Sort comments">
            <button
              type="button"
              className={`comment-sort-btn ${sortMode === 'newest' ? 'active' : ''}`}
              onClick={() => setSortMode('newest')}
            >
              Newest
            </button>
            <button
              type="button"
              className={`comment-sort-btn ${sortMode === 'relevant' ? 'active' : ''}`}
              onClick={() => setSortMode('relevant')}
            >
              Relevant
            </button>
          </div>
          <button
            type="button"
            className="comment-panel-close"
            onClick={onClose}
            aria-label="Close discussion"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>
      </header>

      <div className="comment-panel-list">
        {topLevel.length === 0 ? (
          <p className="comment-panel-empty">
            No comments yet. Be the first to share your solution.
          </p>
        ) : (
          topLevel.map((comment) => renderComment(comment, 0))
        )}
        {remaining > 0 && (
          <button
            type="button"
            className="comment-panel-more"
            onClick={() => setVisibleCount((count) => count + 4)}
          >
            See more comments ({remaining})
          </button>
        )}
      </div>

      <form className="comment-panel-form" onSubmit={handleSubmit}>
        <div className="comment-composer">
          {replyTo && (
            <div className="comment-reply-meta">
              <FiCornerUpLeft size={13} />
              <span>Replying to @{replyTo.author}</span>
              <button
                type="button"
                className="comment-reply-cancel"
                onClick={cancelReply}
                aria-label="Cancel reply"
                title="Cancel reply"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
          <textarea
            ref={inputRef}
            className="comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={replyTo ? 'Write a reply...' : 'Add to the discussion...'}
            rows={2}
            aria-label="Write a comment"
          />
        </div>
        <button
          type="submit"
          className="comment-submit"
          disabled={!draft.trim()}
          title="Post comment"
        >
          <FiSend size={16} />
        </button>
      </form>

      <ReportDialog
        open={!!reportTarget}
        subject={reportTarget ? `Comment by ${reportTarget.author}` : ''}
        targetType="comment"
        targetId={reportTarget?.id}
        onClose={() => setReportTarget(null)}
      />
    </section>
  )
}

export default CommentPanel