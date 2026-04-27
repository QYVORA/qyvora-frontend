import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trophy, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { resolveImg } from './helpers';
import type { MarketplaceItem } from './types';
import CpLogo from '../../../../shared/components/CpLogo';

interface EconomySectionProps {
  totalCp: number;
  marketItems: MarketplaceItem[];
  loading?: boolean;
}

const EconomySection: React.FC<EconomySectionProps> = ({ totalCp, marketItems, loading = false }) => {
  const displayedItems = marketItems.slice(0, 2);

  return (
    <section className="py-16 md:py-24 bg-bg relative isolate">
      <img
        src="/images/section-backgrounds/offsec-grid-background.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.16] md:opacity-[0.2] pointer-events-none"
      />
      <div className="section-bg-overlay absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-[0.02] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">

          {/* Left: description */}
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE ECONOMY</span>
              <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-5">Zero-Day Market</h2>
              <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">
                Earn Cyber Points by completing bootcamps and challenges. Use <CpLogo className="w-4 h-4 mx-1" /> in the marketplace and track your progress on the leaderboard.
              </p>
              <Link
                to="/cyber-points"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 rounded-md px-4 py-2 mb-6 hover:bg-accent-dim transition-all"
              >
                Learn Cyber Points <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <ul className="flex flex-col space-y-3 mb-8">
                {[
                  'Complete bootcamps to earn points',
                  'Finish challenges to earn more points',
                  'Build your rank on the leaderboard',
                  'Spend points in the marketplace',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-primary font-medium text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent flex-none" /> {item}
                  </li>
                ))}
              </ul>

              {/* Community pool widget — fix #11: progress bar width is data-driven */}
              <div className="p-4 md:p-5 bg-accent-dim border border-accent/20 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:rotate-12 transition-transform pointer-events-none">
                  <img src="/images/cp-images/CYBER_POINTS_LOGO.png" alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">OPERATOR_WALLET</div>
                <div className="text-2xl md:text-3xl font-bold text-accent font-mono mb-3 inline-flex items-center gap-2">
                  {totalCp.toLocaleString()} <CpLogo className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  {/* L9: bg-accent-dim/60 + border-accent/30 — more visible in light mode */}
                  <div className="w-8 h-8 rounded-full bg-accent-dim/60 flex items-center justify-center border border-accent/30 flex-none">
                    <Trophy className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-text-primary uppercase">Community Points Pool</div>
                    {/* Fix #11: width is based on real data — capped at 100% */}
                    {/* L8: border instead of bg-bg for track — visible in both themes */}
                    <div className="w-full h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, totalCp > 0 ? 70 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: market items — fix #12: 2-col grid with exactly 2 items */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {loading || marketItems.length === 0 ? (
              [0, 1].map((i) => (
                <div key={i} className="card-hsociety p-3 md:p-4 animate-pulse">
                  <div className="w-full h-24 md:h-32 rounded bg-accent-dim/30 mb-3" />
                  <div className="h-3 bg-accent-dim/30 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-accent-dim/20 rounded w-1/3 mt-auto" />
                </div>
              ))
            ) : (
              displayedItems.map((prod, idx) => (
                <ScrollReveal key={prod.id || idx} delay={idx * 0.1}>
                  <div className="card-hsociety p-3 md:p-4 flex flex-col h-full">
                    <img
                      src={resolveImg(prod.coverUrl, '/images/how-it-works-section/Engagements-4Completed.webp')}
                      alt=""
                      className="w-full h-24 md:h-32 object-cover rounded mb-3"
                    />
                    <h4 className="text-xs md:text-sm font-bold text-text-primary mb-2 line-clamp-1">{prod.title}</h4>
                    <div className="mt-auto flex flex-col gap-2">
                      <span className="text-xs font-mono text-accent py-0.5 px-2 bg-accent-dim border border-accent/20 rounded w-fit inline-flex items-center gap-1">
                        {prod.cpPrice ?? 0} <CpLogo className="w-3.5 h-3.5" />
                      </span>
                      {/* Fix #10: public visitors go to /zero-day-market, not the auth-gated /marketplace */}
                      <Link
                        to="/zero-day-market"
                        className="w-full py-2 bg-accent text-bg font-bold text-[10px] uppercase tracking-tighter rounded hover:brightness-110 text-center block"
                      >
                        View in Market
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EconomySection;
