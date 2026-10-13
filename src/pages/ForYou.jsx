import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard, { PostCardSkeleton } from '../components/PostCard'
import TopicChip from '../components/TopicChip'
import { shuffleArray } from '../utils/shuffle'
import { formatCompactNumber } from '../utils/time'
import { isTryOutPossible } from '../utils/formulaEngine'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import './ForYou.css'

const PAGE_SIZE = 3
const GHOST_COUNT = 2
const LOAD_DELAY = 650

const TRYOUT_FILTERS = [
  { value: 'no', label: 'Non Try-out' },
  { value: 'yes', label: 'Questions with Try-outs' }
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
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [tryOutFilter, setTryOutFilter] = useState(null)
  const [subjects] = useState(() => shuffleArray(POPULAR_SUBJECTS))
  const { openPrompt } = useAuth()
  const { allPosts, hiddenIds } = useInteractions()
  const sentinelRef = useRef(null)
  const pendingRef = useRef(false)

  const pool = useMemo(
    () =>
      allPosts.filter((p) => {
        if (hiddenIds.has(p.id)) return false
        if (tryOutFilter) return isTryOutPossible(p) === (tryOutFilter === 'yes')
        return true
      }),
    [allPosts, hiddenIds, tryOutFilter]
  )

  const poolLengthRef = useRef(pool.length)
  useEffect(() => {
    poolLengthRef.current = pool.length
  }, [pool.length])

  const trending = useMemo(
    () => [...pool].sort((a, b) => b.voteCount - a.voteCount).slice(0, 3),
    [pool]
  )
  const recent = useMemo(
    () =>
      [...pool]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3),
    [pool]
  )

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY)
    return () => clearTimeout(timer)
  }, [])

  const loadMore = useCallback(() => {
    if (pendingRef.current) return
    pendingRef.current = true
    setLoadingMore(true)
    setTimeout(() => {
      setVisible((v) => Math.min(v + PAGE_SIZE, poolLengthRef.current))
      setLoadingMore(false)
      pendingRef.current = false
    }, LOAD_DELAY)
  }, [])

  const hasMore = visible < pool.length

  useEffect(() => {
    if (loading || !hasMore) return undefined
    const node = sentinelRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loading, hasMore, loadMore])

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
            {TRYOUT_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`topic-chip ${tryOutFilter === f.value ? 'active' : ''}`}
                aria-pressed={tryOutFilter === f.value}
                onClick={() => setTryOutFilter((v) => (v === f.value ? null : f.value))}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <div className="foryou-stream">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <PostCardSkeleton key={`init-${i}`} />
              ))
            : pool.slice(0, visible).map((post) => <PostCard key={post.id} post={post} />)}

          {!loading &&
            loadingMore &&
            Array.from({ length: GHOST_COUNT }).map((_, i) => (
              <PostCardSkeleton key={`ghost-${i}`} />
            ))}

          {!loading && hasMore && (
            <div ref={sentinelRef} className="foryou-sentinel" aria-hidden="true" />
          )}

          {!loading && !hasMore && pool.length > 0 && (
            <p className="foryou-end">
              {'You\u2019ve reached the end \u2014 '}
              {pool.length} problems.
            </p>
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
