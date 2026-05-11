import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trophy, ArrowRight, CheckCircle2, BookOpen, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { CardMedia, CardBase } from '../../../../shared/components/ui/Card';
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

const CP_FEATURES = [
  { icon: BookOpen, title: 'Complete Bootcamp Rooms', desc: 'Finish room tasks in any module to earn CP instantly.' },
  { icon: Shield,   title: 'Capture CTF Flags',      desc: 'Submit correct flags for immediate CP rewards.' },
  { icon: Trophy,   title: 'Climb the Leaderboard',   desc: 'Consistent activity and completions grow your rank.' },
];

const EconomySection: React.FC<EconomySectionProps> = ({ totalCp, marketItems, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="
      pt-28 pb-14 md:py-16 bg-bg relative isolate has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <img
        src="/assets/sections/backgrounds/proprietary-tooling-bg.webp"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.10] md:opacity-[0.13] pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 scanlines light-theme-hide-bg-overlay opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">

          {/* Left: description + CP features */}
          <div>
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-2 block">// THE ECONOMY</span>
              <h2 className="text-3xl lg:text-4xl text-text-primary font-bold mb-4">
                Cyber Points &amp; Zero-Day Market
              </h2>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Earn <CpLogo className="w-4 h-4 mx-0.5 inline-block align-middle" /> by completing bootcamp rooms
                and CTF challenges. Every transaction is recorded on the{' '}
                <span className="text-accent font-bold">HSOCIETY Chain</span> — tamper-proof and verifiable.
              </p>

              {/* Chain badge */}
              <div className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-accent/20 bg-accent/5 w-fit">
                <ChainLogo size={14} />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                  Verified by HSOCIETY Chain
                </span>
              </div>

              {/* CP Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {CP_FEATURES.map((feat, i) => (
                  <ScrollReveal key={feat.title} delay={i * 0.05}>
                    <CardBase className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent-dim flex items-center justify-center">
                        <feat.icon className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-xs font-black text-text-primary">{feat.title}</p>
                      <p className="text-[10px] text-text-muted leading-relaxed">{feat.desc}</p>
                    </CardBase>
                  </ScrollReveal>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 rounded-md px-4 py-2 hover:bg-accent-dim transition-all"
              >
                Start Earning <ArrowRight className="w-3 h-3" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: Chain (left) + CP coin (right) side-by-side */}
          <ScrollReveal className="flex flex-col items-center gap-6" direction="none" delay={0.1}>
            {/* Combined visual wrapper */}
            <div className="relative flex items-center justify-center w-full max-w-[500px] h-40 md:h-48">

              {/* HSOCIETY Chain image — left side, positioned behind */}
              <div className="absolute left-[-10%] md:left-0 z-0 w-[55%] h-full">
                <motion.img
                  src="/assets/branding/chain/hsociety-chain-3d.webp"
                  alt="HSOCIETY Chain"
                  className="w-full h-full object-contain drop-shadow-[0_0_40px_var(--color-accent-glow)]"
                  animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Cyber Points coin — right side, in front */}
              <div className="relative z-10 ml-auto mr-0 md:mr-[5%] w-32 h-32 md:w-40 md:h-40">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%)' }}
                />
                <motion.img
                  src="/assets/branding/logos/cyber-points-logo.webp"
                  alt="Cyber Points"
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 48px var(--color-accent-glow))' }}
                  animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Pool widget */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xs p-4 bg-accent-dim border border-accent/20 rounded-lg relative overflow-hidden"
            >
              <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-1">Community Pool</div>
              <div className="text-2xl font-bold text-accent font-mono mb-2 inline-flex items-center gap-1.5">
                {totalCp.toLocaleString()} <CpLogo className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-dim/60 flex items-center justify-center border border-accent/30 flex-none">
                  <Trophy className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-text-primary uppercase">Total Earned</div>
                  <div className="w-full h-1 bg-border rounded-full mt-1 overflow-hidden">
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
      </div>
    </section>
  );
};

export default EconomySection;
