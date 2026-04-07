import { Link, NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { Logo } from '@/shared/components/brand/Logo'

export function StudentSidebar({
  mobile,
  navItems,
  onLogout,
  onClose = () => {},
}) {
  const navTemplate = mobile ? undefined : { gridTemplateRows: `repeat(${navItems.length}, minmax(0, 1fr))` }
  const tourMap = {
    '/dashboard': 'nav-dashboard',
    '/bootcamp': 'nav-bootcamp',
    '/wallet': 'nav-wallet',
    '/marketplace': 'nav-marketplace',
    '/notifications': 'nav-notifications',
    '/profile': 'nav-profile',
  }

  return (
    <aside className={`${mobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden lg:flex w-64 h-screen sticky top-0 shrink-0'} flex flex-col bg-[var(--bg-secondary)] overflow-hidden`}>
      <div className="h-20 flex items-center justify-between px-5 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size="sm" />
        </Link>
        {mobile && (
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div
          className={`grid gap-1.5 ${mobile ? '' : 'h-full'}`}
          style={navTemplate}
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              data-tour={tourMap[to]}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium h-full transition-all duration-150 ${
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
