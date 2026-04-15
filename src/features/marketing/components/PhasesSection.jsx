import { Link } from 'react-router-dom'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'
import { SectionHeader, Spinner, Skeleton } from '@/shared/components/ui'
import { useAuth } from '@/core/contexts/AuthContext'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function PhasesSection({ items = [], loading = false }) {
  const { user } = useAuth()
  const bootcampStatus = user?.bootcampStatus || 'not_enrolled'
  const isEnrolled = bootcampStatus !== 'not_enrolled'
  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative" id="bootcamps">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <SectionHeader
            kicker="// bootcamps"
            title="Bootcamps Built for Operators"
            subtitle="Choose a track, commit to the grind, and earn your way through."
          />
        </div>

        {loading ? (
          <StaggerReveal className="grid grid-cols-1 gap-10 justify-center" stagger={140}>
            <div className="card overflow-hidden flex flex-col lg:flex-row w-full max-w-5xl mx-auto" style={{ borderRadius: '18px' }}>
              <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0 flex items-center justify-center">
                <Spinner size={28} />
              </div>
              <div className="p-6 lg:p-8 flex flex-col flex-1 justify-center gap-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </StaggerReveal>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">Bootcamps will appear here soon.</p>
          </div>
        ) : (
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={120} variant="scale">
            {items.map((item, i) => {
              const accent = 'var(--accent)'
              const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
              const bootcampId = item.id
              const loginTarget = bootcampId
                ? `/login?intent=bootcamp&bootcampId=${encodeURIComponent(bootcampId)}`
                : '/login?intent=bootcamp'
              const enrolledTarget = bootcampId ? `/bootcamp/${bootcampId}` : '/bootcamp'
              const ctaTarget = user ? (isEnrolled ? enrolledTarget : '/bootcamp') : loginTarget
              return (
                <Link key={item.id} to={ctaTarget} className="block">
                  <div className="card overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ willChange: 'transform' }}>
                    <div className="relative h-36 bg-[var(--bg-secondary)] overflow-hidden">
                    <img
                      src={cover}
                      alt={item.title || 'Bootcamp'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                          <div className="w-6 h-6 rounded-full" style={{ background: `${accent}40` }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] truncate">{item.title}</h3>
                          <p className="text-xs text-[var(--text-muted)]">{item.level || 'Beginner'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {item.description || 'Curated offensive security track built for real-world mastery.'}
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.2em] font-mono text-accent">
                        {item.duration && <span>{item.duration}</span>}
                        {item.priceLabel && <span>• {item.priceLabel}</span>}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent">Enroll →</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </StaggerReveal>
        )}
      </div>
    </section>
  )
}
