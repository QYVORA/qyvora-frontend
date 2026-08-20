import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconFire, IconTarget } from '@/shared/components/icons';
import type { EngagementResponse } from '@/features/student/data/missions';

interface CpEarnHintProps {
  engagement: EngagementResponse | null;
  loading?: boolean;
}

const CpEarnHint = ({ engagement, loading }: CpEarnHintProps) => {
  const { t } = useTranslation();

  if (loading || !engagement) return null;

  const { status: dailyStatus, mission, weeklyOperation: weekly, weeklyStatus, weeklyProgress } = engagement;

  if (dailyStatus === 'not_started') {
    return (
      <Link
        to={mission.actionType === 'lab_flag' ? '/dashboard/labs' : '/dashboard/courses'}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10 text-[11px] font-mono text-accent hover:bg-accent/10 transition-colors"
      >
        <IconFire size={14} className="shrink-0" />
        <span>{t('student.dashboard.cpEarnHint.dailyMission', { cp: mission.cpReward })}</span>
      </Link>
    );
  }

  if (weeklyStatus !== 'completed' && weeklyProgress < 1) {
    const remaining = weekly.steps.filter(s => !s.completed).reduce((sum, s) => sum + s.cpReward, 0);
    return (
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10 text-[11px] font-mono text-accent hover:bg-accent/10 transition-colors"
      >
        <IconTarget size={14} className="shrink-0" />
        <span>{t('student.dashboard.cpEarnHint.weeklyOperation', { cp: remaining })}</span>
      </Link>
    );
  }

  return (
    <Link
      to="/dashboard/labs"
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10 text-[11px] font-mono text-accent hover:bg-accent/10 transition-colors"
    >
      <IconFire size={14} className="shrink-0" />
      <span>{t('student.dashboard.cpEarnHint.general')}</span>
    </Link>
  );
};

export default CpEarnHint;
