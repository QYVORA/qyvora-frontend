import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Clock, Trophy, Zap } from 'lucide-react';
import { IconArrowRight as IconArrow } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import CpLogo from '@/shared/components/CpLogo';
import { SimpleHeading } from '@/shared/components/ui';
import { Carousel } from '@/shared/components/carousel';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import CourseBadge from '@/shared/components/CourseBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import ProgrammeHeroCard from '@/features/marketing/components/programmes/ProgrammeHeroCard';
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

/** Accent tile for the CP coin in the hero lockup — same recipe as the bootcamp marks. */
const CpMark: React.FC = () => (
  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 p-2.5">
    <CpLogo alt="CP Cyber Coin" className="h-full w-full" />
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CyberCoinPage: React.FC = () => {
  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO
        title="Cyber Coin - QYVORA"
        description="CP: the QYVORA Cyber Coin. The reward layer connecting learning, execution, and achievement across the QYVORA cybersecurity ecosystem. Learn. Execute. Earn."
      />

      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <ProgrammeHeroCard
          headingId="cp-hero-title"
          background={cpHeaderBg}
          mark={<CpMark />}
          kicker={"QYVORA · Economy"}
          status={
            <span className="type-meta inline-flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {CP_HERO.label}
            </span>
          }
          title={"CP Cyber Coin"}
          description={CP_HERO.description}
          actions={
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById('what-is-cp')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              {"Explore CP"}
              <IconArrow size={14} />
            </Button>
          }
        />

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
                  <Card
                    key={pillar.id}
                    className="flex min-h-[220px] flex-col gap-3 p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/40 bg-accent-dim text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="type-meta">{pillar.index}</span>
                    </div>
                    <h3 className="type-h3 mt-1 font-black uppercase tracking-tight text-text-primary">
                      {pillar.title}
                    </h3>
                    <p className="type-body-sm flex-1 text-text-secondary">
                      {pillar.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* ── 03 · PHILOSOPHY — split: heading left, stage card right ──── */}
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
              <Card className="p-5 md:p-7">
                <ol className="divide-y divide-border-subtle">
                  {CP_PHILOSOPHY_STAGES.map((stage, i) => {
                    const isReward = stage.id === 'reward';
                    return (
                      <li
                        key={stage.id}
                        className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span className="flex min-w-0 items-center gap-4">
                          <span
                            className={`type-meta shrink-0 font-mono ${
                              isReward ? 'text-accent' : 'text-text-muted'
                            }`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-sm font-black uppercase tracking-widest md:text-base ${
                              isReward ? 'text-accent' : 'text-text-primary'
                            }`}
                          >
                            {stage.label}
                          </span>
                        </span>
                        {isReward && (
                          <span className="inline-flex shrink-0 items-center rounded-lg border border-accent/20 bg-accent/5 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-accent">
                            + CP
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </Card>
            </ScrollReveal>
          </section>

          {/* ── 04 · HOW YOU EARN CP — split (reversed): loop card left ───── */}
          <section id="earn" className="grid w-full scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <Card className="p-5 md:p-7">
                <ol className="divide-y divide-border-subtle">
                  {CP_LEARNING_LOOP.map((stage) => {
                    const isEarn = stage.id === 'earn';
                    return (
                      <li
                        key={stage.id}
                        className="flex items-baseline gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span
                          className={`type-meta shrink-0 font-mono ${
                            isEarn ? 'text-accent' : 'text-text-muted'
                          }`}
                        >
                          {stage.index}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-black uppercase tracking-widest md:text-base ${
                              isEarn ? 'text-accent' : 'text-text-primary'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="type-body-sm mt-1 block text-text-muted">
                            {stage.description}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </Card>
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
                <ul className="divide-y divide-border-subtle">
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
                <ul className="divide-y divide-border-subtle">
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

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {CP_FUTURE_CHAIN.map((step, i) => (
                <Card
                  key={step.id}
                  selected={!step.planned}
                  className={`flex flex-col gap-3 p-5 md:p-6 ${
                    step.planned ? 'border-dashed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="type-meta">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-black uppercase tracking-widest ${
                        step.planned
                          ? 'border border-dashed border-border-subtle text-text-muted'
                          : 'border border-accent/20 bg-accent/5 text-accent'
                      }`}
                    >
                      {step.planned ? 'Planned' : 'Active'}
                    </span>
                  </div>
                  <p
                    className={`type-body-sm font-black uppercase tracking-widest ${
                      step.planned ? 'text-text-muted' : 'text-text-primary'
                    }`}
                  >
                    {step.label}
                  </p>
                </Card>
              ))}
            </div>

            <ScrollReveal>
              <Card className="flex items-start gap-3 p-5 md:p-6">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <p className="font-mono text-xs leading-relaxed text-text-muted md:text-sm">
                  CP currently functions as the QYVORA platform reward system. Blockchain-backed settlement and portable digital proof are planned future layers. They are not deployed, and CP is not a publicly tradable asset.
                </p>
              </Card>
            </ScrollReveal>
          </section>

          {/* ── 08 · START YOUR JOURNEY — split: heading + carousel ───────── */}
          <section id="journey" className="grid w-full scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
                  <Button to="/learn?tab=courses" variant="secondary" className="mt-6 self-start">
                    {"View All Courses"}
                    <IconArrow size={14} />
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative flex min-h-0 min-w-0 flex-1 items-center">
              <Carousel
                bare
                slides={STARTER_COURSES}
                showArrows={false}
                className="w-full"
                renderCard={(course) => {
                  const category = getCategoryById(course.categoryId);
                  return (
                    <Link
                      to={`/dashboard/courses/${course.id}`}
                      className="group/card relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-[border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/40 md:min-h-[280px] md:flex-row"
                    >
                      <div className="relative flex min-w-0 flex-1 flex-col items-start p-6 text-left md:p-7">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          {category && (
                            <span className="rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-1 text-xs font-black uppercase tracking-widest text-accent">
                              {category.name}
                            </span>
                          )}
                          <DifficultyBadge difficulty={course.skillLevel} />
                        </div>
                        <h3 className="mb-3 line-clamp-2 type-h3 font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover/card:text-accent">
                          {course.title}
                        </h3>
                        <p className="type-body-sm mb-5 line-clamp-3 flex-1 text-text-secondary">
                          {course.description}
                        </p>
                        <div className="mt-auto flex w-full items-center justify-between gap-3 border-t border-border-subtle pt-4">
                          <div className="flex min-w-0 shrink-0 items-center gap-3 font-mono text-xs text-text-muted">
                            <span className="flex min-w-0 items-center gap-1 whitespace-nowrap">
                              <Clock size={12} className="shrink-0" /> {course.estimatedMinutes}min
                            </span>
                            <span className="flex min-w-0 items-center gap-1 whitespace-nowrap">
                              <Zap size={12} className="shrink-0" /> {course.lessons.length || 0} lessons
                            </span>
                          </div>
                          <span className="flex min-w-0 shrink-0 items-center gap-1 whitespace-nowrap text-xs font-black uppercase tracking-widest text-accent transition-[gap] duration-[var(--dur-base)] ease-[var(--ease-smooth)] group-hover/card:gap-1.5">
                            View Course <IconArrow size={12} className="shrink-0" />
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 items-center justify-center border-l border-border-subtle md:flex md:w-[140px] lg:w-[160px]">
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