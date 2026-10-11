import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FiSearch,
  FiSmile,
  FiZap,
  FiChevronRight,
  FiChevronLeft,
  FiPlus
} from 'react-icons/fi'
import PostCard from '../components/PostCard'
import { types, categories, formatTypeLabel, formatCategoryLabel } from '../store'
import { funFacts, formulasAndTricks } from '../data/mathExtras'
import { useInteractions } from '../context/interactions'
import './Discoveries.css'

const SORTS = [
  { value: 'recent', label: 'Recent' },
  { value: 'popular', label: 'Popular' },
  { value: 'discussed', label: 'Most discussed' }
]

const MENU_TYPES = types.filter((type) => type !== 'investigation')

function Discoveries() {
  const [params, setParams] = useSearchParams()
  const { allPosts, hiddenIds } = useInteractions()
  const [query, setQuery] = useState('')

  const type = params.get('type') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || 'recent'

  const selectType = (next) => {
    const p = new URLSearchParams(params)
    p.set('type', next)
    p.delete('category')
    setParams(p, { replace: true })
  }

  const selectCategory = (next) => {
    const p = new URLSearchParams(params)
    p.set('category', next)
    setParams(p, { replace: true })
  }

  const backToCategories = () => {
    const p = new URLSearchParams(params)
    p.delete('category')
    setParams(p, { replace: true })
  }

  const typeCounts = useMemo(() => {
    const map = {}
    allPosts.forEach((post) => {
      if (hiddenIds.has(post.id)) return
      map[post.type] = (map[post.type] || 0) + 1
    })
    return map
  }, [allPosts, hiddenIds])

  const categoryCounts = useMemo(() => {
    const map = {}
    if (!type) return map
    allPosts.forEach((post) => {
      if (hiddenIds.has(post.id) || post.type !== type) return
      map[post.category] = (map[post.category] || 0) + 1
    })
    return map
  }, [allPosts, hiddenIds, type])

  const questions = useMemo(() => {
    if (!category) return []
    const term = query.trim().toLowerCase()
    const filtered = allPosts.filter((post) => {
      if (hiddenIds.has(post.id)) return false
      if (type && post.type !== type) return false
      if (
        post.category !== category &&
        !(post.secondaryCategories || []).includes(category)
      ) {
        return false
      }
      if (term) {
        const hay = `${post.title} ${post.problem} ${post.author} ${post.tags?.join(' ') || ''}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'popular') return b.voteCount - a.voteCount
      if (sort === 'discussed') return b.commentCount - a.commentCount
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [allPosts, hiddenIds, type, category, query, sort])

  return (
    <div className="discoveries">
      <header className="discoveries-head">
        <h1 className="discoveries-title">Discoveries</h1>
        <p className="discoveries-sub">
          Pick a type on the left, then a category, to reveal every question filed under
          that combination.
        </p>
      </header>

      <div className="discoveries-layout">
        <aside className="discoveries-sidebar" aria-label="Problem types">
          <ul className="type-menu">
            {MENU_TYPES.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={`type-menu-item ${type === item ? 'active' : ''}`}
                  onClick={() => selectType(item)}
                >
                  <span className="type-menu-name">{formatTypeLabel(item)}</span>
                  <span className="type-menu-count">{typeCounts[item] || 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="discoveries-main">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/discoveries">Discoveries</Link>
              </li>
              {type && (
                <li>
                  {category ? (
                    <button type="button" onClick={backToCategories}>
                      {formatTypeLabel(type)}
                    </button>
                  ) : (
                    <span className="current">{formatTypeLabel(type)}</span>
                  )}
                </li>
              )}
              {category && (
                <li>
                  <span className="current">{formatCategoryLabel(category)}</span>
                </li>
              )}
            </ol>
          </nav>

          <form
            className="discoveries-search"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <FiSearch className="discoveries-search-icon" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems, ideas and topics…"
              aria-label="Search discoveries"
            />
          </form>

          {!type && (
            <div className="discoveries-placeholder">
              <FiChevronLeft size={18} />
              <p>Select a type from the menu to begin browsing its categories.</p>
            </div>
          )}

          {type && !category && (
            <div className="category-view">
              <div className="questions-head">
                <h2 className="questions-title">{formatTypeLabel(type)}</h2>
                <span className="questions-count">
                  {typeCounts[type] || 0} questions
                </span>
              </div>
              <div className="category-grid">
                {categories.map((cat) => {
                  const count = categoryCounts[cat] || 0
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`category-tile ${count === 0 ? 'empty' : ''}`}
                      onClick={() => selectCategory(cat)}
                    >
                      <span className="category-tile-info">
                        <span className="category-tile-name">
                          {formatCategoryLabel(cat)}
                        </span>
                        <span className="category-tile-count">
                          {count} {count === 1 ? 'question' : 'questions'}
                        </span>
                      </span>
                      <FiChevronRight className="category-tile-icon" size={18} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {category && (
            <div className="questions-view">
              <div className="questions-head">
                <h2 className="questions-title">{formatCategoryLabel(category)}</h2>
                <label className="questions-sort">
                  Sort
                  <select
                    value={sort}
                    onChange={(e) => {
                      const p = new URLSearchParams(params)
                      p.set('sort', e.target.value)
                      setParams(p, { replace: true })
                    }}
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

              <div className="questions-count-line">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                {type
                  ? ` in ${formatTypeLabel(type)} · ${formatCategoryLabel(category)}`
                  : ` in ${formatCategoryLabel(category)}`}
              </div>

              {questions.length === 0 ? (
                <div className="discoveries-empty">
                  <h2>Nothing here yet</h2>
                  <p>
                    No {type ? `${formatTypeLabel(type)} ` : ''}questions are filed under{' '}
                    {formatCategoryLabel(category)}.
                  </p>
                  <Link to="/create" className="type-panel-empty-cta">
                    <FiPlus size={15} /> Add the first question
                  </Link>
                </div>
              ) : (
                <div className="discoveries-grid">
                  {questions.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

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
