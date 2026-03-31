import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon: Icon,
  children,
  className,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  const variants = {
    primary: 'bg-accent text-dark-900 hover:bg-accent-400 hover:shadow-lg hover:shadow-accent/25',
    secondary: 'border border-accent text-accent hover:bg-accent/10',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]',
    danger: 'bg-red-500 text-white hover:bg-red-400',
    outline: 'border border-[var(--border)] text-[var(--text-primary)] hover:border-accent/40 hover:bg-[var(--bg-card-hover)]',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
