import { Avatar, SectionHeader, Spinner } from '@/shared/components/ui'

export function RanksSection({ leaderboard = [], loading = false, rewards }) {
  const totalXp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const totalCp = totalXp
  const earnedXp = rewards?.totals?.xp || 0
  const earnedCp = rewards?.totals?.cp || 0
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

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          {loading ? (
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Spinner size={24} />
              <span className="text-xs font-mono">Loading totals...</span>
            </div>
          ) : (
            <>
              <div className="card px-5 py-3">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Total XP</p>
                <p className="font-display font-bold text-xl text-accent">{Number(totalXp + earnedXp).toLocaleString()} XP</p>
              </div>
              <div className="card px-5 py-3">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Total CP</p>
                <p className="font-display font-bold text-xl text-[var(--text-primary)]">{Number(totalCp + earnedCp).toLocaleString()} CP</p>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-center mt-16">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card p-7 flex flex-col items-center gap-3" style={{ borderRadius: '18px' }}>
                <Spinner size={26} />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card p-8 text-sm text-[var(--text-secondary)] text-center mt-12">
            Leaderboard data is currently unavailable.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-center mt-16">
            {leaderboard.slice(0, 6).map((entry) => {
              const color = '#1fbf8f'
              const handle = entry.handle || entry.name || 'Anonymous'
              const displayHandle = handle.length > 14 ? `${handle.slice(0, 12)}…` : handle
              const rankLabel = entry.rank || 'Operator'
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
                  <div className="relative z-10">
                    <Avatar username={handle} size="lg" />
                  </div>
                  <p
                    className="font-display font-bold text-[var(--text-primary)] text-base text-center relative z-10 truncate max-w-[140px]"
                    title={handle}
                  >
                    {displayHandle}
                  </p>
                  <p className="text-xs font-mono text-[var(--text-muted)] relative z-10">
                    {rankLabel}
                  </p>
                  <p className="text-xs font-mono relative z-10" style={{ color }}>
                    {Number(entry.totalXp || 0).toLocaleString()} XP
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
