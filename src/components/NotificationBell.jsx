import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBell } from 'react-icons/fi'
import NotificationItem from './NotificationItem'
import { sampleNotifications } from '../data/sampleNotifications'

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const unread = sampleNotifications.filter((n) => !n.readAt).length

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="notification-bell" ref={wrapRef}>
      <button
        type="button"
        className={`icon-btn bell-btn ${open ? 'active' : ''}`}
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <FiBell size={19} />
        {unread > 0 && <span className="notification-badge">{unread}</span>}
      </button>

      {open && (
        <div className="menu-pop menu-pop-right bell-pop" role="menu">
          <div className="bell-heading">
            <span>Notifications</span>
            <span className="bell-unread">{unread} unread</span>
          </div>
          <div className="bell-list">
            {sampleNotifications.slice(0, 3).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
          <Link
            to="/notifications"
            className="menu-item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}

export default NotificationBell