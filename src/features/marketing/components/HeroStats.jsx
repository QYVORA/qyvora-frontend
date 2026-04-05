import { Spinner } from '@/shared/components/ui'

export function HeroStats({ stats, loading }) {
  const students = stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0
  const bootcamps = stats?.stats?.bootcampsCount ?? 0
  const marketItems = stats?.stats?.zeroDayProductsCount ?? 0
  const items = [
    [Number(students || 0).toLocaleString(), 'Students'],
    [Number(bootcamps || 0).toLocaleString(), 'Bootcamps'],
    [Number(marketItems || 0).toLocaleString(), 'Zero-Day Market Products'],
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mt-16 pt-10 pb-20">
      {items.map(([val, label]) => (
        <div key={label} className="flex flex-col items-center gap-3">
          {loading ? (
            <Spinner size={28} />
          ) : (
            <span className="font-display font-black text-3xl md:text-4xl text-accent glow-text leading-none mb-2">
              {val}
            </span>
          )}
          <span className="text-[10px] md:text-xs text-[var(--text-muted)] font-mono uppercase tracking-[0.2em]">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
