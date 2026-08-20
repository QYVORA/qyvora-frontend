import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/ui';
import { IconFire } from '@/shared/components/icons';
import type { EngagementResponse } from '@/features/student/data/missions';

interface DailyMissionCardProps {
  engagement: EngagementResponse;
  loading?: boolean;
}

const DailyMissionCard = ({ engagement, loading }: DailyMissionCardProps) => {
  const { t } = useTranslation();
  const { mission, status, cpAwarded } = engagement;

  const difficultyVariant = {
    beginner: 'accent' as const,
    intermediate: 'warning' as const,
    advanced: 'danger' as const,
  };

  if (loading) {
    return (
      <div className="card-accent bg-bg-card p-6 md:p-8 animate-pulse">
        <div className="h-5 w-40 bg-border/30 rounded mb-4" />
        <div className="h-7 w-56 bg-border/30 rounded mb-3" />
        <div className="h-4 w-full bg-border/20 rounded mb-5" />
        <div className="h-9 w-28 bg-border/30 rounded" />
      </div>
    );
  }

  return (
    <div className="card-accent bg-bg-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
          <IconFire size={20} className="text-accent" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          {t('student.dashboard.dailyMission.title')}
        </span>
        <Badge variant={difficultyVariant[mission.difficulty]} size="sm">
          {mission.difficulty}
        </Badge>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-text-primary mb-2">
        {mission.title}
      </h3>

      <p className="text-sm md:text-base text-text-muted mb-4 line-clamp-2">
        {mission.brief}
      </p>

      <div className="flex items-center gap-4 mb-5">
        <span className="text-xs font-mono text-text-muted">
          {mission.estimatedTime}
        </span>
        <span className="text-xs font-mono text-accent font-bold">
          +{mission.cpReward} CP
        </span>
      </div>

      {status === 'completed' ? (
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {t('student.dashboard.dailyMission.completed')}
          </Badge>
          <span className="text-xs font-mono text-accent font-bold">+{cpAwarded} CP</span>
        </div>
      ) : (
        <Link
          to={mission.actionType === 'lab_flag' ? '/dashboard/labs' : '/dashboard/courses'}
          className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs w-full sm:w-auto text-center"
        >
          {t('student.dashboard.dailyMission.start')}
        </Link>
      )}
    </div>
  );
};

export default DailyMissionCard;
