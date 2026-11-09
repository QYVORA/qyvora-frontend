import { Check, Clock, Target, Zap } from 'lucide-react';
import { Badge, Button, Card, Skeleton } from '@/shared/components/ui';
import type { EngagementResponse } from '@/features/student/data/missions';

interface WeeklyMissionCardProps {
  engagement: EngagementResponse;
  loading?: boolean;
}

const difficultyVariant = {
  beginner: 'accent' as const,
  intermediate: 'warning' as const,
  advanced: 'danger' as const,
};

/**
 * WeeklyMissionCard — the dashboard's short-term goal card.
 *
 * Combines the current weekly operation (multi-step objectives, progress and
 * bonus reward) with today's mission in one container. All values come from
 * `/student/engagement`; no mission, deadline or reward is invented here.
 */
const WeeklyMissionCard = ({ engagement, loading }: WeeklyMissionCardProps) => {
  if (loading) {
    return (
      <Card className="p-5 md:p-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="mb-3 h-6 w-48" />
        <Skeleton className="mb-5 h-4 w-full" />
        <Skeleton className="mb-2 h-3 w-full" />
        <Skeleton className="h-10 w-28" />
      </Card>
    );
  }

  const {
    weeklyOperation: operation,
    weeklyStatus,
    weeklyDaysRemaining,
    weeklyProgress,
    weeklyCpAwarded,
    mission,
    status: dailyStatus,
    cpAwarded: dailyCpAwarded,
  } = engagement;

  const doneSteps = operation.steps.filter((step) => step.completed).length;
  const remainingCp = operation.steps
    .filter((step) => !step.completed)
    .reduce((sum, step) => sum + step.cpReward, 0);

  return (
    <Card className="flex flex-col p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
          <Target className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          Weekly Mission
        </span>
        <Badge variant="info" size="sm">
          <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
          {weeklyDaysRemaining} {weeklyDaysRemaining === 1 ? 'day' : 'days'} left
        </Badge>
        {weeklyStatus !== 'completed' && (
          <Badge variant="accent" size="sm">Active</Badge>
        )}
      </div>

      <h2 className="type-h2 text-text-primary">{operation.title}</h2>
      <p className="mt-1.5 type-body-sm text-text-secondary">{operation.brief}</p>

      <div className="mt-4 mb-2 flex items-center justify-between gap-3">
        <span className="type-meta">
          {doneSteps}/{operation.steps.length} objectives
        </span>
        <span className="font-mono text-xs font-bold text-accent">
          +{operation.cpReward} CP bonus
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]"
          style={{ width: `${Math.min(weeklyProgress * 100, 100)}%` }}
        />
      </div>

      <ul className="space-y-3">
        {operation.steps.map((step) => (
          <li key={step.id} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                step.completed ? 'border-accent bg-accent' : 'border-border-subtle'
              }`}
              aria-hidden="true"
            >
              {step.completed && <Check className="h-3 w-3 text-on-accent" strokeWidth={3} />}
            </span>
            <span className={`min-w-0 flex-1 text-sm leading-snug ${step.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {step.label}
            </span>
            <span className="shrink-0 font-mono text-[11px] font-bold text-accent">+{step.cpReward}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
        {weeklyStatus === 'completed' ? (
          <>
            <Badge variant="success" size="sm">Completed</Badge>
            <Badge variant="accent" size="sm">{operation.badge}</Badge>
            <span className="font-mono text-xs font-bold text-accent">+{weeklyCpAwarded} CP earned</span>
          </>
        ) : (
          <>
            <Button to="/dashboard/labs" size="sm">
              Continue mission
            </Button>
            <span className="type-meta">+{remainingCp} CP remaining</span>
          </>
        )}
      </div>

      <div className="mt-5 border-t border-border-subtle pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
            <Zap className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Today's Mission
          </span>
          <Badge variant={difficultyVariant[mission.difficulty]} size="sm">
            {mission.difficulty}
          </Badge>
        </div>
        <h3 className="text-base font-black leading-snug text-text-primary">{mission.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary">{mission.brief}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="type-meta">{mission.estimatedTime}</span>
          <span className="font-mono text-[11px] font-bold text-accent">+{mission.cpReward} CP</span>
        </div>
        {dailyStatus === 'completed' ? (
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="success" size="sm">Completed</Badge>
            <span className="font-mono text-xs font-bold text-accent">+{dailyCpAwarded} CP</span>
          </div>
        ) : (
          <Button to="/dashboard/labs" size="sm" variant="secondary" className="mt-3">
            Start today's mission
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WeeklyMissionCard;
