import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LayoutDashboard, Users, Upload, ShoppingBag, Bell, AlertTriangle, GraduationCap, ShieldCheck, Layers, ListChecks, Coins } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { AdminSidebar } from '@/features/admin/components/layout/AdminSidebar'
import { AdminTopbar } from '@/features/admin/components/layout/AdminTopbar'
import { AdminMobileNav } from '@/features/admin/components/layout/AdminMobileNav'

const NAV_ITEMS = [
  // Dashboard
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, group: 'dashboard' },

  // Users & Comms
  { to: '/admin/users', label: 'Users', icon: Users, group: 'users' },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell, group: 'users' },

  // Learning
  { to: '/admin/bootcamps', label: 'Bootcamps', icon: GraduationCap, group: 'learning' },
  { to: '/admin/bootcamp-management', label: 'Bootcamp Access', icon: ShieldCheck, group: 'learning' },
  { to: '/admin/rooms', label: 'Learn Rooms', icon: Layers, group: 'learning' },
  { to: '/admin/learn-rules', label: 'Learn Rules', icon: ListChecks, group: 'learning' },

  // Store & Content
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag, group: 'store' },
  { to: '/admin/content', label: 'Content Upload', icon: Upload, group: 'store' },

  // Ops
  { to: '/admin/cp-audit', label: 'CP Audit', icon: Coins, group: 'ops' },
  { to: '/admin/security-events', label: 'Security Events', icon: AlertTriangle, group: 'ops' },
]

// Fix MOBILE_NAV_ITEMS — use path matching instead of fragile index references
const MOBILE_NAV_ITEMS = ['/admin', '/admin/users', '/admin/bootcamps', '/admin/notifications']
  .map(path => NAV_ITEMS.find(item => item.to === path))
  .filter(Boolean)

export default function AdminLayout() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/admin'

  const handleLogout = () => {
    logout()
    toast({ type: 'info', message: 'Admin session ended.' })
    navigate('/')
  }

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
      <AdminSidebar
        navItems={NAV_ITEMS}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className={`flex-1 pb-24 lg:pb-8 animate-enter ${isDashboard ? 'p-0 sm:p-6 lg:p-8' : 'p-6 lg:p-8'}`}>
          <Outlet />
        </main>
        <AdminMobileNav navItems={MOBILE_NAV_ITEMS} solid={isDashboard} />
      </div>
    </div>
  )
}
