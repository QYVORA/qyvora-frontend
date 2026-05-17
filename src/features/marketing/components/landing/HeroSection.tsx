import React from 'react';
import { motion, useReducedMotion, type MotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { SITE_CONFIG } from '../../content/siteConfig';
import type { BackendStats } from './types';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';

const HackerGlobe = lazy(() => import('../HackerGlobe'));

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroY: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  user: { isAdmin?: boolean } | null;
  stats: BackendStats | null;
  totalCp: number;
}

const STAT_ORDER = ['Students', 'Bootcamps Live', 'Zero-Day Products', 'CP Pool'];

const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  heroY,
  heroOpacity,
  user,
  stats,
  totalCp,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  const heroStats = [
    { label: 'Students',          value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, suffix: '+' },
    { label: 'Bootcamps Live',    value: stats?.stats?.bootcampsCount ?? 0,                                  suffix: ''  },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount ?? 0,                            suffix: '+' },
    { label: 'CP Pool',           value: totalCp,                                                            suffix: ''  },
  ].sort((a, b) => STAT_ORDER.indexOf(a.label) - STAT_ORDER.indexOf(b.label));

  return (
    <div ref={heroRef} className="relative w-full h-full flex flex-col">

      {/* ── Main content grid ── */}
      <motion.div
        style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
        className="relative z-30 flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-center lg:text-left pt-24 md:pt-6 pb-24 md:pb-8 md:min-h-0 h-full"
      >
        {/* Left column */}
        <div className="flex min-h-full flex-col items-center justify-center lg:min-h-0 lg:-translate-y-8 lg:items-start lg:justify-start lg:pr-12 md:pt-4 xl:-translate-y-10 xl:pt-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 md:mb-4 px-3 py-1 border border-accent/20 bg-accent/5 backdrop-blur-sm rounded-full"
          >
            <span className="text-[9px] sm:text-10px font-semibold uppercase tracking-[0.25em] text-accent/80">
              Africa's Offensive Security Platform
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-[1.08] mb-4 md:mb-5 tracking-tight">
            <span className="block">Train Like a Hacker.</span>
            <span className="block text-accent mt-1">Become a Hacker.</span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-text-secondary text-sm sm:text-base md:text-lg max-w-lg mb-6 md:mb-8 leading-relaxed opacity-80"
          >
            {SITE_CONFIG.brand.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mb-6 md:mb-0"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary glass-effect flex items-center justify-center gap-2 !px-8 py-3.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary glass-effect flex items-center justify-center gap-2 text-sm font-medium !px-10 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Start Training <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary glass-effect text-sm font-medium !px-10 py-3.5 text-center transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Login
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats — Mobile/Tablet only */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-5 sm:gap-6 w-full max-w-2xl mt-8 sm:mt-10">
            {heroStats.map((s, i) => (
              <motion.div
                key={i}
                initial={minimizeEffects ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center lg:items-start"
              >
                <div className="text-xl font-bold text-accent font-mono leading-none mb-1">
                  <StatCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column: Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden aspect-square w-full max-w-[440px] items-center justify-center overflow-visible mx-auto lg:mx-0 lg:flex xl:max-w-[560px]"
        >
          <div className="relative z-10 w-full h-full">
            <Suspense fallback={null}>
              <HackerGlobe scale={0.88} />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
