import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import CpLogo from '../../../../shared/components/CpLogo';
import ChainLogo from '../../../../shared/components/ChainLogo';
import BinaryStreamBackground from '../../../../shared/components/BinaryStreamBackground';

interface CyberPointsCtaSectionProps {
  totalCp: number;
}

const CyberPointsCtaSection: React.FC<CyberPointsCtaSectionProps> = ({ totalCp }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="
      ascii-section py-20 bg-bg border-t border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <BinaryStreamBackground />
      <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left — text + CTA (always first on mobile) ── */}
          <div className="flex flex-col items-start order-1">
            <ScrollReveal>
              <span className="ascii-kicker block mb-3">
                // Cyber Points
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-none tracking-tight mb-4">
                The Currency of<br />Skill &amp; Access
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-md">
                Earn <CpLogo className="w-3.5 h-3.5 mx-0.5 inline-block align-middle" /> by completing bootcamp
                rooms and challenges. Spend it in the Zero-Day Market. Every transaction is recorded on the{' '}
                <span className="text-accent font-bold">HSOCIETY Chain</span> — tamper-proof and verifiable.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto mb-5">
              <Link
                to="/cyber-points"
                className="btn-primary text-sm !px-6 inline-flex items-center justify-center gap-2"
              >
                Learn About CP <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-sm !px-6 inline-flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Start Earning
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="terminal-card inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/20 bg-accent-dim">
                <ChainLogo size={14} />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                  Verified by HSOCIETY Chain
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right — CP coin visual (below text on mobile) ── */}
          <ScrollReveal
            className="flex items-center justify-center order-2"
            direction="none"
            delay={0.15}
          >
            {/* Constrained wrapper — no overflow on mobile */}
            <div className="relative flex items-center justify-center w-full max-w-[280px] md:max-w-[360px] lg:max-w-[420px] mx-auto">

              {/* Glow ring */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 65%)' }}
              />

              {/* Coin */}
              <motion.img
                src="/assets/branding/logos/cyber-points-logo.webp"
                alt="Cyber Points"
                className="relative z-10 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 object-contain"
                style={{ filter: 'drop-shadow(0 0 48px var(--color-accent-glow))' }}
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Community pool badge — anchored to bottom-right of coin, clipped to wrapper */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="terminal-card absolute bottom-0 right-0 z-20 px-2.5 py-1.5 rounded-lg border border-accent/20 bg-bg-card/95 backdrop-blur-sm"
                style={{ boxShadow: 'var(--card-shimmer), 0 4px 20px rgba(0,0,0,0.3)' }}
              >
                <div className="text-[8px] uppercase tracking-widest text-text-muted mb-0.5">Community Pool</div>
                <div className="font-mono text-sm font-black text-accent inline-flex items-center gap-1.5">
                  {totalCp.toLocaleString()} <CpLogo className="w-3.5 h-3.5" />
                </div>
              </motion.div>

              {/* Orbit decoration — desktop only */}
              <motion.div
                aria-hidden
                className="terminal-card hidden lg:block absolute top-4 left-0 z-20 px-2 py-1 rounded border border-accent/15 bg-bg-card/80 backdrop-blur-sm"
                animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <span className="text-[8px] font-mono font-bold text-accent/60 uppercase tracking-widest">
                  CP // VERIFIED
                </span>
              </motion.div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default CyberPointsCtaSection;
