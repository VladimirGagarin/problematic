import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiMessageSquare,
  FiHeart,
  FiBell,
  FiBookmark,
  FiCompass,
  FiShare2,
  FiCheck
} from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import { toggleVote, isRemote } from '../lib/api'
import { formatCompactNumber } from '../utils/time'

function DiscussionActions({ post, onOpenComments }) {
  const navigate = useNavigate()
  const { requireAuth } = useAuth()
  const {
    savedIds,
    followingIds,
    toggleSaved,
    toggleFollowing,
    createShareLink,
    getShareCount
  } = useInteractions()
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

  const handleLike = () => {
    const next = !liked
    setLiked(next)
    if (isRemote && requireAuth()) {
      toggleVote(post.id, next ? 1 : -1).catch(() => {})
    }
  }

  const handleShare = async () => {
    const url = createShareLink(post.id)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // clipboard may be blocked; still show the copied confirmation
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="discussion-actions">
      <div className="da-group">
        <button
          type="button"
          className="da-action"
          onClick={onOpenComments}
          title="Comment"
          aria-label="Comment"
        >
          <FiMessageSquare size={17} />
          <span className="da-count">{formatCompactNumber(post.commentCount)}</span>
          <span className="da-label">Comment</span>
        </button>

        <button
          type="button"
          className={`da-action da-like ${liked ? 'active' : ''}`}
          onClick={handleLike}
          title="Upvote"
          aria-label="Upvote"
          aria-pressed={liked}
        >
          <FiHeart size={17} />
          <span className="da-count">{formatCompactNumber(post.voteCount + (liked ? 1 : 0))}</span>
        </button>
      </div>

      <div className="da-group da-group-end">
        <button
          type="button"
          className={`da-action ${isFollowing ? 'active' : ''}`}
          onClick={handleFollow}
          title={isFollowing ? 'Unfollow discussion' : 'Follow up'}
          aria-label={isFollowing ? 'Unfollow discussion' : 'Follow up'}
          aria-pressed={isFollowing}
        >
          <FiBell size={17} />
          <span className="da-label">{isFollowing ? 'Following' : 'Follow up'}</span>
        </button>

        <button
          type="button"
          className={`da-action ${isSaved ? 'active' : ''}`}
          onClick={handleSave}
          title={isSaved ? 'Remove bookmark' : 'Save'}
          aria-label={isSaved ? 'Remove bookmark' : 'Save'}
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
          aria-label="More like this"
        >
          <FiCompass size={17} />
          <span className="da-label">More like this</span>
        </button>

        <button
          type="button"
          className={`da-action da-share ${copied ? 'active' : ''}`}
          onClick={handleShare}
          title="Copy link"
          aria-label="Copy link"
        >
          {copied ? <FiCheck size={17} /> : <FiShare2 size={17} />}
          <span className="da-count">{formatCompactNumber(getShareCount(post))}</span>
          <span className="da-label">{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
    </div>
  )
}

export default DiscussionActions