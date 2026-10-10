import { Link } from 'react-router-dom'
import './TopicChip.css'

function TopicChip({ label, to }) {
  return (
    <Link className="topic-chip" to={to}>
      {label}
    </Link>
  )
}

export default TopicChip