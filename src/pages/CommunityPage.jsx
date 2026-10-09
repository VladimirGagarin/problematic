import './CommunityPage.css'

function CommunityPage() {
  return (
    <div className="community-page">
      <div className="community-header">
        <h1 className="community-title">Community</h1>
        <p className="community-subtitle">See replies, comments, and interactions you made or received.</p>
      </div>
      <div className="community-empty">
        <p>No interactions yet. Join discussions to see activity here.</p>
      </div>
    </div>
  )
}

export default CommunityPage
