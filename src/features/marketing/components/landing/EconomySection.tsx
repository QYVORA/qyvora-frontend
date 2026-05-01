import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { resolveImg } from './helpers';
import type { MarketplaceItem } from './types';
import CpLogo from '../../../../shared/components/CpLogo';
import ChainLogo from '../../../../shared/components/ChainLogo';

interface EconomySectionProps {
  totalCp: number;
  marketItems: MarketplaceItem[];
  loading?: boolean;
}

const BULLETS = [
  'Complete bootcamps to earn points',
  'Finish challenges to earn more points',
  'Build your rank on the leaderboard',
  'Spend points in the marketplace',
];

const EconomySection: React.FC<EconomySectionProps> = ({ totalCp, marketItems, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayedItems = marketItems.slice(0, 2);

  return (
    <section className="py-16 md:py-24 bg-bg relative isolate has-bg-image">
      <img
        src="/assets/sections/backgrounds/proprietary-tooling-bg.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.10] md:opacity-[0.13] pointer-events-none"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 scanlines light-theme-hide-bg-overlay opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">

          {/* Left: description */}
          <div className="lg:col-span-5">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE ECONOMY</span>
              <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-5">Zero-Day Market</h2>
              <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">
                Earn Cyber Points by completing bootcamps and challenges. Use <CpLogo className="w-4 h-4 mx-1 inline-block" /> in the marketplace and track your progress on the leaderboard.
              </p>
              <Link
                to="/chain"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 rounded-md px-4 py-2 mb-6 hover:bg-accent-dim transition-all"
              >
                CP &amp; Chain <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Animated bullet list */}
              <ul className="flex flex-col space-y-2.5 mb-6">
                {BULLETS.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 text-text-primary font-medium text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent flex-none" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              {/* Chain badge */}
              <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5 w-fit">
                <ChainLogo size={18} />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Verified by HSOCIETY Chain</span>
              </div>

              {/* CP widget */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-5 bg-accent-dim border border-accent/20 rounded-lg relative overflow-hidden group cursor-default"
              >
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                  <img src="/assets/branding/logos/cyber-points-logo.png" alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                </div>
                {/* Phase badge illustration */}
                <img
                  src="/assets/illustrations/phase-complete-badge.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute bottom-2 right-2 w-14 h-14 object-contain opacity-60 pointer-events-none select-none"
                />
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">OPERATOR_WALLET</div>
                <div className="text-2xl md:text-3xl font-bold text-accent font-mono mb-3 inline-flex items-center gap-2">
                  {totalCp.toLocaleString()} <CpLogo className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-dim/60 flex items-center justify-center border border-accent/30 flex-none">
                    <Trophy className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-text-primary uppercase">Community Points Pool</div>
                    <div className="w-full h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, totalCp > 0 ? 70 : 0)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Right: market items */}
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
                <motion.div
                  key={prod.id || idx}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                >
                  <div className="card-hsociety p-3 md:p-4 flex flex-col h-full">
                    <div className="relative overflow-hidden rounded mb-3">
                      <img
                        src={resolveImg(prod.coverUrl, '/assets/sections/how-it-works/engagements-completed.webp')}
                        alt=""
                        className="w-full h-24 md:h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-text-primary mb-2 line-clamp-1">{prod.title}</h4>
                    <div className="mt-auto flex flex-col gap-2">
                      <span className="text-xs font-mono text-accent py-0.5 px-2 bg-accent-dim border border-accent/20 rounded w-fit inline-flex items-center gap-1">
                        {prod.cpPrice ?? 0} <CpLogo className="w-3.5 h-3.5" />
                      </span>
                      <Link
                        to="/zero-day-market"
                        className="w-full py-2 bg-accent text-bg font-bold text-[10px] uppercase tracking-tighter rounded hover:brightness-110 text-center block transition-all"
                      >
                        View in Market
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EconomySection;
