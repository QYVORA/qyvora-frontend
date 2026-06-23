const BADGE_PATH = '/assets/achievements/categories/bootcamp/hpb-completion-badge.png';

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
      className={`inline-block rounded-full object-cover ring-2 ring-accent/30 shadow-lg shadow-accent/20 ${className}`}
    />
  );
};

export default BootcampBadge;
