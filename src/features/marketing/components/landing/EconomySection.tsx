import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import type { MarketplaceItem } from './types';
import CpLogo from '../../../../shared/components/CpLogo';
import ChainLogo from '../../../../shared/components/ChainLogo';
import BinaryStreamBackground from '../../../../shared/components/BinaryStreamBackground';

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

const EconomySection: React.FC<EconomySectionProps> = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="
      ascii-section pt-28 pb-24 md:py-16 bg-bg relative isolate has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <BinaryStreamBackground />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 scanlines light-theme-hide-bg-overlay opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">

          {/* Left: description + CP features */}
          <div>
            <ScrollReveal>
              <span className="ascii-kicker mb-2 block">// THE ECONOMY</span>
              <h2 className="text-3xl lg:text-4xl text-text-primary font-bold mb-4">
                Cyber Points &amp; Zero-Day Market
              </h2>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Earn <CpLogo className="w-4 h-4 mx-0.5 inline-block align-middle" /> by completing bootcamp rooms
                and CTF challenges. Every transaction is recorded on the{' '}
                <span className="text-accent font-bold">HSOCIETY Chain</span> — tamper-proof and verifiable.
              </p>

              {/* Chain badge */}
              <div className="terminal-card flex items-center gap-2 mb-5 px-3 py-1.5 w-fit">
                <ChainLogo size={14} />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                  Verified by HSOCIETY Chain
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
                {BULLETS.map((bullet, i) => (
                  <ScrollReveal key={bullet} delay={i * 0.04}>
                    <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-none" />
                      <span>{bullet}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <Link
                to="/register"
                className="btn-secondary text-xs inline-flex items-center gap-2"
              >
                Start Earning <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right: CP coin with HSOCIETY Chain badge */}
          <ScrollReveal className="flex items-center justify-center" direction="none" delay={0.1}>
            <div className="relative flex items-center justify-center w-full max-w-[560px] h-72 sm:h-80 md:h-[24rem] lg:h-[28rem]">
              <div className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 68%)' }}
                />
                <motion.img
                  src="/assets/branding/logos/cyber-points-logo.webp"
                  alt="Cyber Points"
                  className="relative z-10 w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 48px var(--color-accent-glow))' }}
                  animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="absolute -right-2 bottom-4 sm:-right-5 sm:bottom-8 md:-right-8 md:bottom-10 z-20 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52">
                  <motion.img
                    src="/assets/branding/chain/hsociety-chain-3d.webp"
                    alt="HSOCIETY Chain"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_32px_var(--color-accent-glow)]"
                    animate={shouldReduceMotion ? {} : { y: [0, -5, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default EconomySection;
