import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import PostCard from '../components/PostCard'
import { samplePosts } from '../data/samplePosts'
import { categories, formatCategoryLabel } from '../data/categories'
import { types, formatTypeLabel } from '../data/types'
import './Discoveries.css'

const DIFFICULTIES = ['easy', 'medium', 'hard']
const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'recent', label: 'Recent' },
  { value: 'discussed', label: 'Most discussed' }
]
const POPULAR_SUBJECTS = categories.slice(0, 8)

function Discoveries() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const type = params.get('type') || ''
  const difficulty = params.get('difficulty') || ''
  const sort = params.get('sort') || 'popular'

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setParams(next, { replace: true })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam('q', query.trim())
  }

  let posts = samplePosts.filter((post) => {
    if (category && !(post.category === category || (post.secondaryCategories || []).includes(category))) {
      return false
    }
    if (type && post.type !== type) return false
    if (difficulty && post.difficulty !== difficulty) return false
    if (q) {
      const hay = `${post.title} ${post.problem} ${post.author} ${post.tags?.join(' ') || ''}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  posts = [...posts].sort((a, b) => {
    if (sort === 'recent') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sort === 'discussed') return b.commentCount - a.commentCount
    return b.voteCount - a.voteCount
  })

  return (
    <div className="discoveries">
      <header className="discoveries-head">
        <h1 className="discoveries-title">Discoveries</h1>
        <p className="discoveries-sub">
          Search and filter the mathematical collection independently of your feed.
        </p>
      </header>

      <form className="discoveries-search" role="search" onSubmit={handleSearch}>
        <FiSearch className="discoveries-search-icon" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems, ideas and topics…"
          aria-label="Search discoveries"
        />
      </form>

      <section className="discoveries-subjects" aria-label="Popular subjects">
        <span className="discoveries-field-label">Popular subjects</span>
        <div className="discoveries-chips">
          <button
            type="button"
            className={`discoveries-chip ${category === '' ? 'active' : ''}`}
            onClick={() => setParam('category', '')}
          >
            All subjects
          </button>
          {POPULAR_SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              className={`discoveries-chip ${category === subject ? 'active' : ''}`}
              onClick={() => setParam('category', category === subject ? '' : subject)}
            >
              {formatCategoryLabel(subject)}
            </button>
          ))}
        </div>
      </section>

      <div className="discoveries-controls">
        <label className="discoveries-field">
          <span className="discoveries-field-label">Post type</span>
          <select
            value={type}
            onChange={(e) => setParam('type', e.target.value)}
            className="discoveries-select"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {formatTypeLabel(t)}
              </option>
            ))}
          </select>
        </label>

        <div className="discoveries-field">
          <span className="discoveries-field-label">Difficulty</span>
          <div className="discoveries-chips">
            <button
              type="button"
              className={`discoveries-chip ${difficulty === '' ? 'active' : ''}`}
              onClick={() => setParam('difficulty', '')}
            >
              All
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`discoveries-chip ${difficulty === d ? 'active' : ''}`}
                onClick={() => setParam('difficulty', difficulty === d ? '' : d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <label className="discoveries-field">
          <span className="discoveries-field-label">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="discoveries-select"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="discoveries-count">
        {posts.length} {posts.length === 1 ? 'problem' : 'problems'}
      </div>

      {posts.length === 0 ? (
        <div className="discoveries-empty">
          <h2>Nothing matches yet</h2>
          <p>Try clearing some filters or switching your search terms.</p>
        </div>
      ) : (
        <div className="discoveries-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Discoveries