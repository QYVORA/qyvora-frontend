import React from 'react';
import { motion, useReducedMotion, type MotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { lazy, Suspense } from 'react';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { SITE_CONFIG } from '../../content/siteConfig';
import type { BackendStats } from './types';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';

const HeroCanvas  = lazy(() => import('../HeroCanvas'));
const HackerGlobe = lazy(() => import('../HackerGlobe'));

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroY: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  terminalText: string;
  user: { isAdmin?: boolean } | null;
  stats: BackendStats | null;
  totalCp: number;
}

const STAT_ORDER = ['Students', 'Bootcamps Live', 'Zero-Day Products', 'CP Pool'];

const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  heroY,
  heroOpacity,
  terminalText,
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
    <section ref={heroRef} className="relative min-h-screen w-full has-bg-image md:h-full md:min-h-0 md:overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 overflow-hidden scanlines pointer-events-none z-0">
        <div className="absolute inset-0 bg-bg light-theme-hide-bg-base" />
        <img
          src="/assets/sections/hero/hero-background.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] pointer-events-none hero-bg-img"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20" />
        {!minimizeEffects && <Suspense fallback={null}><HeroCanvas /></Suspense>}
        <div className="absolute inset-0 bg-radial-vignette opacity-60 hero-vignette" />
      </div>

      {/*
        ── MOBILE GLOBE ─────────────────────────────────────────────────────
        Absolutely pinned to the section's bottom edge (z-10, behind text z-30).
        The globe square is 120vw wide and centred; its vertical centre is
        placed AT the section bottom via `bottom: -50%` on the square — so
        exactly the top half of the globe is visible, clipped flush by the
        section boundary (overflow on the section clips it naturally on mobile
        since the section is min-h-screen and the next section starts right after).

        Adjust `bottom` value to taste:
          -60%  → shows ~40% of globe (more crescent)
          -50%  → shows exactly the top hemisphere
          -40%  → shows ~60% of globe (more globe, less crescent)
        ──────────────────────────────────────────────────────────────────── */}
      {!shouldReduceMotion && (
        <div
          className="md:hidden absolute left-0 w-full pointer-events-none z-10 overflow-hidden"
          style={{ height: '60vw', maxHeight: '260px', bottom: '64px' }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: '120vw',
              maxWidth: '580px',
              aspectRatio: '1 / 1',
              top: '30%',
            }}
          >
            <Suspense fallback={null}>
              <HackerGlobe scale={1.0} />
            </Suspense>
          </div>
        </div>
      )}

      {/* ── Main content grid ── */}
      <motion.div
        style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
        className="relative z-30 min-h-screen max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start md:items-center pt-28 md:pt-20 pb-20 md:pb-40 lg:pb-56 xl:pb-52
          md:min-h-0 md:h-full"
      >
        {/* Left column */}
        <div className="flex flex-col items-start w-full lg:pr-6">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 md:mb-3 px-3 py-1 border border-border bg-accent-dim rounded-sm"
          >
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              AFRICA'S OFFENSIVE SECURITY PLATFORM
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5 md:mb-3">
            <span className="inline-block">
              {'Train Like a Hacker.'.split(' ').map((w, i) => (
                <motion.span
                  key={i}
                  initial={minimizeEffects ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={minimizeEffects ? { duration: 0 } : { duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-2 md:mr-3"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="inline-block text-accent">
              {'Become a Hacker.'.split(' ').map((w, i) => (
                <motion.span
                  key={i}
                  initial={minimizeEffects ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={minimizeEffects ? { duration: 0 } : { duration: 0.4, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-2 md:mr-3"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.55, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-7 md:mb-4"
          >
            {SITE_CONFIG.brand.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.55, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 md:mb-6 lg:mb-8"
          >
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 !px-8 text-sm">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-sm !px-8">
                  Start Free Module <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-secondary text-sm !px-8 text-center">Log In</Link>
              </>
            )}
          </motion.div>

          {/* Terminal ticker */}
          {!constrainedDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, delay: 1.7 }}
              className="block font-mono text-[9px] sm:text-[10px] text-accent/70 tracking-tighter w-full max-w-lg overflow-hidden break-words mb-8 md:mb-0"
            >
              {terminalText}<span className="animate-blink italic">_</span>
            </motion.div>
          )}

          {/* Mobile/Tablet stats grid (lg:hidden) */}
          <div className="grid grid-cols-2 gap-3 mt-2 md:mt-5 lg:hidden w-full max-w-sm sm:max-w-md">
            {heroStats.map((s, i) => (
              <motion.div
                key={i}
                initial={minimizeEffects ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.45, delay: 1.8 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-lg border border-border bg-bg-card/80 backdrop-blur-sm px-3.5 py-3"
              >
                <div className="text-xl font-bold text-accent font-mono leading-none">
                  <StatCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Globe — lg+ only — UNTOUCHED */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex relative h-[500px] xl:h-[560px] max-w-[560px] w-full items-center justify-center justify-self-center"
        >
          <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          {!minimizeEffects && <div className="w-full h-full pointer-events-none"><Suspense fallback={null}><HackerGlobe scale={0.95} /></Suspense></div>}
          <motion.div
            animate={shouldReduceMotion ? {} : { opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-8 right-6 px-2 py-1 bg-bg-card/80 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest"
          >
            SAT-02 // ORBIT
          </motion.div>
          <img
            src="/assets/illustrations/hero-operator.webp"
            alt=""
            aria-hidden="true"
            className="absolute bottom-[-14%] left-1/2 -translate-x-1/2 z-20 w-[66%] max-w-[390px] xl:max-w-[460px] h-auto object-contain pointer-events-none select-none opacity-95 drop-shadow-[0_0_50px_var(--color-accent-glow)]"
          />
        </motion.div>
      </motion.div>

      {/* Desktop stats bar — UNTOUCHED */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 w-full bg-bg-card/80 backdrop-blur-sm z-30 py-3 md:py-5 hidden lg:block border-t border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-4 gap-3 md:gap-6">
          {heroStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.7 + i * 0.06 }}
              className="flex flex-col"
            >
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent font-mono">
                <StatCounter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;