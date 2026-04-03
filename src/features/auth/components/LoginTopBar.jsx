import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { Logo } from '@/shared/components/brand/Logo'

export function LoginTopBar({ isDark, onToggleTheme }) {
  return (
    <div className="flex items-center justify-between p-6">
      <Link to="/" className="lg:hidden flex items-center">
        <Logo size="sm" />
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <button onClick={onToggleTheme} className="btn-ghost p-2 rounded-lg">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/register" className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
          No account? <span className="text-accent">Register</span>
        </Link>
      </div>
    </div>
  )
}
