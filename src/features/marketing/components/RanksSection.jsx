import { Avatar, SectionHeader, Spinner } from '@/shared/components/ui'
import { resolveAvatarSeed } from '@/shared/utils/hackerMaskIdenticon'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function RanksSection({ leaderboard = [], loading = false, rewards }) {
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const earnedCp = rewards?.totals?.cp || 0
  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative overflow-hidden border-t border-accent/10">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)]/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <SectionHeader
          kicker="// progression"
          title="Rise Through the Ranks"
          subtitle="Your rank reflects your earned CP over time."
        />

        <StaggerReveal as="div" className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6" stagger={120} variant="fade">
          {loading ? (
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Spinner size={24} />
              <span className="text-xs font-mono">Loading totals...</span>
            </div>
          ) : (
            <>
              <div className="card px-5 py-3 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Total CP</p>
                <p className="font-mono font-bold text-xl text-[var(--text-primary)]">{Number(totalCp + earnedCp).toLocaleString()} CP</p>
              </div>
            </>
          )}
        </StaggerReveal>

        {loading ? (
          <StaggerReveal as="div" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 border border-[var(--border)] mt-16" stagger={90}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="border-r border-b border-[var(--border)] last:border-r-0 p-5 sm:p-7 flex flex-col items-center gap-3">
                <Spinner size={26} />
              </div>
            ))}
          </StaggerReveal>
        ) : leaderboard.length === 0 ? (
          <div className="card p-8 text-sm text-[var(--text-secondary)] text-center mt-12">
            Leaderboard data is currently unavailable.
          </div>
        ) : (
          <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 border border-[var(--border)] mt-16" stagger={90} variant="scale">
            {leaderboard.slice(0, 6).map((entry, idx) => {
              const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32']
              const color = idx < 3 ? podiumColors[idx] : 'var(--accent)'
              const handle = entry.handle || entry.name || 'Anonymous'
              const displayHandle = handle.length > 14 ? `${handle.slice(0, 12)}…` : handle
              const rankLabel = entry.rank || 'Operator'
              return (
                <div
                  key={entry.id || entry.handle || idx}
                  className="border-r border-b border-[var(--border)] last:border-r-0 p-5 sm:p-7 flex flex-col items-center gap-3 relative overflow-hidden group hover:bg-[var(--bg-secondary)] transition-colors duration-200"
                  style={{ borderTopColor: color, borderTopWidth: 2 }}
                >
                  {/* Position badge */}
                  <div
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center font-mono text-[10px] font-bold z-10 border"
                    style={{ background: `${color}20`, color, borderColor: `${color}50` }}
                  >
                    {idx + 1}
                  </div>
                  <div className="relative z-10">
                    <Avatar
                      username={handle}
                      size="lg"
                      src={entry.avatarUrl}
                      seed={resolveAvatarSeed({
                        id: entry.id,
                        _id: entry.userId,
                        email: entry.email,
                        handle,
                        name: entry.name,
                      })}
                    />
                  </div>
                  <p className="font-mono font-bold text-[var(--text-primary)] text-sm text-center relative z-10 truncate max-w-[140px]" title={handle}>
                    {displayHandle}
                  </p>
                  <p className="text-xs font-mono text-[var(--text-muted)] relative z-10">{rankLabel}</p>
                  <p className="text-xs font-mono relative z-10" style={{ color }}>
                    {Number(entry.totalXp || 0).toLocaleString()} CP
                  </p>
                </div>
              )
            })}
          </StaggerReveal>
        )}
      </div>
    </section>
  )
}
