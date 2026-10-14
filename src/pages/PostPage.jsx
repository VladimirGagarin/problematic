import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FiTrendingUp, FiBookOpen, FiHelpCircle, FiCheckSquare } from 'react-icons/fi'
import { formatTypeLabel } from '../data/types'
import { formatCategoryLabel } from '../data/categories'
import PostCard, { PostCardSkeleton } from '../components/PostCard'
import { useInteractions } from '../context/interactions'
import { formatCompactNumber } from '../utils/time'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import { fetchPost, isRemote } from '../lib/api'
import './PostPage.css'

function PostPageSkeleton() {
  return (
    <div className="post-page-grid post-page-loading" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading problem…</span>
      <div className="post-page-main">
        <PostCardSkeleton />
      </div>
      <aside className="post-page-side">
        {[0, 1].map((i) => (
          <section key={i} className="post-page-side-card post-side-skeleton">
            <span className="skeleton skeleton-line skeleton-side-title" />
            <span className="skeleton skeleton-line skeleton-side-row" />
            <span className="skeleton skeleton-line skeleton-side-row" />
            <span className="skeleton skeleton-line skeleton-side-row short" />
          </section>
        ))}
      </aside>
    </div>
  )
}

function PostPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getPostOf, allPosts, registerShareView } = useInteractions()
  const [post, setPost] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const loading = loadedId !== id

  useDocumentTitle(
    loading
      ? 'Loading problem · Problematic'
      : post
        ? `${post.title} · Problematic`
        : 'Problem not found · Problematic'
  )

  useEffect(() => {
    let active = true
    let timer

    const load = async () => {
      if (isRemote) {
        try {
          const found = await fetchPost(id)
          if (active) {
            setPost(found)
            setLoadedId(id)
          }
        } catch {
          if (active) {
            setPost(null)
            setLoadedId(id)
          }
        }
        return
      }
      const found = getPostOf(id) || null
      timer = setTimeout(() => {
        if (active) {
          setPost(found)
          setLoadedId(id)
        }
      }, 300)
    }

    load()
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [id, getPostOf])

  useEffect(() => {
    if (!post) return
    const fromShare = searchParams.get('from_share')
    if (fromShare !== 'true' && fromShare !== '1') return
    registerShareView(post.id, searchParams.get('user_id'))
    const next = new URLSearchParams(searchParams)
    next.delete('from_share')
    next.delete('user_id')
    setSearchParams(next, { replace: true })
  }, [post, searchParams, registerShareView, setSearchParams])

  if (loading) {
    return <PostPageSkeleton />
  }

  if (!post) {
    return (
      <div className="post-page">
        <div className="not-found">
          <h1 className="not-found-title">Post not found</h1>
          <p className="not-found-copy">The problem you're looking for doesn't exist.</p>
          <Link to="/foryou" className="btn btn-accent">
            Back to For you
          </Link>
        </div>
      </div>
    )
  }

  const related = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category ||
          p.type === post.type ||
          (p.secondaryCategories || []).includes(post.category))
    )
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 4)

  const handle = `@${(post.author || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '')}`

  return (
    <div className="post-page-grid">
      <div className="post-page-main">
        <PostCard post={post} detail />
      </div>

      <aside className="post-page-side">
        <section className="post-side-card">
          <h3 className="post-side-title">About this problem</h3>
          <dl className="post-details">
            <div className="post-detail">
              <dt>Posted by</dt>
              <dd>
                {post.author}
                <span className="post-detail-sub">{handle}</span>
              </dd>
            </div>
            <div className="post-detail">
              <dt>Type</dt>
              <dd>{formatTypeLabel(post.type)}</dd>
            </div>
            <div className="post-detail">
              <dt>Subject</dt>
              <dd>{formatCategoryLabel(post.category)}</dd>
            </div>
            <div className="post-detail">
              <dt>Difficulty</dt>
              <dd className={`post-difficulty post-difficulty-${post.difficulty}`}>
                {post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
              </dd>
            </div>
            <div className="post-detail">
              <dt>Status</dt>
              <dd>
                {post.solutionStatus === 'unsolved' ? 'Unsolved' : 'Solution available'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="post-side-card">
          <h3 className="post-side-title">
            <FiTrendingUp size={16} /> Related problems
          </h3>
          <ul className="related-posts">
            {related.length === 0 && (
              <li className="related-empty">Nothing related yet — explore Discoveries.</li>
            )}
            {related.map((p) => (
              <li key={p.id}>
                <Link to={`/post/${p.id}`} className="related-post">
                  <span className="related-post-title">{p.title}</span>
                  <span className="related-post-meta">
                    {formatCompactNumber(p.commentCount)} comments · {formatCategoryLabel(p.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="post-side-card post-side-cta">
          <FiBookOpen size={18} />
          <div>
            <strong>Want to discuss it?</strong>
            <span>Open the discussion below the problem and compare methods.</span>
          </div>
        </section>

        <Link to={`/checkproof?post=${post.id}`} className="post-side-link">
          <FiCheckSquare size={16} />
          Run the proof checker
        </Link>

        <Link to="/discoveries" className="post-side-link">
          <FiHelpCircle size={16} />
          Browse all problems
        </Link>
      </aside>
    </div>
  )
}

export default PostPage
