import { SectionHeader, Skeleton } from '@/shared/components/ui'

export function RanksSection({ leaderboard = [], loading = false }) {
  return (
    <section className="py-32 px-6 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)]/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <SectionHeader
          kicker="// progression"
          title="Rise Through the Ranks"
          subtitle="XP never lies. Your rank reflects your actual skill level."
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-center mt-16">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card p-7 flex flex-col items-center gap-3" style={{ borderRadius: '18px' }}>
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card p-8 text-sm text-[var(--text-secondary)] text-center mt-12">
            Leaderboard data is currently unavailable.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-center mt-16">
            {leaderboard.slice(0, 6).map((entry, idx) => {
              const colors = ['#3A3F8F', '#0EA5E9', '#22C55E', '#B8860B', '#6D28D9', '#94a3b8']
              const color = colors[idx % colors.length]
              return (
                <div
                  key={entry.id || entry.handle || idx}
                  className="card p-7 flex flex-col items-center gap-3 relative overflow-hidden group hover:scale-105 transition-transform duration-300"
                  style={{ borderColor: `${color}35`, borderRadius: '18px' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color, opacity: 0.6 }} />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)` }}
                  />
                  <div
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold font-mono text-base relative z-10"
                    style={{ borderColor: color, color }}
                  >
                    {idx + 1}
                  </div>
                  <p className="font-display font-bold text-[var(--text-primary)] text-base text-center relative z-10">
                    {entry.handle || entry.name}
                  </p>
                  <p className="text-xs font-mono relative z-10" style={{ color }}>
                    {entry.rank || 'Operator'} · {Number(entry.totalXp || 0).toLocaleString()} XP
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
