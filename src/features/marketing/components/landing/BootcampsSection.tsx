import React from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { BootcampLevel } from '../../../student/components/BootcampCard';
import { PHASE_IMGS, type Bootcamp } from './types';
import { resolveImg } from './helpers';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BootcampsSectionProps {
  bootcamps: Bootcamp[];
  loading?: boolean;
}

// ─── Level helpers ────────────────────────────────────────────────────────────

const BOOTCAMP_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];

const normalizeBootcampLevel = (level?: string): BootcampLevel =>
  BOOTCAMP_LEVELS.includes(level as BootcampLevel) ? (level as BootcampLevel) : 'Operator';

const LEVEL_META: Record<BootcampLevel, { color: string; bg: string; border: string }> = {
  Novice:     { color: 'text-accent', bg: 'bg-accent-dim', border: 'border-border-strong' },
  Operator:   { color: 'text-accent', bg: 'bg-accent-dim', border: 'border-border-strong' },
  Specialist: { color: 'text-accent', bg: 'bg-accent-dim', border: 'border-border-strong' },
  Elite:      { color: 'text-accent', bg: 'bg-accent-dim', border: 'border-border-strong' },
};

// ─── HPB constants ────────────────────────────────────────────────────────────

const HPB_ID          = 'bc_1775270338500';
const HPB_TITLE       = 'Hacker Protocol Bootcamp';
const HPB_DESCRIPTION = 'Hacker Protocol Bootcamp (HPB) teaches beginners to think like hackers — covering networking, Linux, web, and social engineering with hands-on labs and CTFs.';
const HPB_IMAGE       = '/assets/bootcamp/hpb-cover.webp';

// ─── FeaturedCard ─────────────────────────────────────────────────────────────

const FeaturedCard: React.FC<{
  bc: Bootcamp;
  idx: number;
  shouldReduceMotion: boolean;
}> = ({ bc, idx, shouldReduceMotion }) => {
  const isHPB    = bc.id === HPB_ID;
  const title    = isHPB ? HPB_TITLE       : bc.title;
  const desc     = isHPB ? HPB_DESCRIPTION : (bc.description || '');
  const image    = resolveImg(isHPB ? HPB_IMAGE : bc.image, PHASE_IMGS[idx % PHASE_IMGS.length]);
  const level    = normalizeBootcampLevel(bc.level);
  const levelCss = LEVEL_META[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong lg:flex-row lg:h-[320px]"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {/* Image */}
      <div className="relative flex-none overflow-hidden bg-bg w-full h-44 sm:h-52 lg:h-full lg:w-[45%]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        {image ? (
          <img
            src={image}
            alt={`${title} cover`}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-90"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-black text-accent/20 select-none">HPB</span>
          </div>
        )}
        {/* Mobile: subtle overlay instead of gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10 lg:hidden bg-bg-card/20"
        />
        {/* Desktop: subtle overlay instead of gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10 hidden lg:block bg-bg-card/20"
        />
        <div className="absolute right-3 top-3 z-20">
          <span className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md ${levelCss.color} ${levelCss.bg} ${levelCss.border}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-5 lg:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">
          Featured Bootcamp
        </p>
        <h3 className="mb-2 text-lg font-black leading-tight text-text-primary transition-colors duration-200 group-hover:text-accent sm:text-xl lg:text-2xl">
          {title}
        </h3>
        <p className="mb-3 max-w-lg text-xs leading-relaxed text-text-secondary line-clamp-2 lg:line-clamp-3">
          {desc}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-xs text-text-muted font-mono">
          {bc.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent/60" aria-hidden="true" />
              {bc.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-accent/60" aria-hidden="true" />
            {bc.priceLabel || 'Free'}
          </span>
        </div>
        <Link
          to="/register"
          className="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 self-start min-h-[40px]"
        >
          Enrol Now <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
};

// ─── RocketSidebar ────────────────────────────────────────────────────────────

const RocketSidebar: React.FC<{ shouldReduceMotion: boolean }> = ({ shouldReduceMotion }) => (
  <motion.div
    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    // Added pl-4 to push the rocket away from the card's right edge
    className="flex flex-col items-center justify-center h-full min-h-0 py-2 pl-4"
  >
    {/* Eyebrow label */}
    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-text-muted mb-3 text-center">
      Launch your career
    </p>

    {/* Rocket */}
    <div className="relative flex items-center justify-center w-full flex-1 min-h-0">
      {/* Subtle sage-green glow behind the rocket */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.img
        src="/assets/illustrations/rocket-visual.png"
        alt="Launch your career"
        // Reduced max-w so the rocket sits smaller and doesn't crowd the card
        className="relative z-10 w-full max-w-[150px] lg:max-w-[180px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_18px_rgba(136,173,124,0.25)]"
        draggable={false}
        animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>

    {/* Tagline below rocket */}
    <p className="text-[10px] font-mono text-text-muted text-center opacity-50 mt-3 leading-relaxed max-w-[160px]">
      From zero to operator.<br />One bootcamp at a time.
    </p>
  </motion.div>
);

// ─── BootcampsSection ─────────────────────────────────────────────────────────

const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayed = bootcamps.slice(0, 3);
  const isSingle  = displayed.length === 1;

  return (
    <div className="w-full h-full flex items-center overflow-hidden py-8 lg:py-0">
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-8 bg-accent/40" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
            Offensive Security Training
          </span>
        </div>

        {/* ── Heading ── */}
        <div className="flex flex-col mb-4 lg:mb-3">
          <AsciiHeading
            text="Bootcamps"
            font="ANSI Shadow"
            align="left"
            animated
            compact
            className="mb-1.5"
          />
          <p className="text-text-secondary text-sm max-w-lg leading-relaxed opacity-80">
            Phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
          </p>
        </div>

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-border bg-bg-card animate-pulse overflow-hidden h-44 lg:h-52" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-xl border border-border bg-bg h-14 animate-pulse" />
              ))}
            </div>
          </div>

        /* ── Empty ── */
        ) : bootcamps.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg p-10 text-center text-text-muted text-sm">
            No bootcamps available yet.
          </div>

        /* ── Single bootcamp: featured + rocket sidebar ── */
        ) : isSingle ? (
          // Increased gap to lg:gap-8 to give more breathing room between card and rocket
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4 lg:gap-8 items-stretch">
            <div className="min-h-0">
              <FeaturedCard bc={displayed[0]} idx={0} shouldReduceMotion={!!shouldReduceMotion} />
            </div>
            {/* Rocket sidebar — hidden on mobile */}
            <div className="hidden lg:flex min-h-0">
              <RocketSidebar shouldReduceMotion={!!shouldReduceMotion} />
            </div>
          </div>

        /* ── Multiple bootcamps: card grid ── */
        ) : (
          <div className={`grid gap-4 grid-cols-1 ${
            displayed.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {displayed.map((bc, i) => {
              const isHPB  = bc.id === HPB_ID;
              const title  = isHPB ? HPB_TITLE       : bc.title;
              const desc   = isHPB ? HPB_DESCRIPTION : (bc.description || '');
              const image  = resolveImg(isHPB ? HPB_IMAGE : bc.image, PHASE_IMGS[i % PHASE_IMGS.length]);
              const level  = normalizeBootcampLevel(bc.level);
              const lvlCss = LEVEL_META[level];

              return (
                <motion.div
                  key={bc.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong"
                  style={{ boxShadow: 'var(--card-shimmer)' }}
                >
                  {/* Image thumbnail */}
                  <div className="relative w-full overflow-hidden bg-bg" style={{ paddingBottom: '52%' }}>
                    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
                    {image && (
                      <img
                        src={image}
                        alt={`${title} cover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-[1.03] group-hover:opacity-85 transition-all duration-500"
                      />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none z-10 bg-bg-card/20"
                    />
                    <span className={`absolute left-3 top-3 z-20 rounded-sm border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest ${lvlCss.color} ${lvlCss.bg} ${lvlCss.border}`}>
                      {level}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                    <h3 className="text-sm font-black text-text-primary leading-snug group-hover:text-accent transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">
                      {desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-muted font-mono border-t border-border pt-3">
                      {bc.duration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-accent/60" aria-hidden="true" />
                          {bc.duration}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-accent/60" aria-hidden="true" />
                        {bc.priceLabel || 'Free'}
                      </span>
                      <Link
                        to="/register"
                        className="ml-auto inline-flex items-center gap-1 text-accent font-black hover:underline underline-offset-2 py-1"
                        aria-label={`Enrol in ${title}`}
                      >
                        Enrol <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BootcampsSection;