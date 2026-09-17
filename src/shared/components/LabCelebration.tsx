import CelebrationModal from '@/shared/components/CelebrationModal';
import { useCelebrationTrigger } from '@/shared/hooks/useCelebrationTrigger';

interface LabCelebrationProps {
  trigger: boolean;
  title: string;
  rewardCp: number;
}

export function LabCelebration({ trigger, title, rewardCp }: LabCelebrationProps) {
  const [open, setOpen] = useCelebrationTrigger(trigger);

  return (
    <CelebrationModal
      open={open}
      onClose={() => setOpen(false)}
      badge={"Lab Complete"}
      title={"Mission Complete"}
      description={`You captured the flag and completed ${title}.`}
      rewardCp={rewardCp}
      ctaLabel={"Continue"}
    />
  );
}
