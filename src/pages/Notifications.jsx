import NotificationItem from '../components/NotificationItem'
import { useInteractions } from '../context/interactions'
import './Notifications.css'

function Notifications() {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useInteractions()

  const unread = notifications.filter((n) => !n.readAt)
  const read = notifications.filter((n) => n.readAt)

  const renderGroup = (list) => (
    <div className="notifications-group">
      {list.map((n) => (
        <div key={n.id} className="notifications-row" onClick={() => markNotificationRead(n.id)}>
          <NotificationItem notification={n} detail />
        </div>
      ))}
    </div>
  )

  return (
    <div className="notifications">
      <header className="notifications-head">
        <div>
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-sub">
            New comments, replies and discussion invitations.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={markAllNotificationsRead}
          disabled={unread.length === 0}
        >
          Mark all as read
        </button>
      </header>

      {unread.length > 0 && (
        <section className="notifications-section">
          <h2 className="notifications-group-title">Unread</h2>
          {renderGroup(unread)}
        </section>
      )}

      {read.length > 0 && (
        <section className="notifications-section">
          <h2 className="notifications-group-title">Read</h2>
          {renderGroup(read)}
        </section>
      )}

      {notifications.length === 0 && (
        <div className="notifications-empty">
          <h2>You're all caught up</h2>
          <p>Notifications appear here when discussions you follow get new activity.</p>
        </div>
      )}
    </div>
  )
}

export default Notifications