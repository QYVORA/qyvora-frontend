import { SectionHeader, Spinner } from '@/shared/components/ui'
import { HOW_IT_WORKS_IMGS, PHASE_IMGS } from '@/features/marketing/data/landingData'
import { Users, BookOpen, Coins, ShoppingBag, Activity } from 'lucide-react'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function FlowSection({ stats, loading = false, leaderboard = [], loadingLeaderboard = false }) {
  const totalCp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const isLoading = loading || loadingLeaderboard
  const items = [
    { label: 'Students Trained', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained, icon: Users, img: HOW_IT_WORKS_IMGS[0] },
    { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount, icon: BookOpen, img: PHASE_IMGS[0] },
    { label: 'Active Users', value: stats?.stats?.pentestersActive, icon: Activity, img: HOW_IT_WORKS_IMGS[2] },
    { label: 'CP In Circulation', value: totalCp, icon: Coins, img: HOW_IT_WORKS_IMGS[2] },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount, icon: ShoppingBag, img: HOW_IT_WORKS_IMGS[3] },
  ]
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <SectionHeader
            kicker="// how it works"
            title="The Operator Pipeline"
            subtitle="Five steps from zero to zero-day researcher."
          />
        </div>

        <StaggerReveal className="stats-marquee stats-marquee--static" stagger={110}>
          <div className="stats-marquee-track stats-marquee-track--static">
            {isLoading
              ? Array.from({ length: items.length || 4 }).map((_, i) => (
                <div key={i} className="stats-card overflow-hidden flex flex-col items-center justify-center h-64 min-w-[260px] sm:min-w-[300px] lg:min-w-[320px] shrink-0">
                  <Spinner size={28} />
                </div>
              ))
              : items.map((step, i) => {
                return (
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
                        {String((i % items.length) + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)]/85 border border-accent/30 flex items-center justify-center shadow-xl">
                          <step.icon size={26} className="text-accent" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col gap-2 flex-1 text-left">
                      <p className="font-display font-bold text-lg text-[var(--text-primary)]">{step.label}</p>
                      <p className="text-2xl font-mono font-semibold text-accent leading-tight">
                        {Number(step.value || 0).toLocaleString()}
                      </p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Live</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </StaggerReveal>
      </div>
    </section>
  )
}
