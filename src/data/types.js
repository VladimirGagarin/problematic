export const types = [
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

export function formatTypeLabel(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
