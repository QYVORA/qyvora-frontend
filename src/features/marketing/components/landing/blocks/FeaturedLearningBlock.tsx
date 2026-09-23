import React from 'react';
import { ArrowRight, BookOpen, Bug, FlaskConical, GraduationCap } from 'lucide-react';
import { COURSES } from '@/features/student/data/courses';
import { LABS } from '@/features/student/constants/labs';
import { PHASES } from '@/features/marketing/data/learnData';
import { SIMULATIONS } from '@/features/marketing/pages/public/SimulationsPage';
import { Card } from '@/shared/components/ui/Card';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import CpLogo from '@/shared/components/CpLogo';
import Button from '@/shared/components/ui/Button';
import ScrollReveal from '@/shared/components/ScrollReveal';

/**
 * FeaturedLearningBlock — the full learning ecosystem on one landing section.
 * Hacker Protocol Bootcamp is the flagship, featured card; courses, labs,
 * simulations and Cyber Points sit beside it as destination cards. Cards
 * render naturally so the collection continues visibly below.
 */
const FeaturedLearningBlock: React.FC = () => {
  return (
    <section className="w-full bg-canvas">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                {"The learning protocol"}
              </p>
              <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Train. Practice. Prove."}
              </h2>
              <p className="type-body mt-2 max-w-prose">
                {"Courses, attack labs, bootcamps, simulations, and Cyber Points earned for every skill you verify."}
              </p>
            </div>
            <Button to="/learn" variant="ghost" className="shrink-0">
              {"Browse all learning"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Flagship — Hacker Protocol Bootcamp */}
          <Card
            to="/hpb"
            interactive
            className="relative flex min-h-[320px] flex-col justify-between gap-6 overflow-hidden p-6 lg:col-span-2 md:p-8 bg-gradient-to-tl from-accent/20 via-accent/5 to-transparent"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
              <div className="absolute bottom-8 right-8 hidden h-48 w-48 md:block">
                <HpbAvatar variant="phase5" className="h-full w-full opacity-90" />
              </div>
            </div>

            <div className="relative flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                {"Featured bootcamp"}
              </span>
              <span className="type-meta">{PHASES.length} {"phases"}</span>
            </div>

            <div className="relative flex flex-col gap-3">
              <h3 className="type-h2 max-w-xl font-black uppercase tracking-tight text-text-primary">
                {"Hacker Protocol Bootcamp"}
              </h3>
              <p className="type-body max-w-lg">
                {"A guided path from first terminal to first exploit: mindset, Linux, networking, web, and social engineering."}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {PHASES.map((phase) => (
                  <span
                    key={phase.id}
                    title={`Phase ${phase.id} · ${phase.name}`}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-surface-raised p-1"
                  >
                    <HpbAvatar variant={`phase${Number(phase.id)}` as HpbVariant} className="h-full w-auto object-contain" />
                  </span>
                ))}
                <span className="ml-1 flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent">
                  {"Enter the bootcamp"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Card>

          {/* Courses */}
          <Card to="/courses" interactive className="flex min-h-[240px] flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="type-label mt-1 uppercase tracking-[0.12em] text-text-tertiary">{"Courses"}</p>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {"Self-paced foundations"}
            </h3>
            <p className="type-body-sm flex-1">{COURSES.length} {"hands-on courses across the core security stack."}</p>
            <div className="flex items-center justify-between">
              <span className="type-meta">{COURSES.length} {"courses"}</span>
              <span className="type-meta text-accent">{`up to 150 CP`}</span>
            </div>
          </Card>

          {/* Labs */}
          <Card to="/labs" interactive className="flex min-h-[240px] flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
              <Bug className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="type-label mt-1 uppercase tracking-[0.12em] text-text-tertiary">{"Labs"}</p>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {"Attack labs"}
            </h3>
            <p className="type-body-sm flex-1">{"Realistic exploitation scenarios with live simulated targets."}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {LABS.slice(0, 4).map((lab) => (
                <span key={lab.id} className="type-meta">{lab.title.split(' ')[0]}</span>
              ))}
            </div>
          </Card>

          {/* Simulations */}
          <Card to="/simulations" interactive className="flex min-h-[240px] flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="type-label mt-1 uppercase tracking-[0.12em] text-text-tertiary">{"Simulations"}</p>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {"Live tool demos"}
            </h3>
            <p className="type-body-sm flex-1">{"Interactive browser-based reproductions of offensive workflows."}</p>
            <div className="flex items-center justify-between">
              <span className="type-meta">{SIMULATIONS.length} {"simulations"}</span>
              <span className="type-meta text-accent">{"run instantly"}</span>
            </div>
          </Card>

          {/* Cyber Points */}
          <Card to="/cp" interactive className="flex min-h-[240px] flex-col gap-3 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised">
              <CpLogo className="h-6 w-6" />
            </span>
            <p className="type-label mt-1 uppercase tracking-[0.12em] text-text-tertiary">{"Cyber Points"}</p>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {"Prove it on-chain"}
            </h3>
            <p className="type-body-sm flex-1">{"Every verified achievement earns CP, a verifiable record of your skill."}</p>
            <div className="flex items-center justify-between">
              <span className="type-meta">{"earned everywhere"}</span>
              <span className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent">
                {"Explore CP"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Button to="/learn" variant="ghost">
            {"Browse learning"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLearningBlock;