import { clsx } from 'clsx'

export function Badge({ variant = 'default', children, className }) {
  const variants = {
    default: 'bg-[var(--border)] text-[var(--text-secondary)]',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    success: 'bg-accent/10 text-accent border border-accent/20',
    warning: 'bg-[var(--primary-10)] text-[var(--text-primary)] border border-[var(--primary-20)]',
    danger: 'bg-[var(--primary-10)] text-[var(--text-primary)] border border-[var(--primary-20)]',
    purple: 'bg-accent/10 text-accent border border-accent/20',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
