import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Users, Upload, ShoppingBag, Bell, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { AdminSidebar } from '@/features/admin/components/layout/AdminSidebar'
import { AdminTopbar } from '@/features/admin/components/layout/AdminTopbar'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <div className="fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
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
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 animate-enter">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
