import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiLogOut, FiLogIn } from 'react-icons/fi'
import SearchBar from './SearchBar'
import NotificationBell from './NotificationBell'
import { useAuth } from '../context/auth'

function Header() {
  const { user, isAuthenticated, openPrompt, requirePremium, signOut } = useAuth()
  const navigate = useNavigate()
  const [openAccount, setOpenAccount] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!openAccount) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenAccount(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenAccount(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openAccount])

  const handleCreate = () => {
    if (requirePremium()) {
      setOpenAccount(false)
      navigate('/create')
    }
  }

  const initial = (user?.name || 'G').charAt(0)

  return (
    <header className="top-banner">
      <div className="top-banner-content">
        <Link to="/foryou" className="brand" title="Problematic">
          <span className="brand-mark" aria-hidden="true">∑</span>
          <span className="brand-name">Problematic</span>
        </Link>

        <div className="top-banner-search">
          <SearchBar />
        </div>

        <div className="top-banner-icons">
          <button type="button" className="btn btn-accent create-btn" onClick={handleCreate}>
            <FiPlus size={16} />
            <span>Create</span>
          </button>

          <NotificationBell />

          <div className="menu-wrap" ref={wrapRef}>
            <button
              type="button"
              className={`icon-btn account-btn ${openAccount ? 'active' : ''}`}
              aria-label="Account"
              aria-haspopup="menu"
              aria-expanded={openAccount}
              title={isAuthenticated ? 'Account' : 'Sign in'}
              onClick={() => setOpenAccount((v) => !v)}
            >
              <span className="account-initial">{initial}</span>
            </button>

            {openAccount && (
              <div className="menu-pop menu-pop-right" role="menu">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="menu-item"
                      role="menuitem"
                      onClick={() => setOpenAccount(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/notifications"
                      className="menu-item"
                      role="menuitem"
                      onClick={() => setOpenAccount(false)}
                    >
                      Notifications
                    </Link>
                    <button
                      type="button"
                      className="menu-item menu-item-danger"
                      role="menuitem"
                      onClick={() => {
                        signOut()
                        setOpenAccount(false)
                      }}
                    >
                      <FiLogOut size={15} />
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={() => {
                      openPrompt('signin')
                      setOpenAccount(false)
                    }}
                  >
                    <FiLogIn size={15} />
                    Sign in
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header