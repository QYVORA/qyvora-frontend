import React from 'react';
import { useTranslation } from 'react-i18next';
import CelebrationModal from '@/shared/components/CelebrationModal';
import Dobia from '@/shared/components/Dobia';

interface Props {
  show: boolean;
  roomTitle: string;
  cpEarned: number;
  onClose: () => void;
}

const RoomCompletionCelebration: React.FC<Props> = ({ show, roomTitle, cpEarned, onClose }) => {
  const { t } = useTranslation();

  return (
    <CelebrationModal
      open={show}
      onClose={onClose}
      badge={t('student.bootcampRoom.celebration.badge')}
      title={t('student.bootcampRoom.celebration.title')}
      description={t('student.bootcampRoom.celebration.description', { room: roomTitle })}
      rewardCp={cpEarned}
      ctaLabel={t('student.bootcampRoom.celebration.continue')}
      mascot={<Dobia expression="success" size="lg" />}
    />
  );
};

export default RoomCompletionCelebration;
