import { Link } from 'react-router-dom'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'
import { SectionHeader, Spinner, Skeleton } from '@/shared/components/ui'
import { useAuth } from '@/core/contexts/AuthContext'
import { API_ORIGIN } from '@/core/services/api'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function PhasesSection({ items = [], loading = false }) {
  const { user } = useAuth()
  const badgeBackdrop = 'none'
  const bootcampStatus = user?.bootcampStatus || 'not_enrolled'
  const isEnrolled = bootcampStatus !== 'not_enrolled'
  const resolveImageUrl = (value) => {
    const src = String(value || '').trim()
    if (!src) return ''
    if (src.startsWith('data:')) return src
    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('//')) return `${window.location.protocol}${src}`
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src.replace(/^\/+/, '')}`
  }
  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative section-gradient border-y border-[var(--border)]/40" id="bootcamps">
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
          <StaggerReveal className="grid grid-cols-1 gap-10 justify-center" stagger={140} variant="scale">
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
                <div
                  key={item.id}
                  className="card overflow-hidden flex flex-col lg:flex-row group cursor-default hover:shadow-2xl transition-all duration-400 w-full max-w-5xl mx-auto"
                  style={{ borderColor: `${accent}35`, borderRadius: '18px' }}
                >
                  <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0">
                    <img
                      src={cover}
                      alt={item.title || 'Bootcamp'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-widest border"
                      style={{
                        color: accent,
                        borderColor: `${accent}50`,
                        background: `${accent}15`,
                        backdropFilter: badgeBackdrop,
                      }}
                    >
                      BOOTCAMP
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-3">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                      {item.description || 'Curated offensive security track built for real-world mastery.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                      {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                      {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
                      {item.priceLabel && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.priceLabel}</span>}
                    </div>
                    <Link to={ctaTarget} className="btn-primary mt-5 inline-flex items-center justify-center">
                      Enroll
                    </Link>
                  </div>
                </div>
              )
            })}
          </StaggerReveal>
        )}
      </div>
    </section>
  )
}
