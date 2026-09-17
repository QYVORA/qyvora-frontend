import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';
import { LearningCard, LearningDetailShell } from '@/shared/components/learning';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';

const HpbPhasePage: React.FC = () => {
  const { phaseId } = useParams<{ phaseId: string }>();

  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const phaseIndex = BOOTCAMP_CONFIG.phases.findIndex((p) => p.id === phaseId);
  const learnPhase = PHASES.find((p) => p.id === phaseId?.replace('phase', '').padStart(2, '0'));

  if (!phase) return <Navigate to="/hpb" replace />;

  const roomCount = phase.rooms?.length || 0;
  const totalMinutes = (phase.rooms || []).reduce(
    (sum, room) => sum + (room.estimatedMinutes || 0),
    0,
  );
  const totalHours = Math.max(1, Math.round((totalMinutes / 60) * 10) / 10);

  const otherPhases = BOOTCAMP_CONFIG.phases.filter((p) => p.id !== phase.id);

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={`${phase.title} - Hacker Protocol Bootcamp`}
        description={learnPhase?.desc ?? `${phase.title}. Hacker Protocol Bootcamp.`}
        breadcrumbName={phase.title}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <LearningDetailShell
          backTo="/hpb"
          backLabel={"All phases"}
          kicker={`${"Hacker Protocol Bootcamp"} · Phase ${phaseIndex + 1} of ${BOOTCAMP_CONFIG.phases.length}`}
          title={phase.title}
          description={learnPhase?.desc ?? `${phase.title}. Hacker Protocol Bootcamp.`}
          metadata={
            <>
              <span className="type-meta">
                {roomCount} {"rooms"}
              </span>
              <span className="type-meta">{totalHours}h {"estimated"}</span>
            </>
          }
          actions={
            <Button to="/register">
              {"Enroll now"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
          relatedTitle={"Other phases"}
          related={
            otherPhases.map((other) => {
              const learn = PHASES.find(
                (p) => p.id === other.id.replace('phase', '').padStart(2, '0'),
              );
              const Icon = learn?.icon;
              const minutes = (other.rooms || []).reduce(
                (sum, room) => sum + (room.estimatedMinutes || 0),
                0,
              );
              const hours = Math.max(1, Math.round((minutes / 60) * 10) / 10);
              return (
                <LearningCard
                  key={other.id}
                  type="bootcamp"
                  to={`/hpb/${other.id}`}
                  icon={Icon ? <Icon className="h-5 w-5" /> : undefined}
                  title={other.title}
                  description={learn?.desc ?? other.codename}
                  duration={`${hours}h`}
                  modulesCount={`${other.rooms?.length || 0} ${"rooms"}`}
                  actionLabel={"Explore"}
                />
              );
            })
          }
        >
          <div className="mt-10">
            <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
              {"Curriculum"}
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              {phase.rooms.map((room, index) => (
                <div
                  key={room.id}
                  id={room.id}
                  className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-4 md:px-5 md:py-5 sm:flex-row sm:items-start sm:gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised font-mono text-sm font-black text-accent">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                      {room.title}
                    </h3>
                    <p className="type-body-sm mt-1 line-clamp-2">{room.overview}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 type-meta pt-0.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {room.estimatedMinutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </LearningDetailShell>
      </div>
    </div>
  );
};

export default HpbPhasePage;