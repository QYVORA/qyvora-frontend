import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { SITE_CONFIG } from '../../content/siteConfig';
import type { BackendStats } from './types';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';

const HackerGlobe = lazy(() => import('../HackerGlobe'));

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  user: { isAdmin?: boolean } | null;
  stats: BackendStats | null;
  totalCp: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  user,
  stats,
  totalCp,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;

  return (
    <div ref={heroRef} className="relative w-full h-full flex flex-col overflow-hidden">
      {/* ── Main content grid ── */}
      <div
        className="
          relative z-30 w-full h-full mx-auto 
          grid grid-cols-1 lg:grid-cols-2
          text-left
          items-center
        "
      >

        {/* ── Left column - Hero Text Area ── */}
        <div className="
          flex flex-col items-start justify-center 
          px-6 sm:px-8 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12
          py-8 sm:py-12 
          lg:py-20 xl:py-24
          min-h-screen lg:min-h-0
          space-y-5 sm:space-y-6 lg:space-y-7
          w-full
        ">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 border border-accent/25 bg-accent-dim rounded-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
            <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-accent">
              Africa's Offensive Security Platform
            </span>
          </motion.div>

          {/* ── Headline ── */}
          <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full">

            <motion.span
              initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem]"
            >
              Train Like a Hacker.
            </motion.span>

            <motion.span
              initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block text-accent text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem]"
            >
              Become a Hacker.
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl"
          >
            {SITE_CONFIG.brand.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 sm:gap-4"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-4 text-sm sm:text-base min-h-[56px] sm:min-h-[52px]">
                <LayoutDashboard className="w-[18px] h-[18px]" /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2.5 text-sm sm:text-base !px-8 sm:!px-10 !py-4 whitespace-nowrap min-h-[56px] sm:min-h-[52px]">
                  Start Training <ArrowRight className="w-[18px] h-[18px]" />
                </Link>
                <Link to="/login" className="btn-secondary text-sm sm:text-base !px-8 sm:!px-10 !py-4 text-center whitespace-nowrap min-h-[56px] sm:min-h-[52px]">
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Right column: Globe - Horizontally aligned with visible text content ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="
            relative hidden lg:flex items-center justify-center
            w-full h-full
            py-20 xl:py-24
            pr-8 xl:pr-16
          "
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 z-0 rounded-full pointer-events-none opacity-60"
            style={{ background: 'radial-gradient(circle at center, var(--color-hero-glow) 0%, transparent 60%)' }}
          />

          {/* Globe container - matches left section vertical alignment */}
          <div className="relative z-10 w-full max-w-[480px] xl:max-w-[540px] aspect-square">
            <Suspense fallback={null}>
              <HackerGlobe scale={1.15} />
            </Suspense>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;
