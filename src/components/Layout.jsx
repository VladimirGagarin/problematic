import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'
import './Layout.css'

function Layout() {
  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />
      <Header />
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout