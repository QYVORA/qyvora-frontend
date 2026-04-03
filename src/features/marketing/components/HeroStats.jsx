import { Spinner } from '@/shared/components/ui'

export function HeroStats({ stats, loading }) {
  const learners = stats?.stats?.learnersTrained ?? 0
  const phases = stats?.stats?.engagementsCompleted ?? 0
  const marketItems = stats?.stats?.vulnerabilitiesIdentified ?? 0
  const items = [
    [Number(learners || 0).toLocaleString(), 'Operators'],
    [Number(phases || 0).toLocaleString(), 'Engagements'],
    [Number(marketItems || 0).toLocaleString(), 'Findings'],
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
