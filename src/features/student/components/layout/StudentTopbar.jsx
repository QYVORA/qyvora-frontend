import { LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { Avatar } from '@/shared/components/ui'
import { Logo } from '@/shared/components/brand/Logo'
import { resolveAvatarSeed } from '@/shared/utils/hackerMaskIdenticon'

export function StudentTopbar({ user, onLogout, solid, navItems = [] }) {
  return (
    <header
      className={clsx(
        'sticky top-0 z-30 border-b border-[var(--border)]/60',
        solid ? 'bg-[color:var(--bg-primary)]' : 'bg-[color:var(--bg-primary)]/96 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center gap-3 sm:gap-5">
        <Link to="/dashboard" className="shrink-0 flex items-center">
          <Logo size="md" scale={1.5} offsetY={-2} className="h-[40px]" />
        </Link>

        <nav className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 w-max py-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-all',
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  )
                }
              >
                <Icon size={12} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/profile"
            className="hover:bg-[var(--bg-secondary)] px-2 py-1.5 flex items-center gap-2 transition-colors"
            aria-label="Profile"
          >
            <Avatar
              username={user?.hackerHandle || user?.name || user?.email}
              size="sm"
              src={user?.avatarUrl}
              seed={resolveAvatarSeed({
                id: user?.id,
                _id: user?._id,
                email: user?.email,
                hackerHandle: user?.hackerHandle,
                name: user?.name,
              })}
            />
            <span className="hidden md:block text-xs font-mono text-[var(--text-secondary)] max-w-[120px] truncate">
              {user?.hackerHandle || user?.name || 'Profile'}
            </span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="hover:bg-[var(--bg-secondary)] hover:text-accent px-2.5 py-2 text-[var(--text-secondary)] transition-colors"
            aria-label="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
