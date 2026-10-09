import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import FeedPage from './pages/FeedPage'
import PostPage from './pages/PostPage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/foryou" replace />} />
        <Route path="/foryou" element={<FeedPage />} />
        <Route path="/foryou/:slug" element={<PostPage />} />
        <Route path="/foryou/post/:id" element={<PostPage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/unsolved" element={<FeedPage />} />
        <Route path="/unsolved/:slug" element={<PostPage />} />
        <Route path="/discoveries" element={<FeedPage />} />
        <Route path="/discoveries/:slug" element={<PostPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App
