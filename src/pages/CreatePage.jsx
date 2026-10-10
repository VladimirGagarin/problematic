import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiSave, FiSend, FiLock, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import { types, formatTypeLabel } from '../data/types'
import { categories, formatCategoryLabel } from '../data/categories'
import './CreatePage.css'

const DIFFICULTIES = ['easy', 'medium', 'hard']

function CreatePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, isPremium, openPrompt } = useAuth()
  const { drafts, createDraft, updateDraft, publishDraft } = useInteractions()

  const draftId = params.get('draft')
  const existing = drafts.find((d) => d.id === draftId)

  const [title, setTitle] = useState(existing?.title || '')
  const [type, setType] = useState(existing?.type || 'challenge')
  const [category, setCategory] = useState(existing?.category || 'calculus')
  const [difficulty, setDifficulty] = useState(existing?.difficulty || 'medium')
  const [problem, setProblem] = useState(existing?.problem || '')
  const [solution, setSolution] = useState(existing?.solution || '')
  const [hints, setHints] = useState((existing?.hints || []).join('\n'))

  if (!isAuthenticated || !isPremium) {
    return (
      <div className="create-page">
        <div className="create-locked">
          <span className="create-locked-icon">
            <FiLock size={22} />
          </span>
          <h1 className="create-locked-title">Premium posting</h1>
          <p className="create-locked-copy">
            Drafts and publishing are part of Premium. Write problems, save them as drafts, and
            publish when your statement and solution are ready.
          </p>
          <div className="create-locked-actions">
            <button type="button" className="btn btn-accent" onClick={() => openPrompt('premium')}>
              Unlock premium
            </button>
            <Link className="btn btn-outline" to="/foryou">
              Back to For you
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const valid = title.trim() && problem.trim()

  const buildFields = () => ({
    title: title.trim(),
    type,
    category,
    difficulty,
    problem: problem.trim(),
    solution: solution.trim(),
    hints: hints
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean)
  })

  const handleSaveDraft = () => {
    if (!valid) return
    const fields = buildFields()
    if (existing) {
      updateDraft(existing.id, fields)
    } else {
      createDraft(fields)
    }
    navigate('/profile?tab=drafts')
  }

  const handlePublish = () => {
    if (!valid) return
    const fields = buildFields()
    if (existing) {
      updateDraft(existing.id, fields)
      const postId = publishDraft(existing.id)
      navigate(`/post/${postId}`)
    } else {
      const postId = publishDraft({ id: `draft-${Date.now()}`, ...fields })
      navigate(`/post/${postId}`)
    }
  }

  return (
    <div className="create-page">
      <header className="create-head">
        <button type="button" className="create-back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 className="create-title">{existing ? 'Edit draft' : 'Write a problem'}</h1>
          <p className="create-sub">
            Premium workspace — save a private draft or publish it to the community.
          </p>
        </div>
      </header>

      <div className="create-grid">
        <section className="create-form">
          <label className="create-field">
            <span className="create-label">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short, evocative title"
            />
          </label>

          <div className="create-row">
            <label className="create-field">
              <span className="create-label">Post type</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {formatTypeLabel(t)}
                  </option>
                ))}
              </select>
            </label>

            <label className="create-field">
              <span className="create-label">Subject</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {formatCategoryLabel(c)}
                  </option>
                ))}
              </select>
            </label>

            <label className="create-field">
              <span className="create-label">Difficulty</span>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="create-field">
            <span className="create-label">Problem statement</span>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="State the problem clearly. What exactly must be proved or found?"
              rows={5}
            />
          </label>

          <label className="create-field">
            <span className="create-label">
              Solution <span className="create-optional">optional</span>
            </span>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Add your solution so others can compare reasoning paths."
              rows={5}
            />
          </label>

          <label className="create-field">
            <span className="create-label">
              Hints <span className="create-optional">one per line, optional</span>
            </span>
            <textarea
              value={hints}
              onChange={(e) => setHints(e.target.value)}
              placeholder={'Consider the extremes first.\nLook for an invariant.'}
              rows={3}
            />
          </label>

          <div className="create-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleSaveDraft}
              disabled={!valid}
            >
              <FiSave size={15} />
              Save draft
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={handlePublish}
              disabled={!valid}
            >
              <FiSend size={15} />
              Publish now
            </button>
          </div>
        </section>

        <aside className="create-preview">
          <span className="create-preview-label">Live preview</span>
          <article className="create-preview-card">
            <div className="create-preview-meta">
              <span className={`create-preview-difficulty is-${difficulty}`}>{difficulty}</span>
              <span className="create-preview-type">{formatTypeLabel(type)}</span>
            </div>
            <h2 className="create-preview-title">{title.trim() || 'Your title appears here'}</h2>
            <p className="create-preview-problem">
              {problem.trim() || 'Your problem statement will be shown to the community.'}
            </p>
            <div className="create-preview-footer">
              {formatCategoryLabel(category)} · by You
            </div>
          </article>
        </aside>
      </div>
    </div>
  )
}

export default CreatePage