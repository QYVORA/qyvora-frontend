import { Badge } from '@/shared/components/ui';
import { Check } from 'lucide-react';
import Skeleton from '@/shared/components/ui/Skeleton';
import type { EngagementResponse } from '@/features/student/data/missions';

interface WeeklyOperationCardProps {
  engagement: EngagementResponse;
  loading?: boolean;
}

const WeeklyOperationCard = ({ engagement, loading }: WeeklyOperationCardProps) => {
  const { weeklyOperation: operation, weeklyStatus: status, weeklyDaysRemaining: daysRemaining, weeklyProgress: progress, weeklyCpAwarded: cpAwarded } = engagement;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="mb-3 h-6 w-48" />
        <Skeleton className="mb-5 h-4 w-full" />
        <Skeleton className="h-10 w-28" />
      </div>
    );
  }

  const doneSteps = operation.steps.filter(s => s.completed).length;
  const remainingCp = operation.steps.filter(s => !s.completed).reduce((sum, s) => sum + s.cpReward, 0);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          {"Weekly Operation"}
        </span>
        <Badge variant="info" size="sm">
          {daysRemaining} {"days left"}
        </Badge>
      </div>

      <h3 className="mb-3 text-lg font-black leading-tight text-text-primary md:text-xl">
        {operation.title}
      </h3>

      <p className="mb-5 line-clamp-2 text-sm text-text-secondary">{operation.brief}</p>

      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="type-meta">{doneSteps}/{operation.steps.length} {"steps"}</span>
          <span className="font-mono text-xs font-bold text-accent">+{operation.cpReward} CP</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>

      <ul className="mb-6 space-y-3">
        {operation.steps.map(step => (
          <li key={step.id} className="flex items-center gap-3">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                step.completed ? 'border-accent bg-accent' : 'border-border-subtle'
              }`}
              aria-hidden="true"
            >
              {step.completed && <Check className="h-3 w-3 text-on-accent" strokeWidth={3} />}
            </span>
            <span className={`text-sm ${step.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {step.label}
            </span>
            <span className="ml-auto font-mono text-xs font-bold text-accent">+{step.cpReward}</span>
          </li>
        ))}
      </ul>

      {status === 'completed' ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" size="sm">
            {"Completed"}
          </Badge>
          <Badge variant="accent" size="sm">
            {operation.badge}
          </Badge>
          <span className="font-mono text-xs font-bold text-accent">+{cpAwarded} CP</span>
        </div>
      ) : (
        <span className="type-meta">+{remainingCp} CP {"remaining"}</span>
      )}
    </div>
  );
};

export default WeeklyOperationCard;
