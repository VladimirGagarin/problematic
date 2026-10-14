import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AuthProvider from './context/AuthProvider'
import InteractionProvider from './context/InteractionProvider'
import ForYou from './pages/ForYou'
import Discoveries from './pages/Discoveries'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import PostPage from './pages/PostPage'
import CreatePage from './pages/CreatePage'
import CheckProof from './pages/CheckProof'
import Policy from './pages/Policy'

function App() {
  return (
    <AuthProvider>
      <InteractionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/foryou" replace />} />
            <Route path="/foryou" element={<ForYou />} />
            <Route path="/foryou/post/:id" element={<PostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/discoveries" element={<Discoveries />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId/view/:viewerId" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/checkproof" element={<CheckProof />} />
            <Route path="/policy" element={<Policy />} />
          </Route>
        </Routes>
      </InteractionProvider>
    </AuthProvider>
  )
}

export default App