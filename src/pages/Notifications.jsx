import { useState } from 'react'
import NotificationItem from '../components/NotificationItem'
import { useInteractions } from '../context/interactions'
import { useAuth } from '../context/auth'
import { NOTIFICATION_AUDIENCES } from '../utils/notifications'
import './Notifications.css'

function Notifications() {
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    canBroadcast,
    sendBroadcast,
    browserPermission,
    browserSupported,
    enableBrowserNotifications
  } = useInteractions()
  const { isAuthenticated } = useAuth()

  const [audience, setAudience] = useState('all')
  const [text, setText] = useState('')
  const [additionalText, setAdditionalText] = useState('')
  const [link, setLink] = useState('')
  const [sent, setSent] = useState(false)

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  const submitBroadcast = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendBroadcast({
      audience,
      text: text.trim(),
      additionalText: additionalText.trim(),
      link: link.trim()
    })
    setText('')
    setAdditionalText('')
    setLink('')
    setSent(true)
  }

  const renderGroup = (list) => (
    <div className="notifications-group">
      {list.map((n) => (
        <div
          key={n.notification_id}
          className="notifications-row"
          onClick={() => markNotificationRead(n.notification_id)}
        >
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
            New comments, replies, community invitations and updates from Problematic.
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

      {!isAuthenticated && (
        <div className="notifications-banner">
          <div>
            <strong>You are browsing as a guest.</strong>
            <p>Sign in to keep your notifications, save problems and follow discussions.</p>
          </div>
        </div>
      )}

      {browserSupported && browserPermission !== 'granted' && (
        <div className="notifications-banner notifications-banner-soft">
          <div>
            <strong>Browser notifications are off.</strong>
            <p>Turn them on to hear about replies and invitations straight away.</p>
          </div>
          <button
            type="button"
            className="btn btn-accent"
            onClick={enableBrowserNotifications}
          >
            Enable
          </button>
        </div>
      )}

      {canBroadcast && (
        <form className="notifications-composer" onSubmit={submitBroadcast}>
          <h2 className="notifications-group-title">Problematic Team broadcast</h2>
          <div className="composer-grid">
            <label className="composer-field">
              <span>Send to</span>
              <select value={audience} onChange={(e) => setAudience(e.target.value)}>
                {NOTIFICATION_AUDIENCES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="composer-field">
              <span>Link (optional)</span>
              <input
                type="text"
                value={link}
                placeholder="/post/..."
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </div>
          <label className="composer-field">
            <span>Message</span>
            <input
              type="text"
              value={text}
              placeholder="What do you want to announce?"
              onChange={(e) => {
                setText(e.target.value)
                setSent(false)
              }}
            />
          </label>
          <label className="composer-field">
            <span>Tagline / extra detail (optional)</span>
            <input
              type="text"
              value={additionalText}
              placeholder="A little more context"
              onChange={(e) => setAdditionalText(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-accent" disabled={!text.trim()}>
            Send notification
          </button>
          {sent && <span className="composer-sent">Broadcast queued to {audience}.</span>}
        </form>
      )}

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
          <h2>You&apos;re all caught up</h2>
          <p>Notifications appear here when discussions you follow get new activity.</p>
        </div>
      )}
    </div>
  )
}

export default Notifications
