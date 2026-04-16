import { Spinner } from '@/shared/components/ui'
import { HOW_IT_WORKS_IMGS, PHASE_IMGS, FLOW_STEPS } from '@/features/marketing/data/landingData'
import { Users, BookOpen, Coins, ShoppingBag, Activity, TrendingUp } from 'lucide-react'

export function FlowSection({ stats, loading = false, leaderboard = [], loadingLeaderboard = false }) {
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const isLoading = loading || loadingLeaderboard

  const statItems = [
    {
      label: 'Students Trained',
      value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained,
      icon: Users,
      img: HOW_IT_WORKS_IMGS[0],
      unit: 'operators',
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/25',
    },
    {
      label: 'Bootcamps Live',
      value: stats?.stats?.bootcampsCount,
      icon: BookOpen,
      img: PHASE_IMGS[0],
      unit: 'active',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/25',
    },
    {
      label: 'Active Operators',
      value: stats?.stats?.pentestersActive,
      icon: Activity,
      img: HOW_IT_WORKS_IMGS[1],
      unit: 'online',
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/25',
    },
    {
      label: 'CP In Circulation',
      value: totalCp,
      icon: Coins,
      img: HOW_IT_WORKS_IMGS[2],
      unit: 'CP',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10 border-yellow-400/25',
    },
    {
      label: 'Zero-Day Products',
      value: stats?.stats?.zeroDayProductsCount,
      icon: ShoppingBag,
      img: HOW_IT_WORKS_IMGS[3],
      unit: 'listed',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/25',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 relative border-t border-accent/10" id="how-it-works">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// how it works</p>
            <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">The Operator Pipeline</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-xl leading-relaxed">
              Five steps from zero to zero-day. Join, train, validate, earn, and unlock.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/5 w-fit shrink-0">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono text-accent tracking-widest uppercase">Live</span>
          </div>
        </div>

        {/* ── Pipeline steps ── */}
        <div className="border border-[var(--border)] mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-5">
            {FLOW_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col gap-4 p-6 border-b sm:border-b-0 sm:border-r border-[var(--border)] last:border-0 relative group hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
                  <step.icon size={18} />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm text-[var(--text-primary)]">{step.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{step.desc}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <span className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-accent/40 text-lg z-10">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Live stats ── */}
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">// live platform stats</p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center h-40">
                <Spinner size={22} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statItems.map((item) => (
              <div
                key={item.label}
                className={`group relative overflow-hidden border flex flex-col gap-3 p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${item.bg}`}
              >
                {/* Faint background image */}
                <div className="absolute inset-0 pointer-events-none">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 to-transparent" />
                </div>

                {/* Icon */}
                <div className={`relative z-10 w-9 h-9 border flex items-center justify-center ${item.bg}`}>
                  <item.icon size={16} className={item.color} />
                </div>

                {/* Value */}
                <div className="relative z-10">
                  <p className={`font-mono text-2xl font-bold leading-none ${item.color}`}>
                    {Number(item.value || 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mt-1">{item.unit}</p>
                </div>

                {/* Label */}
                <p className="relative z-10 text-xs text-[var(--text-secondary)] leading-snug">{item.label}</p>

                {/* Decorative icon */}
                <TrendingUp size={36} className={`absolute bottom-3 right-3 opacity-[0.06] ${item.color}`} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-6 border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl">
            The CP economy is operator-driven — every module completed, challenge solved, and engagement closed moves the ticker.
          </p>
          <p className="text-xs font-mono text-[var(--text-muted)] shrink-0">● Updates with operator activity</p>
        </div>

      </div>
    </section>
  )
}
