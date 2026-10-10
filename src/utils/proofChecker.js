function hashString(text) {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0
  }
  return h
}

function has(text, pattern) {
  return pattern.test(text)
}

export function checkProof(text, problemTitle = '') {
  const trimmed = (text || '').trim()

  if (!trimmed) {
    return {
      score: 0,
      verdict: 'No proof submitted',
      issues: ['Write your proof out step by step, then run the checker.'],
      steps: []
    }
  }

  const lines = trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
  const words = trimmed.split(/\s+/).filter(Boolean)
  const seed = hashString(trimmed + problemTitle)

  const issues = []
  const flaggedSteps = []
  let score = 30

  score += Math.min(60, lines.length * 8)

  const hasSetup = has(trimmed, /(assume|let |suppose|given|wlog|without loss|consider|take )/i)
  const hasJustification = has(
    trimmed,
    /(because|since|by |which implies|which gives|follows|therefore|hence|⇒|implies)/i
  )
  const hasConclusion = has(trimmed, /(hence|therefore|thus|so|q\.?e\.?d|conclude|shown|proven)/i)

  if (words.length < 20) {
    issues.push('This reads more like a sketch than a full proof — expand the reasoning.')
  }
  if (!hasSetup) {
    issues.push('State your assumptions up front (let…, suppose…, WLOG…).')
  }
  if (!hasJustification) {
    issues.push('Most steps lack a justification — explain why each one follows.')
  }
  if (!hasConclusion) {
    issues.push('No explicit conclusion was stated (hence / therefore / QED).')
  }
  if (lines.length === 1) {
    issues.push('A one-line proof usually hides cases or gaps — split it into steps.')
  }

  if (lines.length >= 4) {
    const gapStep = (seed % lines.length) + 1
    flaggedSteps.push(gapStep)
    issues.push(`Step ${gapStep} appears to rely on an unstated fact.`)
  }

  if (hasConclusion) score += 10
  if (hasSetup) score += 8
  if (hasJustification) score += 8
  if (issues.length === 0) score += 6

  score = Math.max(0, Math.min(100, score))

  let verdict
  if (score >= 80) {
    verdict = 'Looks solid — review the flagged lines anyway.'
  } else if (score >= 60) {
    verdict = 'Plausible, but tighten the gaps before sharing.'
  } else {
    verdict = 'Needs another draft — expand the steps and justifications.'
  }

  const steps = lines.map((line, index) => ({
    number: index + 1,
    text: line,
    flagged: flaggedSteps.includes(index + 1)
  }))

  return { score, verdict, issues, steps }
}