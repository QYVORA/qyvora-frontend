import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { LearningCard } from '@/shared/components/learning/LearningCard';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import BootcampFacts, { BootcampLogo } from '@/features/marketing/components/bootcamp/BootcampFacts';
import ProgrammeHeroCard from '@/features/marketing/components/programmes/ProgrammeHeroCard';
import ProgrammeCtaCard from '@/features/marketing/components/programmes/ProgrammeCtaCard';
import { openBootcampAccessModal } from '@/features/marketing/components/bootcamp/BootcampAccessModal';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { BOOTCAMPS } from '@/features/marketing/content/bootcampData';
import hpbHeaderBg from '@/assets/backgrounds/hpb-header.webp';

const HPB = BOOTCAMPS.hpb;

const HpbPage = () => {
  const phases = BOOTCAMP_CONFIG.phases || [];

  const scrollToRooms = (anchorId: string) => () => {
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Hacker Protocol Bootcamp | QYVORA"}
        description={"Train as an offensive security operator across 5 phases: hacker mindset, Linux foundations, networking, web & backend, and social engineering."}
        breadcrumbName="HPB"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <ProgrammeHeroCard
          headingId="hpb-hero-title"
          background={hpbHeaderBg}
          mark={<BootcampLogo bootcamp={HPB} size="sm" accent />}
          kicker={"QYVORA · Bootcamp"}
          status={
            <>
              <Badge variant="success" size="md">
                {HPB.statusLabel}
              </Badge>
              <span className="type-meta text-text-muted">{`${HPB.acronym} · ${HPB.name}`}</span>
            </>
          }
          title={HPB.name}
          description={HPB.tagline}
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

        <div className="mt-4 md:mt-5">
          <BootcampFacts facts={HPB.facts} />
        </div>

        {/* ── What it is · Who it is for ─────────────────────────────────── */}
        <section aria-labelledby="hpb-overview-title" className="mt-14 md:mt-20">
          <div className="mb-6 md:mb-8">
            <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
              {"The programme"}
            </span>
            <h2
              id="hpb-overview-title"
              className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
            >
              {"Understand systems before tools"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <Card className="flex flex-col gap-3 p-6 md:p-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"What it is"}
              </span>
              <p className="type-body text-text-secondary">{HPB.overview}</p>
            </Card>
            <Card className="flex flex-col gap-3 p-6 md:p-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"Who it is for"}
              </span>
              <p className="type-body text-text-secondary">{HPB.audience}</p>
            </Card>
          </div>

          <Card className="mt-4 flex flex-col gap-4 p-6 md:p-8">
            <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
              {"What it covers"}
            </span>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
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
          </Card>
        </section>

        {/* ── Curriculum ──────────────────────────────────────────────────── */}
        <section className="mt-14 md:mt-20" aria-labelledby="hpb-phases-heading">
          <div className="mb-6 md:mb-8">
            <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
              {"The curriculum"}
            </span>
            <h2
              id="hpb-phases-heading"
              className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
            >
              {"Five phases, nineteen rooms"}
            </h2>
            <p className="type-body mt-3 max-w-2xl text-text-secondary">
              {"Pick a phase to jump straight to its rooms below."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {phases.map((phase) => {
              const phaseNumber = Number(phase.id.replace('phase', '').padStart(2, '0'));
              const rooms = phase.rooms || [];
              const minutes = rooms.reduce((sum, room) => sum + (room.estimatedMinutes || 0), 0);
              const hours = Math.max(1, Math.round((minutes / 60) * 10) / 10);
              const anchorId = `rooms-${phase.id}`;
              return (
                <LearningCard
                  key={phase.id}
                  type="bootcamp"
                  onClick={scrollToRooms(anchorId)}
                  badge={
                    <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-accent/20 bg-accent/10 p-1.5">
                      <HpbAvatar
                        variant={`phase${phaseNumber}` as HpbVariant}
                        className="h-full w-auto max-h-full max-w-full object-contain"
                      />
                    </span>
                  }
                  title={phase.title}
                  duration={`${hours}h`}
                  lessonsCount={rooms.length}
                  actionLabel={"Rooms"}
                  className="min-h-[240px]"
                />
              );
            })}
          </div>
        </section>

        {/* ── Rooms by phase ──────────────────────────────────────────────── */}
        <section className="mt-14 md:mt-20" aria-labelledby="hpb-rooms-heading">
          <div className="mb-6 md:mb-8">
            <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
              {"Room index"}
            </span>
            <h2
              id="hpb-rooms-heading"
              className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
            >
              {"Rooms by phase"}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {phases.map((phase) => (
              <Card
                key={phase.id}
                id={`rooms-${phase.id}`}
                className="scroll-mt-24 overflow-hidden p-0"
              >
                <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4 md:px-7">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="type-label shrink-0 uppercase tracking-[0.12em] text-text-tertiary">
                      {`Phase ${phase.id.replace('phase', '')}`}
                    </span>
                    <span className="text-sm font-black uppercase tracking-tight text-text-primary md:text-base">
                      {phase.title}
                    </span>
                  </span>
                  <span className="type-meta shrink-0">
                    {`${phase.rooms?.length || 0} rooms`}
                  </span>
                </div>

                <ul className="border-t border-border-subtle">
                  {(phase.rooms || []).map((room) => (
                    <li
                      key={room.id}
                      className="flex flex-col gap-1 border-b border-border-subtle px-5 py-4 last:border-b-0 md:flex-row md:items-baseline md:gap-6 md:px-7"
                    >
                      <span className="type-label shrink-0 text-accent md:w-40">
                        {room.id.replace('room', 'Room ')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-text-primary">
                          {room.title}
                        </span>
                        {room.overview && (
                          <span className="type-body-sm mt-1 block text-text-muted">
                            {room.overview}
                          </span>
                        )}
                      </span>
                      <span className="type-meta shrink-0 md:w-24 md:text-right">
                        {room.estimatedMinutes ? `${room.estimatedMinutes}m` : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Ethics + next level ─────────────────────────────────────────── */}
        <section aria-labelledby="hpb-ethics-title" className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <Card className="flex flex-col gap-4 p-6 md:p-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"Ethics & responsibility"}
              </span>
              <h2
                id="hpb-ethics-title"
                className="type-h3 font-black uppercase tracking-tight text-text-primary"
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
            </Card>

            <ProgrammeCtaCard
              kicker={"Next level"}
              title={"Ready for the next level?"}
              description={
                "QOSE is the 12-week offensive security engineer bootcamp built on top of HPB, and it is currently in pre-registration."
              }
            >
              <Button to="/qose" size="lg">
                {"Explore QOSE"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => openBootcampAccessModal('qose')}
              >
                {"Join the QOSE group"}
              </Button>
            </ProgrammeCtaCard>
          </div>
        </section>
      </PublicContainer>
    </div>
  );
};

export default HpbPage;