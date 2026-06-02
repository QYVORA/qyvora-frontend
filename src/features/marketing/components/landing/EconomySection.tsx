import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import type { MarketplaceItem } from './types';
import CpLogo from '../../../../shared/components/CpLogo';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

interface EconomySectionProps {
  totalCp: number;
  marketItems: MarketplaceItem[];
  loading?: boolean;
}

const BULLETS = [
  'Complete bootcamps to earn points',
  'Spend points in the marketplace',
];

const EconomySection: React.FC<EconomySectionProps> = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full min-h-full flex items-center py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-2 md:px-10 relative z-10 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-10 items-center px-2 md:px-0">

          {/* Left: description + CP features */}
          <div>
            <ScrollReveal direction="left">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4 lg:mb-3">
                <div className="h-[1px] w-8 bg-accent/40" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                  Zero-Day Economy
                </span>
              </div>

              <AsciiHeading 
                text="EARN" 
                font="ANSI Shadow" 
                align="left" 
                animated 
                className="mb-8" 
              />
              
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Earn <CpLogo className="w-4 h-4 mx-0.5 inline-block align-middle" /> by completing bootcamp rooms
                and CTF challenges. Every transaction is recorded on the{' '}
                <span className="text-accent font-bold">HSOCIETY Chain</span> — tamper-proof and verifiable.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
                {BULLETS.map((bullet, i) => (
                  <div key={bullet} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-none" />
                    <span>{bullet}</span>
                  </div>
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
          <ScrollReveal className="flex items-center justify-center" direction="right" delay={0.1}>
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
    </div>
  );
};

export default EconomySection;
