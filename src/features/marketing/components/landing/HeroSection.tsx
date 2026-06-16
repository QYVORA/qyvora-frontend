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
  const { constrainedDevice, isMobile, isLg } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;

  return (
    <div ref={heroRef} className="relative w-full md:h-screen md:overflow-hidden flex flex-col">
      
      {/* ── Main content grid ── */}
      <div
        className="
          relative z-30 w-full flex-1 mx-auto 
          grid grid-cols-1 lg:grid-cols-2
          text-left
          items-center
          md:h-full
        "
      >

        {/* ── Left column - Hero Text Area ── */}
        <div className="
          flex flex-col items-start justify-center
          px-6 sm:px-8 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12
          pt-32 pb-10
          sm:pt-36 sm:pb-12
          lg:pt-28 lg:pb-20
          space-y-0
          w-full
          h-full
        ">

          {/* Top content block */}
          <div className="flex flex-col items-start w-full space-y-5 sm:space-y-6">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-accent/35 bg-accent/10 backdrop-blur-sm rounded-lg max-w-full shadow-[0_0_15px_rgba(102,184,112,0.05)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
              <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-accent whitespace-normal">
                Africa's Offensive Security Platform
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full">

              <motion.span
                initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]"
              >
                Train Like a Hacker.
              </motion.span>

              <motion.span
                initial={minimizeEffects ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="block text-accent text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05]"
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
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 mt-8 lg:mt-9"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2.5 !px-10 sm:!px-10 !py-4 text-base sm:text-base min-h-[58px] sm:min-h-[52px]">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2.5 text-base sm:text-base !px-10 sm:!px-10 !py-4 whitespace-nowrap min-h-[58px] sm:min-h-[52px]">
                  Start Training <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn-secondary text-base sm:text-base !px-10 sm:!px-10 !py-4 text-center whitespace-nowrap min-h-[58px] sm:min-h-[52px]">
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Right column: Globe - Desktop only ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="
            relative hidden lg:flex items-center justify-center
            w-full h-full
            pt-28 pb-12 xl:pt-32 xl:pb-16
            pr-8 xl:pr-16
          "
        >
          {/* Globe container - larger bounds to prevent clipping */}
          <div className="relative z-10 w-full h-full max-w-[600px] xl:max-w-[720px] flex items-center justify-center">
            <Suspense fallback={null}>
              {isLg && <HackerGlobe scale={1.4} />}
            </Suspense>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;