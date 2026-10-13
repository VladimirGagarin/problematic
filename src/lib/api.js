import { supabase, isRemote } from './supabase'
import { samplePosts, getComments } from '../data/samplePosts'

export { isRemote }

const toPost = (row) => ({
  id: row.id,
  title: row.title,
  type: row.type,
  category: row.category,
  secondaryCategories: row.secondary_categories || [],
  difficulty: row.difficulty,
  problem: row.problem,
  author: row.author || 'Member',
  createdAt: row.created_at,
  voteCount: row.vote_count,
  commentCount: row.comment_count,
  shareCount: row.share_count,
  solutionStatus: row.solution_status,
  hints: row.hints || [],
  solution: row.solution || ''
})

const toComment = (row) => ({
  id: row.id,
  postId: row.post_id,
  parentId: row.parent_id,
  author: row.author || 'Member',
  text: row.text,
  createdAt: row.created_at,
  likes: row.likes || 0
})

export async function fetchPosts({ limit = 20, offset = 0, sort = 'latest' } = {}) {
  if (!supabase) {
    const list =
      sort === 'relevant'
        ? [...samplePosts].sort((a, b) => b.voteCount - a.voteCount)
        : [...samplePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return { posts: list.slice(offset, offset + limit), total: list.length }
  }
  const orderColumn = sort === 'relevant' ? 'vote_count' : 'created_at'
  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order(orderColumn, { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return { posts: (data || []).map(toPost), total: count ?? data?.length ?? 0 }
}

export async function fetchPost(id) {
  if (!supabase) return samplePosts.find((p) => p.id === id) || null
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toPost(data) : null
}

export async function createPost(input) {
  const row = {
    id: input.id,
    title: input.title,
    type: input.type,
    category: input.category,
    secondary_categories: input.secondaryCategories || [],
    difficulty: input.difficulty || 'medium',
    problem: input.problem,
    author: input.author || 'Member',
    hints: input.hints || [],
    solution: input.solution || '',
    answer: input.answer || '',
    formula: input.formula || '',
    solution_status: input.solutionStatus || (input.solution ? 'solved' : 'unsolved'),
    created_at: input.createdAt || new Date().toISOString(),
    vote_count: 0,
    comment_count: 0,
    share_count: 0
  }
  if (!supabase) return toPost(row)
  const { data, error } = await supabase.from('posts').insert(row).select().single()
  if (error) throw error
  return toPost(data)
}

export async function toggleVote(postId, direction) {
  if (!supabase) return { post: null }
  const { data, error } = await supabase.rpc('toggle_vote', {
    p_post_id: postId,
    p_direction: direction
  })
  if (error) throw error
  return { post: data ? toPost(data) : null }
}

export async function recordShare(postId) {
  if (!supabase) return { post: null }
  const { data, error } = await supabase.rpc('record_share', { p_post_id: postId })
  if (error) throw error
  return { post: data ? toPost(data) : null }
}

export async function fetchComments(postId) {
  if (!supabase) return getComments(postId)
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(toComment)
}

export async function addComment(postId, { text, parentId = null }) {
  if (!supabase) {
    return {
      id: `local-${Date.now()}`,
      postId,
      parentId,
      author: 'You',
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    }
  }
  const { data, error } = await supabase.rpc('add_comment', {
    p_post_id: postId,
    p_text: text,
    p_parent_id: parentId
  })
  if (error) throw error
  return toComment(data)
}