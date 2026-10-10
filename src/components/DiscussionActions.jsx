import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMessageSquare,
  FiHeart,
  FiBell,
  FiBookmark,
  FiCompass,
  FiShare2
} from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import { formatCompactNumber } from '../utils/time'

function DiscussionActions({ post, onOpenComments }) {
  const navigate = useNavigate()
  const { requireAuth } = useAuth()
  const { savedIds, followingIds, toggleSaved, toggleFollowing } = useInteractions()
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const isSaved = savedIds.has(post.id)
  const isFollowing = followingIds.has(post.id)

  const handleFollow = () => {
    if (!requireAuth()) return
    toggleFollowing(post.id)
  }

  const handleSave = () => {
    if (!requireAuth()) return
    toggleSaved(post.id)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="discussion-actions">
      <button
        type="button"
        className="da-action"
        onClick={onOpenComments}
        title="Comment"
      >
        <FiMessageSquare size={17} />
        <span>{formatCompactNumber(post.commentCount)}</span>
        <span className="da-label">Comment</span>
      </button>

      <button
        type="button"
        className="da-action da-like"
        onClick={() => setLiked((v) => !v)}
        title="Upvote"
      >
        <FiHeart size={17} />
        <span>{formatCompactNumber(post.voteCount + (liked ? 1 : 0))}</span>
      </button>

      <button
        type="button"
        className={`da-action ${isFollowing ? 'active' : ''}`}
        onClick={handleFollow}
        title={isFollowing ? 'Unfollow discussion' : 'Follow up'}
        aria-pressed={isFollowing}
      >
        <FiBell size={17} />
        <span className="da-label">{isFollowing ? 'Following discussion' : 'Follow up'}</span>
      </button>

      <button
        type="button"
        className={`da-action ${isSaved ? 'active' : ''}`}
        onClick={handleSave}
        title={isSaved ? 'Remove bookmark' : 'Save'}
        aria-pressed={isSaved}
      >
        <FiBookmark size={17} />
        <span className="da-label">{isSaved ? 'Saved' : 'Save'}</span>
      </button>

      <button
        type="button"
        className="da-action"
        onClick={() => navigate(`/discoveries?category=${post.category}`)}
        title="More like this"
      >
        <FiCompass size={17} />
        <span className="da-label">More like this</span>
      </button>

      <button type="button" className="da-action da-share" onClick={handleShare} title="Share">
        <FiShare2 size={17} />
        <span className="da-label">{copied ? 'Copied!' : 'Share'}</span>
      </button>
    </div>
  )
}

export default DiscussionActions