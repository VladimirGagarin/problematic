import { supabase, isRemote } from './supabase'
import { samplePosts, getComments } from '../data/samplePosts'

export { isRemote }

const COMMENTS_KEY = 'problematic:comments'

function readLocalComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {}
  } catch {
    return {}
  }
}

function writeLocalComments(map) {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(map))
  } catch {
    // storage unavailable; the comment still shows for this session
  }
}

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
  authorId: row.author_id || null,
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

export const VIOLATION_THRESHOLD = 3

export async function checkUserEligibility(userId) {
  if (supabase) {
    const { data, error } = await supabase.rpc('check_eligibility')
    if (error) throw error
    return Boolean(data)
  }
  try {
    const raw = localStorage.getItem('problematic:reports')
    const reports = raw ? JSON.parse(raw) : []
    const against = reports.filter(
      (r) => r.targetUserId === userId && r.status !== 'dismissed'
    )
    return against.length < VIOLATION_THRESHOLD
  } catch {
    return true
  }
}

export async function createReport(report) {
  if (!supabase) return { report }
  const { data, error } = await supabase
    .from('reports')
    .insert({
      reporter_id: report.reporterId || null,
      target_type: report.targetType,
      target_id: String(report.targetId),
      target_user_id: report.targetUserId || null,
      reason: report.reason,
      details: report.details || ''
    })
    .select()
    .single()
  if (error) throw error
  return { report: data }
}

export async function recordProfileView(ownerId, viewerId) {
  if (!supabase) return
  const { error } = await supabase.rpc('record_profile_view', {
    p_owner_id: ownerId,
    p_viewer_id: viewerId
  })
  if (error) throw error
}

export async function fetchComments(postId) {
  if (!supabase) {
    const stored = readLocalComments()[postId] || []
    return [...stored, ...getComments(postId)].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  }
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(toComment)
}

export async function addComment(postId, { text, parentId = null, author, authorId = null }) {
  if (!supabase) {
    const comment = {
      id: `local-${Date.now()}`,
      postId,
      parentId,
      authorId,
      author: author || 'You',
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    }
    const map = readLocalComments()
    map[postId] = [comment, ...(map[postId] || [])]
    writeLocalComments(map)
    return comment
  }
  const { data, error } = await supabase.rpc('add_comment', {
    p_post_id: postId,
    p_text: text,
    p_parent_id: parentId
  })
  if (error) throw error
  return toComment(data)
}

export async function editComment(commentId, text) {
  if (!supabase) {
    const map = readLocalComments()
    for (const postId of Object.keys(map)) {
      map[postId] = map[postId].map((c) =>
        c.id === commentId ? { ...c, text, edited: true } : c
      )
    }
    writeLocalComments(map)
    return { id: commentId, text }
  }
  const { data, error } = await supabase
    .from('comments')
    .update({ text })
    .eq('id', commentId)
    .select()
    .single()
  if (error) throw error
  return toComment(data)
}

export async function deleteComment(commentId) {
  if (!supabase) {
    const map = readLocalComments()
    for (const postId of Object.keys(map)) {
      const toRemove = new Set([commentId])
      let grew = true
      while (grew) {
        grew = false
        for (const c of map[postId]) {
          if (c.parentId && toRemove.has(c.parentId) && !toRemove.has(c.id)) {
            toRemove.add(c.id)
            grew = true
          }
        }
      }
      map[postId] = map[postId].filter((c) => !toRemove.has(c.id))
    }
    writeLocalComments(map)
    return
  }
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) throw error
}