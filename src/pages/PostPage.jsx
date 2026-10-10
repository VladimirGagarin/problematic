import { Link, useParams } from 'react-router-dom'
import { getPost } from '../data/samplePosts'
import PostCard from '../components/PostCard'
import './PostPage.css'

function PostPage() {
  const { id } = useParams()
  const post = getPost(id)

  if (!post) {
    return (
      <div className="post-page">
        <div className="not-found">
          <h1 className="not-found-title">Post not found</h1>
          <p className="not-found-copy">The problem you're looking for doesn't exist.</p>
          <Link to="/foryou" className="btn btn-accent">
            Back to For you
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="post-page">
      <div className="post-page-inner">
        <PostCard post={post} />
        <p className="post-page-note">
          Open the discussion from the card to compare approaches with the community.
        </p>
      </div>
    </div>
  )
}

export default PostPage