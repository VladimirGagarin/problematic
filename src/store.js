export const exploreByType = [
  'sequence-puzzle',
  'logic-puzzle',
  'proof',
  'conjecture',
  'open-problem',
  'unsolved-problem',
  'number-puzzle',
  'geometry-problem',
  'algebra-problem',
  'combinatorics-problem',
  'graph-theory-problem',
  'probability-problem',
  'game-theory-problem',
  'optimization-problem',
  'cryptography-problem',
  'paradox',
  'thought-experiment',
  'research-question',
  'challenge',
  'theorem-discussion',
  'counterexample-hunt',
  'proof-verification',
  'mathematical-model',
  'algorithm-problem',
  'riddle',
  'investigation'
]

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

export const types = exploreByType

export function formatTypeLabel(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatCategoryLabel(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default { exploreByType, types, categories }
