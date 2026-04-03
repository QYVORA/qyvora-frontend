import { Link } from 'react-router-dom'
import { PHASES_SECTION_BG, PHASE_IMGS, PHASE_ICONS } from '@/features/marketing/data/landingData'
import { SectionHeader, Skeleton } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'

export function PhasesSection({ items = [], loading = false }) {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const enrollTo = user ? '/bootcamp' : '/login'
  const overlayFilter = isDark ? 'brightness(0.2) saturate(0.5)' : 'brightness(0.85) saturate(0.7)'
  const overlayOpacity = isDark ? 'opacity-40' : 'opacity-20'
  const iconBackdrop = 'none'
  const badgeBackdrop = 'none'
  return (
    <section className="py-32 px-6 bg-[var(--bg-secondary)] relative" id="phases">
      <div
        className={`absolute inset-0 pointer-events-none ${overlayOpacity}`}
        style={{
          backgroundImage: `url(${PHASES_SECTION_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: overlayFilter,
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <SectionHeader
            kicker="// bootcamps"
            title="Bootcamps Built for Operators"
            subtitle="Choose a track, commit to the grind, and earn your way through."
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden flex flex-col" style={{ borderRadius: '18px' }}>
                <div className="relative h-48 overflow-hidden shrink-0">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-[var(--border)]" />
                </div>
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">Bootcamps will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => {
              const Icon = PHASE_ICONS[i % PHASE_ICONS.length]
              const accent = ['#3A3F8F', '#0EA5E9', '#22C55E', '#B8860B', '#6D28D9'][i % 5]
              const cover = item.image || PHASE_IMGS[i % PHASE_IMGS.length]
              return (
                <div
                  key={item.id}
                  className="card overflow-hidden flex flex-col group cursor-default hover:shadow-2xl transition-all duration-400"
                  style={{ borderColor: `${accent}35`, borderRadius: '18px' }}
                >
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img
                      src={cover}
                      alt={item.title || 'Bootcamp'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'brightness(0.4) saturate(1.3)' }}
                    />
                    <div
                      className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                      style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border"
                        style={{
                          background: `${accent}20`,
                          borderColor: `${accent}50`,
                          backdropFilter: iconBackdrop,
                        }}
                      >
                        <Icon size={28} style={{ color: accent }} />
                      </div>
                    </div>
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

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-3">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                      {item.description || 'Curated offensive security track built for real-world mastery.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                      {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                      {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
                      {item.priceLabel && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.priceLabel}</span>}
                    </div>
                    <Link to={enrollTo} className="btn-primary mt-5 inline-flex items-center justify-center">
                      Enroll
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
