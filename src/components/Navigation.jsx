import { NavLink } from 'react-router-dom'
import { FiHome, FiCompass, FiUser, FiBell } from 'react-icons/fi'
import './Navigation.css'

const desktopTabs = [
  { to: '/foryou', label: 'For you' },
  { to: '/discoveries', label: 'Discoveries' }
]

const bottomItems = [
  { to: '/foryou', label: 'For you', Icon: FiHome },
  { to: '/discoveries', label: 'Discover', Icon: FiCompass },
  { to: '/notifications', label: 'Alerts', Icon: FiBell },
  { to: '/profile', label: 'Profile', Icon: FiUser }
]

function Navigation() {
  return (
    <>
      <nav className="main-nav" aria-label="Primary">
        <ul className="nav-tabs">
          {desktopTabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end
                className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="bottom-nav" aria-label="Primary mobile">
        {bottomItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Navigation