import { useTranslation } from 'react-i18next';
import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';

interface LabCelebrationProps {
  trigger: boolean;
  title: string;
  rewardCp: number;
}

export function LabCelebration({ trigger, title, rewardCp }: LabCelebrationProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useCelebrationTrigger(trigger);

  return (
    <CelebrationModal
      open={open}
      onClose={() => setOpen(false)}
      badge={t('student.celebration.badge')}
      title={t('student.celebration.title')}
      description={t('student.celebration.description', { title })}
      rewardCp={rewardCp}
      ctaLabel={t('student.celebration.continue')}
    />
  );
}
