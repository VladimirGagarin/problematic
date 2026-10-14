import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { FiX, FiFlag, FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useInteractions } from '../context/interactions'
import './ReportDialog.css'
const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'offensive', label: 'Offensive or hateful content' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'misinformation', label: 'Misleading or incorrect' },
  { value: 'off-topic', label: 'Off-topic or low effort' },
  { value: 'other', label: 'Something else' }
]

function ReportDialog({
  open,
  subject,
  targetType,
  targetId,
  targetUserId,
  onClose
}) {
  const { requireEligible } = useAuth()
  const { reportContent } = useInteractions()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null
  if (typeof document === 'undefined') return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!requireEligible()) {
      onClose()
      return
    }
    if (!reason) return
    reportContent({ targetType, targetId, targetUserId, reason, details })
    setDone(true)
  }

  return createPortal(
    <div
      className="report-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="report-card" role="dialog" aria-modal="true" aria-label="Report content">
        <button type="button" className="report-close" onClick={onClose} aria-label="Close">
          <FiX size={18} />
        </button>

        {done ? (
          <div className="report-done">
            <span className="report-done-icon" aria-hidden="true">
              <FiCheck size={22} />
            </span>
            <h2 className="report-title">Thanks for the report</h2>
            <p className="report-copy">
              Our moderators review every report. Accounts that repeatedly break our
              guidelines lose the ability to post, like, comment and report.
            </p>
            <div className="report-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  onClose()
                  navigate('/policy')
                }}
              >
                Read the policy
              </button>
              <button type="button" className="btn btn-accent" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className="report-form" onSubmit={handleSubmit}>
            <span className="report-icon" aria-hidden="true">
              <FiFlag size={20} />
            </span>
            <h2 className="report-title">Report this {targetType}</h2>
            {subject && <p className="report-subject">{subject}</p>}
            <p className="report-copy">
              Tell us what is wrong. Reports help keep Problematic free of ads and abuse.
            </p>

            <fieldset className="report-reasons">
              <legend className="report-legend">Reason</legend>
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`report-reason ${reason === r.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </fieldset>

            <label className="report-field">
              <span className="report-legend">More details (optional)</span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Add context that helps moderators review this."
              />
            </label>

            <div className="report-footer">
              <button
                type="button"
                className="report-policy-link"
                onClick={() => {
                  onClose()
                  navigate('/policy')
                }}
              >
                Community policy
              </button>
              <div className="report-actions">
                <button type="button" className="btn btn-ghost" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent" disabled={!reason}>
                  Submit report
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

export default ReportDialog
