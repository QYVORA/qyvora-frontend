import { clsx } from 'clsx'

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-1',
          checked ? 'bg-accent' : 'bg-[var(--border)]'
        )}
      >
        <span
          style={{ width: '18px', height: '18px', top: '3px', left: '3px', transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
          className={clsx(
            'absolute rounded-full shadow-sm transition-transform duration-200',
            checked ? 'bg-white' : 'bg-[var(--text-muted)]'
          )}
        />
      </button>
      {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
    </label>
  )
}
