export const posts = [
  {
    id: "f8e7a620-9c4d-4b82-8f61-2d7e5ac03b94",
    title: "The Next Number",
    slug: "the-next-number",
    type: "sequence-puzzle",
    category: "number-theory",
    difficulty: "medium",
    problem: "2, 6, 12, 20, 30, ?",
    hints: [
      "Look at the differences between consecutive terms.",
      "Can each term be written as a product?"
    ],
    answer: "42",
    solution: "The nth term is n(n+1).",
    formula: "n(n+1)",
    status: "published",
    author: "Room24 Community",
    coAuthors: [],
    sources: [
      {
        title: "Original Community Puzzle",
        url: ""
      }
    ],
    tags: ["patterns", "sequences", "algebra"],
    views: 1284,
    votes: 245,
    comments: 18,
    createdAt: "2026-10-09T00:00:00Z",
    updatedAt: "2026-10-09T00:00:00Z"
  },
  {
    id: "7c2b5d81-6e4a-4f09-8a3c-7e1d6f0c25ab",
    title: "Sum of First N Integers",
    slug: "sum-of-first-n-integers",
    type: "proof",
    category: "algebra",
    difficulty: "easy",
    problem: "Prove that 1 + 2 + ... + n = n(n+1)/2",
    hints: [
      "Try pairing terms from both ends.",
      "Consider the sum as (n)(n+1)/2 by induction or by pairing."
    ],
    answer: "n(n+1)/2",
    solution: "Pair first and last: (1+n) + (2+n-1) + ... = k(n+1). Count k terms gives n(n+1)/2.",
    formula: "S_n = \\frac{n(n+1)}{2}",
    status: "published",
    author: "Problematic Team",
    coAuthors: [],
    sources: [],
    tags: ["proof", "series", "induction"],
    views: 892,
    votes: 187,
    comments: 12,
    createdAt: "2026-10-09T01:00:00Z",
    updatedAt: "2026-10-09T01:00:00Z"
  }
]

export function getPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

export function getPostsByCategory(category) {
  if (category === 'for-you') return posts
  if (category === 'unsolved') return posts.filter(p => p.type.includes('puzzle'))
  if (category === 'discoveries') return posts.filter(p => p.type.includes('proof') || p.category === 'discovery')
  return posts
}
