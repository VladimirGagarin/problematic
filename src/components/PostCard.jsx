import './PostCard.css'

function PostCard({ post }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="meta-item">By {post.author}</span>
          <span className="meta-item">{formatDate(post.createdAt)}</span>
          <span className="meta-item">Difficulty: {post.difficulty}</span>
          <span className="meta-item">Category: {post.category}</span>
          <span className="meta-item">Type: {post.type}</span>
        </div>
      </header>

      <section className="post-problem">
        <div>{post.problem}</div>
      </section>

      {post.hints && post.hints.length > 0 && (
        <section className="post-section">
          <h2>Hints</h2>
          <ul>
            {post.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="post-section">
        <h2>Answer</h2>
        <div className="post-answer">{post.answer}</div>
      </section>

      {post.solution && (
        <section className="post-section">
          <h2>Solution</h2>
          <p className="post-solution">{post.solution}</p>
        </section>
      )}

      {post.formula && (
        <section className="post-section">
          <h2>Formula</h2>
          <div className="post-formula">{post.formula}</div>
        </section>
      )}

      <footer className="post-footer">
        {post.tags && post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="tag">#{tag}</span>
            ))}
          </div>
        )}
        <div className="stats">
          <span>{post.views} views</span>
          <span>{post.votes} votes</span>
          <span>{post.comments} comments</span>
        </div>
      </footer>
    </article>
  )
}

export default PostCard
