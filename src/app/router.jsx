import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts'
import { FullPageLoader } from '@/shared/components/feedback'
import { PublicLayout, StudentLayout, AdminLayout } from '@/shared/layouts'
import NotFoundPage from '@/shared/pages/NotFoundPage'

const LandingPage = lazy(() => import('@/features/marketing/pages/LandingPage'))
const PrivacyPage = lazy(() => import('@/features/marketing/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/features/marketing/pages/TermsPage'))
const ServicesPage = lazy(() => import('@/features/marketing/pages/ServicesPage'))
const ContactPage = lazy(() => import('@/features/marketing/pages/ContactPage'))
const IdenticonPreviewPage = lazy(() => import('@/shared/pages/IdenticonPreviewPage'))
const PublicProfilePage = lazy(() => import('@/shared/pages/PublicProfilePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
const ChangePasswordPage = lazy(() => import('@/features/auth/pages/ChangePasswordPage'))
const StudentDashboard = lazy(() => import('@/features/student/pages/Dashboard'))
const BootcampPage = lazy(() => import('@/features/student/pages/Bootcamp'))
const BootcampDashboard = lazy(() => import('@/features/student/pages/BootcampDashboard'))
const BootcampModule = lazy(() => import('@/features/student/pages/BootcampModule'))
const BootcampRoom = lazy(() => import('@/features/student/pages/BootcampRoom'))
const StudentPayments = lazy(() => import('@/features/student/pages/StudentPayments'))
const WalletPage = lazy(() => import('@/features/student/pages/Wallet'))
const MarketplacePage = lazy(() => import('@/features/student/pages/Marketplace'))
const LearnPage = lazy(() => import('@/features/student/pages/Learn'))
const RoomsPage = lazy(() => import('@/features/student/pages/Rooms'))
const RoomDetailPage = lazy(() => import('@/features/student/pages/RoomDetail'))
const ProfilePage = lazy(() => import('@/features/student/pages/Profile'))
const NotificationsPage = lazy(() => import('@/features/student/pages/Notifications'))
const AdminDashboard = lazy(() => import('@/features/admin/pages/Dashboard'))
const AdminUsers = lazy(() => import('@/features/admin/pages/Users'))
const AdminContent = lazy(() => import('@/features/admin/pages/Content'))
const AdminBootcamps = lazy(() => import('@/features/admin/pages/Bootcamps'))
const AdminBootcampManagement = lazy(() => import('@/features/admin/pages/BootcampManagement'))
const AdminMarketplace = lazy(() => import('@/features/admin/pages/Marketplace'))
const AdminNotifications = lazy(() => import('@/features/admin/pages/Notifications'))
const AdminSecurityEvents = lazy(() => import('@/features/admin/pages/SecurityEvents'))
const AdminRooms = lazy(() => import('@/features/admin/pages/LearnRooms'))
const AdminLearnRules = lazy(() => import('@/features/admin/pages/LearnRules'))
const AdminCPAudit = lazy(() => import('@/features/admin/pages/CPAudit'))

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
  const hasStoredSession = Boolean(localStorage.getItem('hs_user'))
  if (user && hasStoredSession) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/identicon-preview" element={<IdenticonPreviewPage />} />
          <Route path="/:handle" element={<PublicProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/change-password" element={<GuestRoute><ChangePasswordPage /></GuestRoute>} />
          <Route path="/verify-email" element={<GuestRoute><VerifyEmailPage /></GuestRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
          </Route>
          <Route path="/bootcamp" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<BootcampPage />} />
            <Route path=":bootcampId" element={<BootcampDashboard />} />
            <Route path=":bootcampId/modules/:moduleId" element={<BootcampModule />} />
            <Route path=":bootcampId/modules/:moduleId/rooms/:roomId" element={<BootcampRoom />} />
          </Route>
          <Route path="/wallet" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<WalletPage />} />
          </Route>
          <Route path="/learn" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<LearnPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:slug" element={<RoomDetailPage />} />
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
        <Route path="/student-payments" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentPayments />} />
        </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bootcamps" element={<AdminBootcamps />} />
          <Route path="bootcamp-management" element={<AdminBootcampManagement />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="learn-rules" element={<AdminLearnRules />} />
          <Route path="marketplace" element={<AdminMarketplace />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="cp-audit" element={<AdminCPAudit />} />
          <Route path="security-events" element={<AdminSecurityEvents />} />
        </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
