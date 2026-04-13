import { clsx } from 'clsx'

export function Badge({ variant = 'default', children, className }) {
  const variants = {
    default: 'bg-[var(--border)] text-[var(--text-secondary)]',
    accent:   'bg-accent/15 text-accent border border-accent/30',
    success:  'bg-accent/15 text-accent border border-accent/30',
    warning:  'bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400',
    danger:   'bg-red-500/15 text-red-600 border border-red-500/30 dark:text-red-400',
    outline:  'border border-[var(--border)] text-[var(--text-secondary)]',
    purple:   'bg-purple-500/15 text-purple-600 border border-purple-500/30 dark:text-purple-400',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium', variants[variant] ?? variants.default, className)}>
      {children}
    </span>
  )
}
