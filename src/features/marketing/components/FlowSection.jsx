import { SectionHeader, Spinner } from '@/shared/components/ui'
import { HOW_IT_WORKS_IMGS, PHASE_IMGS, FLOW_STEPS } from '@/features/marketing/data/landingData'
import { Users, BookOpen, Coins, ShoppingBag, Activity } from 'lucide-react'

export function FlowSection({ stats, loading = false, leaderboard = [], loadingLeaderboard = false }) {
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const isLoading = loading || loadingLeaderboard

  // Platform stats cards
  const statItems = [
    { label: 'Students Trained', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained, icon: Users, img: HOW_IT_WORKS_IMGS[0] },
    { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount, icon: BookOpen, img: PHASE_IMGS[0] },
    { label: 'Active Users', value: stats?.stats?.pentestersActive, icon: Activity, img: HOW_IT_WORKS_IMGS[1] },
    { label: 'CP In Circulation', value: totalCp, icon: Coins, img: HOW_IT_WORKS_IMGS[2] },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount, icon: ShoppingBag, img: HOW_IT_WORKS_IMGS[3] },
  ]

  return (
    <section className="py-32 px-6 relative border-t border-accent/10">
      <div className="max-w-7xl mx-auto">
        {/* Section header — title now matches the flow steps content */}
        <div className="mb-16">
          <SectionHeader
            kicker="// how it works"
            title="The Operator Pipeline"
            subtitle="Join, train, validate, earn, and unlock — five steps from zero to zero-day."
          />
        </div>

        {/* Step flow — uses FLOW_STEPS data so title and content match */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center gap-3 relative">
              {/* horizontal connector — desktop only */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-accent/40 to-transparent" />
              )}
              {/* vertical connector — mobile/tablet */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="lg:hidden absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-accent/40 to-transparent" />
              )}
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0 relative z-10">
                <step.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-widest">{String(i + 1).padStart(2, '0')}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{step.label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live platform stats carousel */}
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">// live platform stats</p>
        </div>
        <div className="stats-marquee-wrapper">
          <div className="stats-marquee">
            <div className="stats-marquee-track">
              {isLoading
                ? Array.from({ length: statItems.length || 4 }).map((_, i) => (
                  <div key={i} className="stats-card overflow-hidden flex flex-col items-center justify-center h-64 min-w-[260px] sm:min-w-[300px] lg:min-w-[320px] shrink-0">
                    <Spinner size={28} />
                  </div>
                ))
                : statItems.map((step, i) => (
                  <div
                    key={step.label}
                    className="stats-card overflow-hidden flex flex-col group transition-all duration-300 min-w-[260px] sm:min-w-[300px] lg:min-w-[320px] shrink-0"
                  >
                    <div className="relative h-44 overflow-hidden shrink-0">
                      <img
                        src={step.img}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: 'brightness(0.8) saturate(1.05)' }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[var(--bg-primary)] text-accent border border-accent/40 font-bold font-mono text-xs flex items-center justify-center shadow-lg">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)]/85 border border-accent/30 flex items-center justify-center shadow-xl">
                          <step.icon size={26} className="text-accent" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-2 flex-1 text-left">
                      <p className="text-base font-semibold text-[var(--text-primary)]">{step.label}</p>
                      <p className="text-2xl font-mono font-semibold text-accent leading-tight">
                        {Number(step.value || 0).toLocaleString()}
                      </p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Live</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
