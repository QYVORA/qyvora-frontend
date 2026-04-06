import { Link } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { Logo } from '@/shared/components/brand/Logo'

export function PublicNavbar({ isDark, onToggleTheme, menuOpen, onToggleMenu }) {
  const { user } = useAuth()
  const displayName = user?.hackerHandle || user?.name || user?.email || ''
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[color:var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo size="md" scale={2.6} offsetY={-3} className="h-[30px]" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {[['/', 'Home'], ['/#bootcamps', 'Bootcamps'], ['/#marketplace', 'Market']].map(([href, label]) => (
            <a key={label} href={href} className="btn-ghost text-sm">{label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onToggleTheme} className="btn-ghost p-2 rounded-lg" aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!user && (
            <>
              <Link to="/login" className="hidden md:inline-flex btn-ghost text-sm border border-[var(--border)] px-4 py-2 rounded-lg">Log in</Link>
              <Link to="/register" className="btn-primary text-sm hidden md:inline-flex">Start Training</Link>
            </>
          )}
          {user && (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="hidden md:inline-flex btn-primary text-sm">
              Go to Dashboard
            </Link>
          )}
          <button className="md:hidden btn-ghost p-2" onClick={onToggleMenu}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)] p-6 space-y-6 animate-fade-in shadow-xl">
          <div className="flex flex-col gap-4">
            {[['/', 'Home'], ['/#bootcamps', 'Bootcamps'], ['/#marketplace', 'Market']].map(([href, label]) => (
              <a
                key={label}
                href={href}
                onClick={onToggleMenu}
                className="text-lg font-medium text-[var(--text-secondary)] hover:text-accent transition-colors py-2 border-b border-[var(--border)]/50 last:border-0"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            {!user && (
              <>
                <Link to="/login" onClick={onToggleMenu} className="block w-full btn-ghost py-3.5 text-center rounded-xl border border-[var(--border)] font-semibold">
                  Log in
                </Link>
                <Link to="/register" onClick={onToggleMenu} className="block w-full btn-primary text-center py-3.5 rounded-xl font-bold shadow-lg shadow-accent/20">
                  Start Training
                </Link>
              </>
            )}
            {user && (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={onToggleMenu} className="block w-full btn-primary text-center py-3.5 rounded-xl font-bold shadow-lg shadow-accent/20">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
