import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { Activity, Coins, BookOpen, ShoppingBag } from 'lucide-react'

export function LiveTickerSection({ leaderboard = [], loading = false, stats }) {
  const { isDark } = useTheme()
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const glow = isDark ? 'bg-accent/10' : 'bg-accent/20'

  const statRows = [
    { label: 'CP In Circulation', value: `${Number(totalCp).toLocaleString()} CP`, icon: Coins },
    { label: 'Active Operators', value: Number(stats?.stats?.pentestersActive || 0).toLocaleString(), icon: Activity },
    { label: 'Bootcamps Live', value: Number(stats?.stats?.bootcampsCount || 0).toLocaleString(), icon: BookOpen },
    { label: 'Zero-Day Products', value: Number(stats?.stats?.zeroDayProductsCount || 0).toLocaleString(), icon: ShoppingBag },
  ]

  return (
    <section className="py-20 px-6 relative section-gradient border-t border-accent/10" id="live-ticker">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-10 right-10 w-72 h-72 rounded-full blur-3xl ${glow}`} />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
        <div>
          <SectionHeader
            kicker="// operator economy"
            title="CP Live Ticker"
            subtitle="Live totals pulled from operator activity across the platform."
            align="left"
          />
          <p className="text-[var(--text-secondary)] text-base leading-relaxed mt-5">
            See how the operator economy moves in real-time as CP flows across the platform.
          </p>
        </div>
        <div className="card p-8 border-accent/25 text-left hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-5">Operator Economy</p>
          {loading ? (
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Spinner size={24} />
              <span className="text-sm font-mono">Loading stats...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statRows.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-secondary)] border border-accent/15 min-w-0">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] min-w-0">
                    <Icon size={14} className="text-accent shrink-0" />
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest leading-snug break-words">
                      {label}
                    </span>
                  </div>
                  <p className="font-mono text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight break-words">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-[var(--text-muted)] mt-4 font-mono">
            ● Live — updates with operator activity
          </p>
        </div>
      </div>
    </section>
  )
}
