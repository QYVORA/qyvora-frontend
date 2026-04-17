import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LayoutDashboard, BookOpen, Wallet, ShoppingBag, User, Layers } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { profileService } from '@/core/services'
import { StudentTopbar } from '@/features/student/components/layout/StudentTopbar'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/learn', label: 'Learn', icon: Layers },
  { to: '/bootcamp', label: 'Bootcamp', icon: BookOpen },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/marketplace', label: 'Market', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: User },
]

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/bootcamp', label: 'Bootcamp', icon: BookOpen },
  { to: '/learn/rooms', label: 'Rooms', icon: Layers },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <StudentTopbar
        user={user}
        onLogout={handleLogout}
        solid={isDashboard}
        navItems={NAV_ITEMS}
      />

      <main
        className={clsx(
          'animate-enter max-w-7xl mx-auto w-full',
          isDashboard ? 'pt-0 px-3 sm:px-6 lg:px-8' : 'px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
          'pb-24 sm:pb-8'
        )}
      >
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)] border-t border-[var(--border)] flex items-stretch">
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors',
                active ? 'text-accent' : 'text-[var(--text-muted)]'
              )}
            >
              <Icon size={20} />
              <span className="font-mono text-[9px] uppercase tracking-wide">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
