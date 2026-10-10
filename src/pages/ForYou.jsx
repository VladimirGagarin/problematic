import { useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import TopicChip from '../components/TopicChip'
import { shuffleArray } from '../utils/shuffle'
import { formatCompactNumber } from '../utils/time'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import './ForYou.css'

const PAGE_SIZE = 3

const HERO_SHORTCUTS = [
  { label: 'Number Theory', category: 'number-theory' },
  { label: 'Algebra', category: 'algebra' },
  { label: 'Geometry', category: 'geometry' },
  { label: 'Combinatorics', category: 'combinatorics' },
  { label: 'Topology', category: 'topology' },
  { label: 'Analysis', category: 'analysis' },
  { label: 'Calculus', category: 'calculus' },
  { label: 'Linear Algebra', category: 'linear-algebra' },
  { label: 'Graph Theory', category: 'graph-theory' },
  { label: 'Probability', category: 'probability' },
  { label: 'Game Theory', category: 'game-theory' },
  { label: 'Logic', category: 'logic' },
  { label: 'Optimization', category: 'optimization' },
  { label: 'Cryptography', category: 'cryptography' },
  { label: 'Dynamical Systems', category: 'dynamical-systems' },
  { label: 'Set Theory', category: 'set-theory' }
]

const POPULAR_SUBJECTS = [
  { label: 'Number Theory', category: 'number-theory' },
  { label: 'Algebra', category: 'algebra' },
  { label: 'Geometry', category: 'geometry' },
  { label: 'Combinatorics', category: 'combinatorics' },
  { label: 'Topology', category: 'topology' },
  { label: 'Game Theory', category: 'game-theory' },
  { label: 'Calculus', category: 'calculus' },
  { label: 'Analysis', category: 'analysis' }
]

function ForYou() {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [shortcuts] = useState(() => shuffleArray(HERO_SHORTCUTS))
  const [subjects] = useState(() => shuffleArray(POPULAR_SUBJECTS))
  const { openPrompt } = useAuth()
  const { allPosts, hiddenIds } = useInteractions()

  const pool = allPosts.filter((p) => !hiddenIds.has(p.id))
  const trending = [...pool].sort((a, b) => b.voteCount - a.voteCount).slice(0, 3)
  const recent = [...pool]
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
            {shortcuts.slice(0, 4).map((s) => (
              <TopicChip key={s.category} to={`/discoveries?category=${s.category}`} label={s.label} />
            ))}
          </div>
        </section>

        <div className="foryou-stream">
          {pool.slice(0, visible).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visible < pool.length && (
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
            {subjects.map((s) => (
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