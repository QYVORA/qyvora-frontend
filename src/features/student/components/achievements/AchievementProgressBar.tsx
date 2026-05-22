import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface AchievementProgressBarProps {
  progress: number;
  total: number;
  label?: string;
  showpercentage?: boolean;
  className?: string;
  color?: string;
}

export const AchievementProgressBar: React.FC<AchievementProgressBarProps> = ({
  progress,
  total,
  label,
  showpercentage = true,
  className,
  color = 'bg-accent',
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / total) * 100));

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {(label || showpercentage) && (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary">
          {label && <span>{label}</span>}
          {showpercentage && (
            <span className={clsx(percentage === 100 ? 'text-accent' : 'text-text-muted')}>
              {progress} / {total} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={clsx('h-full rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]', color)}
        />
      </div>
    </div>
  );
};
