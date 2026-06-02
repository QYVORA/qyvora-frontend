import React from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { BootcampLevel } from '../../../student/components/BootcampCard';
import { PHASE_IMGS, type Bootcamp } from './types';
import { resolveImg } from './helpers';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BootcampsSectionProps {
  bootcamps: Bootcamp[];
  loading?: boolean;
}

// ─── Level helpers ────────────────────────────────────────────────────────────

const BOOTCAMP_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];

const normalizeBootcampLevel = (level?: string): BootcampLevel =>
  BOOTCAMP_LEVELS.includes(level as BootcampLevel) ? (level as BootcampLevel) : 'Operator';

// ─── HPB constants ────────────────────────────────────────────────────────────

const HPB_ID          = 'bc_1775270338500';
const HPB_TITLE       = 'Hacker Protocol Bootcamp';
const HPB_DESCRIPTION = 'Hacker Protocol Bootcamp (HPB) teaches beginners to think like hackers — covering networking, Linux, web, and social engineering with hands-on labs and CTFs.';
const HPB_IMAGE       = '/assets/bootcamp/hpb-cover.webp';

// ─── FeaturedCard ─────────────────────────────────────────────────────────────

const FeaturedCard: React.FC<{
  bc: Bootcamp;
  idx: number;
}> = ({ bc, idx }) => {
  const isHPB    = bc.id === HPB_ID;
  const title    = isHPB ? HPB_TITLE       : bc.title;
  const desc     = isHPB ? HPB_DESCRIPTION : (bc.description || '');
  const image    = resolveImg(isHPB ? HPB_IMAGE : bc.image, PHASE_IMGS[idx % PHASE_IMGS.length]);
  const level    = normalizeBootcampLevel(bc.level);

  return (
    <div
      className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong lg:flex-row lg:h-[320px] w-full mx-auto"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {/* Image */}
      <div className="relative flex-none overflow-hidden bg-bg w-full h-40 sm:h-48 lg:h-full lg:w-[42%]">
        {image ? (
          <img
            src={image}
            alt={`${title} cover`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 dark:group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-black text-accent/20 select-none">HPB</span>
          </div>
        )}
        <div className="absolute right-3 top-3 z-20">
          <span className="rounded-sm border border-white/60 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
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
    </div>
  );
};

// ─── RocketSidebar ────────────────────────────────────────────────────────────

const RocketSidebar: React.FC<{ shouldReduceMotion: boolean }> = ({ shouldReduceMotion }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-0 py-2 pl-0 lg:pl-10">
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
  </div>
);

// ─── BootcampsSection ─────────────────────────────────────────────────────────

const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayed = bootcamps.slice(0, 3);
  const isSingle  = displayed.length === 1;

  return (
    <div className="w-full min-h-full flex items-center py-12 lg:py-16">
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_280px] gap-12 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="flex flex-col gap-8 lg:gap-5">
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
                <FeaturedCard bc={displayed[0]} idx={0} />
              </div>
            </ScrollReveal>

            {/* Rocket sidebar — hidden on mobile */}
            <ScrollReveal direction="right" className="hidden lg:flex min-h-0">
              <RocketSidebar shouldReduceMotion={!!shouldReduceMotion} />
            </ScrollReveal>
          </div>

        /* Multiple bootcamps: card grid */
        ) : (
          <>
            <ScrollReveal direction="up" amount={0.2} className="mb-12 lg:mb-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-2">
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
            </ScrollReveal>

            <ScrollReveal 
              direction="up" 
              amount={0.1} 
              staggerChildren={0.1}
              className={`grid gap-4 grid-cols-1 ${
                displayed.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {displayed.map((bc, i) => {
                const isHPB  = bc.id === HPB_ID;
                const title  = isHPB ? HPB_TITLE       : bc.title;
                const desc   = isHPB ? HPB_DESCRIPTION : (bc.description || '');
                const image  = resolveImg(isHPB ? HPB_IMAGE : bc.image, PHASE_IMGS[i % PHASE_IMGS.length]);
                const level  = normalizeBootcampLevel(bc.level);

                return (
                  <motion.div
                    key={bc.id}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
                      visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                    }}
                    className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong"
                    style={{ boxShadow: 'var(--card-shimmer)' }}
                  >
                    {/* Image thumbnail */}
                    <div className="relative w-full overflow-hidden bg-bg" style={{ paddingBottom: '44%' }}>
                      {image && (
                        <img
                          src={image}
                          alt={`${title} cover`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 dark:group-hover:scale-[1.03]"
                        />
                      )}
                      <span className="absolute left-3 top-3 z-20 rounded-sm border border-white/60 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
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
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
};

export default BootcampsSection;
