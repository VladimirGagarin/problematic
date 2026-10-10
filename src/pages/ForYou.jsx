import { useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import TopicChip from '../components/TopicChip'
import { samplePosts } from '../data/samplePosts'
import { formatCompactNumber } from '../utils/time'
import { useAuth } from '../context/auth'
import './ForYou.css'

const PAGE_SIZE = 3

const POPULAR_SUBJECTS = [
  { label: 'Number Theory', category: 'number-theory' },
  { label: 'Algebra', category: 'algebra' },
  { label: 'Geometry', category: 'geometry' },
  { label: 'Combinatorics', category: 'combinatorics' },
  { label: 'Topology', category: 'topology' },
  { label: 'Game Theory', category: 'game-theory' }
]

function ForYou() {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { openPrompt } = useAuth()

  const trending = [...samplePosts].sort((a, b) => b.voteCount - a.voteCount).slice(0, 3)
  const recent = [...samplePosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div className="foryou">
      <div className="foryou-main">
        <section className="foryou-hero">
          <span className="foryou-eyebrow">UNA DISPUTEMUS</span>
          <h1 className="foryou-title">Curiosity starts with a question.</h1>
          <p className="foryou-sub">
            Explore problems, challenge ideas, and discover how others think.
          </p>
          <div className="foryou-shortcuts">
            <TopicChip to="/discoveries?category=number-theory" label="Number Theory" />
            <TopicChip to="/discoveries?category=algebra" label="Algebra" />
            <TopicChip to="/discoveries?category=geometry" label="Geometry" />
            <TopicChip to="/discoveries?category=combinatorics" label="Combinatorics" />
          </div>
        </section>

        <div className="foryou-stream">
          {samplePosts.slice(0, visible).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visible < samplePosts.length && (
            <div className="foryou-more">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Load more problems
              </button>
            </div>
          )}
        </div>
      </div>

      <aside className="foryou-sidebar">
        <div className="side-card">
          <h3 className="side-card-title">Popular subjects</h3>
          <div className="side-chips">
            {POPULAR_SUBJECTS.map((s) => (
              <TopicChip
                key={s.category}
                to={`/discoveries?category=${s.category}`}
                label={s.label}
              />
            ))}
          </div>
        </div>

        <div className="side-card">
          <h3 className="side-card-title">Trending discussions</h3>
          <ul className="side-posts">
            {trending.map((p) => (
              <li key={p.id}>
                <Link to={`/post/${p.id}`} className="side-post-title">
                  {p.title}
                </Link>
                <span className="side-post-meta">
                  {formatCompactNumber(p.commentCount)} comments
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="side-card">
          <h3 className="side-card-title">Recently active</h3>
          <ul className="side-posts">
            {recent.map((p) => (
              <li key={p.id}>
                <Link to={`/post/${p.id}`} className="side-post-title">
                  {p.title}
                </Link>
                <span className="side-post-meta">
                  {formatCompactNumber(p.voteCount)} upvotes
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="side-card side-join">
          <h3 className="side-card-title">Join the community</h3>
          <p className="side-join-copy">
            Follow discussions and share proofs with like-minded thinkers.
          </p>
          <button type="button" className="btn btn-accent" onClick={() => openPrompt('signin')}>
            Sign in
          </button>
        </div>
      </aside>
    </div>
  )
}

export default ForYou