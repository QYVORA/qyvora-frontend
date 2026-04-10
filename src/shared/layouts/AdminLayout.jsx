import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Users, Upload, ShoppingBag, Bell, AlertTriangle, GraduationCap, ShieldCheck, Layers, ListChecks, Coins } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { AdminSidebar } from '@/features/admin/components/layout/AdminSidebar'
import { AdminTopbar } from '@/features/admin/components/layout/AdminTopbar'
import { AdminMobileNav } from '@/features/admin/components/layout/AdminMobileNav'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, group: 'core' },
  { to: '/admin/users', label: 'Users', icon: Users, group: 'core' },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell, group: 'core' },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag, group: 'core' },
  { to: '/admin/bootcamps', label: 'Bootcamps', icon: GraduationCap, group: 'learning' },
  { to: '/admin/bootcamp-management', label: 'Bootcamp Access', icon: ShieldCheck, group: 'learning' },
  { to: '/admin/rooms', label: 'Learn Rooms', icon: Layers, group: 'learning' },
  { to: '/admin/learn-rules', label: 'Learn Rules', icon: ListChecks, group: 'learning' },
  { to: '/admin/content', label: 'Content Upload', icon: Upload, group: 'content' },
  { to: '/admin/cp-audit', label: 'CP Audit', icon: Coins, group: 'ops' },
  { to: '/admin/security-events', label: 'Security Events', icon: AlertTriangle, group: 'ops' },
]

const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[3],
  NAV_ITEMS[2],
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDashboard = location.pathname === '/admin'

  const handleLogout = () => {
    logout()
    toast({ type: 'info', message: 'Admin session ended.' })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <AdminSidebar
        navItems={NAV_ITEMS}
        onLogout={handleLogout}
      />
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <AdminSidebar
            mobile
            navItems={NAV_ITEMS}
            onLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className={`flex-1 pb-24 lg:pb-8 animate-enter ${isDashboard ? 'p-0 sm:p-6 lg:p-8' : 'p-6 lg:p-8'}`}>
          <Outlet />
        </main>
        <AdminMobileNav navItems={MOBILE_NAV_ITEMS} solid={isDashboard} onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  )
}
