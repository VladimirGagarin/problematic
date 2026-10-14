import { getQuizPool } from '../data/tryOutQuizzes'

export const TRY_OUT_TYPES = [
  'sequence-puzzle',
  'logic-puzzle',
  'open-problem',
  'number-puzzle',
  'algebra-problem',
  'probability-problem',
  'game-theory-problem',
  'cryptography-problem',
  'challenge',
  'mathematical-model'
]

const FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  ln: Math.log,
  log: Math.log,
  log10: Math.log10,
  exp: Math.exp,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  pow: Math.pow
}

function normalizeFormula(input) {
  return String(input || '')
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/[\u00d7\u2217\u00b7]/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\u00b2/g, '^2')
    .replace(/\u00b3/g, '^3')
    .replace(/\u221a/g, 'sqrt')
    .replace(/\s+/g, '')
}

function tokenize(input) {
  const tokens = []
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (/[0-9.]/.test(ch)) {
      let num = ''
      while (i < input.length && /[0-9.]/.test(input[i])) num += input[i++]
      tokens.push({ type: 'num', value: parseFloat(num) })
      continue
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = ''
      while (i < input.length && /[a-zA-Z]/.test(input[i])) name += input[i++]
      tokens.push({ type: 'name', value: name })
      continue
    }
    if ('+-*/^(),%'.includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
      continue
    }
    throw new Error(`Unexpected character "${ch}"`)
  }
  return tokens
}

function withImplicitMultiplication(tokens) {
  const out = []
  for (let i = 0; i < tokens.length; i++) {
    const a = tokens[i]
    const b = tokens[i + 1]
    out.push(a)
    if (!b) break
    const aEnds = a.type === 'num' || a.type === 'name' || (a.type === 'op' && a.value === ')')
    const bStarts = b.type === 'num' || b.type === 'name' || (b.type === 'op' && b.value === '(')
    const isFunctionCall = a.type === 'name' && FUNCTIONS[a.value] && b.value === '('
    if (aEnds && bStarts && !isFunctionCall) out.push({ type: 'op', value: '*' })
  }
  return out
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }

  peek() {
    return this.tokens[this.pos]
  }

  isOp(value) {
    const t = this.peek()
    return t && t.type === 'op' && t.value === value
  }

  next() {
    return this.tokens[this.pos++]
  }

  parse() {
    const node = this.parseExpression()
    if (this.pos !== this.tokens.length) throw new Error('Could not parse formula')
    return node
  }

  parseExpression() {
    let node = this.parseTerm()
    while (this.isOp('+') || this.isOp('-')) {
      const op = this.next().value
      node = { type: 'bin', op, left: node, right: this.parseTerm() }
    }
    return node
  }

  parseTerm() {
    let node = this.parsePower()
    while (this.isOp('*') || this.isOp('/') || this.isOp('%')) {
      const op = this.next().value
      node = { type: 'bin', op, left: node, right: this.parsePower() }
    }
    return node
  }

  parsePower() {
    const base = this.parseUnary()
    if (this.isOp('^')) {
      this.next()
      return { type: 'bin', op: '^', left: base, right: this.parsePower() }
    }
    return base
  }

  parseUnary() {
    if (this.isOp('-')) {
      this.next()
      return { type: 'neg', operand: this.parseUnary() }
    }
    if (this.isOp('+')) {
      this.next()
      return this.parseUnary()
    }
    return this.parsePrimary()
  }

  parsePrimary() {
    const token = this.next()
    if (!token) throw new Error('Unexpected end of formula')
    if (token.type === 'num') return { type: 'num', value: token.value }
    if (token.type === 'name') {
      if (this.isOp('(')) {
        if (!FUNCTIONS[token.value]) throw new Error(`Unknown function "${token.value}"`)
        this.next()
        const args = []
        if (!this.isOp(')')) {
          args.push(this.parseExpression())
          while (this.isOp(',')) {
            this.next()
            args.push(this.parseExpression())
          }
        }
        if (!this.isOp(')')) throw new Error('Missing closing parenthesis')
        this.next()
        return { type: 'call', name: token.value, args }
      }
      return { type: 'var', name: token.value }
    }
    if (token.type === 'op' && token.value === '(') {
      const node = this.parseExpression()
      if (!this.isOp(')')) throw new Error('Missing closing parenthesis')
      this.next()
      return node
    }
    throw new Error('Unexpected token in formula')
  }
}

function collectVariables(node, found) {
  if (node.type === 'var') found.add(node.name)
  else if (node.type === 'neg') collectVariables(node.operand, found)
  else if (node.type === 'bin') {
    collectVariables(node.left, found)
    collectVariables(node.right, found)
  } else if (node.type === 'call') {
    node.args.forEach((arg) => collectVariables(arg, found))
  }
  return found
}

function evaluateNode(node, variables) {
  switch (node.type) {
    case 'num':
      return node.value
    case 'var': {
      if (!(node.name in variables)) throw new Error(`Unknown value "${node.name}"`)
      return variables[node.name]
    }
    case 'neg':
      return -evaluateNode(node.operand, variables)
    case 'bin': {
      const a = evaluateNode(node.left, variables)
      const b = evaluateNode(node.right, variables)
      switch (node.op) {
        case '+':
          return a + b
        case '-':
          return a - b
        case '*':
          return a * b
        case '/':
          return a / b
        case '%':
          return a % b
        case '^':
          return Math.pow(a, b)
        default:
          throw new Error(`Unknown operator "${node.op}"`)
      }
    }
    case 'call':
      return FUNCTIONS[node.name](...node.args.map((arg) => evaluateNode(arg, variables)))
    default:
      throw new Error('Invalid formula node')
  }
}

export function compileFormula(formula) {
  const normalized = normalizeFormula(formula)
  const eq = normalized.lastIndexOf('=')
  const rhs = eq === -1 ? normalized : normalized.slice(eq + 1)
  if (!rhs) throw new Error('Empty formula')
  const tokens = withImplicitMultiplication(tokenize(rhs))
  const ast = new Parser(tokens).parse()
  const variables = [...collectVariables(ast, new Set())]
  return { ast, variables, expression: rhs }
}

export function evaluateExpression(expression, variables = {}) {
  const tokens = withImplicitMultiplication(tokenize(normalizeFormula(expression)))
  const ast = new Parser(tokens).parse()
  return evaluateNode(ast, variables)
}

export function getTryOut(post) {
  if (!post || !post.formula) return null
  try {
    const { ast, variables, expression } = compileFormula(post.formula)
    if (variables.length !== 1) return null
    const variable = variables[0]
    const probe = evaluateNode(ast, { [variable]: 3 })
    if (!Number.isFinite(probe)) return null
    return { ast, variable, expression }
  } catch {
    return null
  }
}

export function isTryOutPossible(post) {
  if (!post || !post.type) return false
  return TRY_OUT_TYPES.includes(post.type)
}

export function getTryOutQuiz(post) {
  if (!post || !post.type) return null
  return getQuizPool(post.type)
}

const normalizeAnswer = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .trim()

export function markQuizAnswer(text, expected) {
  const trimmed = (text || '').trim()
  if (!trimmed) return { correct: false, reason: 'Enter an answer to check it.' }

  const user = normalizeAnswer(trimmed)
  const options = String(expected ?? '')
    .split('|')
    .map(normalizeAnswer)
    .filter(Boolean)

  const userNumber = Number(user.replace(/,/g, ''))
  const correct = options.some((option) => {
    if (option === user) return true
    const optionNumber = Number(option.replace(/,/g, ''))
    return (
      Number.isFinite(userNumber) &&
      Number.isFinite(optionNumber) &&
      Math.abs(userNumber - optionNumber) < 1e-9
    )
  })

  return {
    correct,
    value: trimmed,
    reason: correct ? null : 'Not quite — try again.'
  }
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export function formatNumber(value) {
  if (!Number.isFinite(value)) return '—'
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)))
}

export function generateInstance(tryOut) {
  const { ast, variable } = tryOut
  const start = randomInt(1, 9)
  const visible = randomInt(4, 5)
  const sequence = []
  for (let k = 0; k < visible; k++) {
    sequence.push(evaluateNode(ast, { [variable]: start + k }))
  }
  const answer = evaluateNode(ast, { [variable]: start + visible })
  return {
    sequence,
    answer,
    variable,
    shown: visible,
    start
  }
}

export function markAnswer(text, expected) {
  const trimmed = (text || '').trim()
  if (!trimmed) return { correct: false, reason: 'Enter an answer to check it.' }
  let value
  try {
    value = evaluateExpression(trimmed)
  } catch {
    return { correct: false, reason: 'That is not a number I can read — try digits or a fraction like 15/2.' }
  }
  if (!Number.isFinite(value)) {
    return { correct: false, reason: 'That is not a number I can read — try digits or a fraction like 15/2.' }
  }
  const tolerance = Math.max(1e-3, Math.abs(expected) * 1e-3)
  const correct = Math.abs(value - expected) <= tolerance
  return { correct, value, reason: correct ? null : 'Not quite — check the differences between terms.' }
}
