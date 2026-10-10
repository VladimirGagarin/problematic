export const funFacts = [
  {
    id: 'fact-0999',
    title: '0.999… is exactly 1',
    text: 'It is not "almost 1" — the infinite decimal and the number 1 are the same value written two ways.'
  },
  {
    id: 'fact-halving',
    title: 'Halving forever still adds to 1',
    text: '1/2 + 1/4 + 1/8 + 1/16 + … keeps going forever, yet the total never exceeds 1.'
  },
  {
    id: 'fact-cantor',
    title: 'There are as many even numbers as whole numbers',
    text: 'Pair 0↔0, 1↔2, 2↔4, 3↔6 … — every whole number gets exactly one even partner. Infinity is strange.'
  },
  {
    id: 'fact-nines',
    title: 'Almost every number contains a 9',
    text: 'Numbers without a 9 are rare: their share of all numbers drops towards 0 the further you count.'
  },
  {
    id: 'fact-primes-25',
    title: '2 and 5 are the last of their kind',
    text: 'They are the only primes that end in 2 or in 5 — every larger such number is divisible by one of them.'
  },
  {
    id: 'fact-pizza',
    title: 'Pizza volume is π z z a',
    text: 'A pizza of radius z and thickness a has volume π × z × z × a. Mathematicians eat well.'
  }
]

export const formulasAndTricks = [
  {
    id: 'formula-gauss',
    name: 'Sum of the first n integers',
    formula: '1 + 2 + … + n = n(n + 1) / 2',
    note: 'Pair the smallest with the largest and multiply by half the count — Gauss saw this as a child.',
    category: 'algebra'
  },
  {
    id: 'formula-diff-squares',
    name: 'Difference of squares',
    formula: 'a² − b² = (a − b)(a + b)',
    note: 'Turns hard-looking subtraction into two easy multiplications — great for mental arithmetic.',
    category: 'algebra'
  },
  {
    id: 'formula-eleven',
    name: 'The 11 trick',
    formula: 'ab × 11 = a (a+b) b',
    note: 'Write the outer digits and drop their sum in the middle, carrying when it exceeds 9. e.g. 43 × 11 = 473.',
    category: 'number-theory'
  },
  {
    id: 'formula-quadratic',
    name: 'Quadratic formula',
    formula: 'x = (−b ± √(b² − 4ac)) / 2a',
    note: 'Solves ax² + bx + c = 0. The part under the root tells you how many real solutions exist.',
    category: 'algebra'
  },
  {
    id: 'formula-squares',
    name: 'Sum of the first n squares',
    formula: '1² + 2² + … + n² = n(n + 1)(2n + 1) / 6',
    note: 'A tidy closed form for stacking square layers — no loop required.',
    category: 'combinatorics'
  },
  {
    id: 'formula-euler',
    name: "Euler's identity",
    formula: 'e^(iπ) + 1 = 0',
    note: 'Five fundamental constants — e, i, π, 1, 0 — meeting in a single line.',
    category: 'complex-analysis'
  },
  {
    id: 'formula-polygon',
    name: 'Angles of a polygon',
    formula: 'sum = (n − 2) × 180°',
    note: 'Every polygon of n sides can be cut into n − 2 triangles, each contributing 180°.',
    category: 'geometry'
  },
  {
    id: 'formula-xx',
    name: 'Derivative of x^x',
    formula: "d/dx x^x = x^x (ln x + 1)",
    note: 'Log-differentiate to bring the exponent down. The logarithm is the trick that cracks it.',
    category: 'calculus'
  }
]