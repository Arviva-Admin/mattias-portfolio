import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ChatWidget from './components/ChatWidget'

const queryClient = new QueryClient()

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={user ? <Admin /> : <Login />} />
      </Routes>
      <ChatWidget />
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App