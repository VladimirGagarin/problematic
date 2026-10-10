import { Link } from 'react-router-dom'
import { FiMessageCircle, FiAtSign, FiUsers } from 'react-icons/fi'
import { formatTimeAgo } from '../utils/time'
import { useInteractions } from '../context/interactions'

const ICONS = {
  new_comment: FiMessageCircle,
  new_reply: FiAtSign,
  discussion_invitation: FiUsers
}

function NotificationItem({ notification, detail = false }) {
  const Icon = ICONS[notification.type] || FiMessageCircle
  const { getPostOf } = useInteractions()
  const post = getPostOf(notification.postId)

  return (
    <article className={`notification-item ${notification.readAt ? 'is-read' : 'is-unread'}`}>
      <Link className="notification-link" to={`/post/${notification.postId}`}>
        <span className="notification-icon" aria-hidden="true">
          <Icon size={16} />
        </span>
        <span className="notification-body">
          <span className="notification-message">{notification.message}</span>
          {post && <span className="notification-post">{post.title}</span>}
          <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
        </span>
      </Link>
      {detail && notification.commentId && (
        <span className="notification-comment-ref">Linked to a comment in the thread.</span>
      )}
    </article>
  )
}

export default NotificationItem