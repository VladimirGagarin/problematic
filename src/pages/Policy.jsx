import { Link } from 'react-router-dom'
import { FiShield, FiFlag, FiUserCheck, FiSlash, FiMail } from 'react-icons/fi'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import './Policy.css'

const SECTIONS = [
  {
    Icon: FiShield,
    title: 'Community guidelines',
    body: 'Problematic is a place to think about mathematics together. Be generous with reasoning, patient with learners and precise with claims. Disagree with ideas, not people.'
  },
  {
    Icon: FiSlash,
    title: 'What is not allowed',
    items: [
      'Advertising, referral links or any form of spam.',
      'Offensive, hateful or harassing language.',
      'Deliberately misleading questions, answers or proofs.',
      'Sharing other people\u2019s private information.',
      'Posting content unrelated to mathematics.'
    ]
  },
  {
    Icon: FiUserCheck,
    title: 'Eligibility to participate',
    body: 'Every account starts ineligible. Once the eligibility check runs in our database, members with no violations are cleared to like, comment, post and report. Members who breach these guidelines are signed out and can lose access to those actions.'
  },
  {
    Icon: FiFlag,
    title: 'Reporting',
    body: 'Use the Report option on any post, comment or profile. Reports go to our moderation queue and help us keep ads and abuse out of discussions. Reporting is only available to signed-in, eligible members.'
  },
  {
    Icon: FiMail,
    title: 'Appeals',
    body: 'If your account was restricted and you believe it was a mistake, contact the moderation team and include the link to the content in question. We review every appeal.'
  }
]

function Policy() {
  useDocumentTitle('Community policy · Problematic')

  return (
    <div className="policy">
      <header className="policy-head">
        <span className="policy-badge">
          <FiShield size={15} />
          Community policy
        </span>
        <h1 className="policy-title">Keeping Problematic worth thinking in</h1>
        <p className="policy-intro">
          These rules keep discussions free of ads and abuse so everyone can focus on the
          mathematics. By using Problematic you agree to follow them.
        </p>
      </header>

      <div className="policy-sections">
        {SECTIONS.map(({ Icon, title, body, items }) => (
          <section key={title} className="policy-section">
            <span className="policy-section-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <div>
              <h2 className="policy-section-title">{title}</h2>
              {body && <p className="policy-section-body">{body}</p>}
              {items && (
                <ul className="policy-list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="policy-footer">
        <p>Questions about a moderation decision? Open your profile and use the support options.</p>
        <Link to="/foryou" className="btn btn-accent">
          Back to discussions
        </Link>
      </footer>
    </div>
  )
}

export default Policy
