import React from 'react';
import { motion, useReducedMotion, type MotionValue } from 'motion/react';
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

// ── U-shaped divider (horizontal U with base facing hero text) ──────────────
const UDivider: React.FC<{ shouldReduceMotion: boolean }> = ({ shouldReduceMotion }) => (
  <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block" aria-hidden>

    {/* ── U-shaped panel with green background ── */}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        {/* Horizontal U-shaped path - base faces left (hero text), opens to the right */}
        <clipPath id="hero-right-clip" clipPathUnits="objectBoundingBox">
          {/* U shape: left side at x=0.55, curves around, right side ends before edge */}
          <path d="M 0.55 0.20  L 0.55 0.80  C 0.55 0.88, 0.60 0.92, 0.68 0.92  L 0.88 0.92  C 0.96 0.92, 1 0.88, 1 0.80  L 1 0.20  C 1 0.12, 0.96 0.08, 0.88 0.08  L 0.68 0.08  C 0.60 0.08, 0.55 0.12, 0.55 0.20 Z" />
        </clipPath>

        {/* Radial accent gradient — centered on the globe area */}
        <radialGradient id="panel-accent" cx="75%" cy="50%" r="30%">
          <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0"    />
        </radialGradient>

        {/* Gradients for the U lines */}
        <linearGradient id="u-grad-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="20%"  stopColor="var(--color-accent)" stopOpacity="0.75" />
          <stop offset="80%"  stopColor="var(--color-accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="u-grad-curve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="var(--color-accent)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.75" />
        </linearGradient>

        {/* Soft glow filter for the U line */}
        <filter id="u-glow" x="-60%" y="-5%" width="220%" height="110%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Green accent fill ONLY in the U-shaped area */}
      <rect x="0" y="0" width="100" height="100"
        fill="var(--color-accent)" opacity="0.06"
        clipPath="url(#hero-right-clip)" />

      {/* Radial accent gradient overlay */}
      <rect x="0" y="0" width="100" height="100"
        fill="url(#panel-accent)"
        clipPath="url(#hero-right-clip)" />
    </svg>

    {/* ── Scattered dots — hand-placed, clipped to U area ── */}
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        <clipPath id="hero-right-clip-abs" clipPathUnits="objectBoundingBox">
          <path d="M 0.55 0.20  L 0.55 0.80  C 0.55 0.88, 0.60 0.92, 0.68 0.92  L 0.88 0.92  C 0.96 0.92, 1 0.88, 1 0.80  L 1 0.20  C 1 0.12, 0.96 0.08, 0.88 0.08  L 0.68 0.08  C 0.60 0.08, 0.55 0.12, 0.55 0.20 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-right-clip-abs)" opacity="1">
        {/* Positioned within the U-shaped area */}
        <circle cx="520" cy="180" r="3"   fill="var(--color-hero-dots)" opacity="0.35" />
        <circle cx="620" cy="220" r="4"   fill="var(--color-hero-dots)" opacity="0.40" />
        <circle cx="700" cy="160" r="3.5" fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="560" cy="320" r="4.5" fill="var(--color-hero-dots)" opacity="0.32" />
        <circle cx="680" cy="380" r="3"   fill="var(--color-hero-dots)" opacity="0.40" />
        <circle cx="740" cy="300" r="5"   fill="var(--color-hero-dots)" opacity="0.30" />
        <circle cx="580" cy="480" r="3.5" fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="660" cy="520" r="4"   fill="var(--color-hero-dots)" opacity="0.36" />
        <circle cx="720" cy="440" r="3"   fill="var(--color-hero-dots)" opacity="0.42" />
        <circle cx="540" cy="600" r="5"   fill="var(--color-hero-dots)" opacity="0.28" />
        <circle cx="640" cy="640" r="3.5" fill="var(--color-hero-dots)" opacity="0.38" />
        <circle cx="700" cy="580" r="4"   fill="var(--color-hero-dots)" opacity="0.32" />
      </g>
    </svg>

    {/* ── The U-line — hairline + glow layer + travelling dash ── */}
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {/* Glow halo — wide, very soft */}
      {/* Left vertical line (base of U) */}
      <line
        x1="55" y1="20" x2="55" y2="80"
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.10"
        style={{ vectorEffect: 'non-scaling-stroke' }}
        filter="url(#u-glow)"
      />
      {/* Top horizontal curve */}
      <path
        d="M 55 20  L 68 20  C 76 20, 80 24, 80 32  L 80 68  C 80 76, 76 80, 68 80  L 55 80"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.10"
        style={{ vectorEffect: 'non-scaling-stroke' }}
        filter="url(#u-glow)"
      />

      {/* Crisp hairline — the actual visible edge */}
      {/* Left vertical line */}
      <line
        x1="55" y1="20" x2="55" y2="80"
        stroke="url(#u-grad-left)"
        strokeWidth="0.20"
        strokeLinecap="round"
        style={{ vectorEffect: 'non-scaling-stroke' }}
      />
      {/* U curve */}
      <path
        d="M 55 20  L 68 20  C 76 20, 80 24, 80 32  L 80 68  C 80 76, 76 80, 68 80  L 55 80"
        fill="none"
        stroke="url(#u-grad-curve)"
        strokeWidth="0.20"
        strokeLinecap="round"
        style={{ vectorEffect: 'non-scaling-stroke' }}
      />

      {/* Travelling highlight — rides along the U */}
      {!shouldReduceMotion && (
        <>
          {/* Left line dash */}
          <line
            x1="55" y1="20" x2="55" y2="80"
            stroke="var(--color-accent)"
            strokeWidth="0.28"
            strokeLinecap="round"
            opacity="0.7"
            strokeDasharray="5 20"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="25"
              dur="2.2s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </line>
          {/* Curve dash */}
          <path
            d="M 55 20  L 68 20  C 76 20, 80 24, 80 32  L 80 68  C 80 76, 76 80, 68 80  L 55 80"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.28"
            strokeLinecap="round"
            opacity="0.7"
            strokeDasharray="8 45"
            style={{ vectorEffect: 'non-scaling-stroke' }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="53"
              to="0"
              dur="3.8s"
              repeatCount="indefinite"
              calcMode="linear"
            />
          </path>
        </>
      )}
    </svg>

    {/* ── Floating status tags ── */}
    {!shouldReduceMotion && (
      <>
        <motion.div
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] right-[10%] px-2.5 py-1 rounded-md border border-accent/15 bg-bg-card/65 backdrop-blur-sm"
          style={{ boxShadow: 'var(--card-shimmer)' }}
        >
          <span className="font-mono text-[8px] font-bold text-accent/55 uppercase tracking-[0.25em]">
            SAT-02 // ORBIT
          </span>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.35, 0.70, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          className="absolute top-[52%] right-[22%] px-2 py-0.5 rounded border border-border/60 bg-bg-card/50 backdrop-blur-sm"
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
          relative z-30 w-full max-w-7xl mx-auto px-6 md:px-10
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
              <HackerGlobe scale={0.92} />
            </Suspense>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;