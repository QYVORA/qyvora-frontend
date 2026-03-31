import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LayoutDashboard, BookOpen, Wallet, ShoppingBag, User, Bell } from 'lucide-react'
import { useTheme } from '@/core/contexts/ThemeContext'
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
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <StudentSidebar
            mobile
            navItems={NAV_ITEMS}
            user={user}
            isDark={isDark}
            onToggleTheme={toggleTheme}
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
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 animate-enter">
          <Outlet />
        </main>

        {/* Bottom Nav (Mobile Only) */}
        <StudentMobileNav navItems={NAV_ITEMS} />
      </div>
    </div>
  )
}
