import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { Activity, Coins, BookOpen, ShoppingBag, TrendingUp } from 'lucide-react'

export function LiveTickerSection({ leaderboard = [], loading = false, stats }) {
  const { isDark } = useTheme()
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)

  const statRows = [
    {
      label: 'CP In Circulation',
      value: `${Number(totalCp).toLocaleString()}`,
      unit: 'CP',
      icon: Coins,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/20',
    },
    {
      label: 'Active Operators',
      value: Number(stats?.stats?.pentestersActive || 0).toLocaleString(),
      unit: 'online',
      icon: Activity,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
    },
    {
      label: 'Bootcamps Live',
      value: Number(stats?.stats?.bootcampsCount || 0).toLocaleString(),
      unit: 'active',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
    {
      label: 'Zero-Day Products',
      value: Number(stats?.stats?.zeroDayProductsCount || 0).toLocaleString(),
      unit: 'listed',
      icon: ShoppingBag,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 relative border-t border-accent/10 overflow-hidden" id="live-ticker">

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-20 right-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-accent/8' : 'bg-accent/15'}`} />
        <div className={`absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-purple-500/6' : 'bg-purple-500/10'}`} />
      </div>

      <div className="max-w-6xl mx-auto relative">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-14">
          <SectionHeader
            kicker="// operator economy"
            title="CP Live Ticker"
            subtitle="Real-time CP flow across the platform — driven by operator activity."
            align="left"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 w-fit shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-accent tracking-widest uppercase">Live</span>
          </div>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-[var(--text-secondary)]">
            <Spinner size={24} />
            <span className="text-sm font-mono">Syncing operator data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {statRows.map(({ label, value, unit, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`relative group rounded-none border p-5 flex flex-col gap-4 bg-[var(--bg-secondary)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${bg}`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon size={16} className={color} />
                </div>

                {/* Value */}
                <div>
                  <p className={`font-mono text-2xl font-bold ${color} leading-none`}>{value}</p>
                  <p className="text-xs font-mono text-[var(--text-muted)] mt-1 uppercase tracking-widest">{unit}</p>
                </div>

                {/* Label */}
                <p className="text-xs text-[var(--text-secondary)] leading-snug">{label}</p>

                {/* Subtle corner accent */}
                <TrendingUp size={40} className={`absolute bottom-3 right-3 opacity-5 ${color}`} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom description bar */}
        <div className="rounded-none border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
            The CP economy is operator-driven — every module completed, challenge solved, and engagement closed moves the ticker.
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)] shrink-0">
            ● Updates with operator activity
          </p>
        </div>

      </div>
    </section>
  )
}
