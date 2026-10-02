import { ArrowRight, ChevronDown } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { LearningCard } from '@/shared/components/learning/LearningCard';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import BootcampFacts, { BootcampLogo } from '@/features/marketing/components/bootcamp/BootcampFacts';
import { openBootcampAccessModal } from '@/features/marketing/components/bootcamp/BootcampAccessModal';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';
import { BOOTCAMPS } from '@/features/marketing/content/bootcampData';
import hpbHeaderBg from '@/assets/backgrounds/hpb-header.webp';

const HPB = BOOTCAMPS.hpb;

const HpbPage = () => {
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Hacker Protocol Bootcamp | QYVORA"}
        description={"Train as an offensive security operator across 5 phases: hacker mindset, Linux foundations, networking, web & backend, and social engineering."}
        breadcrumbName="HPB"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <div className="relative overflow-hidden rounded-2xl" data-theme-persist="dark">
          <img
            src={hpbHeaderBg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          />
          <div className="relative px-4 py-10 sm:px-6 md:px-8 md:py-14 lg:flex lg:min-h-[440px] lg:flex-col lg:justify-center">
            <PageHeader
              kicker={"QYVORA · Bootcamp"}
              title={"Hacker Protocol Bootcamp"}
              description={"A phased offensive security curriculum designed to take you from operator to expert. Explore each phase, its rooms, and the outcome you train toward."}
              metadata={
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Badge variant="success" size="md">
                    {HPB.statusLabel}
                  </Badge>
                  <span className="type-meta text-text-muted">{`${HPB.acronym} · ${HPB.name}`}</span>
                </div>
              }
              actions={
                <>
                  <Button to="/register">
                    {"Enroll now"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => openBootcampAccessModal('hpb')}
                  >
                    {"Join the HPB group"}
                  </Button>
                </>
              }
            />
          </div>
          <div className="relative flex justify-center border-t border-border-subtle px-4 py-8 sm:px-6 md:px-8">
            <BootcampLogo bootcamp={HPB} size="lg" />
          </div>
        </div>

        <div className="mt-4 md:mt-5">
          <BootcampFacts facts={HPB.facts} />
        </div>

        <section aria-labelledby="hpb-audience-title" className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
              <h2
                id="hpb-audience-title"
                className="type-h2 font-black uppercase tracking-tight text-text-primary"
              >
                {"Understand systems before tools"}
              </h2>
              <p className="type-body text-text-secondary">{HPB.overview}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
              <p className="type-label uppercase tracking-[0.12em] text-accent">{"Who it is for"}</p>
              <p className="type-body text-text-secondary">{HPB.audience}</p>
              <p className="type-label uppercase tracking-[0.12em] text-accent">{"What it covers"}</p>
              <ul className="flex flex-col gap-2">
                {HPB.covers.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span className="type-body-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 md:mt-16" aria-labelledby="hpb-phases-heading">
          <div className="mb-6 md:mb-8">
            <span className="type-kicker block text-accent">{"The curriculum"}</span>
            <h2 id="hpb-phases-heading" className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary">
              {"Five phases, nineteen rooms"}
            </h2>
            <p className="type-body mt-3 max-w-3xl text-text-secondary">
              {"Every phase below is part of the same continuous track. Expand a phase to see the rooms it contains and what each one covers."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {phases.map((phase) => {
              const phaseNumber = Number(phase.id.replace('phase', '').padStart(2, '0'));
              const learnPhase = PHASES.find((p) => p.id === phase.id.replace('phase', '').padStart(2, '0'));
              const rooms = phase.rooms || [];
              const minutes = rooms.reduce((sum, room) => sum + (room.estimatedMinutes || 0), 0);
              const hours = Math.max(1, Math.round((minutes / 60) * 10) / 10);
              return (
                <LearningCard
                  key={phase.id}
                  type="bootcamp"
                  badge={
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-accent/20 bg-accent/10 p-1.5">
                      <HpbAvatar variant={`phase${phaseNumber}` as HpbVariant} className="h-full w-auto max-h-full max-w-full object-contain" />
                    </div>
                  }
                  title={phase.title}
                  description={learnPhase?.desc ?? phase.codename}
                  duration={`${hours}h`}
                  lessonsCount={rooms.length}
                />
              );
            })}
          </div>
        </section>

        <section className="mt-12 md:mt-16" aria-labelledby="hpb-rooms-heading">
          <div className="mb-6 md:mb-8">
            <h2 id="hpb-rooms-heading" className="type-h2 font-black uppercase tracking-tight text-text-primary">
              {"Rooms by phase"}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {phases.map((phase) => (
              <details
                key={phase.id}
                className="group rounded-2xl border border-border-subtle bg-surface-raised"
              >
                <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-6">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="type-label shrink-0 uppercase tracking-[0.12em] text-text-tertiary">
                      {`Phase ${phase.id.replace('phase', '')}`}
                    </span>
                    <span className="truncate text-sm font-black uppercase tracking-tight text-text-primary md:text-base">
                      {phase.title}
                    </span>
                  </span>
                  <span className="type-meta flex shrink-0 items-center gap-3">
                    {`${phase.rooms?.length || 0} rooms`}
                    <ChevronDown
                      className="h-4 w-4 text-accent transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </span>
                </summary>

                <ul className="border-t border-border-subtle">
                  {(phase.rooms || []).map((room) => (
                    <li
                      key={room.id}
                      className="flex flex-col gap-1 border-b border-border-subtle px-4 py-4 last:border-b-0 md:flex-row md:items-baseline md:gap-6 md:px-6"
                    >
                      <span className="type-label shrink-0 text-accent md:w-40">
                        {room.id.replace('room', 'Room ')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-text-primary">{room.title}</span>
                        {room.overview && (
                          <span className="type-body-sm mt-1 block text-text-muted">{room.overview}</span>
                        )}
                      </span>
                      <span className="type-meta shrink-0 md:w-24 md:text-right">
                        {room.estimatedMinutes ? `${room.estimatedMinutes}m` : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="hpb-ethics-title" className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                {"Ethics & responsibility"}
              </p>
              <h2
                id="hpb-ethics-title"
                className="type-h2 font-black uppercase tracking-tight text-text-primary"
              >
                {"Learn responsibly"}
              </h2>
              <ul className="flex flex-col gap-3">
                {HPB.ethics.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span className="type-body-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border-subtle bg-surface p-5 text-center md:p-8">
              <BootcampLogo bootcamp={HPB} size="md" />
              <p className="type-h2 font-black uppercase tracking-tight text-text-primary">
                {"Ready for the next level?"}
              </p>
              <p className="type-body-sm max-w-md text-text-secondary">
                QOSE is the 12-week offensive security engineer bootcamp built on top of HPB,
                and it is currently in pre-registration.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button to="/qose" size="lg">
                  {"Explore QOSE"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="secondary" onClick={() => openBootcampAccessModal('qose')}>
                  {"Join the QOSE group"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default HpbPage;