import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { CP_COIN, CP_MARKET_BG } from '@/features/marketing/data/landingData'
import { SectionHeader, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { StaggerReveal } from '@/features/marketing/components/ScrollReveal'

export function MarketplaceSection({ items = [], stats, loading = false, rewards }) {
  const { isDark } = useTheme()
  const previewItems = items.slice(0, 3)
  const earnedCp = rewards?.totals?.cp || 0
  return (
    <section className="py-32 px-6 relative section-gradient" id="marketplace">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col">
            <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 mb-8 shrink-0">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Spinner size={28} />
                </div>
              ) : (
                <img
                  src={CP_MARKET_BG}
                  alt="Zero-Day Market"
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.5) saturate(1.2)' }}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">Zero-Day<br />Market</p>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-[var(--bg-primary)] text-xs font-bold font-mono">
                LIVE
              </div>
            </div>

            <SectionHeader
              kicker="// economy"
              title="CP Wallet & Zero-Day Market"
              subtitle=""
              align="left"
            />
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6 mt-5">
              Earn Captured Points (CP) by completing modules, challenges, and phases. Spend them in the Zero-Day Market to unlock premium tools, playbooks, frameworks, and exploit research created by the community.
            </p>
            <div className="card p-4 mb-6 border border-accent/25">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">CP Wallet (Preview)</p>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {Number(earnedCp).toLocaleString()} CP
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                CP totals update as you complete milestones and earn rewards.
              </p>
            </div>
            <StaggerReveal as="ul" className="space-y-4" stagger={80}>
              {[
                'Earn CP for every module you complete',
                'Bonus rewards for phase completions',
                'Purchase tools, PDFs, and exploit kits',
                'Exclusive items locked to higher ranks',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight size={11} className="text-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </StaggerReveal>
            <Link to="/register" className="btn-primary mt-8 inline-flex items-center gap-2 self-start">
              Open Your Wallet <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <div className="relative w-full">
              <div className="absolute -top-3 -right-3 bg-accent text-[var(--bg-primary)] text-xs font-bold font-mono px-3 py-1.5 rounded-full shadow-lg z-30">
                ZERO-DAY MARKET
              </div>
              <div className="card p-8 border-accent/25 shadow-2xl shadow-accent/8 rounded-2xl relative overflow-hidden">
                <div className={`absolute -right-12 -bottom-12 w-64 h-64 pointer-events-none rotate-12 ${isDark ? 'opacity-10' : 'opacity-25'}`}>
                  <img src={CP_COIN} alt="" className="w-full h-full object-contain" loading="lazy" decoding="async" />
                </div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div>
                    <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">Marketplace</p>
                    {loading ? (
                      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <Spinner size={24} />
                        <span className="text-xs font-mono">Loading stats...</span>
                      </div>
                    ) : (
                      <>
                    <p className="font-display font-black text-4xl sm:text-5xl text-accent">
                          {Number(items.length || 0).toLocaleString()}
                          <span className="text-xl text-[var(--text-muted)]"> Items</span>
                        </p>
                        {stats?.stats?.learnersTrained !== undefined && (
                          <p className="text-xs text-[var(--text-secondary)] mt-2">
                            {Number(stats.stats.learnersTrained).toLocaleString()} learners trained
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center overflow-hidden">
                    <img src={CP_COIN} alt="CP Coin" className="w-10 h-10 object-contain" loading="lazy" decoding="async" />
                  </div>
                </div>

                <StaggerReveal className="space-y-1 mb-6" stagger={70} variant="left">
                  {loading ? (
                    <div className="flex items-center gap-3 text-[var(--text-secondary)] py-3">
                      <Spinner size={22} />
                      <span className="text-xs font-mono">Loading items...</span>
                    </div>
                  ) : previewItems.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)]">No marketplace items available yet.</div>
                  ) : (
                    previewItems.map((item) => (
                      <div key={item._id || item.id} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
                        <span className="text-sm text-[var(--text-secondary)]">{item.title}</span>
                        <span className="text-sm font-mono font-bold text-accent">{item.cpPrice} CP</span>
                      </div>
                    ))
                  )}
                </StaggerReveal>

                <div className="rounded-xl overflow-hidden border border-accent/20">
                  <div className="bg-accent/8 px-4 py-2 border-b border-accent/20 flex items-center justify-between">
                    <span className="text-xs font-mono text-accent uppercase tracking-widest">Recent Market Items</span>
                    <ChevronRight size={12} className="text-accent" />
                  </div>
                  {loading ? (
                    <div className="px-4 py-4 flex items-center gap-3 text-[var(--text-secondary)]">
                      <Spinner size={22} />
                      <span className="text-xs font-mono">Loading items...</span>
                    </div>
                  ) : previewItems.length === 0 ? (
                    <div className="px-4 py-4 text-xs text-[var(--text-muted)]">No listings yet.</div>
                  ) : (
                    <StaggerReveal className="divide-y divide-[var(--border)]" stagger={70} variant="right">
                      {previewItems.map(item => (
                        <div key={item._id || item.id} className="flex items-center justify-between px-4 py-3">
                          <span className="text-xs text-[var(--text-secondary)]">{item.title}</span>
                          <span className="text-xs font-mono font-bold text-accent">{item.cpPrice} CP</span>
                        </div>
                      ))}
                    </StaggerReveal>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
