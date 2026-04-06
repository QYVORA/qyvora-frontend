import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'

export function LiveTickerSection({ leaderboard = [], loading = false }) {
  const { isDark } = useTheme()
  const totalXp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const totalCp = totalXp
  const glow = isDark ? 'bg-accent/10' : 'bg-accent/20'

  return (
    <section className="py-28 px-6 relative section-gradient" id="live-ticker">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-10 right-10 w-72 h-72 rounded-full blur-3xl ${glow}`} />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
        <div>
          <SectionHeader
            kicker="// operator economy"
            title="XP & CP Live Ticker"
            subtitle="Live totals pulled from operator activity across the platform."
            align="left"
          />
          <p className="text-[var(--text-secondary)] text-base leading-relaxed mt-5">
            See how the operator economy moves in real-time. XP converts directly into CP, so the
            entire ecosystem scales with community output.
          </p>
        </div>
        <div className="card p-8 border border-accent/25 text-left">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Operator Economy</p>
          <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-4">Live Leaderboard Totals</h3>
          {loading ? (
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Spinner size={24} />
              <span className="text-sm font-mono">Loading stats...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Total XP Tracked</span>
                <span className="font-mono text-lg text-accent">{Number(totalXp).toLocaleString()} XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">CP In Circulation</span>
                <span className="font-mono text-lg text-[var(--text-primary)]">{Number(totalCp).toLocaleString()} CP</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Live leaderboard totals from active operators.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
