import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiX,
  FiPlay,
  FiCheck,
  FiXCircle,
  FiRefreshCw,
  FiArrowRight,
  FiAward
} from 'react-icons/fi'
import { getTryOut, generateInstance, markAnswer, formatNumber } from '../utils/formulaEngine'
import { formatCategoryLabel } from '../data/categories'
import { useInteractions } from '../context/interactions'
import './TryOut.css'

function TryOut({ post, onClose }) {
  const tryOut = useMemo(() => getTryOut(post), [post])
  const { allPosts } = useInteractions()
  const [instance, setInstance] = useState(() => (tryOut ? generateInstance(tryOut) : null))
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [stats, setStats] = useState({ attempts: 0, correct: 0, streak: 0 })
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    inputRef.current?.focus()
  }, [instance])

  const suggestions = useMemo(() => {
    if (!allPosts) return []
    return allPosts
      .filter((p) => p.id !== post.id && p.formula && getTryOut(p))
      .sort((a, b) => {
        const aSame = a.category === post.category ? 0 : 1
        const bSame = b.category === post.category ? 0 : 1
        return aSame - bSame || b.voteCount - a.voteCount
      })
      .slice(0, 3)
  }, [allPosts, post])

  if (!tryOut || !instance) return null

  const handleCheck = () => {
    if (result) return
    const marked = markAnswer(input, instance.answer)
    setResult(marked)
    setStats((prev) => ({
      attempts: prev.attempts + 1,
      correct: prev.correct + (marked.correct ? 1 : 0),
      streak: marked.correct ? prev.streak + 1 : 0
    }))
    setRevealed(true)
  }

  const next = () => {
    setInstance(generateInstance(tryOut))
    setInput('')
    setResult(null)
    setRevealed(false)
  }

  return (
    <div
      className="tryout-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="tryout-card" role="dialog" aria-modal="true" aria-label="Try out">
        <button type="button" className="tryout-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <header className="tryout-head">
          <span className="tryout-badge">
            <FiPlay size={13} /> Try out
          </span>
          <h2 className="tryout-title">{post.title}</h2>
          <p className="tryout-sub">
            The pattern is generated from{' '}
            <code className="tryout-code">{post.formula}</code> — find the next value.
          </p>
        </header>

        <div className="tryout-pattern" aria-label="Generated pattern">
          {instance.sequence.map((term, idx) => (
            <span key={idx} className="tryout-term">
              {formatNumber(term)}
            </span>
          ))}
          <span className="tryout-term tryout-term-unknown" aria-hidden="true">
            ?
          </span>
        </div>

        <div className="tryout-input-row">
          <input
            ref={inputRef}
            type="text"
            className="tryout-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (result) next()
                else handleCheck()
              }
            }}
            placeholder="Your answer"
            aria-label="Your answer"
            disabled={!!result}
          />
          {!result ? (
            <button
              type="button"
              className="btn btn-accent tryout-check"
              onClick={handleCheck}
              disabled={!input.trim()}
            >
              <FiCheck size={16} /> Check
            </button>
          ) : (
            <button type="button" className="btn btn-accent tryout-check" onClick={next}>
              <FiRefreshCw size={16} /> Try another
            </button>
          )}
        </div>

        {result && (
          <div className={`tryout-feedback ${result.correct ? 'is-correct' : 'is-wrong'}`}>
            <span className="tryout-feedback-head">
              {result.correct ? <FiCheck size={18} /> : <FiXCircle size={18} />}
              {result.correct ? 'Correct!' : result.reason}
            </span>
            {!result.correct && (
              <span className="tryout-answer-key">
                The right answer was <strong>{formatNumber(instance.answer)}</strong>.
              </span>
            )}
            {revealed && (
              <span className="tryout-rule">
                Rule: <code>{post.formula}</code>
              </span>
            )}
          </div>
        )}

        <footer className="tryout-foot">
          <span className="tryout-stats">
            <FiAward size={14} />
            {stats.correct}/{stats.attempts} correct · streak {stats.streak}
          </span>
          <button type="button" className="tryout-link" onClick={next}>
            New pattern <FiArrowRight size={14} />
          </button>
        </footer>

        {suggestions.length > 0 && (
          <section className="tryout-suggest">
            <span className="tryout-suggest-title">More patterns like this</span>
            <div className="tryout-suggest-list">
              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  to={`/post/${p.id}`}
                  className="tryout-suggest-item"
                  onClick={onClose}
                >
                  <span className="tryout-suggest-name">{p.title}</span>
                  <span className="tryout-suggest-meta">
                    {formatCategoryLabel(p.category)} · {p.formula}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default TryOut
