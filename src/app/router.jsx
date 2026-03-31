import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts'
import { FullPageLoader } from '@/shared/components/feedback'
import { PublicLayout, StudentLayout, AdminLayout } from '@/shared/layouts'

const LandingPage = lazy(() => import('@/features/marketing/pages/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const StudentDashboard = lazy(() => import('@/features/student/pages/Dashboard'))
const BootcampPage = lazy(() => import('@/features/student/pages/Bootcamp'))
const WalletPage = lazy(() => import('@/features/student/pages/Wallet'))
const MarketplacePage = lazy(() => import('@/features/student/pages/Marketplace'))
const ProfilePage = lazy(() => import('@/features/student/pages/Profile'))
const NotificationsPage = lazy(() => import('@/features/student/pages/Notifications'))
const AdminDashboard = lazy(() => import('@/features/admin/pages/Dashboard'))
const AdminUsers = lazy(() => import('@/features/admin/pages/Users'))
const AdminContent = lazy(() => import('@/features/admin/pages/Content'))
const AdminMarketplace = lazy(() => import('@/features/admin/pages/Marketplace'))
const AdminNotifications = lazy(() => import('@/features/admin/pages/Notifications'))
const AdminSecurityEvents = lazy(() => import('@/features/admin/pages/SecurityEvents'))

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
          </Route>
          <Route path="/bootcamp" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<BootcampPage />} />
          </Route>
          <Route path="/wallet" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<WalletPage />} />
          </Route>
          <Route path="/marketplace" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<MarketplacePage />} />
        </Route>
        <Route path="/notifications" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<NotificationsPage />} />
        </Route>
        <Route path="/profile" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<ProfilePage />} />
        </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="marketplace" element={<AdminMarketplace />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="security-events" element={<AdminSecurityEvents />} />
        </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
