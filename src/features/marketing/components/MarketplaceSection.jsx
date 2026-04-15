import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, FileText, ShoppingBag } from 'lucide-react'
import { CP_COIN, CP_MARKET_BG } from '@/features/marketing/data/landingData'
import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function MarketplaceSection({ items = [], loading = false, rewards }) {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const previewItems = items.slice(0, 4)
  const earnedCp = rewards?.totals?.cp || 0
  const buyHref = user
    ? (user.role === 'admin' ? '/admin/marketplace' : '/marketplace')
    : '/login?intent=marketplace'

  return (
    <section className="py-32 px-6 relative border-t border-accent/10" id="marketplace">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <SectionHeader
            kicker="// economy"
            title="CP Wallet & Zero-Day Market"
            subtitle="Earn CP by training. Spend it on real offensive security tools."
            align="left"
          />
          <Link to="/register" className="btn-primary inline-flex items-center gap-2 self-start lg:self-auto shrink-0">
            Open Your Wallet <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-none overflow-hidden h-52 sm:h-64 mb-12">
          {loading ? (
            <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <Spinner size={28} />
            </div>
          ) : (
            <img
              src={CP_MARKET_BG}
              alt="Zero-Day Market"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(1.2)' }}
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div className="flex flex-col gap-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-[var(--bg-primary)] text-xs font-bold font-mono w-fit">
                LIVE
              </div>
              <p className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">Zero-Day Market</p>
              <p className="text-white/70 text-sm leading-relaxed">
                {Number(items.length || 0).toLocaleString()} items available — tools, playbooks, exploit research
              </p>
            </div>
            <div className={`absolute right-8 sm:right-12 bottom-6 ${isDark ? 'opacity-15' : 'opacity-30'}`}>
              <img src={CP_COIN} alt="" className="w-24 h-24 object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>

        {/* Two-column layout: wallet info + product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">

          {/* Left — wallet card + feature list */}
          <div className="flex flex-col gap-6">
            <div className="card p-6 border-accent/25">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center">
                  <img src={CP_COIN} alt="CP" className="w-6 h-6 object-contain" loading="lazy" decoding="async" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">CP Wallet</p>
                  <p className="text-xl font-mono font-bold text-[var(--text-primary)]">
                    {Number(earnedCp).toLocaleString()} <span className="text-sm text-accent">CP</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                CP updates as you complete modules, phases, and challenges.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                'Earn CP for every module you complete',
                'Bonus rewards for phase completions',
                'Purchase tools, PDFs, and exploit kits',
                'Exclusive items locked to higher ranks',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight size={10} className="text-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — standalone product cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-6 flex flex-col gap-4 h-64 w-full max-w-sm sm:max-w-none">
                  <div className="h-32 rounded-xl bg-[var(--bg-secondary)] animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-[var(--bg-secondary)] animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-[var(--bg-secondary)] animate-pulse" />
                </div>
              ))}
            </div>
          ) : previewItems.length === 0 ? (
            <div className="card p-12 flex flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={36} className="text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-secondary)]">No marketplace items available yet.</p>
            </div>
          ) : (
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center" stagger={80} variant="scale">
              {previewItems.map((item) => {
                const priceValue = Number(item.cpPrice || 0)
                const priceLabel = `${priceValue.toLocaleString()} CP`
                return (
                  <div
                    key={item._id || item.id}
                    className="card overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300 w-full max-w-sm sm:max-w-none"
                  >
                  {/* Cover image — tall and prominent */}
                  <div className="relative h-44 bg-[var(--bg-secondary)] overflow-hidden shrink-0">
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={32} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-accent text-[var(--bg-primary)] text-[10px] font-bold font-mono uppercase tracking-widest">
                      {priceLabel}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-semibold text-base text-[var(--text-primary)] leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
                        {item.category || 'Tool'}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">{priceLabel}</span>
                    </div>
                    <Link
                      to={buyHref}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-none bg-accent text-[var(--bg-primary)] px-4 py-2.5 text-sm font-semibold shadow-lg shadow-accent/20 transition-all duration-200 hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <ShoppingBag size={14} />
                      Buy Now
                    </Link>
                  </div>
                </div>
                )
              })}
            </StaggerReveal>
          )}
        </div>
      </div>
    </section>
  )
}
