import { ChevronRight, Gift } from 'lucide-react';
import { Button, Card } from '@/shared/components/ui';
import type { EngagementResponse } from '@/features/student/data/missions';

interface WeeklyBonusCardProps {
  engagement: EngagementResponse | null;
}

/**
 * WeeklyBonusCard — the sidebar "bonus chest". Every value comes from the
 * weekly operation returned by `/student/engagement`; nothing is invented.
 */
const WeeklyBonusCard = ({ engagement }: WeeklyBonusCardProps) => {
  const operation = engagement?.weeklyOperation;
  if (!operation) return null;

  const doneSteps = operation.steps.filter((step) => step.completed).length;
  const remainingCp = operation.steps
    .filter((step) => !step.completed)
    .reduce((sum, step) => sum + step.cpReward, 0);
  const progress = Number.isFinite(engagement.weeklyProgress)
    ? Math.round(engagement.weeklyProgress * 100)
    : operation.steps.length > 0
      ? Math.round((doneSteps / operation.steps.length) * 100)
      : 0;
  const unlocked = remainingCp <= 0;

  return (
    <Card as="section" tone="strip" className="flex items-center gap-4 p-[var(--app-card-pad)]">
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-accent"
        aria-hidden="true"
      >
        <Gift className="h-6 w-6" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="type-meta text-accent">Bonus chest</p>
        <h2 className="mt-0.5 truncate text-base font-bold text-text-primary">
          {unlocked ? `+${operation.cpReward} CP unlocked` : `Earn +${operation.cpReward} CP this week`}
        </h2>
        <p className="mt-0.5 truncate text-sm text-text-secondary">
          {unlocked
            ? 'All weekly objectives complete — bonus awarded.'
            : `${remainingCp} CP left across ${operation.steps.length - doneSteps} objective${operation.steps.length - doneSteps === 1 ? '' : 's'}.`}
        </p>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
          aria-label="Weekly bonus chest progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)] motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Button
        to="/dashboard/labs"
        variant="ghost"
        size="sm"
        aria-label="View weekly objectives"
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </Card>
  );
};

export default WeeklyBonusCard;
