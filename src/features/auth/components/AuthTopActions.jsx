import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

export function AuthTopActions({ isDark, onToggleTheme, linkTo, linkLabel, linkText }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <button onClick={onToggleTheme} className="btn-ghost p-2 rounded-lg self-start sm:self-auto">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <Link to={linkTo} className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors sm:text-right">
        {linkLabel} <span className="text-accent">{linkText}</span>
      </Link>
    </div>
  )
}
