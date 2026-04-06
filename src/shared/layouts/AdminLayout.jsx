import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Users, Upload, ShoppingBag, Bell, AlertTriangle, GraduationCap, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { AdminSidebar } from '@/features/admin/components/layout/AdminSidebar'
import { AdminTopbar } from '@/features/admin/components/layout/AdminTopbar'
import { AdminMobileNav } from '@/features/admin/components/layout/AdminMobileNav'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/bootcamps', label: 'Bootcamps', icon: GraduationCap },
  { to: '/admin/bootcamp-management', label: 'Bootcamp Access', icon: ShieldCheck },
  { to: '/admin/content', label: 'Content Upload', icon: Upload },
  { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/security-events', label: 'Security Events', icon: AlertTriangle },
]

export default function AdminLayout() {
  const { isDark, toggleTheme } = useTheme()
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
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
          <AdminSidebar
            mobile
            navItems={NAV_ITEMS}
            isDark={isDark}
            onToggleTheme={toggleTheme}
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
        <AdminMobileNav navItems={NAV_ITEMS} solid={isDashboard} />
      </div>
    </div>
  )
}
