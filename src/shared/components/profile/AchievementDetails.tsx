import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type { Achievement } from '@/shared/constants/achievements';

interface AchievementDetailsProps {
  achievement: Achievement;
  completionDate?: string;
  onClose: () => void;
}

export const AchievementDetails: React.FC<AchievementDetailsProps> = ({
  achievement,
  completionDate,
  onClose,
}) => {
  const Icon = achievement.IconComponent;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`${achievement.title} details`}
      className="relative z-30 flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-card p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 sm:max-w-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Icon className="h-9 w-9 text-text-primary" />
          </div>
          <div className="min-w-0">
            <span className="block font-mono text-[10px] font-black uppercase tracking-wider text-accent">
              {achievement.category}
            </span>
            <h4 className="truncate font-mono text-sm font-black text-text-primary">
              {achievement.title}
            </h4>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close achievement details"
          className="rounded-lg p-1 text-text-muted hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="font-mono text-xs leading-relaxed text-text-secondary">
        {achievement.description}
      </p>

      <div className="flex items-center justify-between border-t border-border-subtle/50 pt-2 font-mono text-[11px]">
        <span className="inline-flex items-center gap-1 font-bold text-accent">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Earned Insignia</span>
        </span>
        {completionDate && (
          <span className="text-text-muted">
            {new Date(completionDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default AchievementDetails;
