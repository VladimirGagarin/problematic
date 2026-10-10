export const samplePosts = [
  {
    id: 'f8e7a620-9c4d-4b82-8f61-2d7e5ac03b94',
    title: 'The Next Number',
    type: 'sequence-puzzle',
    category: 'number-theory',
    secondaryCategories: ['algebra'],
    difficulty: 'medium',
    problem: '2, 6, 12, 20, 30, ?',
    author: 'Room24 Community',
    createdAt: '2026-10-09T00:00:00Z',
    voteCount: 245,
    commentCount: 18,
    solutionStatus: 'solved',
    hints: [
      'Look at the differences between consecutive terms.',
      'Can each term be written as a product?'
    ],
    answer: '42',
    solution: 'The nth term is n(n+1).',
    formula: 'n(n+1)'
  },
  {
    id: '7c2b5d81-6e4a-4f09-8a3c-7e1d6f0c25ab',
    title: 'Sum of First N Integers',
    type: 'proof',
    category: 'algebra',
    secondaryCategories: ['number-theory'],
    difficulty: 'easy',
    problem: 'Prove that 1 + 2 + ... + n = n(n+1)/2',
    author: 'Problematic Team',
    createdAt: '2026-10-09T01:00:00Z',
    voteCount: 187,
    commentCount: 12,
    solutionStatus: 'solved',
    hints: [
      'Try pairing terms from both ends.',
      'Count how many pairs each sum to (n+1).'
    ],
    answer: 'n(n+1)/2',
    solution:
      'Pair first and last: (1+n) + (2+n-1) + ... = k(n+1). Counting the pairs gives n(n+1)/2.',
    formula: 'S(n) = n(n+1)/2'
  },
  {
    id: 'a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    title: 'Do All Paths Reach One?',
    type: 'conjecture',
    category: 'number-theory',
    secondaryCategories: ['dynamical-systems'],
    difficulty: 'hard',
    problem:
      'Start with any positive integer. If it is even, halve it; if it is odd, triple it and add 1. Does every starting number eventually reach 1?',
    author: 'Dr. Alina Voss',
    createdAt: '2026-10-09T02:30:00Z',
    voteCount: 412,
    commentCount: 33,
    solutionStatus: 'unsolved',
    hints: [
      'Try starting from 3, 7, or 15 and watch the orbit.',
      'No one has found a counterexample yet.'
    ]
  },
  {
    id: 'e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b',
    title: 'Five Coins Around One',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'medium',
    problem:
      'A circle of radius 1 is surrounded by identical circles that each touch it and their two neighbours. How many can fit around it, and what radius do they have?',
    author: 'Mira Chen',
    createdAt: '2026-10-09T04:00:00Z',
    voteCount: 156,
    commentCount: 21,
    solutionStatus: 'unsolved',
    hints: [
      'A circle surrounded exactly once uses a ring of congruent circles.',
      'The number that fit is not 6 for arbitrary radii.'
    ]
  },
  {
    id: '9d8e7f6a-5b4c-4d3e-8f2a-1b9c8d7e6f5a',
    title: 'Shaking Hands With the Neighbours',
    type: 'combinatorics-problem',
    category: 'combinatorics',
    secondaryCategories: ['graph-theory'],
    difficulty: 'medium',
    problem:
      'In a village, every pair of neighbours shook hands exactly once. If there were 28 handshakes in total, how many neighbours are there?',
    author: 'Room24 Community',
    createdAt: '2026-10-09T06:00:00Z',
    voteCount: 98,
    commentCount: 7,
    solutionStatus: 'solved',
    hints: [
      'A handshake connects a pair of distinct people.',
      'Use the binomial coefficient C(n, 2).'
    ],
    answer: '8',
    solution: 'C(n, 2) = 28 means n(n-1)/2 = 28, so n = 8.',
    formula: 'C(n, 2) = n(n-1)/2'
  },
  {
    id: 'hilbert-01',
    title: 'Hilbert\u2019s First Problem: The Continuum Hypothesis',
    type: 'open-problem',
    category: 'set-theory',
    difficulty: 'hard',
    problem:
      'Is there a set whose cardinality lies strictly between that of the natural numbers and that of the real numbers?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T00:00:00Z',
    voteCount: 203,
    commentCount: 14,
    solutionStatus: 'unsolved',
    hints: [
      'The continuum hypothesis asks whether |N| < |X| < |R| is possible.',
      'G\u00f6del and Cohen showed this question is independent of ZFC.'
    ]
  },
  {
    id: 'hilbert-02',
    title: 'Hilbert\u2019s Second Problem: Consistency of Arithmetic',
    type: 'open-problem',
    category: 'foundations-of-mathematics',
    difficulty: 'hard',
    problem:
      'Prove that the axioms of arithmetic are consistent, without relying on stronger systems.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T00:20:00Z',
    voteCount: 178,
    commentCount: 9,
    solutionStatus: 'unsolved',
    hints: [
      'G\u00f6del\u2019s second incompleteness theorem limits any finitistic proof.',
      'Consistency can only be shown relative to yet stronger systems.'
    ]
  },
  {
    id: 'hilbert-03',
    title: 'Hilbert\u2019s Third Problem: Equal Volumes',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'medium',
    problem:
      'Given two tetrahedra with equal bases and equal heights, can one be cut into finitely many polyhedral pieces to reassemble the other?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T00:40:00Z',
    voteCount: 112,
    commentCount: 6,
    solutionStatus: 'solved',
    hints: [
      'Contrast with the planar statement, which is true for polygons.',
      'The Dehn invariant distinguishes the two tetrahedra.'
    ],
    solution: 'Max Dehn answered No in 1901 using his Dehn invariant.'
  },
  {
    id: 'hilbert-04',
    title: 'Hilbert\u2019s Fourth Problem: The Straightest Line',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'hard',
    problem:
      'Given a geometry, characterise the metrics for which the straight line is the shortest distance between any two points.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T01:00:00Z',
    voteCount: 89,
    commentCount: 5,
    solutionStatus: 'unsolved',
    hints: [
      'This is a question about geodesic metrics and convexity.',
      'Only special cases, such as plane and space geometries, are settled.'
    ]
  },
  {
    id: 'hilbert-05',
    title: 'Hilbert\u2019s Fifth Problem: Continuous Groups',
    type: 'research-question',
    category: 'topology',
    difficulty: 'hard',
    problem:
      'Are Lie groups defined with differentiability assumptions actually the same as purely topological continuous groups?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T01:20:00Z',
    voteCount: 141,
    commentCount: 7,
    solutionStatus: 'solved',
    hints: [
      'It suffices to show a locally Euclidean continuous group is a Lie group.',
      'The key step is proving the existence of a local coordinate system.'
    ],
    solution:
      'Gleason, Montgomery and Zippin proved every locally Euclidean topological group is a Lie group (1952).'
  },
  {
    id: 'hilbert-06',
    title: 'Hilbert\u2019s Sixth Problem: Axiomatising Physics',
    type: 'research-question',
    category: 'mathematical-physics',
    difficulty: 'hard',
    problem:
      'Treat physics axiomatically, with the same rigour as the axioms of geometry or arithmetic.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T01:40:00Z',
    voteCount: 132,
    commentCount: 8,
    solutionStatus: 'unsolved',
    hints: [
      'Mechanics, probability and quantum theory each need a postulate system.',
      'No universally accepted axiomatisation has been completed.'
    ]
  },
  {
    id: 'hilbert-07',
    title: 'Hilbert\u2019s Seventh Problem: Transcendental Powers',
    type: 'algebra-problem',
    category: 'number-theory',
    difficulty: 'medium',
    problem:
      'If \u03b1 is algebraic, \u03b1 \u2260 0, 1, and \u03b2 is irrational algebraic, is \u03b1^\u03b2 always transcendental?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T02:00:00Z',
    voteCount: 155,
    commentCount: 6,
    solutionStatus: 'solved',
    hints: [
      '2\u221a2 was long a famous open special case.',
      'The Gelfond\u2013Schneider theorem resolves the general statement.'
    ],
    solution:
      'Yes \u2014 the Gelfond\u2013Schneider theorem (1934).'
  },
  {
    id: 'hilbert-08',
    title: 'Hilbert\u2019s Eighth Problem: Riemann Hypothesis',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Every non-trivial zero of the Riemann zeta function lies on the critical line \u211c(s) = 1/2.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T02:20:00Z',
    voteCount: 402,
    commentCount: 31,
    solutionStatus: 'unsolved',
    hints: [
      'The zeros determine the fine distribution of the primes.',
      'Billions of zeros on the line have been verified computationally.'
    ]
  },
  {
    id: 'hilbert-09',
    title: 'Hilbert\u2019s Ninth Problem: General Reciprocity Law',
    type: 'algebra-problem',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Find the most general reciprocity law, extending quadratic reciprocity to higher powers and arbitrary number fields.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T02:40:00Z',
    voteCount: 98,
    commentCount: 4,
    solutionStatus: 'solved',
    hints: [
      'Quadratic reciprocity is the power-2 case.',
      'Artin reciprocity governs abelian extensions in general.'
    ],
    solution:
      'Resolved by Artin reciprocity in class field theory.'
  },
  {
    id: 'hilbert-10',
    title: 'Hilbert\u2019s Tenth Problem: Solvability of Diophantine Equations',
    type: 'algorithm-problem',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Is there an algorithm that decides whether any given Diophantine equation has an integer solution?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T03:00:00Z',
    voteCount: 289,
    commentCount: 18,
    solutionStatus: 'solved',
    hints: [
      'The four steps reduce the problem to the unsolvability of Hilbert\u2019s Tenth Problem.',
      'Matiyasevich completed the chain in 1970.'
    ],
    solution:
      'No \u2014 proved impossible by Davis, Putnam, Robinson and Matiyasevich (1970).'
  },
  {
    id: 'hilbert-11',
    title: 'Hilbert\u2019s Eleventh Problem: Quadratic Forms',
    type: 'algebra-problem',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Classify quadratic forms whose coefficients are algebraic numbers, and determine which integers they represent.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T03:20:00Z',
    voteCount: 76,
    commentCount: 3,
    solutionStatus: 'solved',
    hints: [
      'The Hasse\u2013Minkowski theorem reduces local behaviour to global.',
      'A rational form represents a number if it does over every completion.'
    ],
    solution:
      'Solved by the Hasse\u2013Minkowski local\u2013global principle.'
  },
  {
    id: 'hilbert-12',
    title: 'Hilbert\u2019s Twelfth Problem: Kronecker\u2019s Jugendtraum',
    type: 'open-problem',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Extend the Kronecker\u2013Weber theorem \u2014 abelian extensions of \u211a come from roots of unity \u2014 to arbitrary number fields.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T03:40:00Z',
    voteCount: 87,
    commentCount: 5,
    solutionStatus: 'unsolved',
    hints: [
      'For imaginary quadratic fields the elliptic modular functions play the role of roots of unity.',
      'No analogous generators are known for more general fields.'
    ]
  },
  {
    id: 'hilbert-13',
    title: 'Hilbert\u2019s Thirteenth Problem: Solving Degree Seven',
    type: 'open-problem',
    category: 'algebra',
    difficulty: 'hard',
    problem:
      'Can the general equation of degree 7 be solved using functions of only two variables?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T04:00:00Z',
    voteCount: 84,
    commentCount: 4,
    solutionStatus: 'unsolved',
    hints: [
      'The quintic already requires functions of more than one variable.',
      'The sharp number of variables for degree 7 remains unknown.'
    ]
  },
  {
    id: 'hilbert-14',
    title: 'Hilbert\u2019s Fourteenth Problem: Finite Invariant Rings',
    type: 'algebra-problem',
    category: 'algebra',
    difficulty: 'hard',
    problem:
      'Are the invariant rings of algebraic group actions always finitely generated?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T04:20:00Z',
    voteCount: 92,
    commentCount: 5,
    solutionStatus: 'solved',
    hints: [
      'Hilbert proved it for finite groups and the classical groups.',
      'Look for counterexamples among general actions.'
    ],
    solution:
      'No for the general statement; Nagata constructed a counterexample in 1959.'
  },
  {
    id: 'hilbert-15',
    title: 'Hilbert\u2019s Fifteenth Problem: Enumerative Geometry',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'hard',
    problem:
      'Give a rigorous foundation for Schubert\u2019s enumerative calculus of counting configurations.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T04:40:00Z',
    voteCount: 71,
    commentCount: 3,
    solutionStatus: 'solved',
    hints: [
      'Count lines meeting curves, circles touching others, and similar figures.',
      'Intersection theory and cohomology of Grassmannians supply the rigour.'
    ],
    solution:
      'Achieved through Schubert calculus and modern intersection theory.'
  },
  {
    id: 'hilbert-16',
    title: 'Hilbert\u2019s Sixteenth Problem: Topology of Curves and Surfaces',
    type: 'geometry-problem',
    category: 'topology',
    difficulty: 'hard',
    problem:
      'Classify the possible positions and number of closed branches (ovals) of real algebraic curves, and of cycles on algebraic surfaces.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T05:00:00Z',
    voteCount: 79,
    commentCount: 6,
    solutionStatus: 'unsolved',
    hints: [
      'Harnack bounds the number of components of a real plane curve.',
      'How those ovals interlace is only partially understood.'
    ]
  },
  {
    id: 'hilbert-17',
    title: 'Hilbert\u2019s Seventeenth Problem: Sums of Squares',
    type: 'algebra-problem',
    category: 'algebra',
    difficulty: 'medium',
    problem:
      'Can every function that is definite at the rational points be written as a sum of squares of rational functions?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T05:20:00Z',
    voteCount: 118,
    commentCount: 5,
    solutionStatus: 'solved',
    hints: [
      'A polynomial like x\u00b2 + y\u00b2 is a square of rationals at rational points.',
      'This is the rational-function analogue of Hilbert\u2019s seventeenth question.'
    ],
    solution:
      'Yes \u2014 proved by Emil Artin in 1927 using ordered fields.'
  },
  {
    id: 'hilbert-18',
    title: 'Hilbert\u2019s Eighteenth Problem: Packing and Tiling Space',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'medium',
    problem:
      'How can congruent polyhedra tile or pack space? Which spheres pack space most densely, and can congruent tiles fill space?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T05:40:00Z',
    voteCount: 103,
    commentCount: 7,
    solutionStatus: 'solved',
    hints: [
      'Spheres tile only poorly; the DNA shape is extremal.',
      'Aperiodic tiles show that tiling need not be periodic.'
    ],
    solution:
      'Fundamental questions answered: optimal sphere packing by Hales, aperiodic tilings by Berger, Penrose and others.'
  },
  {
    id: 'hilbert-19',
    title: 'Hilbert\u2019s Nineteenth Problem: Regularity of Variational Solutions',
    type: 'optimization-problem',
    category: 'analysis',
    difficulty: 'hard',
    problem:
      'Are solutions of regular variational problems always analytic?',
    author: 'David Hilbert',
    createdAt: '2026-10-10T06:00:00Z',
    voteCount: 96,
    commentCount: 4,
    solutionStatus: 'solved',
    hints: [
      'Minimisers of reasonable energy functionals are smooth.',
      'The De Giorgi\u2013Nash result extends regularity to nonlinear settings.'
    ],
    solution:
      'Yes \u2014 Hilbert, Bernstein and finally De Giorgi and Nash established analytic regularity.'
  },
  {
    id: 'hilbert-20',
    title: 'Hilbert\u2019s Twentieth Problem: Boundary Value Problems',
    type: 'research-question',
    category: 'differential-equations',
    difficulty: 'hard',
    problem:
      'Do general boundary value problems always have solutions? Give the Dirichlet principle a rigorous footing.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T06:20:00Z',
    voteCount: 68,
    commentCount: 3,
    solutionStatus: 'solved',
    hints: [
      'The Dirichlet principle minimises an energy with prescribed boundary values.',
      'Hilbert restored rigour using direct methods of the calculus of variations.'
    ],
    solution:
      'Largely solved; Hilbert\u2019s direct methods grew into modern Sobolev and potential theory.'
  },
  {
    id: 'hilbert-21',
    title: 'Hilbert\u2019s Twenty-First Problem: Prescribed Monodromy',
    type: 'open-problem',
    category: 'complex-analysis',
    difficulty: 'hard',
    problem:
      'Prove the existence of a linear differential equation with a prescribed monodromy group.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T06:40:00Z',
    voteCount: 64,
    commentCount: 3,
    solutionStatus: 'unsolved',
    hints: [
      'The monodromy describes how solutions change around singular points.',
      'Plemelj settled most cases; the precise complete answer is subtle.'
    ]
  },
  {
    id: 'hilbert-22',
    title: 'Hilbert\u2019s Twenty-Second Problem: Uniformisation',
    type: 'theorem-discussion',
    category: 'complex-analysis',
    difficulty: 'hard',
    problem:
      'Uniformise any analytic relation between two variables by automorphic functions.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T07:00:00Z',
    voteCount: 85,
    commentCount: 5,
    solutionStatus: 'solved',
    hints: [
      'Every compact Riemann surface becomes a quotient of the plane or the disk.',
      'Elliptic curves are uniformised by doubly periodic functions.'
    ],
    solution:
      'Resolved by Koebe and Poincar\u00e9: the Riemann mapping theorem and uniformisation theory.'
  },
  {
    id: 'hilbert-23',
    title: 'Hilbert\u2019s Twenty-Third Problem: Calculus of Variations',
    type: 'research-question',
    category: 'analysis',
    difficulty: 'hard',
    problem:
      'Further develop the methods of the calculus of variations, especially for general and unsolved boundary problems.',
    author: 'David Hilbert',
    createdAt: '2026-10-10T07:20:00Z',
    voteCount: 90,
    commentCount: 6,
    solutionStatus: 'unsolved',
    hints: [
      'Hilbert left this open programme rather than a single yes-or-no question.',
      'Modern research expands it through convexity, isoperimetric and nonlinear equations.'
    ]
  },
  {
    id: 'famous-pnp',
    title: 'P vs NP',
    type: 'open-problem',
    category: 'computational-mathematics',
    difficulty: 'hard',
    problem:
      'If a problem\u2019s answer can be checked quickly, can it also be found quickly? Is every problem in NP also in P?',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T07:40:00Z',
    voteCount: 368,
    commentCount: 26,
    solutionStatus: 'unsolved',
    hints: [
      'P contains problems solvable in polynomial time; NP contains those verifiable in polynomial time.',
      'Most Complexity theorists believe P \u2260 NP, but no one has proved it.'
    ]
  },
  {
    id: 'famous-navier-stokes',
    title: 'The Navier\u2013Stokes Problem',
    type: 'open-problem',
    category: 'differential-equations',
    difficulty: 'hard',
    problem:
      'Do the Navier\u2013Stokes equations, governing fluid flow, always have smooth global solutions from any smooth initial data?',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T08:00:00Z',
    voteCount: 241,
    commentCount: 15,
    solutionStatus: 'unsolved',
    hints: [
      'Singularities may appear as turbulence forms.',
      'The prize problem asks for existence and smoothness, or a finite-time blow-up example.'
    ]
  },
  {
    id: 'famous-yang-mills',
    title: 'The Yang\u2013Mills Mass Gap',
    type: 'open-problem',
    category: 'mathematical-physics',
    difficulty: 'hard',
    problem:
      'Prove that a quantum Yang\u2013Mills theory exists and that the lightest particle it predicts has a positive mass.',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T08:20:00Z',
    voteCount: 187,
    commentCount: 11,
    solutionStatus: 'unsolved',
    hints: [
      'The mass gap explains why the strong force does not reach far.',
      'A rigorous construction of the quantum theory is still missing.'
    ]
  },
  {
    id: 'famous-bsd',
    title: 'Birch and Swinnerton-Dyer Conjecture',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'Does the order of vanishing of an elliptic curve\u2019s L-function at s = 1 equal the rank of its group of rational points?',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T08:40:00Z',
    voteCount: 174,
    commentCount: 9,
    solutionStatus: 'unsolved',
    hints: [
      'Numerical evidence links the L-function zero to the number of rational solutions.',
      'Verified for many curves but open in general.'
    ]
  },
  {
    id: 'famous-hodge',
    title: 'The Hodge Conjecture',
    type: 'conjecture',
    category: 'topology',
    difficulty: 'hard',
    problem:
      'For a smooth complex projective variety, are the rational (p, p)-cohomology classes combinations of classes coming from algebraic cycles?',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T09:00:00Z',
    voteCount: 145,
    commentCount: 8,
    solutionStatus: 'unsolved',
    hints: [
      'Think of cohomology as global structure and algebraic cycles as subvarieties.',
      'True in dimension 1 and 2, open in higher dimensions.'
    ]
  },
  {
    id: 'famous-poincare',
    title: 'The Poincar\u00e9 Conjecture',
    type: 'theorem-discussion',
    category: 'topology',
    difficulty: 'hard',
    problem:
      'Is every simply connected closed 3-dimensional manifold homeomorphic to the 3-sphere?',
    author: 'Clay Mathematics Institute',
    createdAt: '2026-10-10T09:20:00Z',
    voteCount: 296,
    commentCount: 19,
    solutionStatus: 'solved',
    hints: [
      'The 2-sphere analogue is classical; the 3-sphere is much harder.',
      'Ricci flow was the key new tool.'
    ],
    solution:
      'Yes \u2014 proved by Grigori Perelman in 2003 using Ricci flow with surgery.'
  },
  {
    id: 'famous-flt',
    title: 'Fermat\u2019s Last Theorem',
    type: 'proof',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'The equation x^n + y^n = z^n has no positive integer solutions for any integer n > 2.',
    author: 'Pierre de Fermat',
    createdAt: '2026-10-10T09:40:00Z',
    voteCount: 451,
    commentCount: 38,
    solutionStatus: 'solved',
    hints: [
      'Fermat famously wrote the margin was too small for his proof.',
      'The modern proof links elliptic curves to modular forms.'
    ],
    solution:
      'Proved by Andrew Wiles in 1994 via the modularity theorem and Ribet\u2019s work.'
  },
  {
    id: 'famous-goldbach',
    title: 'Goldbach\u2019s Conjecture',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'medium',
    problem:
      'Every even integer greater than 2 can be written as the sum of two primes.',
    author: 'Christian Goldbach',
    createdAt: '2026-10-10T10:00:00Z',
    voteCount: 322,
    commentCount: 21,
    solutionStatus: 'unsolved',
    hints: [
      '4 = 2+2, 6 = 3+3, 8 = 3+5, 10 = 3+7 = 5+5.',
      'Verified for enormous numbers by computer.'
    ]
  },
  {
    id: 'famous-twin-prime',
    title: 'The Twin Prime Conjecture',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'medium',
    problem:
      'Are there infinitely many pairs of primes that differ by 2, such as (3,5), (5,7), (11,13)?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T10:20:00Z',
    voteCount: 276,
    commentCount: 17,
    solutionStatus: 'unsolved',
    hints: [
      'Prime gaps of 2 appear throughout the number line.',
      'Zhang, Maynard and the Polymath project bounded prime gaps by a finite number, but not 2.'
    ]
  },
  {
    id: 'famous-four-color',
    title: 'The Four Colour Theorem',
    type: 'graph-theory-problem',
    category: 'graph-theory',
    difficulty: 'medium',
    problem:
      'Can any map drawn on the plane always be coloured with just four colours so neighbouring regions differ?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T10:40:00Z',
    voteCount: 208,
    commentCount: 12,
    solutionStatus: 'solved',
    hints: [
      'This is equivalent to a statement about planar graphs.',
      'One region can meet many others, yet four colours always suffice.'
    ],
    solution:
      'Yes \u2014 Appel and Haken (1976) proved it with extensive computer assistance.'
  },
  {
    id: 'famous-cuboid',
    title: 'The Perfect Cuboid',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'hard',
    problem:
      'Is there a rectangular box with integer edge lengths, integer face diagonals and an integer space diagonal?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T11:00:00Z',
    voteCount: 133,
    commentCount: 9,
    solutionStatus: 'unsolved',
    hints: [
      'Integer cuboids without the space diagonal condition are easy to find.',
      'The impossible-looking side condition remains unproven either way.'
    ]
  },
  {
    id: 'famous-erdos-straus',
    title: 'The Erd\u0151s\u2013Straus Conjecture',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'medium',
    problem:
      'For every integer n \u2265 2, can 4/n be written as 1/x + 1/y + 1/z with positive integers x, y, z?',
    author: 'Paul Erd\u0151s and E.G. Straus',
    createdAt: '2026-10-10T11:20:00Z',
    voteCount: 97,
    commentCount: 6,
    solutionStatus: 'unsolved',
    hints: [
      'Try splitting 4/n into three unit fractions.',
      'It holds for all n up to enormous bounds but is open in general.'
    ]
  },
  {
    id: 'famous-abc',
    title: 'The abc Conjecture',
    type: 'conjecture',
    category: 'number-theory',
    difficulty: 'hard',
    problem:
      'If a + b = c are coprime positive integers, is the radical of abc almost as large as c?',
    author: 'Joseph Oesterl\u00e9 and David Masser',
    createdAt: '2026-10-10T11:40:00Z',
    voteCount: 189,
    commentCount: 14,
    solutionStatus: 'unsolved',
    hints: [
      'The radical is the product of the distinct prime factors.',
      'A proof claimed by Mochizuki is still not fully accepted.'
    ]
  },
  {
    id: 'famous-monty-hall',
    title: 'The Monty Hall Problem',
    type: 'paradox',
    category: 'probability',
    difficulty: 'easy',
    problem:
      'Behind one of three doors is a prize. You pick a door, the host opens a losing door, then asks: switch or stay?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T12:00:00Z',
    voteCount: 233,
    commentCount: 27,
    solutionStatus: 'solved',
    hints: [
      'The host never opens your door and never opens the prize door.',
      'Count what happens across the two cases, not the three doors.'
    ],
    solution:
      'Switch: it wins 2/3 of the time because your first pick is wrong 2/3 of the time.'
  },
  {
    id: 'famous-koenigsberg',
    title: 'The Seven Bridges of K\u00f6nigsberg',
    type: 'graph-theory-problem',
    category: 'graph-theory',
    difficulty: 'easy',
    problem:
      'In old K\u00f6nigsberg, can you walk across all seven bridges exactly once and return to your starting point?',
    author: 'Leonhard Euler',
    createdAt: '2026-10-10T12:20:00Z',
    voteCount: 166,
    commentCount: 10,
    solutionStatus: 'solved',
    hints: [
      'Model the land masses as vertices and the bridges as edges.',
      'Every vertex in an Eulerian circuit must have even degree.'
    ],
    solution:
      'Impossible \u2014 four land masses have odd degree, so Euler (1736) said no.'
  },
  {
    id: 'famous-square-circle',
    title: 'Squaring the Circle',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'medium',
    problem:
      'Using only a straightedge and compass, can you construct a square with the same area as a given circle?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T12:40:00Z',
    voteCount: 152,
    commentCount: 8,
    solutionStatus: 'solved',
    hints: [
      'This would require constructing a segment of length \u221a\u03c0.',
      'It boils down to \u03c0 being a constructible number.'
    ],
    solution:
      'Impossible \u2014 Lindemann proved \u03c0 is transcendental, so \u221a\u03c0 cannot be constructed.'
  },
  {
    id: 'famous-double-cube',
    title: 'Doubling the Cube',
    type: 'geometry-problem',
    category: 'geometry',
    difficulty: 'medium',
    problem:
      'Using straightedge and compass, can you construct a cube with exactly twice the volume of a given cube?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T13:00:00Z',
    voteCount: 141,
    commentCount: 7,
    solutionStatus: 'solved',
    hints: [
      'You need to construct a segment of length \u221b2.',
      'The cube root of 2 is not a constructible number.'
    ],
    solution:
      'Impossible \u2014 Wantzel (1837) showed \u221b2 cannot be reached with straightedge and compass.'
  },
  {
    id: 'famous-banach-tarski',
    title: 'The Banach\u2013Tarski Paradox',
    type: 'paradox',
    category: 'set-theory',
    difficulty: 'hard',
    problem:
      'Can a solid ball be cut into finitely many pieces and reassembled into two balls, each the same size as the original?',
    author: 'Stefan Banach and Alfred Tarski',
    createdAt: '2026-10-10T13:20:00Z',
    voteCount: 198,
    commentCount: 16,
    solutionStatus: 'solved',
    hints: [
      'The paradox relies on non-measurable sets built with the axiom of choice.',
      'Pieces have no well-defined volume, so volume is not conserved.'
    ],
    solution:
      'Yes — proved in 1924; it exploits non-measurable sets and the axiom of choice.'
  },
  {
    id: 'famous-0999',
    title: 'Does 0.999\u2026 Equal 1?',
    type: 'proof',
    category: 'recreational-mathematics',
    difficulty: 'easy',
    problem:
      'The decimal 0.999\u2026 repeats forever. Does it equal exactly 1, or just get close?',
    author: 'Problematic Community',
    createdAt: '2026-10-10T13:40:00Z',
    voteCount: 224,
    commentCount: 24,
    solutionStatus: 'solved',
    hints: [
      'Multiplying 0.999\u2026 by 10 and subtracting collapses the tail.',
      'It is the same geometric-series fact that gives 1/3 = 0.333\u2026.'
    ],
    solution:
      'They are equal. 10x - x = 9 gives 9x = 9, so x = 1.'
  },
  {
    id: 'famous-birthday',
    title: 'The Birthday Problem',
    type: 'probability-problem',
    category: 'probability',
    difficulty: 'easy',
    problem:
      'How many people do you need in a room so that a shared birthday is more likely than not?',
    author: 'Richard von Mises',
    createdAt: '2026-10-10T14:00:00Z',
    voteCount: 137,
    commentCount: 11,
    solutionStatus: 'solved',
    hints: [
      'Work with the probability that all birthdays differ.',
      'The answer is surprisingly small because pairs grow quadratically.'
    ],
    solution:
      '23 people: the chance of a shared birthday already exceeds 50%.'
  }
]

const commentsByPost = {
  'f8e7a620-9c4d-4b82-8f61-2d7e5ac03b94': [
    {
      id: 'c1',
      author: 'Maya R.',
      text: 'The differences are 4, 6, 8, 10... so the next difference is 12. That gives 42.',
      createdAt: '2026-10-09T03:00:00Z',
      likes: 24
    },
    {
      id: 'c2',
      author: 'Deniz K.',
      text: 'Each term is n(n+1): 1·2, 2·3, 3·4, so 6·7 = 42. Clean!',
      createdAt: '2026-10-09T04:30:00Z',
      likes: 17
    },
    {
      id: 'c3',
      author: 'Sam O.',
      text: 'I stared at this for ten minutes before noticing the product pattern.',
      createdAt: '2026-10-09T06:00:00Z',
      likes: 9
    },
    {
      id: 'c4',
      author: 'Priya L.',
      text: 'Those are pronic numbers, the products of two consecutive integers.',
      createdAt: '2026-10-09T08:15:00Z',
      likes: 12
    }
  ],
  '7c2b5d81-6e4a-4f09-8a3c-7e1d6f0c25ab': [
    {
      id: 'c5',
      author: 'Jonas W.',
      text: 'Gauss pairing is still my favourite proof. (1+n) + (2+n-1) + ... every pair sums to n+1.',
      createdAt: '2026-10-09T05:00:00Z',
      likes: 31
    },
    {
      id: 'c6',
      author: 'Elena V.',
      text: 'Induction works neatly here too. Assume for n, then add n+1 and factor.',
      createdAt: '2026-10-09T07:00:00Z',
      likes: 14
    },
    {
      id: 'c7',
      author: 'Tomás A.',
      text: 'A visual proof with the triangular arrangement of dots is lovely too.',
      createdAt: '2026-10-09T09:00:00Z',
      likes: 8
    }
  ],
  'a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d': [
    {
      id: 'c8',
      author: 'Karim B.',
      text: 'My favourite value to start from is 27 — the orbit gets impressively tall.',
      createdAt: '2026-10-09T05:30:00Z',
      likes: 27
    },
    {
      id: 'c9',
      author: 'Lin W.',
      text: 'Equiv is is that any counterexample runs forever or enters a different cycle.',
      createdAt: '2026-10-09T07:45:00Z',
      likes: 11
    }
  ]
}

const fallbackComments = [
  {
    id: 'cf1',
    author: 'Community Member',
    text: 'Interesting problem! Curious to see how others approach this one.',
    createdAt: '2026-10-09T10:00:00Z',
    likes: 5
  },
  {
    id: 'cf2',
    author: 'Problematic Fan',
    text: 'Drop your solution below and compare methods with the community.',
    createdAt: '2026-10-09T11:00:00Z',
    likes: 3
  }
]

export function getPost(key) {
  return samplePosts.find((post) => post.id === key)
}

export function getComments(postId) {
  return commentsByPost[postId] ?? fallbackComments
}

export function getPostsByType(type) {
  return type ? samplePosts.filter((post) => post.type === type) : samplePosts
}

export function getPostsByCategory(category) {
  return category
    ? samplePosts.filter(
        (post) =>
          post.category === category ||
          (post.secondaryCategories || []).includes(category)
      )
    : samplePosts
}