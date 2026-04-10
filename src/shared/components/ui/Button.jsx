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
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  const variants = {
    primary: 'bg-accent text-[var(--text-primary)] hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25',
    secondary: 'border border-accent text-accent hover:bg-accent/10',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]',
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
        <div className="h-loader" style={{ width: 18, height: 24 }} aria-label="Loading">
          <div className="h-leg h-leg-left"><div className="h-beam" /></div>
          <div className="h-crossbar"><div className="h-beam" /></div>
          <div className="h-leg h-leg-right"><div className="h-beam" /></div>
        </div>
      ) : Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
