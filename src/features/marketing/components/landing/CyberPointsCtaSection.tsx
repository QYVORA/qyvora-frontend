import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import CpLogo from '../../../../shared/components/CpLogo';
import ChainLogo from '../../../../shared/components/ChainLogo';

interface CyberPointsCtaSectionProps {
  totalCp: number;
}

const CyberPointsCtaSection: React.FC<CyberPointsCtaSectionProps> = ({ totalCp }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="
      py-14 bg-bg border-t border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <img
        src="/assets/sections/backgrounds/ai-solutions-bg.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none"
      />
      <div data-light-overlay="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-8 items-center">

          {/* Left — CP logo */}
          <ScrollReveal className="flex items-center justify-center order-2 lg:order-1" direction="none">
            <div className="relative flex items-center justify-center">
              <div data-light-overlay="true" className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none scale-110" />
              <motion.img
                src="/assets/branding/logos/cyber-points-logo.webp"
                alt="Cyber Points"
                className="w-44 h-44 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain relative z-10"
                style={{ filter: 'drop-shadow(0 0 60px var(--color-accent-glow))' }}
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Community pool badge */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-2 right-0 lg:right-2 px-2.5 py-1.5 bg-bg-card/90 border border-accent/20 rounded-lg backdrop-blur-sm shadow-lg"
              >
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-0.5">Community Pool</div>
                <div className="text-sm font-bold text-accent font-mono inline-flex items-center gap-1.5">
                  {totalCp.toLocaleString()} <CpLogo className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Right — text + CTA */}
          <div className="order-1 lg:order-2 flex flex-col items-start">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-2 block">// CYBER POINTS</span>
              <h2 className="text-3xl md:text-2xl lg:text-4xl font-extrabold text-text-primary leading-[1.1] mb-3">
                The Currency of<br />Skill &amp; Access
              </h2>
              <p className="text-text-secondary text-sm md:text-xs lg:text-sm mb-5 max-w-md leading-relaxed">
                Earn <CpLogo className="w-3.5 h-3.5 mx-0.5 inline-block" /> by completing bootcamp rooms and challenges.
                Spend it in the Zero-Day Market. Every transaction is recorded on the{' '}
                <span className="text-accent font-bold">HSOCIETY Chain</span> — tamper-proof and verifiable.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-4">
              <Link to="/cyber-points" className="btn-primary text-sm !px-6 inline-flex items-center justify-center gap-2">
                Learn About CP <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-secondary text-sm !px-6 inline-flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> Start Earning
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-accent/20 bg-accent/5 w-fit">
                <ChainLogo size={14} />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Verified by HSOCIETY Chain</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyberPointsCtaSection;
