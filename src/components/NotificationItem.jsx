import { Link } from 'react-router-dom'
import { FiMessageCircle, FiAtSign, FiUsers, FiUser, FiBell, FiX } from 'react-icons/fi'
import { formatTimeAgo } from '../utils/time'
import { useInteractions } from '../context/interactions'
import {
  notificationContentOf,
  notificationIdOf,
  notificationLinkOf,
  notificationTimeOf,
  isNotificationRead
} from '../utils/notifications'

const ICONS = {
  new_comment: FiMessageCircle,
  new_reply: FiAtSign,
  discussion_invitation: FiUsers,
  profile_view: FiUser,
  welcome: FiBell,
  browser_permission: FiBell,
  broadcast: FiBell,
  system: FiBell
}

function NotificationItem({ notification, detail = false }) {
  const { getPostOf, runNotificationAction, dismissNotification } = useInteractions()
  const id = notificationIdOf(notification)
  const content = notificationContentOf(notification)
  const link = notificationLinkOf(notification)
  const read = isNotificationRead(notification)
  const Icon = ICONS[notification.type] || FiBell
  const post = notification.postId ? getPostOf(notification.postId) : null

  const body = (
    <>
      <span className="notification-icon" aria-hidden="true">
        <Icon size={16} />
      </span>
      <span className="notification-body">
        <span className="notification-message">{content.text}</span>
        {content.additional_text && (
          <span className="notification-additional">{content.additional_text}</span>
        )}
        {post && <span className="notification-post">{post.title}</span>}
        <span className="notification-time">
          {content.tagline ? `${content.tagline} \u00b7 ` : ''}
          {formatTimeAgo(notificationTimeOf(notification))}
        </span>
      </span>
    </>
  )

  return (
    <article
      className={`notification-item ${read ? 'is-read' : 'is-unread'} notification-type-${notification.type}`}
    >
      {link ? (
        <Link className="notification-link" to={link}>
          {body}
        </Link>
      ) : (
        <div className="notification-link">{body}</div>
      )}

      {notification.action && (
        <div className="notification-actions">
          <button
            type="button"
            className="btn btn-accent notification-action"
            onClick={() => runNotificationAction(notification)}
          >
            {notification.action.label}
          </button>
        </div>
      )}

      {detail && notification.dismissible && (
        <button
          type="button"
          className="notification-dismiss"
          aria-label="Dismiss notification"
          title="Dismiss"
          onClick={() => dismissNotification(id)}
        >
          <FiX size={14} />
        </button>
      )}
    </article>
  )
}

export default NotificationItem
