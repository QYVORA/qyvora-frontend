import { NavLink } from 'react-router-dom'

export function StudentMobileNav({ navItems }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-t border-[var(--border)] px-3 pb-safe-area-inset-bottom z-40">
      <div className="flex items-center justify-around h-20">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? 'text-accent' : 'text-[var(--text-muted)]'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[11px] font-semibold uppercase tracking-tight">
              {label === 'CP Wallet' ? 'Wallet' : label === 'Notifications' ? 'Alerts' : label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
