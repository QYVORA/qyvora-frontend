import { Link } from 'react-router-dom'
import { SectionHeader, Skeleton } from '@/shared/components/ui'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function RoomsPreviewSection({ items = [], loading = false }) {
  // Don't render the section at all if not loading and no rooms
  if (!loading && items.length === 0) return null

  return (
    <section className="py-32 px-6 bg-[var(--bg-primary)] relative border-t border-accent/10" id="rooms">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <SectionHeader
            kicker="// rooms"
            title="Self-Paced Rooms"
            subtitle="Hands-on labs and content you can complete at your own pace."
          />
        </div>

        {loading ? (
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={120}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6 space-y-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </StaggerReveal>
        ) : (
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={120} variant="scale">
            {items.slice(0, 3).map((room) => {
              const accent = room.accentColor || 'var(--accent)'
              const cover = resolveImageUrl(room.coverImage)
              const logo = resolveImageUrl(room.logoUrl)
              return (
                <Link key={room.id} to="/login?intent=rooms" className="block">
                  <div className="card overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ willChange: 'transform' }}>
                    <div className="relative h-36 bg-[var(--bg-secondary)] overflow-hidden">
                      {cover ? (
                        <img
                          src={cover}
                          alt={room.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs font-mono uppercase tracking-[0.2em]">
                          Room Briefing
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--bg-secondary)] border border-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                          {logo ? (
                            <img src={logo} alt="Room logo" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-6 h-6 rounded-full" style={{ background: `${accent}40` }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] truncate">{room.title}</h3>
                          <p className="text-xs text-[var(--text-muted)]">{room.level || 'Beginner'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {room.description || 'Room description coming soon.'}
                      </p>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-accent">View room →</div>
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
