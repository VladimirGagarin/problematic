import './ProfilePage.css'

function ProfilePage() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
      </div>
      <div className="profile-card">
        <div className="profile-avatar">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="profile-name">Guest User</h2>
        <p className="profile-email">Not signed in</p>
      </div>
    </div>
  )
}

export default ProfilePage
