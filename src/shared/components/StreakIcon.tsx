import { Flame } from 'lucide-react';

export interface StreakIconProps {
  days: number;
  className?: string;
}

export function getStreakLevel(days: number): 0 | 1 | 2 | 3 {
  if (days <= 0) return 0;
  if (days <= 6) return 1;
  if (days <= 29) return 2;
  return 3;
}

const LEVEL_CONFIG = {
  0: { size: 14, color: 'text-text-muted/30', label: 'No streak' },
  1: { size: 16, color: 'text-orange-400/80', label: `${1}-6 day streak` },
  2: { size: 22, color: 'text-orange-500', label: `${7}-29 day streak` },
  3: { size: 28, color: 'text-orange-400', label: `${30}+ day streak` },
} as const;

const StreakIcon: React.FC<StreakIconProps> = ({ days, className = '' }) => {
  const level = getStreakLevel(days);
  const config = LEVEL_CONFIG[level];

  if (level === 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      title={`${days} day${days === 1 ? '' : 's'}`}
    >
      <Flame
        className={config.color}
        size={config.size}
        strokeWidth={level === 3 ? 1.5 : 2}
      />
      <span className="text-xs font-mono font-bold text-text-muted">{days}</span>
    </span>
  );
};

export default StreakIcon;
