import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
import {
  getTryOut,
  getTryOutQuiz,
  generateInstance,
  markAnswer,
  markQuizAnswer,
  formatNumber,
  isTryOutPossible
} from '../utils/formulaEngine'
import { formatCategoryLabel } from '../data/categories'
import { formatTypeLabel } from '../data/types'
import { useInteractions } from '../context/interactions'
import './TryOut.css'

function pickQuiz(pool, avoid) {
  if (!pool || pool.length === 0) return null
  if (pool.length === 1) return pool[0]
  let next = pool[Math.floor(Math.random() * pool.length)]
  if (avoid && next.qn === avoid.qn) {
    next = pool[(pool.indexOf(next) + 1) % pool.length]
  }
  return next
}

function firstAnswer(answer) {
  return String(answer ?? '').split('|')[0].trim()
}

function TryOut({ post, onClose }) {
  const tryOut = useMemo(() => getTryOut(post), [post])
  const quizPool = useMemo(() => getTryOutQuiz(post), [post])
  const mode = tryOut ? 'pattern' : quizPool ? 'quiz' : null

  const { allPosts } = useInteractions()
  const [instance, setInstance] = useState(() => (tryOut ? generateInstance(tryOut) : null))
  const [quiz, setQuiz] = useState(() => (tryOut ? null : pickQuiz(quizPool, null)))
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
  }, [instance, quiz])

  const suggestions = useMemo(() => {
    if (!allPosts) return []
    return allPosts
      .filter((p) => p.id !== post.id && isTryOutPossible(p))
      .sort((a, b) => {
        const aSame = a.type === post.type ? 0 : 1
        const bSame = b.type === post.type ? 0 : 1
        return aSame - bSame || b.voteCount - a.voteCount
      })
      .slice(0, 3)
  }, [allPosts, post])

  if (!mode || (mode === 'pattern' && !instance) || (mode === 'quiz' && !quiz)) return null
  if (typeof document === 'undefined') return null

  const expected = mode === 'pattern' ? instance.answer : quiz.answer

  const handleCheck = () => {
    if (result) return
    const marked = mode === 'pattern' ? markAnswer(input, expected) : markQuizAnswer(input, expected)
    setResult(marked)
    setStats((prev) => ({
      attempts: prev.attempts + 1,
      correct: prev.correct + (marked.correct ? 1 : 0),
      streak: marked.correct ? prev.streak + 1 : 0
    }))
    setRevealed(true)
  }

  const next = () => {
    if (mode === 'pattern') {
      setInstance(generateInstance(tryOut))
    } else {
      setQuiz((prev) => pickQuiz(quizPool, prev))
    }
    setInput('')
    setResult(null)
    setRevealed(false)
  }

  return createPortal(
    <div
      className="tryout-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`tryout-card tryout-card-${mode}`}
        role="dialog"
        aria-modal="true"
        aria-label="Try out"
      >
        <button type="button" className="tryout-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        <header className="tryout-head">
          <span className="tryout-badge">
            <FiPlay size={13} /> Try out
          </span>
          <span className="tryout-type">{formatTypeLabel(post.type)}</span>
          <h2 className="tryout-title">{post.title}</h2>
          <p className="tryout-sub">
            {mode === 'pattern' ? (
              <>
                The pattern is generated from <code className="tryout-code">{post.formula}</code> —
                find the next value.
              </>
            ) : (
              <>Answer this {formatTypeLabel(post.type).toLowerCase()} question.</>
            )}
          </p>
        </header>

        {mode === 'pattern' ? (
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
        ) : (
          <div className="tryout-question" aria-label="Question">
            {quiz.qn}
          </div>
        )}

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
                The right answer was{' '}
                <strong>
                  {mode === 'pattern' ? formatNumber(expected) : firstAnswer(expected)}
                </strong>
                .
              </span>
            )}
            {revealed && mode === 'pattern' && (
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
            {mode === 'pattern' ? 'New pattern' : 'Next question'} <FiArrowRight size={14} />
          </button>
        </footer>

        {suggestions.length > 0 && (
          <section className="tryout-suggest">
            <span className="tryout-suggest-title">
              {mode === 'pattern' ? 'More patterns like this' : 'More to try'}
            </span>
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
                    {formatCategoryLabel(p.category)} · {formatTypeLabel(p.type)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>,
    document.body
  )
}

export default TryOut
