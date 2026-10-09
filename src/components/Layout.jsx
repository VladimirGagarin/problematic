import { Outlet, Link, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout() {
  const location = useLocation()
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/foryou') || location.pathname.startsWith('/post')
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app">
      <header className="top-banner">
        <div className="top-banner-content">
          <Link to="/unsolved" className="top-banner-text">Problematic</Link>
          <div className="top-banner-icons">
            <button type="button" className="icon-btn" aria-label="Search">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link to="/profile" className="icon-btn user-btn" aria-label="Profile">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="notification-badge">3</span>
            </Link>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <ul className="nav-tabs">
          <li className="nav-tab">
            <Link
              to="/foryou"
              className={`tab-btn ${isActive('/foryou') || isActive('/') ? 'active' : ''}`}
            >
              For you
            </Link>
          </li>
          <li className="nav-tab">
            <Link
              to="/unsolved"
              className={`tab-btn ${isActive('/unsolved') ? 'active' : ''}`}
            >
              Unsolved
            </Link>
          </li>
          <li className="nav-tab">
            <Link
              to="/discoveries"
              className={`tab-btn ${isActive('/discoveries') ? 'active' : ''}`}
            >
              Discoveries
            </Link>
          </li>
          <li className="nav-tab">
            <Link
              to="/community"
              className={`tab-btn ${isActive('/community') ? 'active' : ''}`}
            >
              Community
            </Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
