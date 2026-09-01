import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FlaskConical, Zap, Clock } from 'lucide-react';
import { IconArrowRight as IconArrow } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { Footer } from '@/shared/components/layout';
import { CpLogo } from '@/shared/components';
import { SimpleHeading } from '@/shared/components/ui';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { Carousel } from '@/shared/components/carousel';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import CourseBadge from '@/shared/components/CourseBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import {
  CP_HERO,
  CP_PILLARS,
  CP_PHILOSOPHY_STAGES,
  CP_REWARD_MATRIX,
  CP_LEARNING_LOOP,
  CP_FUTURE_CHAIN,
} from '@/features/marketing/data/cpPageData';
import type { CpActivityStatus } from '@/features/marketing/data/cpPageData';

/** Beginner-friendly starter courses for the "Start Your Journey" carousel. */
const STARTER_COURSES = COURSES.filter((c) => c.skillLevel === 'beginner').slice(0, 6);

const STATUS_STYLES: Record<CpActivityStatus, { dot: string; text: string }> = {
  VERIFIED: { dot: 'bg-accent', text: 'text-accent' },
  COMPLETED: { dot: 'bg-accent/60', text: 'text-text-secondary' },
  'IN PROGRESS': { dot: 'bg-text-muted animate-pulse', text: 'text-text-muted' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const CyberCoinPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title="Cyber Coin - QYVORA"
        description="CP: the QYVORA Cyber Coin. The reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem. Learn. Execute. Earn."
      />

      <PublicSnapLayout>

        {/* ── 01 · HERO ─────────────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh snap-section bg-bg">
          <StudentHeroSection
            title="CP"
            accentWord="Cyber Coin"
            titleClassName={PUBLIC_HERO_TITLE_CLASS}
            showGlobe
            description={CP_HERO.description}
            stats={[
              { label: 'Ecosystem', value: 'QYVORA' },
              { label: 'Protocol', value: 'Reward' },
            ]}
            rightContent={
              <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
                <CpLogo
                  className="w-[55%] xl:w-[48%] max-h-[56vh] object-contain"
                  alt="CP | QYVORA Cyber Coin logo"
                />
              </div>
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('what-is-cp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
              >
                Explore CP <IconArrow size={14} />
              </button>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                {CP_HERO.label}
              </span>
            </div>
          </StudentHeroSection>
        </section>

        {/* ── 02 · WHAT IS CP ───────────────────────────────────────────── */}
        <PublicSnapSection id="what-is-cp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <SimpleHeading
                text="A Reward System Built Around Capability."
                accentWords={1}
                accentPlacement="end"
                kicker="What is CP"
                align="left"
                description="CP connects achievement with cybersecurity development. Instead of rewarding passive engagement, QYVORA rewards operators for actually progressing through its ecosystem."
              />
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CP_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <ScrollReveal key={pillar.id} delay={i * 0.08}>
                    <div className="terminal-card group relative h-full rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 transition-colors duration-300 hover:border-accent/40">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-[10px] text-text-muted">{pillar.index}</span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mt-5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed mt-2">
                        {pillar.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </PublicSnapSection>

        {/* ── 03 · PHILOSOPHY ───────────────────────────────────────────── */}
        <PublicSnapSection id="philosophy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <SimpleHeading
                text="Knowledge Is Only the Beginning."
                accentWords={1}
                accentPlacement="end"
                kicker="The CP Philosophy"
                align="left"
                description="QYVORA is designed around the transition from consuming cybersecurity knowledge to actually executing it. The reward system reinforces that progression: every stage must be proven before the next one pays out."
              />
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className="relative rounded-2xl border border-border/50 bg-bg-card p-5 md:p-7">
                <div className="absolute left-[39px] md:left-[47px] top-10 bottom-10 w-px bg-border/30" aria-hidden="true" />
                {!prefersReducedMotion && (
                  <motion.span
                    className="absolute left-[35px] md:left-[43px] w-[9px] h-[9px] rounded-full bg-accent"
                    style={{ boxShadow: '0 0 8px var(--color-hero-glow)' }}
                    animate={{ top: ['12%', '88%'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
                    aria-hidden="true"
                  />
                )}
                <ol className="relative space-y-6">
                  {CP_PHILOSOPHY_STAGES.map((stage, i) => {
                    const isReward = stage.id === 'reward';
                    return (
                      <li key={stage.id} className="flex items-center gap-4">
                        <span
                          className={`relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center font-mono text-[10px] font-black shrink-0 ${
                            isReward
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-border/40 bg-bg-elevated text-text-muted'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm md:text-base font-black uppercase tracking-widest ${isReward ? 'text-accent' : 'text-text-primary'}`}>
                            {stage.label}
                          </p>
                        </div>
                        {isReward && (
                          <span className="ml-auto inline-flex items-center rounded-lg border border-accent/30 bg-accent/5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-accent shrink-0">
                            + CP
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── 04 · HOW YOU EARN CP — learning loop ──────────────────────── */}
        <PublicSnapSection id="earn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <SimpleHeading
                text="How You Earn CP."
                accentWords={1}
                accentPlacement="end"
                kicker="Reward Protocol"
                align="left"
                description="Progress through the QYVORA learning loop: learn, practice, break, build, verify, and every verified step is mapped to a CP issuance."
              />
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className="relative rounded-2xl border border-border/50 bg-bg-card p-5 md:p-7">
                <div className="absolute left-[39px] md:left-[47px] top-10 bottom-10 w-px bg-border/30" aria-hidden="true" />
                {!prefersReducedMotion && (
                  <motion.span
                    className="absolute left-[35px] md:left-[43px] w-[9px] h-[9px] rounded-full bg-accent"
                    style={{ boxShadow: '0 0 8px var(--color-hero-glow)' }}
                    animate={{ top: ['8%', '92%'], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }}
                    aria-hidden="true"
                  />
                )}
                <ol className="relative space-y-5">
                  {CP_LEARNING_LOOP.map((stage, i) => {
                    const isEarn = stage.id === 'earn';
                    return (
                      <li key={stage.id} className="flex items-center gap-4">
                        <span
                          className={`relative z-10 w-8 h-8 md:w-9 md:h-9 rounded-lg border flex items-center justify-center font-mono text-[10px] font-black shrink-0 ${
                            isEarn
                              ? 'border-on-accent bg-accent text-on-accent'
                              : 'border-border/40 bg-bg-elevated text-text-muted'
                          }`}
                        >
                          {stage.index}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm md:text-base font-black uppercase tracking-widest ${isEarn ? 'text-accent' : 'text-text-primary'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[10px] font-mono text-text-muted leading-relaxed mt-0.5 line-clamp-1">
                            {stage.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── 05 · REWARD MATRIX ────────────────────────────────────────── */}
        <PublicSnapSection id="rewards">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <SimpleHeading
                text="Verified Activity Rewards."
                accentWords={1}
                accentPlacement="end"
                kicker="Reward Matrix"
                align="left"
                description="No logins, no clicks: only completed, verified missions earn rewards. Every CP amount is issued by the platform on verification."
              />
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal>
                <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
                  <div className="hidden sm:grid grid-cols-[1.5fr_1fr_120px_150px] gap-4 px-5 md:px-6 py-3.5 border-b border-border/50 bg-bg-elevated">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Activity</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Category</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Reward</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted text-right sm:text-left">Status</span>
                  </div>
                  <ul className="divide-y divide-border/20">
                    {CP_REWARD_MATRIX.slice(0, 3).map((row) => {
                      const status = STATUS_STYLES[row.status];
                      return (
                        <li key={row.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_120px_150px] gap-x-4 gap-y-1.5 px-5 md:px-6 py-4 transition-colors duration-300 hover:bg-bg-elevated">
                          <span className="text-sm font-bold text-text-primary self-center">{row.activity}</span>
                          <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-text-muted self-center">{row.category}</span>
                          <span className="col-start-2 sm:col-start-3 row-start-1 font-mono text-sm font-black text-accent self-center text-right sm:text-left">{row.reward}</span>
                          <span className="col-span-2 sm:col-span-1 col-start-1 sm:col-start-4 inline-flex items-center gap-2 justify-end sm:justify-start">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${status.text}`}>{row.status}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── 06 · REWARD ACTIVITIES ─────────────────────────────────────── */}
        <PublicSnapSection id="activities">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal>
              <SimpleHeading
                text="All Verified Activities."
                accentWords={1}
                accentPlacement="end"
                kicker="Activity Matrix"
                align="left"
                description="Every completed, verified activity earns CP. The full matrix of rewarded activities and their categories."
              />
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal>
                <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
                  <ul className="divide-y divide-border/20">
                    {CP_REWARD_MATRIX.slice(3).map((row) => {
                      const status = STATUS_STYLES[row.status];
                      return (
                        <li key={row.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_120px_150px] gap-x-4 gap-y-1.5 px-5 md:px-6 py-4 transition-colors duration-300 hover:bg-bg-elevated">
                          <span className="text-sm font-bold text-text-primary self-center">{row.activity}</span>
                          <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-text-muted self-center">{row.category}</span>
                          <span className="col-start-2 sm:col-start-3 row-start-1 font-mono text-sm font-black text-accent self-center text-right sm:text-left">{row.reward}</span>
                          <span className="col-span-2 sm:col-span-1 col-start-1 sm:col-start-4 inline-flex items-center gap-2 justify-end sm:justify-start">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${status.text}`}>{row.status}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ScrollReveal>
              <p className="text-[9px] md:text-[10px] font-mono text-text-muted leading-relaxed md:text-right">
                Reward values are defined per activity by the QYVORA protocol. Values shown are placeholders. Concrete CP amounts are issued by the platform on verification.
              </p>
            </div>
          </div>
        </PublicSnapSection>
        {/* ── 07 · FUTURE / BLOCKCHAIN LAYER ────────────────────────────── */}
        <PublicSnapSection id="future">
          <div className="space-y-8">
            <ScrollReveal>
              <SimpleHeading
                text="Built for the Next Layer."
                accentWords={1}
                accentPlacement="end"
                kicker="Future Architecture // Planned"
                align="left"
                description="CP is designed with a future-ready architecture that can connect verified cybersecurity achievements with a blockchain-backed reward infrastructure."
              />
            </ScrollReveal>

            <div className="-mx-3 md:-mx-4 lg:-mx-6 overflow-x-clip overflow-y-visible">
              <DragMarquee speed={20} trackClassName="gap-4 px-2" className="overflow-hidden w-full">
              {CP_FUTURE_CHAIN.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`shrink-0 w-[220px] md:w-[260px] rounded-2xl border p-5 md:p-6 ${
                      step.planned
                        ? 'border-dashed border-border/40 bg-transparent'
                        : 'border-accent/50 bg-bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[9px] text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                          step.planned
                            ? 'border border-dashed border-border/50 text-text-muted'
                            : 'border border-accent/30 bg-accent/5 text-accent'
                        }`}
                      >
                        {step.planned ? 'Planned' : 'Active'}
                      </span>
                    </div>
                    <p className={`text-xs md:text-sm font-black uppercase tracking-widest ${step.planned ? 'text-text-muted' : 'text-text-primary'}`}>
                      {step.label}
                    </p>
                  </div>
                  <IconArrow size={16} className="shrink-0 text-accent/40 self-center" aria-hidden="true" />
                </React.Fragment>
              ))}
            </DragMarquee>
            </div>

            <ScrollReveal>
              <div className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 flex items-start gap-3">
                <FlaskConical className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[10px] md:text-xs font-mono text-text-muted leading-relaxed">
                  CP currently functions as the QYVORA platform reward system. Blockchain-backed settlement and portable digital proof are planned future layers. They are not deployed, and CP is not a publicly tradable asset.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── 08 · START YOUR JOURNEY ───────────────────────────────────── */}
        <PublicSnapSection id="journey">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">
            <ScrollReveal>
              <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
                <SimpleHeading
                  text="Begin With Your First Course."
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Start Your Journey"
                  align="left"
                  description="Every completed course is verified and feeds your CP balance. Start where every operator starts, the fundamentals."
                />
                <Link
                  to="/courses"
                  className="btn-secondary inline-flex items-center justify-center gap-2 !px-5 !py-2.5 self-start shrink-0 mt-6"
                >
                  View All Courses <IconArrow size={14} />
                </Link>
              </div>
            </ScrollReveal>

            <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center">
              <Carousel
                slides={STARTER_COURSES}
                showArrows={false}
                className="w-full"
                renderCard={(course) => {
                  const category = getCategoryById(course.categoryId);
                  return (
                    <Link
                      to={`/courses/${course.id}`}
                      className="group relative overflow-hidden flex flex-col md:flex-row bg-bg-card rounded-2xl border border-border/50 transition-[transform,box-shadow,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/40 h-full min-h-[340px] md:min-h-[280px]"
                    >
                      <div className="relative flex flex-col items-start text-left p-5 sm:p-6 md:p-7 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {category && (
                            <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-accent/10 border border-accent/20 rounded-full text-accent">
                              {category.name}
                            </span>
                          )}
                          <DifficultyBadge difficulty={course.skillLevel} />
                        </div>
                        <h3 className="text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono border-l-2 border-accent/40 pl-3 py-1.5 mb-4 line-clamp-3 flex-1">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between gap-3 w-full pt-3 mt-auto">
                          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono text-text-muted shrink-0 min-w-0">
                            <span className="flex items-center gap-1 whitespace-nowrap min-w-0">
                              <Clock size={12} className="shrink-0" /> {course.estimatedMinutes}min
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap min-w-0">
                              <Zap size={12} className="shrink-0" /> {course.lessons.length || 0} lessons
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-accent group-hover:gap-1.5 transition-[gap] duration-[var(--dur-base)] ease-[var(--ease-smooth)] whitespace-nowrap shrink-0 min-w-0">
                            View Course <IconArrow size={12} className="shrink-0" />
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex relative w-[140px] lg:w-[160px] shrink-0 items-center justify-center border-l border-border/30">
                        <CourseBadge courseId={course.id} className="w-24 h-24 lg:w-28 lg:h-28" />
                      </div>
                    </Link>
                  );
                }}
              />
            </div>
          </div>
        </PublicSnapSection>

        {/* ── 09 · FOOTER ───────────────────────────────────────────────── */}
        <section className="w-full bg-bg snap-section pt-10 md:pt-16">
          <Footer />
        </section>

      </PublicSnapLayout>
    </div>
  );
};

export default CyberCoinPage;
