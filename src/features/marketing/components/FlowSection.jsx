import { Spinner } from '@/shared/components/ui'
import { HOW_IT_WORKS_IMGS, PHASE_IMGS, FLOW_STEPS } from '@/features/marketing/data/landingData'
import { Users, BookOpen, Coins, ShoppingBag, Activity } from 'lucide-react'

export function FlowSection({ stats, loading = false, leaderboard = [], loadingLeaderboard = false }) {
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const isLoading = loading || loadingLeaderboard

  const statItems = [
    { label: 'Students Trained', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained, icon: Users, img: HOW_IT_WORKS_IMGS[0] },
    { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount, icon: BookOpen, img: PHASE_IMGS[0] },
    { label: 'Active Users', value: stats?.stats?.pentestersActive, icon: Activity, img: HOW_IT_WORKS_IMGS[1] },
    { label: 'CP In Circulation', value: totalCp, icon: Coins, img: HOW_IT_WORKS_IMGS[2] },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount, icon: ShoppingBag, img: HOW_IT_WORKS_IMGS[3] },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 relative border-t border-accent/10" id="how-it-works">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// how it works</p>
          <h2 className="font-mono font-black text-3xl sm:text-4xl text-[var(--text-primary)]">The Operator Pipeline</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-xl leading-relaxed">
            Five steps from zero to zero-day. Join, train, validate, earn, and unlock.
          </p>
        </div>

        {/* Steps — horizontal bordered list */}
        <div className="border border-[var(--border)] mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-5">
            {FLOW_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col gap-4 p-6 border-b sm:border-b-0 sm:border-r border-[var(--border)] last:border-0 relative group hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                {/* Step number */}
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon box */}
                <div className="w-10 h-10 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
                  <step.icon size={18} />
                </div>

                {/* Text */}
                <div>
                  <p className="font-mono font-bold text-sm text-[var(--text-primary)]">{step.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{step.desc}</p>
                </div>

                {/* Connector arrow — desktop only */}
                {i < FLOW_STEPS.length - 1 && (
                  <span className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-accent/40 text-lg z-10">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live stats label */}
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">// live platform stats</p>

        {/* Stats grid */}
        {isLoading ? (
          <div className="border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center h-48 border-b sm:border-b-0 sm:border-r border-[var(--border)] last:border-0">
                <Spinner size={24} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {statItems.map((item, i) => (
              <div
                key={item.label}
                className="group relative overflow-hidden border-b sm:border-b-0 sm:border-r border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col gap-3 h-full min-h-[160px] justify-between">
                  <div className="w-9 h-9 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-2xl text-accent leading-none">
                      {Number(item.value || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">{item.label}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mt-1">Live</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
