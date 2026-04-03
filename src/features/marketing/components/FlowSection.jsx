import { SectionHeader, Spinner } from '@/shared/components/ui'
import { HOW_IT_WORKS_IMGS } from '@/features/marketing/data/landingData'
import { Users, Target, Zap, Database } from 'lucide-react'

export function FlowSection({ stats, loading = false }) {
  const items = [
    { label: 'Learners Trained', value: stats?.stats?.learnersTrained, icon: Users, img: HOW_IT_WORKS_IMGS[0] },
    { label: 'Pentesters Active', value: stats?.stats?.pentestersActive, icon: Target, img: HOW_IT_WORKS_IMGS[1] },
    { label: 'Engagements Completed', value: stats?.stats?.engagementsCompleted, icon: Zap, img: HOW_IT_WORKS_IMGS[2] },
    { label: 'Findings Identified', value: stats?.stats?.vulnerabilitiesIdentified, icon: Database, img: HOW_IT_WORKS_IMGS[3] },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden flex flex-col items-center justify-center h-64" style={{ borderRadius: '16px' }}>
                <Spinner size={28} />
              </div>
            ))
            : items.map((step, i) => (
              <div
                key={step.label}
                className="card overflow-hidden flex flex-col group hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
                style={{ borderRadius: '16px' }}
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={step.img}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.55) saturate(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-accent text-[var(--bg-primary)] font-bold font-mono text-xs flex items-center justify-center shadow-lg">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)]/85 border border-accent/30 flex items-center justify-center shadow-xl">
                      <step.icon size={26} className="text-accent" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-2 flex-1 text-center">
                  <p className="font-display font-bold text-lg text-[var(--text-primary)]">{step.label}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {Number(step.value || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
