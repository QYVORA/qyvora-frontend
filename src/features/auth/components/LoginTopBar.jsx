import { Link } from 'react-router-dom'
import { Logo } from '@/shared/components/brand/Logo'

export function LoginTopBar() {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6">
      <Link to="/" className="lg:hidden flex items-center">
        <Logo size="md" className="h-[48px] sm:h-[56px]" />
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <Link to="/register" className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
          No account? <span className="text-accent">Register</span>
        </Link>
      </div>
    </div>
  )
}
