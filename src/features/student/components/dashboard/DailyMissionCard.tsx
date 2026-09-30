import { Badge, Button } from '@/shared/components/ui';
import Skeleton from '@/shared/components/ui/Skeleton';
import type { EngagementResponse } from '@/features/student/data/missions';

interface DailyMissionCardProps {
  engagement: EngagementResponse;
  loading?: boolean;
}

const DailyMissionCard = ({ engagement, loading }: DailyMissionCardProps) => {
  const { mission, status, cpAwarded } = engagement;

  const difficultyVariant = {
    beginner: 'accent' as const,
    intermediate: 'warning' as const,
    advanced: 'danger' as const,
  };

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

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          {"Daily Mission"}
        </span>
        <Badge variant={difficultyVariant[mission.difficulty]} size="sm">
          {mission.difficulty}
        </Badge>
      </div>

      <h3 className="mb-3 text-lg font-black leading-tight text-text-primary md:text-xl">
        {mission.title}
      </h3>

      <p className="mb-5 line-clamp-2 text-sm text-text-secondary">{mission.brief}</p>

      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="type-meta">{mission.estimatedTime}</span>
        <span className="font-mono text-xs font-bold text-accent">+{mission.cpReward} CP</span>
      </div>

      {status === 'completed' ? (
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {"Completed"}
          </Badge>
          <span className="font-mono text-xs font-bold text-accent">+{cpAwarded} CP</span>
        </div>
      ) : (
        <Button
          to={mission.actionType === 'lab_flag' ? '/dashboard/labs' : '/dashboard/courses'}
          size="sm"
        >
          {"Start Mission"}
        </Button>
      )}
    </div>
  );
};

export default DailyMissionCard;
