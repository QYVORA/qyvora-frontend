import { clsx } from 'clsx'

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon: Icon,
  children,
  className,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-none transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none font-mono uppercase tracking-[0.08em]'
  const variants = {
    primary: 'bg-accent text-black border border-accent hover:bg-[#a0c490] hover:border-[#a0c490] hover:shadow-lg hover:shadow-accent/20',
    secondary: 'bg-transparent border border-white/15 text-[var(--text-muted)] hover:border-accent/50 hover:text-[var(--text-primary)] hover:bg-accent/10',
    ghost: 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]',
    danger: 'bg-[var(--text-primary)] text-accent hover:bg-[color:var(--text-primary)]/90',
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
      {loading ? (
        <div
          role="status"
          aria-label="Loading"
          className="spinner"
          style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: 'currentColor', borderColor: 'rgba(0,0,0,0.2)' }}
        />
      ) : Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
