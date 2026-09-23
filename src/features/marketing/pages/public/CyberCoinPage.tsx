import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Zap, Clock, Trophy } from 'lucide-react';
import { IconArrowRight as IconArrow } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import { CpLogo } from '@/shared/components';
import { SimpleHeading } from '@/shared/components/ui';
import { Carousel } from '@/shared/components/carousel';
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
import cpHeaderBg from '@/assets/backgrounds/cp-header.webp';

/** Beginner-friendly starter courses for the "Start Your Journey" carousel. */
const STARTER_COURSES = COURSES.filter((c) => c.skillLevel === 'beginner').slice(0, 6);

const STATUS_STYLES: Record<CpActivityStatus, { dot: string; text: string }> = {
  VERIFIED: { dot: 'bg-accent', text: 'text-accent' },
  COMPLETED: { dot: 'bg-accent/60', text: 'text-text-secondary' },
  'IN PROGRESS': { dot: 'bg-text-muted animate-pulse', text: 'text-text-muted' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const CyberCoinPage: React.FC = () => {
  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO
        title="Cyber Coin - QYVORA"
        description="CP: the QYVORA Cyber Coin. The reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem. Learn. Execute. Earn."
      />

      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <div className="relative overflow-hidden rounded-2xl" data-theme-persist="dark">
          <img
            src={cpHeaderBg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          />
          <div className="relative px-4 py-10 sm:px-6 md:px-8 md:py-14 lg:flex lg:min-h-[440px] lg:flex-col lg:justify-center">
            <PageHeader
              kicker="QYVORA · Economy"
              title="CP Cyber Coin"
              description={CP_HERO.description}
              metadata={
                <span className="type-meta inline-flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {CP_HERO.label}
                </span>
              }
              actions={
                <button
                  type="button"
                  onClick={() => document.getElementById('what-is-cp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-6"
                >
                  Explore CP <IconArrow size={14} />
                </button>
              }
            />
          </div>
        </div>

        <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          {/* ── 02 · WHAT IS CP — centered heading + pillars grid ─────────── */}
          <section id="what-is-cp" className="flex w-full scroll-mt-24 flex-col items-center gap-8">
            <ScrollReveal>
              <SimpleHeading
                compact
                text="A Reward System Built Around Capability."
                accentWords={1}
                accentPlacement="end"
                kicker="What is CP"
                align="center"
                description="CP connects achievement with cybersecurity development. Instead of rewarding passive engagement, QYVORA rewards operators for actually progressing through its ecosystem."
                descriptionWidth="max-w-xl"
                className="max-w-2xl"
              />
            </ScrollReveal>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CP_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.id} className="group relative h-full rounded-2xl border border-border-subtle bg-surface p-5 transition-colors duration-300 hover:border-accent/40 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                      </div>
                      <span className="type-meta">{pillar.index}</span>
                    </div>
                    <h3 className="mt-5 text-sm font-black uppercase tracking-widest text-text-primary">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 03 · PHILOSOPHY — split: heading left, stages card right ──── */}
          <section id="philosophy" className="grid w-full scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <ScrollReveal>
                <SimpleHeading
                  compact
                  text="Knowledge Is Only the Beginning."
                  accentWords={1}
                  accentPlacement="end"
                  kicker="The CP Philosophy"
                  align="left"
                  description="QYVORA is designed around the transition from consuming cybersecurity knowledge to actually executing it. The reward system reinforces that progression: every stage must be proven before the next one pays out."
                  descriptionWidth="max-w-xl"
                />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1}>
              <div className="relative rounded-2xl border border-border-subtle bg-surface p-5 md:p-7">
                <div className="absolute bottom-10 left-[39px] top-10 w-px bg-border/30 md:left-[47px]" aria-hidden="true" />
                <ol className="relative space-y-6">
                  {CP_PHILOSOPHY_STAGES.map((stage, i) => {
                    const isReward = stage.id === 'reward';
                    return (
                      <li key={stage.id} className="flex items-center gap-4">
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-black md:h-9 md:w-9 ${
                            isReward
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-border-subtle bg-surface-raised text-text-muted'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-black uppercase tracking-widest md:text-base ${isReward ? 'text-accent' : 'text-text-primary'}`}>
                            {stage.label}
                          </p>
                        </div>
                        {isReward && (
                          <span className="ml-auto inline-flex shrink-0 items-center rounded-lg border border-accent/30 bg-accent/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-accent">
                            + CP
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </ScrollReveal>
          </section>

          {/* ── 04 · HOW YOU EARN CP — split (reversed): loop card left ───── */}
          <section id="earn" className="grid w-full scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div className="relative rounded-2xl border border-border-subtle bg-surface p-5 md:p-7">
                <div className="absolute bottom-10 left-[39px] top-10 w-px bg-border/30 md:left-[47px]" aria-hidden="true" />
                <ol className="relative space-y-5">
                  {CP_LEARNING_LOOP.map((stage, i) => {
                    const isEarn = stage.id === 'earn';
                    return (
                      <li key={stage.id} className="flex items-center gap-4">
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-black md:h-9 md:w-9 ${
                            isEarn
                              ? 'border-on-accent bg-accent text-on-accent'
                              : 'border-border-subtle bg-surface-raised text-text-muted'
                          }`}
                        >
                          {stage.index}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-black uppercase tracking-widest md:text-base ${isEarn ? 'text-accent' : 'text-text-primary'}`}>
                            {stage.label}
                          </p>
                          <p className="mt-0.5 font-mono text-xs leading-relaxed text-text-muted line-clamp-1">
                            {stage.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </ScrollReveal>

            <div className="flex flex-col justify-center">
              <ScrollReveal delay={0.1}>
                <SimpleHeading
                  compact
                  text="How You Earn CP."
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Reward Protocol"
                  align="left"
                  description="Progress through the QYVORA learning loop: learn, practice, break, build, verify, and every verified step is mapped to a CP issuance."
                  descriptionWidth="max-w-xl"
                />
              </ScrollReveal>
            </div>
          </section>

          {/* ── 05 · REWARD MATRIX — stacked heading + full-width table ───── */}
          <section id="rewards" className="flex w-full scroll-mt-24 flex-col gap-8">
            <ScrollReveal>
              <SimpleHeading
                compact
                text="Verified Activity Rewards."
                accentWords={1}
                accentPlacement="end"
                kicker="Reward Matrix"
                align="left"
                description="No logins, no clicks: only completed, verified missions earn rewards. Every CP amount is issued by the platform on verification."
                descriptionWidth="max-w-2xl"
                className="max-w-2xl"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                <div className="hidden bg-surface-raised sm:grid grid-cols-[1.5fr_1fr_120px_150px] gap-4 border-b border-border-subtle px-5 py-3.5 md:px-6">
                  <span className="type-meta font-black uppercase tracking-widest text-text-muted">Activity</span>
                  <span className="type-meta font-black uppercase tracking-widest text-text-muted">Category</span>
                  <span className="type-meta font-black uppercase tracking-widest text-text-muted">Reward</span>
                  <span className="type-meta font-black uppercase tracking-widest text-right text-text-muted sm:text-left">Status</span>
                </div>
                <ul className="divide-y divide-border/20">
                  {CP_REWARD_MATRIX.slice(0, 3).map((row) => {
                    const status = STATUS_STYLES[row.status];
                    return (
                      <li key={row.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-5 py-4 transition-colors duration-300 hover:bg-surface-raised sm:grid-cols-[1.5fr_1fr_120px_150px] md:px-6">
                        <span className="self-center text-sm font-bold text-text-primary">{row.activity}</span>
                        <span className="hidden self-center type-meta font-black uppercase tracking-widest text-text-muted sm:block">{row.category}</span>
                        <span className="col-start-2 self-center font-mono text-sm font-black text-right text-accent sm:col-start-3 sm:row-start-1 sm:text-left">{row.reward}</span>
                        <span className="col-span-2 col-start-1 inline-flex items-center gap-2 justify-end self-center sm:col-span-1 sm:col-start-4 sm:justify-start">
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                          <span className={`type-meta font-black uppercase tracking-widest ${status.text}`}>{row.status}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
          </section>

          {/* ── 06 · REWARD ACTIVITIES — stacked heading + full-width list ── */}
          <section id="activities" className="flex w-full scroll-mt-24 flex-col gap-8">
            <ScrollReveal>
              <SimpleHeading
                compact
                text="All Verified Activities."
                accentWords={1}
                accentPlacement="end"
                kicker="Activity Matrix"
                align="left"
                description="Every completed, verified activity earns CP. The full matrix of rewarded activities and their categories."
                descriptionWidth="max-w-2xl"
                className="max-w-2xl"
              />
            </ScrollReveal>

            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                <ul className="divide-y divide-border/20">
                  {CP_REWARD_MATRIX.slice(3).map((row) => {
                    const status = STATUS_STYLES[row.status];
                    return (
                      <li key={row.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 px-5 py-4 transition-colors duration-300 hover:bg-surface-raised sm:grid-cols-[1.5fr_1fr_120px_150px] md:px-6">
                        <span className="self-center text-sm font-bold text-text-primary">{row.activity}</span>
                        <span className="hidden self-center type-meta font-black uppercase tracking-widest text-text-muted sm:block">{row.category}</span>
                        <span className="col-start-2 self-center font-mono text-sm font-black text-right text-accent sm:col-start-3 sm:row-start-1 sm:text-left">{row.reward}</span>
                        <span className="col-span-2 col-start-1 inline-flex items-center gap-2 justify-end self-center sm:col-span-1 sm:col-start-4 sm:justify-start">
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                          <span className={`type-meta font-black uppercase tracking-widest ${status.text}`}>{row.status}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollReveal>
            <p className="font-mono text-xs leading-relaxed text-text-muted md:text-right">
              Reward values are defined per activity by the QYVORA protocol. Values shown are placeholders. Concrete CP amounts are issued by the platform on verification.
            </p>
          </section>

          {/* ── 07 · FUTURE / BLOCKCHAIN LAYER — stacked heading + steps ──── */}
          <section id="future" className="flex w-full scroll-mt-24 flex-col gap-8">
            <ScrollReveal>
              <SimpleHeading
                compact
                text="Built for the Next Layer."
                accentWords={1}
                accentPlacement="end"
                kicker="Future Architecture // Planned"
                align="left"
                description="CP is designed with a future-ready architecture that can connect verified cybersecurity achievements with a blockchain-backed reward infrastructure."
                descriptionWidth="max-w-2xl"
                className="max-w-2xl"
              />
            </ScrollReveal>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CP_FUTURE_CHAIN.map((step, i) => (
                <div
                  key={step.id}
                  className={`rounded-2xl border p-5 md:p-6 ${
                    step.planned
                      ? 'border-dashed border-border-subtle bg-transparent'
                      : 'border-accent/50 bg-surface'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="type-meta">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-black uppercase tracking-widest ${
                        step.planned
                          ? 'border border-dashed border-border-subtle text-text-muted'
                          : 'border border-accent/30 bg-accent/5 text-accent'
                      }`}
                    >
                      {step.planned ? 'Planned' : 'Active'}
                    </span>
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest md:text-sm ${step.planned ? 'text-text-muted' : 'text-text-primary'}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            <ScrollReveal>
              <div className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface p-4 md:p-5">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <p className="font-mono text-xs leading-relaxed text-text-muted md:text-sm">
                  CP currently functions as the QYVORA platform reward system. Blockchain-backed settlement and portable digital proof are planned future layers. They are not deployed, and CP is not a publicly tradable asset.
                </p>
              </div>
            </ScrollReveal>
          </section>

          {/* ── 08 · START YOUR JOURNEY — split: heading + carousel ───────── */}
          <section id="journey" className="grid w-full scroll-mt-24 grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <ScrollReveal>
                <div className="flex shrink-0 flex-col lg:w-[420px] lg:justify-center xl:w-[480px]">
                  <SimpleHeading
                    compact
                    text="Begin With Your First Course."
                    accentWords={1}
                    accentPlacement="end"
                    kicker="Start Your Journey"
                    align="left"
                    description="Every completed course is verified and feeds your CP balance. Start where every operator starts, the fundamentals."
                    descriptionWidth="max-w-xl"
                  />
                  <Link
                    to="/courses"
                    className="btn-secondary mt-6 inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 self-start !px-5"
                  >
                    View All Courses <IconArrow size={14} />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative flex min-h-0 min-w-0 flex-1 items-center overflow-hidden">
              <Carousel
                slides={STARTER_COURSES}
                showArrows={false}
                className="w-full"
                renderCard={(course) => {
                  const category = getCategoryById(course.categoryId);
                  return (
                    <Link
                      to={`/courses/${course.id}`}
                      className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-[transform,box-shadow,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/40 md:min-h-[280px] md:flex-row"
                    >
                      <div className="relative flex min-w-0 flex-1 flex-col items-start p-5 text-left sm:p-6 md:p-7">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {category && (
                            <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-black uppercase tracking-widest text-accent">
                              {category.name}
                            </span>
                          )}
                          <DifficultyBadge difficulty={course.skillLevel} />
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-lg font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent md:text-xl lg:text-2xl">
                          {course.title}
                        </h3>
                        <p className="mb-4 flex-1 border-l-2 border-accent/40 py-1.5 pl-3 font-mono text-xs leading-relaxed text-text-secondary line-clamp-3 sm:text-sm">
                          {course.description}
                        </p>
                        <div className="mt-auto flex w-full items-center justify-between gap-3 pt-3">
                          <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-text-muted min-w-0">
                            <span className="flex items-center gap-1 whitespace-nowrap min-w-0">
                              <Clock size={12} className="shrink-0" /> {course.estimatedMinutes}min
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap min-w-0">
                              <Zap size={12} className="shrink-0" /> {course.lessons.length || 0} lessons
                            </span>
                          </div>
                          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-black uppercase tracking-widest text-accent transition-[gap] duration-[var(--dur-base)] ease-[var(--ease-smooth)] group-hover:gap-1.5 min-w-0">
                            View Course <IconArrow size={12} className="shrink-0" />
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 items-center justify-center border-l border-border/30 md:flex md:w-[140px] lg:w-[160px]">
                        <CourseBadge courseId={course.id} className="h-24 w-24 lg:h-28 lg:w-28" />
                      </div>
                    </Link>
                  );
                }}
              />
            </div>
          </section>
        </div>
      </PublicContainer>
    </div>
  );
};

export default CyberCoinPage;
