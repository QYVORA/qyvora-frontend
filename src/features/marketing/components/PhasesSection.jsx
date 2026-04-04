import { Link, useNavigate } from 'react-router-dom'
import { PHASES_SECTION_BG, PHASE_IMGS, PHASE_ICONS } from '@/features/marketing/data/landingData'
import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { API_ORIGIN } from '@/core/services/api'

export function PhasesSection({ items = [], loading = false }) {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const enrollTo = user ? '/bootcamp' : '/login'
  const overlayFilter = isDark ? 'brightness(0.2) saturate(0.5)' : 'brightness(0.85) saturate(0.7)'
  const overlayOpacity = isDark ? 'opacity-40' : 'opacity-20'
  const iconBackdrop = 'none'
  const badgeBackdrop = 'none'
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
    <section className="py-32 px-6 bg-[var(--bg-secondary)] relative" id="bootcamps">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <SectionHeader
            kicker="// bootcamps"
            title="Bootcamps Built for Operators"
            subtitle="Choose a track, commit to the grind, and earn your way through."
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-10 justify-center">
            <div className="card overflow-hidden flex flex-col lg:flex-row w-full max-w-5xl mx-auto" style={{ borderRadius: '18px' }}>
              <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0 flex items-center justify-center">
                <Spinner size={28} />
              </div>
              <div className="p-6 lg:p-8 flex flex-col flex-1 items-center justify-center">
                <Spinner size={24} />
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">Bootcamps will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 justify-center">
            {items.map((item, i) => {
              const Icon = PHASE_ICONS[i % PHASE_ICONS.length]
              const accent = ['#3A3F8F', '#0EA5E9', '#22C55E', '#B8860B', '#6D28D9'][i % 5]
              const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
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
