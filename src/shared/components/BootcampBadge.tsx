import badgeSrc from '@/assets/bootcamp/hpb-completion-badge.webp';
const BADGE_PATH = badgeSrc;

interface BootcampBadgeProps {
  completed: boolean;
  className?: string;
}

const BootcampBadge: React.FC<BootcampBadgeProps> = ({ completed, className = '' }) => {
  if (!completed) return null;

  return (
    <img
      src={BADGE_PATH}
      alt="HPB Bootcamp Completed"
      title="Hacker Protocol Bootcamp — Completed"
      width={64}
      height={64}
      className={`inline-block ${className}`}
    />
  );
};

export default BootcampBadge;
