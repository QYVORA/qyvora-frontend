import { clsx } from 'clsx'

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none',
          checked ? 'bg-accent' : 'bg-[var(--dark-300,#2e2e44)]'
        )}
      >
        <span
          className={clsx('absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-0')}
          style={{ width: '18px', height: '18px', top: '2px', left: '2px', transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
      {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
    </label>
  )
}
