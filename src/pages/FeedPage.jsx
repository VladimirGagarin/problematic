import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { posts } from '../data/posts'
import './FeedPage.css'

function FeedPage() {
  const location = useLocation()
  const [feedPosts, setFeedPosts] = useState([])

  useEffect(() => {
    if (location.pathname.includes('foryou') || location.pathname === '/') {
      setFeedPosts(posts)
    } else if (location.pathname.includes('unsolved')) {
      setFeedPosts(posts.filter(p => p.type.includes('puzzle')))
    } else if (location.pathname.includes('discoveries')) {
      setFeedPosts(posts)
    }
  }, [location.pathname])

  return (
    <div className="feed-page">
      {feedPosts.length === 0 ? (
        <div className="empty-feed">
          <p>No posts yet.</p>
        </div>
      ) : (
        feedPosts.map((post) => (
          <div key={post.id} className="feed-item">
            <Link to={`/post/${post.slug}`} className="feed-item-link">
              <h2 className="feed-item-title">{post.title}</h2>
              <div className="feed-item-problem">{post.problem}</div>
              <div className="feed-item-meta">
                <span>{post.difficulty}</span> • <span>{post.category}</span> • <span>{post.views} views</span>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}

export default FeedPage
