import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

export function StudentMobileNav({ navItems, solid }) {
  const mobileItems = navItems.filter((item) => item.to !== '/profile')
  return (
    <nav
      className={clsx(
        'lg:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)] px-3 pb-safe-area-inset-bottom z-40',
        solid ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-secondary)]/95 backdrop-blur-md'
      )}
    >
      <div className="flex items-center justify-around h-20">
        {mobileItems.map(({ to, label, icon: Icon }) => (
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
