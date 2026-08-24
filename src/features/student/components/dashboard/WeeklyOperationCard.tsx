import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/components/ui';
import { IconTarget } from '@/shared/components/icons';
import type { EngagementResponse } from '@/features/student/data/missions';

interface WeeklyOperationCardProps {
  engagement: EngagementResponse;
  loading?: boolean;
}

const WeeklyOperationCard = ({ engagement, loading }: WeeklyOperationCardProps) => {
  const { t } = useTranslation();
  const { weeklyOperation: operation, weeklyStatus: status, weeklyDaysRemaining: daysRemaining, weeklyProgress: progress, weeklyCpAwarded: cpAwarded } = engagement;

  if (loading) {
    return (
      <div className="card-accent bg-bg-card p-5 md:p-6 animate-pulse">
        <div className="h-5 w-40 bg-border/30 rounded mb-4" />
        <div className="h-6 w-56 bg-border/30 rounded mb-3" />
        <div className="h-4 w-full bg-border/20 rounded mb-5" />
        <div className="h-9 w-28 bg-border/30 rounded" />
      </div>
    );
  }

  return (
    <div className="card-accent bg-bg-card p-5 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent/10 shrink-0">
          <IconTarget size={18} className="text-accent" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-text-muted">
          {t('student.dashboard.weeklyOperation.title')}
        </span>
        <Badge variant="info" size="sm">
          {daysRemaining} {t('student.dashboard.weeklyOperation.daysLeft')}
        </Badge>
      </div>

      <h3 className="text-lg md:text-xl font-black text-text-primary mb-2">
        {operation.title}
      </h3>

      <p className="text-sm md:text-base text-text-muted mb-4 line-clamp-2">
        {operation.brief}
      </p>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-text-muted">
            {operation.steps.filter(s => s.completed).length}/{operation.steps.length} {t('student.dashboard.weeklyOperation.steps')}
          </span>
          <span className="text-xs font-mono text-accent font-bold">
            +{operation.cpReward} CP
          </span>
        </div>
        <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {operation.steps.map(step => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${step.completed ? 'bg-accent border-accent' : 'border-border'}`}>
              {step.completed && (
                <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${step.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {step.label}
            </span>
            <span className="text-xs font-mono text-accent ml-auto font-bold">
              +{step.cpReward}
            </span>
          </div>
        ))}
      </div>

      {status === 'completed' ? (
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {t('student.dashboard.weeklyOperation.completed')}
          </Badge>
          <Badge variant="accent" size="sm">
            {operation.badge}
          </Badge>
          <span className="text-xs font-mono text-accent font-bold">+{cpAwarded} CP</span>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
          <span>+{operation.steps.filter(s => !s.completed).reduce((sum, s) => sum + s.cpReward, 0)} CP {t('student.dashboard.weeklyOperation.remaining')}</span>
        </div>
      )}
    </div>
  );
};

export default WeeklyOperationCard;
