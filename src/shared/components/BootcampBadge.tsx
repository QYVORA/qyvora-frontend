import badgeSrc from '@/assets/bootcamp/HPB-logo.webp';
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
      alt="Hacker Protocol Bootcamp"
      title="Hacker Protocol Bootcamp"
      width={96}
      height={64}
      className={`inline-block object-contain ${className}`}
    />
  );
};

export default BootcampBadge;
