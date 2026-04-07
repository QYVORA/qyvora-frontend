import { Link } from 'react-router-dom'

export function AuthTopActions({ linkTo, linkLabel, linkText }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="flex-1" />
      <Link to={linkTo} className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors sm:text-right">
        {linkLabel} <span className="text-accent">{linkText}</span>
      </Link>
    </div>
  )
}
