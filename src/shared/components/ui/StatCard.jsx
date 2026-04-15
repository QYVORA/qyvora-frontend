import { clsx } from 'clsx'

export function StatCard({ label, value, sub, icon: Icon, trend, color, className, valueClassName }) {
  const resolvedColor = color || 'var(--accent)'
  const resolvedBg = color && !color.startsWith('var(') ? `${color}15` : 'rgba(var(--accent-rgb), 0.12)'
  return (
    <div className={clsx('card p-5 flex items-start gap-4 min-w-0 overflow-hidden', className)}>
      {Icon && (
        <div className="p-2.5 rounded-xl shrink-0" style={{ background: resolvedBg, color: resolvedColor }}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono">{label}</p>
        <p className={clsx('font-mono font-bold text-2xl text-[var(--text-primary)] mt-1 truncate', valueClassName)}>{value}</p>
        {sub && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{sub}</p>}
        {trend !== undefined && (
          <p className={`text-xs font-medium mt-1 ${trend >= 0 ? 'text-accent' : 'text-[var(--text-primary)]'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
          </p>
        )}
      </div>
    </div>
  )
}
