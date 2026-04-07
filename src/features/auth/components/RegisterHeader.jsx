import { Link } from 'react-router-dom'
import { Logo } from '@/shared/components/brand/Logo'

export function RegisterHeader() {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <Link to="/" className="inline-flex items-center mb-6">
        <Logo size="xl" className="h-[56px] sm:h-[64px]" />
      </Link>
      <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// create account</p>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">Join the Platform</h1>
      <p className="text-[var(--text-secondary)] text-sm mt-2">Begin your offensive security journey.</p>
    </div>
  )
}
