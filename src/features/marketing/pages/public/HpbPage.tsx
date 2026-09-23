import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { LearningCard } from '@/shared/components/learning/LearningCard';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';

const HpbPage = () => {
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Hacker Protocol Bootcamp | QYVORA"}
        description={"Train as an offensive security operator across 5 phases: hacker mindset, Linux foundations, networking, web & backend, and social engineering."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Bootcamp"}
          title={"Hacker Protocol Bootcamp"}
          description={"A phased offensive security curriculum designed to take you from operator to expert. Explore each phase, its rooms, and the outcome you train toward."}
          actions={
            <Button to="/register">
              {"Enroll now"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => {
            const phaseNumber = Number(phase.id.replace('phase', '').padStart(2, '0'));
            const learnPhase = PHASES.find((p) => p.id === phase.id.replace('phase', '').padStart(2, '0'));
            const minutes = (phase.rooms || []).reduce(
              (sum, room) => sum + (room.estimatedMinutes || 0),
              0,
            );
            const hours = Math.max(1, Math.round((minutes / 60) * 10) / 10);
            return (
              <LearningCard
                key={phase.id}
                type="bootcamp"
                to={`/hpb/${phase.id}`}
                badge={
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-accent/20 bg-accent/10">
                    <HpbAvatar variant={`phase${phaseNumber}` as HpbVariant} className="h-full w-auto max-h-full max-w-full" />
                  </div>
                }
                title={phase.title}
                description={learnPhase?.desc ?? phase.codename}
                duration={`${hours}h`}
                modulesCount={`${phase.rooms?.length || 0} rooms`}
                actionLabel={"Explore phase"}
              />
            );
          })}
        </div>
      </PublicContainer>
    </div>
  );
};

export default HpbPage;