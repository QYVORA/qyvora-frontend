import { Sun, Moon, LogOut, Bell, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/shared/components/ui'

export function StudentTopbar({ user, isDark, onToggleTheme, onLogout }) {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-[color:var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-2 lg:hidden font-display font-bold text-lg tracking-tight">
        <span>
          H<span className="text-accent">SOCIETY</span>
        </span>
      </Link>
      <div className="hidden lg:flex items-center gap-2 text-[var(--text-muted)] text-sm">
        <Zap size={14} className="text-accent" />
        <span className="font-mono">Rank {user?.xpSummary?.rank || 'Operator'} — {Number(user?.xpSummary?.totalXp || 0).toLocaleString()} XP</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={onToggleTheme} className="lg:hidden btn-ghost p-2 rounded-lg" aria-label="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={onLogout} className="lg:hidden btn-ghost p-2 rounded-lg text-red-400" aria-label="Logout">
          <LogOut size={18} />
        </button>
        <Link to="/notifications" className="btn-ghost p-2 rounded-lg relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </Link>
        <div className="h-6 w-px bg-[var(--border)] mx-1" />
        <div className="flex items-center gap-2.5 max-w-[200px]">
          <Avatar username={user?.hackerHandle || user?.name || user?.email} size="sm" />
          <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block truncate">
            {user?.hackerHandle || user?.name || user?.email}
          </span>
        </div>
      </div>
    </header>
  )
}
