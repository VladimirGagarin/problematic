import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCpu, FiCheckCircle, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi'
import { checkProof } from '../utils/proofChecker'
import { useInteractions } from '../context/interactions'
import './CheckProof.css'

const SAMPLE_PROOF =
  'Suppose n is even.\nThen n = 2k for some integer k, so n\u00b2 = 4k\u00b2.\nHence n\u00b2 is divisible by 4.\nTherefore n\u00b2 is even, as required.'

function CheckProof() {
  const [params] = useSearchParams()
  const { getPostOf } = useInteractions()
  const post = getPostOf(params.get('post'))
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  const run = () => setResult(checkProof(text, post?.title))

  return (
    <div className="checkproof">
      <header className="checkproof-head">
        <Link to={post ? `/post/${post.id}` : '/discoveries'} className="checkproof-back">
          <FiArrowLeft size={16} />
          Back
        </Link>
        <div className="checkproof-head-text">
          <h1 className="checkproof-title">
            <FiCpu size={22} /> Proof checker
          </h1>
          <p className="checkproof-sub">
            {post
              ? `Draft a proof for “${post.title}” and get instant (mock) feedback.`
              : 'Paste a proof step by step and get instant (mock) feedback.'}
          </p>
        </div>
      </header>

      <div className="checkproof-grid">
        <section className="checkproof-input">
          <div className="checkproof-input-head">
            <span className="checkproof-label">Your proof</span>
            <button
              type="button"
              className="checkproof-sample"
              onClick={() => {
                setText(SAMPLE_PROOF)
                setResult(null)
              }}
            >
              Load sample
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setResult(null)
            }}
            placeholder={'Suppose …\nThen …\nHence … (one step per line)'}
            rows={12}
            aria-label="Your proof"
          />
          <button type="button" className="btn btn-accent checkproof-run" onClick={run} disabled={!text.trim()}>
            <FiCpu size={16} />
            Check my proof
          </button>
        </section>

        <aside className="checkproof-result">
          {!result ? (
            <div className="checkproof-placeholder">
              <FiCpu size={26} />
              <p>Your review will appear here — score, verdict and flagged steps.</p>
            </div>
          ) : (
            <>
              <div className="checkproof-score">
                <div
                  className="checkproof-score-bar"
                  style={{ '--score': `${result.score}%` }}
                  aria-hidden="true"
                />
                <strong className="checkproof-score-value">{result.score}</strong>
                <span className="checkproof-score-label">out of 100</span>
              </div>

              <p className={`checkproof-verdict ${result.score >= 80 ? 'is-good' : result.score >= 60 ? 'is-mid' : 'is-low'}`}>
                {result.score >= 60 ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
                {result.verdict}
              </p>

              {result.steps.length > 0 && (
                <div className="checkproof-section">
                  <span className="checkproof-section-title">Steps</span>
                  <ol className="checkproof-steps">
                    {result.steps.map((step) => (
                      <li key={step.number} className={step.flagged ? 'is-flagged' : ''}>
                        {step.text}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="checkproof-section">
                <span className="checkproof-section-title">Review notes</span>
                <ul className="checkproof-issues">
                  {result.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>

              <p className="checkproof-disclaimer">
                Mock checker: heuristic feedback only, not a proof assistant. A human reviewer still
                matters.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

export default CheckProof