import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardPage from './pages/participant/DashboardPage'
import CreditScorePage from './pages/participant/CreditScorePage'
import ClassProgressPage from './pages/participant/ClassProgressPage'
import LoanGatewayPage from './pages/participant/LoanGatewayPage'
import QuizTestPage from './pages/participant/QuizTestPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminParticipantDetail from './pages/admin/AdminParticipantDetail'
import AdminCBTPage from './pages/admin/AdminCBTPage'
import ParticipantLayout from './components/layout/ParticipantLayout'
import AdminLayout from './components/layout/AdminLayout'

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-forest-400 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/" element={<PrivateRoute requiredRole="participant"><ParticipantLayout /></PrivateRoute>}>
            <Route path="dashboard"      element={<DashboardPage />} />
            <Route path="credit-score"   element={<CreditScorePage />} />
            <Route path="class-progress" element={<ClassProgressPage />} />
            <Route path="loan-gateway"   element={<LoanGatewayPage />} />
            <Route path="quiz"           element={<QuizTestPage />} />
          </Route>

          <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminLayout /></PrivateRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="participant/:id" element={<AdminParticipantDetail />} />
            <Route path="cbt" element={<AdminCBTPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
