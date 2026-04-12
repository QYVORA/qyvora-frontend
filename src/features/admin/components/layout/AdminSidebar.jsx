import { Link, NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { Logo } from '@/shared/components/brand/Logo'

export function AdminSidebar({
  mobile,
  navItems,
  onLogout,
  onClose = () => {},
}) {
  const groups = [
    { key: 'dashboard', label: null },
    { key: 'users', label: 'Users & Comms' },
    { key: 'learning', label: 'Learning' },
    { key: 'store', label: 'Store & Content' },
    { key: 'ops', label: 'Ops' },
  ]
  const grouped = navItems.reduce((acc, item) => {
    const group = item.group || 'core'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})

  return (
    <aside className={`${mobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden lg:flex w-64 h-screen sticky top-0 shrink-0'} flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden`}>
      <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border)] shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div>
            <Logo size="sm" />
            <p className="text-[10px] text-accent font-mono uppercase tracking-widest -mt-0.5">Admin Panel</p>
          </div>
        </Link>
        {mobile && <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>}
      </div>
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="space-y-4">
          {groups.map((group) => {
            const items = grouped[group.key] || []
            if (!items.length) return null
            return (
              <div key={group.key} className="space-y-1.5">
                {group.label && (
                  <p className="px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">{group.label}</p>
                )}
                {items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    <Icon size={16} />
                    {label}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </div>
      </nav>
      <div className="border-t border-[var(--border)] p-2 space-y-3 shrink-0 mt-auto">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-accent/10 hover:text-accent transition-all justify-start text-left">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
