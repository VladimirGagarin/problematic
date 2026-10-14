import { useEffect, useRef, useState } from 'react'
import {
  FiX,
  FiSend,
  FiCornerUpLeft,
  FiHeart,
  FiFlag,
  FiBell,
  FiSmile,
  FiEdit2,
  FiTrash2,
  FiCheck
} from 'react-icons/fi'
import { getComments } from '../data/samplePosts'
import { fetchComments, addComment, editComment, deleteComment, isRemote } from '../lib/api'
import { CURRENT_USER_NAME } from '../data/users'
import { formatTimeAgo } from '../utils/time'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import ReportDialog from './ReportDialog'
import EmojiPicker from './EmojiPicker'
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
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [confirmId, setConfirmId] = useState(null)
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

  const isOwner = (comment) =>
    comment.author === 'You' || comment.author === CURRENT_USER_NAME

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
    setEmojiOpen(false)
  }

  const insertEmoji = (emoji) => {
    const el = inputRef.current
    if (!el) {
      setDraft((value) => value + emoji)
      return
    }
    const start = el.selectionStart ?? draft.length
    const end = el.selectionEnd ?? draft.length
    const next = draft.slice(0, start) + emoji + draft.slice(end)
    setDraft(next)
    requestAnimationFrame(() => {
      el.focus()
      const caret = start + emoji.length
      el.setSelectionRange(caret, caret)
    })
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
  }

  const cancelReply = () => {
    setReplyTo(null)
  }

  const startEdit = (comment) => {
    setConfirmId(null)
    setEditingId(comment.id)
    setEditDraft(comment.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft('')
  }

  const saveEdit = (comment) => {
    const text = editDraft.trim()
    if (!text) return
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, text, edited: true } : c))
    )
    if (isRemote) {
      editComment(comment.id, text).catch(() => {})
    }
    cancelEdit()
  }

  const removeComment = (id) => {
    setComments((prev) => {
      const toRemove = new Set([id])
      let grew = true
      while (grew) {
        grew = false
        for (const item of prev) {
          if (item.parentId && toRemove.has(item.parentId) && !toRemove.has(item.id)) {
            toRemove.add(item.id)
            grew = true
          }
        }
      }
      return prev.filter((item) => !toRemove.has(item.id))
    })
    if (isRemote) {
      deleteComment(id).catch(() => {})
    }
    setConfirmId(null)
  }

  const parentOf = (comment) => comments.find((c) => c.id === comment.parentId)

  const renderPrompt = (comment, parent) => (
    <span className="term-prompt">
      <span className="term-user">[{comment.author}]</span>
      {parent && (
        <>
          <span className="term-sep">\</span>
          <span className="term-user-replied">[{parent.author}]</span>
        </>
      )}
      <span className="term-caret">&gt;</span>
    </span>
  )

  const renderComment = (comment, depth) => {
    const replies = sortList(comments.filter((c) => c.parentId === comment.id))
    const parent = parentOf(comment)
    const editing = editingId === comment.id
    const confirming = confirmId === comment.id
    return (
      <article key={comment.id} className={`comment-item ${depth > 0 ? 'comment-item-reply' : ''}`}>
        {editing ? (
          <div className="comment-input-line comment-edit-line">
            {renderPrompt(comment, parent)}
            <textarea
              className="comment-input"
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  saveEdit(comment)
                } else if (e.key === 'Escape') {
                  cancelEdit()
                }
              }}
              rows={1}
              autoFocus
              aria-label="Edit comment"
            />
            <span className="comment-edit-tools">
              <button
                type="button"
                className="comment-edit-save"
                onClick={() => saveEdit(comment)}
                disabled={!editDraft.trim()}
                title="Save changes"
              >
                <FiCheck size={14} />
              </button>
              <button
                type="button"
                className="comment-edit-cancel"
                onClick={cancelEdit}
                title="Cancel"
              >
                <FiX size={14} />
              </button>
            </span>
          </div>
        ) : (
          <p className="comment-line">
            {renderPrompt(comment, parent)}
            <span className="comment-text">{comment.text}</span>
            {comment.edited && <span className="comment-edited">(edited)</span>}
          </p>
        )}

        {confirming ? (
          <div className="comment-confirm">
            <span className="comment-confirm-text">delete this comment?</span>
            <button
              type="button"
              className="comment-action comment-action-danger"
              onClick={() => removeComment(comment.id)}
            >
              <FiTrash2 size={13} />
              <span>yes, delete</span>
            </button>
            <button
              type="button"
              className="comment-action"
              onClick={() => setConfirmId(null)}
            >
              cancel
            </button>
          </div>
        ) : (
          <div className="comment-actions">
            <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
            <button
              type="button"
              className={`comment-action ${likedIds.has(comment.id) ? 'liked' : ''}`}
              onClick={() => toggleLike(comment.id)}
              title={likedIds.has(comment.id) ? 'Unlike' : 'Like'}
            >
              <FiHeart size={13} />
              <span>{effectiveLikes(comment)}</span>
            </button>
            <button
              type="button"
              className="comment-action"
              onClick={() => startReply(comment)}
              title="Reply"
            >
              <FiCornerUpLeft size={13} />
              <span>reply</span>
            </button>
            {isOwner(comment) ? (
              <>
                <button
                  type="button"
                  className="comment-action comment-action-edit"
                  onClick={() => startEdit(comment)}
                  title="Edit your comment"
                >
                  <FiEdit2 size={13} />
                  <span>edit</span>
                </button>
                <button
                  type="button"
                  className="comment-action comment-action-danger"
                  onClick={() => {
                    setEditingId(null)
                    setConfirmId(comment.id)
                  }}
                  title="Delete your comment"
                >
                  <FiTrash2 size={13} />
                  <span>delete</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="comment-action comment-action-report"
                onClick={() => setReportTarget(comment)}
                title="Report"
              >
                <FiFlag size={13} />
                <span>report</span>
              </button>
            )}
          </div>
        )}

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
        <span className="comment-term-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2 className="comment-panel-title">
          discussion
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
            <span>notify</span>
          </label>
          <div className="comment-sort" role="group" aria-label="Sort comments">
            <button
              type="button"
              className={`comment-sort-btn ${sortMode === 'newest' ? 'active' : ''}`}
              onClick={() => setSortMode('newest')}
            >
              newest
            </button>
            <button
              type="button"
              className={`comment-sort-btn ${sortMode === 'relevant' ? 'active' : ''}`}
              onClick={() => setSortMode('relevant')}
            >
              relevant
            </button>
          </div>
          <button
            type="button"
            className="comment-panel-close"
            onClick={onClose}
            aria-label="Close discussion"
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>
      </header>

      <div className="comment-panel-list">
        {topLevel.length === 0 ? (
          <p className="comment-panel-empty">
            <span className="term-user">[system]</span>
            <span className="term-caret">&gt;</span> no comments yet — be the first to share your
            solution.
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
            see more comments ({remaining})
          </button>
        )}
      </div>

      <form className="comment-panel-form" onSubmit={handleSubmit}>
        <div className="comment-composer">
          <div className="comment-input-line">
            <span className="term-prompt term-prompt-input">
              <span className="term-user">[You]</span>
              {replyTo && (
                <>
                  <span className="term-sep">\</span>
                  <span className="term-user-replied">[{replyTo.author}]</span>
                </>
              )}
              <span className="term-caret">&gt;</span>
            </span>
            <textarea
              ref={inputRef}
              className="comment-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={replyTo ? 'type your reply…' : 'type your comment…'}
              rows={1}
              aria-label="Write a comment"
            />
          </div>
        </div>
        <div className="comment-form-tools">
          {replyTo && (
            <button
              type="button"
              className="comment-reply-cancel"
              onClick={cancelReply}
              aria-label="Cancel reply"
              title="Cancel reply"
            >
              <FiX size={14} />
            </button>
          )}
          <button
            type="button"
            className={`comment-emoji-btn ${emojiOpen ? 'active' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setEmojiOpen((value) => !value)}
            aria-label="Insert emoji"
            title="Insert emoji"
          >
            <FiSmile size={16} />
          </button>
          <button
            type="submit"
            className="comment-submit"
            disabled={!draft.trim()}
            title="Post comment"
          >
            <FiSend size={16} />
          </button>
        </div>
      </form>

      <EmojiPicker open={emojiOpen} onPick={insertEmoji} onClose={() => setEmojiOpen(false)} />

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
