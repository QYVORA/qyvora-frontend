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
      className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong lg:flex-row lg:h-[320px] w-full mx-auto"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {/* Image */}
      <div className="relative flex-none overflow-hidden bg-bg w-full h-40 sm:h-48 lg:h-full lg:w-[42%]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none hidden dark:block" />
        {image ? (
          <img
            src={image}
            alt={`${title} cover`}
            className="absolute inset-0 h-full w-full object-cover dark:opacity-80 transition-all duration-700 dark:group-hover:scale-[1.05] dark:group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-black text-accent/20 select-none">HPB</span>
          </div>
        )}
        {/* Mobile: subtle overlay instead of gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10 hidden dark:block lg:hidden dark:bg-bg-card/20"
        />
        {/* Desktop: subtle overlay instead of gradient fade */}
        <div
          className="absolute inset-0 pointer-events-none z-10 hidden dark:lg:block dark:bg-bg-card/20"
        />
        <div className="absolute right-3 top-3 z-20">
          <span className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md ${levelCss.color} ${levelCss.bg} ${levelCss.border}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-center p-4 lg:p-5">
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
    // Increased padding and adjusted alignment
    className="flex flex-col items-center justify-center h-full min-h-0 py-2 pl-0 lg:pl-10"
  >
    {/* Eyebrow label */}
    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-text-muted mb-4 text-center">
      Launch your career
    </p>

    {/* Rocket */}
    <div className="relative flex items-center justify-center w-full flex-1 min-h-0">
      {/* Subtle sage-green glow behind the rocket */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <motion.img
        src="/assets/illustrations/rocket-visual.webp"
        alt="Launch your career"
        // Increased max-w for a more significant illustration presence
        className="relative z-10 w-full max-w-[200px] lg:max-w-[240px] xl:max-w-[280px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_24px_rgba(136,173,124,0.3)]"
        draggable={false}
        animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
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
    <div className="w-full h-full flex items-center overflow-hidden py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10 w-full">
        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-border bg-bg-card animate-pulse overflow-hidden h-44 lg:h-52" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-xl border border-border bg-bg h-14 animate-pulse" />
              ))}
            </div>
          </div>

        /* Empty */
        ) : bootcamps.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg p-10 text-center text-text-muted text-sm">
            No bootcamps available yet.
          </div>

        /* Single bootcamp: Header + card vertically aligned on left, rocket on right */
        ) : isSingle ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_280px] gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-5">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-accent/40" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                  Offensive Security Training
                </span>
              </div>

              {/* Heading */}
              <div className="flex flex-col">
                <AsciiHeading
                  text="Bootcamps"
                  font="ANSI Shadow"
                  align="left"
                  animated
                  compact
                  className="mb-1"
                />
                <p className="text-text-secondary text-sm max-w-lg leading-relaxed opacity-80">
                  Phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
                </p>
              </div>

              {/* Card - Taller and narrower on desktop */}
              <div className="min-h-0 w-full lg:max-w-2xl">
                <FeaturedCard bc={displayed[0]} idx={0} shouldReduceMotion={!!shouldReduceMotion} />
              </div>
            </div>

            {/* Rocket sidebar — hidden on mobile */}
            <div className="hidden lg:flex min-h-0">
              <RocketSidebar shouldReduceMotion={!!shouldReduceMotion} />
            </div>
          </div>

        /* Multiple bootcamps: card grid */
        ) : (
          <>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-accent/40" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                Offensive Security Training
              </span>
            </div>

            {/* Heading */}
            <div className="flex flex-col mb-3 lg:mb-2">
              <AsciiHeading
                text="Bootcamps"
                font="ANSI Shadow"
                align="left"
                animated
                compact
                className="mb-1"
              />
              <p className="text-text-secondary text-sm max-w-lg leading-relaxed opacity-80">
                Phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
              </p>
            </div>

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
                    <div className="relative w-full overflow-hidden bg-bg" style={{ paddingBottom: '44%' }}>
                      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none hidden dark:block" />
                      {image && (
                        <img
                          src={image}
                          alt={`${title} cover`}
                          className="absolute inset-0 w-full h-full object-cover dark:opacity-70 dark:group-hover:scale-[1.03] dark:group-hover:opacity-100 transition-all duration-500"
                        />
                      )}
                      <div
                        className="absolute inset-0 pointer-events-none z-10 hidden dark:block dark:bg-bg-card/20"
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
          </>
        )}
      </div>
    </div>
  );
};

export default BootcampsSection;