import { Link, useParams } from 'react-router-dom'
import { FiTrendingUp, FiBookOpen, FiHelpCircle, FiCheckSquare } from 'react-icons/fi'
import { formatTypeLabel } from '../data/types'
import { formatCategoryLabel } from '../data/categories'
import PostCard from '../components/PostCard'
import { useInteractions } from '../context/interactions'
import { formatCompactNumber } from '../utils/time'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import './PostPage.css'

function PostPage() {
  const { id } = useParams()
  const { getPostOf, allPosts } = useInteractions()
  const post = getPostOf(id)

  useDocumentTitle(
    post ? `${post.title} · Problematic` : 'Problem not found · Problematic'
  )

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