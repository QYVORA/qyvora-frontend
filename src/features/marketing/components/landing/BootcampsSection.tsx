import React from 'react';
import { ArrowRight, Clock, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import type { BootcampLevel } from '../../../student/components/BootcampCard';
import { PHASE_IMGS, type Bootcamp } from './types';
import { resolveImg } from './helpers';

interface BootcampsSectionProps {
  bootcamps: Bootcamp[];
  loading?: boolean;
}

const BOOTCAMP_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];

const normalizeBootcampLevel = (level?: string): BootcampLevel =>
  BOOTCAMP_LEVELS.includes(level as BootcampLevel) ? (level as BootcampLevel) : 'Operator';

const LEVEL_META: Record<BootcampLevel, { color: string; bg: string; border: string }> = {
  Novice:     { color: 'text-blue-400',   bg: 'bg-blue-400/8',   border: 'border-blue-400/25'   },
  Operator:   { color: 'text-accent',     bg: 'bg-accent-dim',   border: 'border-accent/25'     },
  Specialist: { color: 'text-amber-400',  bg: 'bg-amber-400/8',  border: 'border-amber-400/25'  },
  Elite:      { color: 'text-red-400',    bg: 'bg-red-400/8',    border: 'border-red-400/25'    },
};

const HPB_ID          = 'bc_1775270338500';
const HPB_TITLE       = 'Hacker Protocol Bootcamp';
const HPB_DESCRIPTION = 'Hacker Protocol Bootcamp (HPB) teaches beginners to think like hackers — covering networking, Linux, web, and social engineering with hands-on labs and CTFs.';
const HPB_IMAGE       = '/assets/bootcamp/hpb-cover.webp';

// Teaser items shown alongside the featured card when only 1 bootcamp exists
const COMING_SOON = [
  { title: 'Web Application Pentesting',  level: 'Operator'   as BootcampLevel, eta: 'Q3 2025' },
  { title: 'Advanced Exploit Dev',        level: 'Elite'       as BootcampLevel, eta: 'Q4 2025' },
  { title: 'Red Team Operations',         level: 'Specialist'  as BootcampLevel, eta: 'Q4 2025' },
];

// ── Featured single-bootcamp card ────────────────────────────────────────────
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
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
      className="group relative flex flex-col lg:flex-row rounded-xl border border-border bg-bg-card overflow-hidden
                 hover:border-accent/30 transition-colors duration-300"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
      />

      {/* ── Cover image ── */}
      <div className="relative lg:w-[45%] flex-none overflow-hidden bg-bg" style={{ minHeight: '200px' }}>
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, var(--color-accent-dim) 0%, transparent 70%)' }}
        />
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.03] transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-black text-accent/20 select-none">HPB</span>
          </div>
        )}
        {/* Gradient overlay — blends into card body on desktop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, var(--color-bg-card) 100%), linear-gradient(to right, transparent 70%, var(--color-bg-card) 100%)',
          }}
        />
        {/* Level badge — pinned top-left */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border ${levelCss.color} ${levelCss.bg} ${levelCss.border} font-mono`}>
            {level}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-6 lg:p-8 justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3">Featured Bootcamp</p>

        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-text-primary leading-tight mb-3 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>

        <p className="text-sm text-text-muted leading-relaxed mb-5 max-w-lg line-clamp-3">
          {desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-6 text-xs text-text-muted font-mono">
          {bc.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent/60" />
              {bc.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-accent/60" />
            {bc.priceLabel || 'Free'}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="btn-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
          >
            Enrol Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/bootcamps"
            className="text-xs font-black text-accent/70 hover:text-accent transition-colors uppercase tracking-widest inline-flex items-center gap-1 group/link"
          >
            View all <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ── Coming-soon teaser card ───────────────────────────────────────────────────
const TeaserCard: React.FC<{
  item: typeof COMING_SOON[0];
  idx: number;
  shouldReduceMotion: boolean;
}> = ({ item, idx, shouldReduceMotion }) => {
  const levelCss = LEVEL_META[item.level];
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
      className="flex items-center gap-4 rounded-xl border border-border bg-bg px-4 py-3.5
                 opacity-60 hover:opacity-80 transition-opacity duration-200"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {/* Index */}
      <span className="font-mono text-xs font-black text-accent/30 w-6 flex-none">
        {String(idx + 2).padStart(2, '0')}
      </span>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-text-secondary truncate">{item.title}</div>
        <div className="text-[9px] uppercase tracking-widest text-text-muted mt-0.5">{item.eta}</div>
      </div>
      {/* Level pill */}
      <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border font-mono flex-none ${levelCss.color} ${levelCss.bg} ${levelCss.border}`}>
        {item.level}
      </span>
      {/* Coming soon tag */}
      <span className="text-[8px] font-black uppercase tracking-widest text-text-muted border border-border rounded px-1.5 py-0.5 flex-none">
        Soon
      </span>
    </motion.div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayed = bootcamps.slice(0, 3);
  const isSingle  = displayed.length === 1;

  return (
    <section className="
      pt-28 pb-20 bg-bg-card border-y border-border relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <img
        src="/assets/sections/backgrounds/employee-training-bg.webp"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-none tracking-tight">
              Bootcamps Built<br className="hidden sm:block" /> For Operators
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Link
              to="/bootcamps"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4 group"
            >
              Explore all
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* ── Skeleton ── */}
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

        /* ── Single bootcamp: featured card + teaser sidebar ── */
        ) : isSingle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 items-stretch">
            {/* Featured card spans 2 columns */}
            <div className="lg:col-span-2">
              <FeaturedCard bc={displayed[0]} idx={0} shouldReduceMotion={!!shouldReduceMotion} />
            </div>

            {/* Teaser sidebar */}
            <div className="flex flex-col justify-center gap-3">
              <ScrollReveal delay={0.05}>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted mb-1 px-1">
                  Coming soon
                </p>
              </ScrollReveal>
              {COMING_SOON.map((item, idx) => (
                <TeaserCard key={idx} item={item} idx={idx} shouldReduceMotion={!!shouldReduceMotion} />
              ))}
            </div>
          </div>

        /* ── Multiple bootcamps: normal grid ── */
        ) : (
          <div className={`grid gap-5 grid-cols-1 ${
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
                  className="group relative flex flex-col rounded-xl border border-border bg-bg-card overflow-hidden
                             hover:border-accent/30 transition-colors duration-300"
                  style={{ boxShadow: 'var(--card-shimmer)' }}
                >
                  {/* Cover */}
                  <div className="relative overflow-hidden bg-bg" style={{ aspectRatio: '16/8' }}>
                    <div className="absolute inset-0 dot-grid opacity-10" />
                    {image && (
                      <img
                        src={image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.03] group-hover:opacity-80 transition-all duration-500"
                      />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, var(--color-bg-card) 0%, transparent 60%)' }}
                    />
                    <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border font-mono ${lvlCss.color} ${lvlCss.bg} ${lvlCss.border}`}>
                      {level}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <h3 className="text-sm font-black text-text-primary leading-snug group-hover:text-accent transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">{desc}</p>
                    <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono border-t border-border pt-3">
                      {bc.duration && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-accent/60" />{bc.duration}</span>}
                      <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3 text-accent/60" />{bc.priceLabel || 'Free'}</span>
                      <Link to="/register" className="ml-auto inline-flex items-center gap-1 text-accent font-black hover:underline underline-offset-2">
                        Enrol <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default BootcampsSection;