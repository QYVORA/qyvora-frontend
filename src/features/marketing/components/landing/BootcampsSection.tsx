import React from 'react';
import { ArrowRight, BookOpen, Clock, Flag, Tag, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
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

// ─── Sidebar signal items ─────────────────────────────────────────────────────

const BOOTCAMP_SIGNALS = [
  { icon: Terminal, title: 'Hands-on rooms', value: 'Live labs and operator drills' },
  { icon: BookOpen, title: 'Five-phase path', value: 'Mindset, Linux, networks, web, social' },
  { icon: Flag,     title: 'CTF checkpoints', value: 'Practice flags mapped to the curriculum' },
];

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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong lg:flex-row"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      <div
        className="relative flex-none overflow-hidden bg-bg h-52 sm:h-64 lg:h-auto lg:w-[45%]"
        style={{ minHeight: '220px' }}
      >
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

        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: [
              'linear-gradient(to bottom, transparent 10%, var(--color-bg-card) 98%)',
              'linear-gradient(to right, transparent 60%, var(--color-bg-card) 98%)',
            ].join(', '),
          }}
        />

        <div className="absolute right-3 top-3 z-20">
          <span className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md ${levelCss.color} ${levelCss.bg} ${levelCss.border}`}>
            {level}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6 lg:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">
          Featured Bootcamp
        </p>

        <h3 className="mb-3 text-xl font-black leading-tight text-text-primary transition-colors duration-200 group-hover:text-accent md:text-2xl lg:text-3xl">
          {title}
        </h3>

        <p className="mb-5 max-w-lg text-sm leading-relaxed text-text-secondary sm:line-clamp-3">
          {desc}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-xs text-text-muted font-mono">
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

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2 min-h-[44px]"
          >
            Enrol Now <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── TeaserCard ───────────────────────────────────────────────────────────────

const TeaserCard: React.FC<{
  item: (typeof BOOTCAMP_SIGNALS)[number];
  idx: number;
  shouldReduceMotion: boolean;
}> = ({ item, idx, shouldReduceMotion }) => {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card flex items-start gap-3 rounded-2xl border border-border bg-bg-card px-4 py-4 min-h-[56px] transition-colors duration-200 hover:border-border-strong"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-border bg-bg text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-black uppercase tracking-[0.18em] text-text-primary">
          {item.title}
        </div>
        <div className="mt-1 text-xs leading-relaxed text-text-muted">
          {item.value}
        </div>
      </div>
    </motion.div>
  );
};

// ─── BootcampsSection ─────────────────────────────────────────────────────────

const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayed = bootcamps.slice(0, 3);
  const isSingle  = displayed.length === 1;

  return (
    <div className="w-full h-full flex items-center py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-2 md:px-10 relative z-10 w-full overflow-hidden">
        
        <div className="flex flex-col mb-8 md:mb-10 px-2 md:px-0">
          <div className="w-full">
            <AsciiHeading text="Bootcamps" font="ANSI Shadow" align="left" animated className="mb-4" />
            <p className="text-text-secondary text-sm mt-2 max-w-lg leading-relaxed">
              Phased training tracks with mission-based checkpoints. Pick a program, enroll, and execute.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-xl border border-border bg-bg-card animate-pulse overflow-hidden" style={{ minHeight: 220 }}>
              <div className="h-40 lg:h-full bg-accent-dim/20" />
            </div>
            <div className="flex flex-col gap-3">
              {[0,1,2].map(i => (
                <div key={i} className="rounded-xl border border-border bg-bg h-14 animate-pulse" />
              ))}
            </div>
          </div>

        ) : bootcamps.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg p-10 text-center text-text-muted text-sm">
            No bootcamps available yet.
          </div>

        ) : isSingle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-center lg:scale-[0.9] lg:-translate-y-8 origin-left">
            <div className="lg:col-span-2">
              <FeaturedCard bc={displayed[0]} idx={0} shouldReduceMotion={!!shouldReduceMotion} />
            </div>
            <div className="flex flex-col justify-center gap-3">
              <ScrollReveal delay={0.05}>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted mb-1 px-1">
                  What you train
                </p>
              </ScrollReveal>
              {BOOTCAMP_SIGNALS.map((item, idx) => (
                <TeaserCard key={idx} item={item} idx={idx} shouldReduceMotion={!!shouldReduceMotion} />
              ))}
            </div>
          </div>

        ) : (
          <div className={`grid gap-x-5 gap-y-0 grid-cols-1 ${
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
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
                  className="terminal-card group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors duration-300 hover:border-border-strong lg:scale-[0.9] lg:-translate-y-10 origin-left"
                  style={{ boxShadow: 'var(--card-shimmer)' }}
                >
                  <div className="relative w-full overflow-hidden bg-bg" style={{ paddingBottom: '52.5%' }}>
                    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

                    {image && (
                      <img
                        src={image}
                        alt={`${title} cover`}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-[1.03] group-hover:opacity-85 transition-all duration-500"
                      />
                    )}

                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{ background: 'linear-gradient(to top, var(--color-bg-card) 5%, transparent 70%)' }}
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
