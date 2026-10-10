import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiSmile, FiZap } from 'react-icons/fi'
import PostCard from '../components/PostCard'
import { categories, formatCategoryLabel } from '../data/categories'
import { types, formatTypeLabel } from '../data/types'
import { funFacts, formulasAndTricks } from '../data/mathExtras'
import { shuffleArray } from '../utils/shuffle'
import { useInteractions } from '../context/interactions'
import './Discoveries.css'

const DIFFICULTIES = ['easy', 'medium', 'hard']
const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'recent', label: 'Recent' },
  { value: 'discussed', label: 'Most discussed' }
]

function Discoveries() {
  const [params, setParams] = useSearchParams()
  const [subjects] = useState(() => shuffleArray(categories.slice(0, 8)))
  const { allPosts, hiddenIds } = useInteractions()
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

  let posts = allPosts.filter((post) => {
    if (hiddenIds.has(post.id)) return false
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
          {subjects.map((subject) => (
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

      <section className="extras-section" aria-label="Math fun facts">
        <header className="extras-head">
          <h2 className="extras-title">
            <FiSmile size={20} /> Math fun facts
          </h2>
          <p className="extras-sub">Small, surprising truths worth dropping into any conversation.</p>
        </header>
        <div className="facts-grid">
          {funFacts.map((fact) => (
            <article key={fact.id} className="fact-card">
              <h3 className="fact-title">{fact.title}</h3>
              <p className="fact-text">{fact.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="extras-section" aria-label="Formulas and tricks">
        <header className="extras-head">
          <h2 className="extras-title">
            <FiZap size={20} /> Formulas &amp; tricks
          </h2>
          <p className="extras-sub">Pocket-sized tools that make problems fall apart faster.</p>
        </header>
        <div className="formulas-grid">
          {formulasAndTricks.map((item) => (
            <article key={item.id} className="formula-card">
              <div className="formula-expr">{item.formula}</div>
              <h3 className="formula-name">{item.name}</h3>
              <p className="formula-note">{item.note}</p>
              <span className="formula-topic">{formatCategoryLabel(item.category)}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Discoveries