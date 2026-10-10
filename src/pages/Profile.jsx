import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiMessageSquare,
  FiBell,
  FiSave,
  FiUsers
} from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import { samplePosts } from '../data/samplePosts'
import { formatCompactNumber } from '../utils/time'
import './Profile.css'

const TABS = [
  { id: 'posted', label: 'Posted questions', Icon: FiMessageSquare },
  { id: 'saved', label: 'Saved posts', Icon: FiSave },
  { id: 'comments', label: 'Comments & replies', Icon: FiBell },
  { id: 'followed', label: 'Discussions followed', Icon: FiUsers }
]

const SAMPLE_COMMENTS = [
  { post: samplePosts[0], text: 'The differences give 42 — lovely puzzle.' },
  { post: samplePosts[1], text: 'The pairing proof is the cleanest of all.' }
]

function Profile() {
  const { user, isAuthenticated, openPrompt, signOut } = useAuth()
  const { savedIds, followingIds } = useInteractions()
  const [activeTab, setActiveTab] = useState('posted')

  if (!isAuthenticated) {
    return (
      <div className="profile profile-guest">
        <h1 className="profile-guest-title">Sign in to Problematic</h1>
        <p className="profile-guest-copy">
          Your questions, saved posts and followed discussions are private until you sign in.
        </p>
        <div className="profile-guest-actions">
          <button type="button" className="btn btn-accent" onClick={() => openPrompt('signin')}>
            Sign in
          </button>
          <button type="button" className="btn btn-outline" onClick={() => openPrompt('signin')}>
            Create account
          </button>
        </div>
      </div>
    )
  }

  const posted = samplePosts.filter(
    (p) => p.author === user?.name || p.author.toLowerCase().includes('room24')
  )
  const savedPosts = samplePosts.filter((p) => savedIds.has(p.id))
  const followedPosts = samplePosts.filter((p) => followingIds.has(p.id))

  const renderEmpty = (message) => (
    <p className="profile-empty">{message}</p>
  )

  const renderList = (list) => (
    <ul className="profile-list">
      {list.map((p) => (
        <li key={p.id}>
          <Link to={`/post/${p.id}`} className="profile-list-title">
            {p.title}
          </Link>
          <span className="profile-list-meta">
            {formatCompactNumber(p.commentCount)} comments · {formatCompactNumber(p.voteCount)} upvotes
          </span>
        </li>
      ))}
    </ul>
  )

  const tabContent = {
    posted: posted.length ? renderList(posted) : renderEmpty('You have not posted any questions yet.'),
    saved: savedPosts.length ? renderList(savedPosts) : renderEmpty('No saved posts yet. Use Save on any card.'),
    comments: (
      <ul className="profile-list">
        {SAMPLE_COMMENTS.map((c) => (
          <li key={c.post.id}>
            <Link to={`/post/${c.post.id}`} className="profile-list-title">
              {c.post.title}
            </Link>
            <span className="profile-list-meta">{c.text}</span>
          </li>
        ))}
      </ul>
    ),
    followed: followedPosts.length
      ? renderList(followedPosts)
      : renderEmpty('You are not following any discussions yet. Use Follow up on any card.')
  }

  return (
    <div className="profile">
      <header className="profile-head">
        <div className="profile-avatar" aria-hidden="true">
          {user?.name?.charAt(0) || 'M'}
        </div>
        <div className="profile-id">
          <h1 className="profile-name">{user?.name || 'Current Member'}</h1>
          <span className="profile-handle">@{user?.handle?.replace('@', '') || 'member'}</span>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{posted.length}</strong>
            <span>Posted</span>
          </div>
          <div className="profile-stat">
            <strong>{savedPosts.length}</strong>
            <span>Saved</span>
          </div>
          <div className="profile-stat">
            <strong>{followedPosts.length}</strong>
            <span>Following</span>
          </div>
        </div>
      </header>

      <p className="profile-bio">
        Curious about patterns, proofs and open questions. Here for the maths.
      </p>

      <nav className="profile-tabs" aria-label="Profile activity">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`profile-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <section className="profile-panel">{tabContent[activeTab]}</section>

      <section className="profile-settings">
        <div className="profile-settings-row">
          <FiBell size={17} />
          <div className="profile-settings-text">
            <strong>Notification settings</strong>
            <span>Choose which discussions notify you and how often.</span>
          </div>
          <button type="button" className="btn btn-outline btn-sm">Manage</button>
        </div>
        <div className="profile-settings-row">
          <FiCreditCard size={17} />
          <div className="profile-settings-text">
            <strong>Account & subscription</strong>
            <span>View your subscription and posting limits.</span>
          </div>
          <button type="button" className="btn btn-outline btn-sm">Manage</button>
        </div>
        <div className="profile-settings-row">
          <FiSettings size={17} />
          <div className="profile-settings-text">
            <strong>Privacy</strong>
            <span>Personal activity is private unless you choose to share it.</span>
          </div>
          <button type="button" className="btn btn-outline btn-sm">Manage</button>
        </div>
      </section>

      <button type="button" className="btn btn-danger profile-signout" onClick={signOut}>
        <FiLogOut size={15} />
        Sign out
      </button>
    </div>
  )
}

export default Profile