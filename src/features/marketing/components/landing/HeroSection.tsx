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
          relative z-30 w-full max-w-7xl mx-auto px-4 md:px-10
          grid grid-cols-1 lg:grid-cols-2 gap-8 items-center
          text-left
          pt-32 md:pt-32 lg:pt-28 pb-16 md:pb-20
          min-h-screen
        "
      >

        {/* ── Left column ── */}
        <div className="flex flex-col items-start justify-center w-full
                        lg:h-auto lg:items-start lg:justify-center lg:pr-10 lg:gap-0">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-accent/25 bg-accent-dim rounded-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-accent">
              Africa's Offensive Security Platform
            </span>
          </motion.div>

          {/* ── Headline ── */}
          <h1 className="font-black text-text-primary leading-[1.06] tracking-tight mb-5 w-full">

            <motion.span
              initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[2.1rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3rem] xl:text-[3.5rem]"
            >
              Train Like a Hacker.
            </motion.span>

            <motion.span
              initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block text-accent text-[2.1rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3rem] xl:text-[3.5rem]"
            >
              Become a Hacker.
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-text-secondary text-sm sm:text-base max-w-lg mb-7 leading-relaxed"
          >
            {SITE_CONFIG.brand.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center
                       justify-start gap-3 mb-8"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 !px-8 !py-3 text-sm">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-sm !px-8 !py-3">
                  Start Training <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary text-sm !px-8 !py-3 text-center">
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Right column: Globe ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden aspect-square w-full max-w-[480px] items-center justify-center
                     overflow-visible mx-auto lg:flex xl:max-w-[540px]"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-[-10%] z-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-hero-glow) 0%, transparent 68%)' }}
          />

          <div className="relative z-10 w-full h-full">
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
