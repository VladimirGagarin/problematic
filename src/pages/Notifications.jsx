import { useState } from 'react'
import NotificationItem from '../components/NotificationItem'
import { sampleNotifications } from '../data/sampleNotifications'
import './Notifications.css'

function Notifications() {
  const [items, setItems] = useState(sampleNotifications)

  const unread = items.filter((n) => !n.readAt)
  const read = items.filter((n) => n.readAt)

  const markAllRead = () => {
    setItems((prev) =>
      prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
    )
  }

  const markRead = (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: new Date().toISOString() } : n))
    )
  }

  const renderGroup = (list) => (
    <div className="notifications-group">
      {list.map((n) => (
        <div key={n.id} className="notifications-row" onClick={() => markRead(n.id)}>
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
          onClick={markAllRead}
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

      {items.length === 0 && (
        <div className="notifications-empty">
          <h2>You're all caught up</h2>
          <p>Notifications appear here when discussions you follow get new activity.</p>
        </div>
      )}
    </div>
  )
}

export default Notifications