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
  },
  {
    id: 'fact-1089',
    title: 'The 1089 magic trick',
    text: 'Pick any 3-digit number with a smaller reverse, subtract, then add the reverse of the result. You always land on 1089.'
  },
  {
    id: 'fact-prime-reciprocal',
    title: 'Full reptend primes loop forever',
    text: '1/7 = 0.142857 142857 … — the repeating block of 6 digits is the largest possible length for a prime denominator of 7.'
  },
  {
    id: 'fact-37',
    title: '37 is a multiplying machine',
    text: '37 × 3 = 111, 37 × 6 = 222, 37 × 9 = 333 … all the way to 37 × 27 = 999. One number, nine repeats.'
  },
  {
    id: 'fact-golden',
    title: 'The golden ratio hides in your hand',
    text: 'The ratio of a human finger segment to the next is roughly 1.618, the golden ratio φ — and it satisfies φ = 1 + 1/φ.'
  },
  {
    id: 'fact-moser',
    title: 'A circle can contain at most 7 regions from 3 lines',
    text: 'Three straight lines cut a circle into at most 7 pieces. Add a fourth and the count jumps, following 1, 2, 4, 7, 11, 16 …'
  },
  {
    id: 'fact-birthday-paradox',
    title: 'A shared birthday needs only 23 people',
    text: 'With 23 people the odds of two sharing a birthday pass 50%; with 70 people it is over 99.9%. Your intuition underestimates pairs.'
  },
  {
    id: 'fact-e',
    title: 'e is the smooth-interest limit',
    text: 'Compound 100% interest infinitely often and $1 grows to exactly e ≈ 2.71828. More compounding can never break that ceiling.'
  },
  {
    id: 'fact-cantor-pairing',
    title: 'There are as many fractions as whole numbers',
    text: 'Walk the grid of fractions diagonally and every fraction gets a turn — so the rationals are countable, just like the naturals.'
  },
  {
    id: 'fact-multiply-9',
    title: 'The 9s always confess',
    text: 'If a number is divisible by 9, so is the sum of its digits: 4,527 → 4+5+2+7 = 18 → 1+8 = 9. Cast out nines to check arithmetic.'
  },
  {
    id: 'fact-mobius',
    title: 'A one-sided strip with no inside',
    text: 'A Möbius strip has just one surface and one edge. Cut it down the middle and you get one longer loop, not two.'
  },
  {
    id: 'fact-koch',
    title: 'A curve of infinite length around finite area',
    text: 'The Koch snowflake adds ever-smaller bumps: its perimeter grows without bound while its area converges to 8/5 of the original triangle.'
  },
  {
    id: 'fact-collatz',
    title: 'The 3n + 1 loop nobody can break',
    text: 'Halve even numbers, triple-plus-one odd numbers, and every start tested so far falls to 1. No one knows why — or if it always will.'
  },
  {
    id: 'fact-euler-bridge',
    title: 'Seven bridges launched a whole field',
    text: 'Euler\u2019s 1736 proof that Königsberg\u2019s bridges cannot all be crossed once founded graph theory — by proving a walk simply does not exist.'
  },
  {
    id: 'fact-napier',
    title: 'Logarithms turned multiplication into addition',
    text: 'Before calculators, log tables let you multiply by adding exponents: log(ab) = log a + log b. Slower to state, faster to compute.'
  },
  {
    id: 'fact-fibonacci-climb',
    title: 'Every positive integer is a sum of Fibonacci numbers',
    text: 'Zeckendorf\u2019s theorem: write any number as a sum of non-consecutive Fibonacci numbers, and the representation is unique.'
  },
  {
    id: 'fact-ramsey',
    title: 'Order is unavoidable in large crowds',
    text: 'In any group of 6 people, some 3 all know each other or some 3 are all strangers. Chaos always produces a pattern.'
  },
  {
    id: 'fact-infinite-monkeys',
    title: 'Infinite monkeys eventually type Shakespeare',
    text: 'Given endless time, a random typist will produce every finite string — including this very sentence — with probability 1.'
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