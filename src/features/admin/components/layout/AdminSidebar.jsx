import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, LogOut, X } from 'lucide-react'

export function AdminSidebar({
  mobile,
  navItems,
  isDark,
  onToggleTheme,
  onLogout,
  onClose = () => {},
}) {
  return (
    <aside className={`${mobile ? 'fixed inset-y-0 left-0 z-50 w-60' : 'hidden lg:flex w-60 shrink-0'} flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]`}>
      <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5">
          <div>
            <span className="font-display font-bold text-sm">H<span className="text-accent">SOCIETY</span></span>
            <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest -mt-0.5">Admin Panel</p>
          </div>
        </Link>
        {mobile && <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[var(--border)] p-3 space-y-1">
        <button onClick={onToggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}{isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut size={17} />Logout
        </button>
      </div>
    </aside>
  )
}
