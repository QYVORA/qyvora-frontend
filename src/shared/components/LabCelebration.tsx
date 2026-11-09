import { useEffect, useState } from 'react';
import CelebrationModal from '@/shared/components/CelebrationModal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { getLabBadgeAsset } from '@/shared/learning/labBadges';

interface LabCelebrationProps {
  trigger: boolean;
  title: string;
  rewardCp: number;
  labId?: string;
}

export function LabCelebration({ trigger, title, rewardCp, labId }: LabCelebrationProps) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const asset = labId ? getLabBadgeAsset(labId) : undefined;

  useEffect(() => {
    if (!trigger || !labId) return;
    let active = true;
    api.post(`/student/labs/${encodeURIComponent(labId)}/complete`)
      .then(() => {
        if (active) setOpen(true);
      })
      .catch(() => {
        if (active) addToast('Could not save Lab completion. Please try again.', 'error');
      });
    return () => { active = false; };
  }, [trigger, labId, addToast]);

  return (
    <CelebrationModal
      open={open}
      onClose={() => setOpen(false)}
      badge={asset ? asset.title : 'Lab Complete'}
      badgeImage={asset?.image}
      badgeImageAlt={asset ? `${asset.title} badge` : undefined}
      title={'Mission Complete'}
      description={`You captured the flag and completed ${title}.`}
      rewardCp={rewardCp}
      ctaLabel={'Continue'}
    />
  );
}
