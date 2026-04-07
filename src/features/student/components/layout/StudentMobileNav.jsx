import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

export function StudentMobileNav({ navItems, solid }) {
  const mobileItems = navItems.filter((item) => item.to !== '/profile')
  return (
    <nav
      className={clsx(
        'lg:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--border)]/60 px-4 pb-safe-area-inset-bottom z-40 shadow-[0_-12px_30px_-28px_rgba(0,0,0,0.45)]',
        solid ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-primary)]/96 backdrop-blur-md'
      )}
    >
      <div className="flex items-center justify-around h-20 sm:h-24">
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
            <Icon size={24} />
            <span className="text-[12.5px] font-semibold uppercase tracking-tight">
              {label === 'CP Wallet' ? 'Wallet' : label === 'Notifications' ? 'Alerts' : label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
