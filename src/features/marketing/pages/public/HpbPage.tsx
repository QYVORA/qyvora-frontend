import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningCard } from '@/shared/components/learning/LearningCard';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { PHASES } from '@/features/marketing/data/learnData';

const HpbPage = () => {
  const { t } = useTranslation();
  const phases = BOOTCAMP_CONFIG.phases || [];

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={t('hpbPage.seo.title', 'Hacker Protocol Bootcamp | QYVORA')}
        description={t(
          'hpbPage.seo.description',
          'Train as an offensive security operator across 5 phases: hacker mindset, Linux foundations, networking, web & backend, and social engineering.',
        )}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={t('hpbPage.kicker', 'QYVORA · Bootcamp')}
          title={t('hpbPage.title', 'Hacker Protocol Bootcamp')}
          description={t(
            'hpbPage.description',
            'A phased offensive security curriculum designed to take you from operator to expert. Explore each phase, its rooms, and the outcome you train toward.',
          )}
          actions={
            <Button to="/register">
              {t('hpbPage.cta', 'Enroll now')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => {
            const learnPhase = PHASES.find(
              (p) => p.id === phase.id.replace('phase', '').padStart(2, '0'),
            );
            const Icon = learnPhase?.icon;
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
                icon={Icon ? <Icon className="h-5 w-5" /> : undefined}
                title={phase.title}
                description={learnPhase?.desc ?? phase.codename}
                duration={`${hours}h`}
                modulesCount={`${phase.rooms?.length || 0} rooms`}
                actionLabel={t('hpbPage.cardCta', 'Explore phase')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HpbPage;