import { clsx } from 'clsx'

export function Badge({ variant = 'default', children, className }) {
  const variants = {
    default: 'bg-[var(--border)] text-[var(--text-secondary)]',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
