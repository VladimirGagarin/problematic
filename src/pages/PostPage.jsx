import { useParams } from 'react-router-dom'
import { getPostBySlug } from '../data/posts'
import PostCard from '../components/PostCard'

function PostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="post-page">
        <div className="not-found">
          <h1>Post not found</h1>
          <p>The post you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="post-page">
      <PostCard post={post} />
    </div>
  )
}

export default PostPage
