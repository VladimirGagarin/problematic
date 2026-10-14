import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiMessageSquare,
  FiBell,
  FiSave,
  FiUsers,
  FiEdit3,
  FiTrash2,
  FiSend,
  FiLock,
  FiPlus
} from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import { formatCategoryLabel } from '../data/categories'
import { formatCompactNumber, formatTimeAgo } from '../utils/time'
import './Profile.css'

const TABS = [
  { id: 'posted', label: 'Posted questions', Icon: FiMessageSquare },
  { id: 'saved', label: 'Saved posts', Icon: FiSave },
  { id: 'comments', label: 'Comments & replies', Icon: FiBell },
  { id: 'followed', label: 'Discussions followed', Icon: FiUsers },
  { id: 'drafts', label: 'Drafts', Icon: FiEdit3 }
]

function Profile() {
  const { user, isAuthenticated, isPremium, openPrompt, openSignIn, signOut } = useAuth()
  const { savedIds, followingIds, drafts, allPosts, publishDraft, deleteDraft } = useInteractions()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'posted')

  if (!isAuthenticated) {
    return (
      <div className="profile profile-guest">
        <h1 className="profile-guest-title">Sign in to Problematic</h1>
        <p className="profile-guest-copy">
          Your questions, saved posts and followed discussions are private until you sign in.
        </p>
        <div className="profile-guest-actions">
          <button type="button" className="btn btn-accent" onClick={openSignIn}>
            Sign in
          </button>
          <button type="button" className="btn btn-outline" onClick={openSignIn}>
            Create account
          </button>
        </div>
      </div>
    )
  }

  const SAMPLE_COMMENTS = [
    { post: allPosts[0], text: 'The differences give 42 — lovely puzzle.' },
    { post: allPosts[1], text: 'The pairing proof is the cleanest of all.' }
  ].filter((c) => c.post)

  const posted = allPosts.filter(
    (p) => p.author === user?.name || p.author.toLowerCase().includes('problematic team')
  )
  const savedPosts = allPosts.filter((p) => savedIds.has(p.id))
  const followedPosts = allPosts.filter((p) => followingIds.has(p.id))

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

  const renderDrafts = () => {
    if (!isPremium) {
      return (
        <div className="profile-upsell">
          <FiLock size={20} />
          <div className="profile-upsell-text">
            <strong>Drafts are a Premium feature</strong>
            <span>Save private drafts and publish them only when they are ready.</span>
          </div>
          <button type="button" className="btn btn-accent btn-sm" onClick={() => openPrompt('premium')}>
            Unlock premium
          </button>
        </div>
      )
    }

    if (!drafts.length) {
      return (
        <div className="profile-empty-block">
          <p className="profile-empty">You have no drafts yet.</p>
          <Link to="/create" className="btn btn-accent btn-sm">
            <FiPlus size={15} />
            New draft
          </Link>
        </div>
      )
    }

    return (
      <>
        <div className="profile-drafts-head">
          <span className="profile-drafts-count">
            {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
          </span>
          <Link to="/create" className="btn btn-accent btn-sm">
            <FiPlus size={15} />
            New draft
          </Link>
        </div>
        <ul className="profile-drafts">
          {drafts.map((d) => (
            <li key={d.id} className="profile-draft">
              <div className="profile-draft-info">
                <span className="profile-draft-title">{d.title || 'Untitled draft'}</span>
                <span className="profile-draft-meta">
                  Edited {formatTimeAgo(d.updatedAt)} · {d.difficulty} ·{' '}
                  {formatCategoryLabel(d.category)}
                </span>
              </div>
              <div className="profile-draft-actions">
                <Link
                  to={`/create?draft=${d.id}`}
                  className="profile-draft-btn"
                  title="Edit draft"
                >
                  <FiEdit3 size={15} />
                </Link>
                <button
                  type="button"
                  className="profile-draft-btn"
                  title="Publish draft"
                  onClick={() => {
                    const postId = publishDraft(d.id)
                    if (postId) navigate(`/post/${postId}`)
                  }}
                >
                  <FiSend size={15} />
                </button>
                <button
                  type="button"
                  className="profile-draft-btn profile-draft-delete"
                  title="Delete draft"
                  onClick={() => deleteDraft(d.id)}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

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
      : renderEmpty('You are not following any discussions yet. Use Follow up on any card.'),
    drafts: renderDrafts()
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