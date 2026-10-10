export function formatTimeAgo(dateStr, { short = false } = {}) {
  if (!dateStr) return short ? 'today' : 'recently'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return short ? `${diffMins}m` : `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return short ? `${diffHours}h` : `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return short ? `${diffDays}d` : `${diffDays}d ago`
}

export function formatCompactNumber(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num
}