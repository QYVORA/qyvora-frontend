import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, BookOpen, Wallet, ShoppingBag, User, Bell } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { profileService } from '@/core/services'
import { StudentSidebar } from '@/features/student/components/layout/StudentSidebar'
import { StudentTopbar } from '@/features/student/components/layout/StudentTopbar'
import { StudentMobileNav } from '@/features/student/components/layout/StudentMobileNav'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bootcamp', label: 'Bootcamp', icon: BookOpen },
  { to: '/wallet', label: 'CP Wallet', icon: Wallet },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function StudentLayout() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDashboard = location.pathname === '/dashboard'

  const handleLogout = () => {
    logout()
    toast({ type: 'success', title: 'Logged out', message: 'See you next time, operator.' })
    navigate('/')
  }

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        const res = await profileService.getProfile()
        if (!mounted) return
        updateUser(res.data || {})
      } catch {
        // ignore
      }
    }
    loadProfile()
    return () => { mounted = false }
  }, [updateUser])

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Desktop sidebar */}
      <StudentSidebar
        navItems={NAV_ITEMS}
        user={user}
        onLogout={handleLogout}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        <StudentSidebar
          mobile
          navItems={NAV_ITEMS}
          user={user}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <StudentTopbar
          user={user}
          onLogout={handleLogout}
          solid={isDashboard}
        />

        {/* Page content */}
        <main
          className={clsx(
            'flex-1 animate-enter',
            isDashboard ? 'pt-0 px-0 sm:p-6 lg:p-8' : 'px-3 py-4 sm:p-6 lg:p-8',
            'pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-24 lg:pb-8',
          )}
        >
          <Outlet />
        </main>

        {/* Bottom Nav (Mobile Only) */}
        <StudentMobileNav navItems={NAV_ITEMS} solid={isDashboard} />
      </div>
    </div>
  )
}
