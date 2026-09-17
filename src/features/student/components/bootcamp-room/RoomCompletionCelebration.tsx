import React from 'react';
import CelebrationModal from '@/shared/components/CelebrationModal';
import Dobia from '@/shared/components/Dobia';

interface Props {
  show: boolean;
  roomTitle: string;
  cpEarned: number;
  onClose: () => void;
}

const RoomCompletionCelebration: React.FC<Props> = ({ show, roomTitle, cpEarned, onClose }) => {

  return (
    <CelebrationModal
      open={show}
      onClose={onClose}
      badge={"Room Complete!"}
      title={"Mission Complete"}
      description={`You've completed the ${roomTitle} room.`}
      rewardCp={cpEarned}
      ctaLabel={"Continue"}
      mascot={<Dobia expression="success" size="lg" />}
    />
  );
};

export default RoomCompletionCelebration;
