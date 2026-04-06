import { clsx } from 'clsx'

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Icon size={16} />
          </div>
        )}
        <input className={clsx('input-field', Icon && 'pl-10', error && 'border-accent/60 focus:border-accent/60')} {...props} />
      </div>
      {error && <p className="mt-1.5 text-xs text-accent">{error}</p>}
    </div>
  )
}
