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

// ── S-curve divider ───────────────────────────────────────────────────────────
const SDivider: React.FC<{ shouldReduceMotion: boolean }> = ({ shouldReduceMotion }) => (
  <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block" aria-hidden>

    {/* ── Panel fill + accent tint — single SVG ── */}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        {/* S-curve clip */}
        <clipPath id="hero-right-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0.62 0  C 0.58 0.15, 0.55 0.25, 0.52 0.38  C 0.49 0.51, 0.52 0.62, 0.48 0.75  C 0.44 0.88, 0.42 0.95, 0.38 1.0  L 1 1  L 1 0 Z" />
        </clipPath>

        {/* Radial accent gradient — centred in the right panel */}
        <radialGradient id="panel-accent" cx="78%" cy="38%" r="55%">
          <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0"    />
        </radialGradient>

        {/* Linear gradient along S — fades in from top, out at bottom */}
        <linearGradient id="s-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0"    />
          <stop offset="20%"  stopColor="var(--color-accent)" stopOpacity="0.85" />
          <stop offset="80%"  stopColor="var(--color-accent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0"    />
        </linearGradient>

        {/* Soft glow filter for the S line */}
        <filter id="s-glow" x="-60%" y="-5%" width="220%" height="110%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Dark fill — masks the canvas/globe bleed into left side */}
      <rect x="0" y="0" width="100" height="100"
        fill="var(--color-hero-right-bg)" opacity="0.96"
        clipPath="url(#hero-right-clip)" />

      {/* Accent radial tint */}
      <rect x="0" y="0" width="100" height="100"
        fill="url(#panel-accent)"
        clipPath="url(#hero-right-clip)" />
    </svg>

    {/* ── Scattered dots — hand-placed, clipped ── */}
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        <clipPath id="hero-right-clip-abs" clipPathUnits="objectBoundingBox">
          <path d="M 0.62 0  C 0.58 0.15, 0.55 0.25, 0.52 0.38  C 0.49 0.51, 0.52 0.62, 0.48 0.75  C 0.44 0.88, 0.42 0.95, 0.38 1.0  L 1 1  L 1 0 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-right-clip-abs)" opacity="1">
        {/* Sized and spaced to feel deliberately placed, not tiled */}
        <circle cx="540" cy="80"  r="4"   fill="var(--color-hero-dots)" opacity="0.40" />
        <circle cx="680" cy="140" r="3"   fill="var(--color-hero-dots)" opacity="0.35" />
        <circle cx="760" cy="60"  r="5"   fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="600" cy="220" r="3.5" fill="var(--color-hero-dots)" opacity="0.42" />
        <circle cx="720" cy="280" r="4.5" fill="var(--color-hero-dots)" opacity="0.32" />
        <circle cx="510" cy="350" r="3"   fill="var(--color-hero-dots)" opacity="0.40" />
        <circle cx="650" cy="390" r="5"   fill="var(--color-hero-dots)" opacity="0.30" />
        <circle cx="780" cy="360" r="3.5" fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="560" cy="480" r="4"   fill="var(--color-hero-dots)" opacity="0.36" />
        <circle cx="700" cy="520" r="3"   fill="var(--color-hero-dots)" opacity="0.42" />
        <circle cx="490" cy="600" r="5"   fill="var(--color-hero-dots)" opacity="0.28" />
        <circle cx="630" cy="650" r="3.5" fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="760" cy="610" r="4"   fill="var(--color-hero-dots)" opacity="0.32" />
        <circle cx="540" cy="730" r="3"   fill="var(--color-hero-dots)" opacity="0.36" />
        <circle cx="690" cy="760" r="4.5" fill="var(--color-hero-dots)" opacity="0.28" />
      </g>
    </svg>

    {/* ── The S-line — hairline + glow layer + travelling dash ── */}
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {/* Glow halo — wide, very soft */}
      <path
        d="M 62 0  C 58 15, 55 25, 52 38  C 49 51, 52 62, 48 75  C 44 88, 42 95, 38 100"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.10"
        style={{ vectorEffect: 'non-scaling-stroke' }}
        filter="url(#s-glow)"
      />

      {/* Crisp hairline — the actual visible edge */}
      <path
        d="M 62 0  C 58 15, 55 25, 52 38  C 49 51, 52 62, 48 75  C 44 88, 42 95, 38 100"
        fill="none"
        stroke="url(#s-grad)"
        strokeWidth="0.22"
        strokeLinecap="round"
        style={{ vectorEffect: 'non-scaling-stroke' }}
      />

      {/* Travelling highlight — rides down the line */}
      {!shouldReduceMotion && (
        <path
          d="M 62 0  C 58 15, 55 25, 52 38  C 49 51, 52 62, 48 75  C 44 88, 42 95, 38 100"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.75"
          strokeDasharray="6 94"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="-100"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </path>
      )}
    </svg>

    {/* ── Floating status tags ── */}
    {!shouldReduceMotion && (
      <>
        <motion.div
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-7 right-8 px-2.5 py-1 rounded-md border border-accent/15 bg-bg-card/65 backdrop-blur-sm"
          style={{ boxShadow: 'var(--card-shimmer)' }}
        >
          <span className="font-mono text-[8px] font-bold text-accent/55 uppercase tracking-[0.25em]">
            SAT-02 // ORBIT
          </span>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.35, 0.70, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          className="absolute top-[36%] right-[35%] px-2 py-0.5 rounded border border-border/60 bg-bg-card/50 backdrop-blur-sm"
          style={{ boxShadow: 'var(--card-shimmer)' }}
        >
          <span className="font-mono text-[7px] font-bold text-text-muted uppercase tracking-widest">
            GH // ACCRA NODE
          </span>
        </motion.div>
      </>
    )}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  heroY,
  heroOpacity,
  user,
  stats,
  totalCp,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;

  const heroStats = [
    { label: 'Students',          value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, suffix: '+' },
    { label: 'Bootcamps Live',    value: stats?.stats?.bootcampsCount ?? 0,                                  suffix: ''  },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount ?? 0,                            suffix: '+' },
    { label: 'CP Pool',           value: totalCp,                                                            suffix: ''  },
  ].sort((a, b) => STAT_ORDER.indexOf(a.label) - STAT_ORDER.indexOf(b.label));

  return (
    <div ref={heroRef} className="relative w-full min-h-full flex flex-col overflow-hidden">

      {/* S-curve divider — desktop only */}
      <SDivider shouldReduceMotion={!!shouldReduceMotion} />

      {/* ── Main content grid ── */}
      <motion.div
        style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
        className="
          relative z-30 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10
          grid grid-cols-1 lg:grid-cols-2 gap-8 items-center
          text-left
          pt-32 md:pt-44 lg:pt-44 pb-12 md:pb-32 lg:pb-48
          md:min-h-0 min-h-full
        "
      >

        {/* ── Left column ── */}
        <div className="flex flex-col items-start justify-center w-full h-full gap-6
                        lg:h-auto lg:min-h-0 lg:items-start lg:justify-start lg:pr-10 md:pt-4 lg:gap-0">

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
              initial={minimizeEffects ? false : { opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
              className="block text-[2.1rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3rem] xl:text-[3.5rem]"
            >
              Train Like a Hacker.
            </motion.span>

            {/* Accent rule — slides in */}
            <motion.span
              initial={minimizeEffects ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block h-[2px] w-12 my-3 origin-left mx-0"
              style={{ background: 'var(--color-accent)' }}
              aria-hidden
            />

            <motion.span
              initial={minimizeEffects ? false : { opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={minimizeEffects ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
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

          {/* Stats — mobile/tablet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.5, delay: 1.0 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-4 sm:gap-6 w-full max-w-2xl pt-5 border-t border-border"
          >
            {heroStats.map((s, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="font-mono text-xl font-black text-accent leading-none mb-1">
                  <StatCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column: Globe ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden aspect-square w-full max-w-[480px] items-center justify-center
                     overflow-visible mx-auto lg:mx-0 lg:flex xl:max-w-[580px] lg:-mr-12 xl:-mr-20"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-[-10%] z-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-hero-glow) 0%, transparent 68%)' }}
          />

          <div className="relative z-10 w-full h-full">
            <Suspense fallback={null}>
              <HackerGlobe scale={0.92} />
            </Suspense>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default HeroSection;