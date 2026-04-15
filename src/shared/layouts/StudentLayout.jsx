import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LayoutDashboard, BookOpen, Wallet, ShoppingBag, User, Bell, Layers } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { profileService } from '@/core/services'
import { StudentSidebar } from '@/features/student/components/layout/StudentSidebar'
import { StudentTopbar } from '@/features/student/components/layout/StudentTopbar'
import { StudentMobileNav } from '@/features/student/components/layout/StudentMobileNav'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/learn', label: 'Learn', icon: Layers },
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

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    let meta = document.querySelector('meta[name="robots"]')
    const previous = meta?.getAttribute('content') || ''
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow')
    return () => {
      if (!meta) return
      if (previous) meta.setAttribute('content', previous)
      else meta.remove()
    }
  }, [])

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Desktop sidebar */}
      <StudentSidebar
        navItems={NAV_ITEMS}
        user={user}
        onLogout={handleLogout}
      />

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
