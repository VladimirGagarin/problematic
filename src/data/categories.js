export const categories = [
  'number-theory',
  'algebra',
  'geometry',
  'topology',
  'analysis',
  'calculus',
  'real-analysis',
  'complex-analysis',
  'linear-algebra',
  'abstract-algebra',
  'combinatorics',
  'graph-theory',
  'probability',
  'statistics',
  'game-theory',
  'optimization',
  'cryptography',
  'logic',
  'set-theory',
  'category-theory',
  'dynamical-systems',
  'differential-equations',
  'discrete-mathematics',
  'computational-mathematics',
  'mathematical-physics',
  'information-theory',
  'machine-learning-math',
  'history-of-mathematics',
  'foundations-of-mathematics',
  'recreational-mathematics'
]

export function formatCategoryLabel(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
