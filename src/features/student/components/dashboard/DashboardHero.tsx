import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface DashboardHeroProps {
  isEnrolled: boolean;
  allDone: boolean;
  nextMission: { title: string } | null;
  continuePath: string;
  currentPhaseTitle?: string;
  username?: string;
}

/**
 * DashboardHero — the Continue banner: one current objective, one action.
 * No grid backdrop, no mascot, no decorative layers — a calm surface.
 */
const DashboardHero = ({
  isEnrolled, allDone, nextMission, continuePath, currentPhaseTitle, username,
}: DashboardHeroProps) => {
  const { t } = useTranslation();
  const displayName = username ? `@${username}` : t('student.dashboard.hero.operatorFallback');

  let kicker = t('student.dashboard.hero.welcome') + ' ' + displayName;
  let title = t('student.dashboard.hero.beginJourney');
  let body = t('student.dashboard.hero.startHpb');
  let ctaLabel = t('student.dashboard.hero.startTraining');

  if (isEnrolled) {
    kicker = `${t('student.dashboard.hero.welcomeBack')} ${displayName}`;
    title = nextMission?.title || currentPhaseTitle || t('student.dashboard.hero.continueTraining');
    body = t('student.dashboard.hero.pickUpWhere');
    ctaLabel = t('student.dashboard.hero.continue');
  }

  if (allDone) {
    kicker = `${t('student.dashboard.hero.welcomeBack')} ${displayName}`;
    title = t('student.dashboard.hero.allMissionsComplete');
    body = t('student.dashboard.hero.allRoomsComplete');
    ctaLabel = t('student.dashboard.hero.reviewCurriculum');
  }

  return (
    <section className="flex min-h-[220px] flex-col justify-between gap-6 rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      <div>
        <p className="type-label mb-2 uppercase tracking-[0.12em] text-accent">{kicker}</p>
        <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">{title}</h2>
        <p className="type-body-sm mt-2">{body}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button to={continuePath} trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
};

export default DashboardHero;