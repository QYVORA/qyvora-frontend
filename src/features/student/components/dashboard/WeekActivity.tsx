import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface WeekActivityProps {
  visitDates?: string[];
  visitDurations?: Record<string, number>;
}

const DayBar = ({
  label,
  minutes,
  isToday,
  maxMinutes,
}: {
  label: string;
  minutes: number;
  isToday: boolean;
  maxMinutes: number;
}) => {
  const active = minutes > 0;
  const heightPercent = active && maxMinutes > 0
    ? Math.max(12, (minutes / maxMinutes) * 100)
    : 12;

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-h-0">
      <div className="relative w-full flex-1 flex justify-center min-h-[80px]">
        <div
          className={`absolute bottom-0 w-full max-w-[28px] rounded-t-md transition-[height,background-color] duration-500 ${
            active ? 'bg-accent' : 'bg-border/20'
          }`}
          style={{ height: `${heightPercent}%` }}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            active ? 'text-accent/80' : 'text-text-muted/30'
          }`}
        >
          {label}
        </span>
        {isToday && (
          <span className="w-1 h-1 rounded-full bg-accent" />
        )}
      </div>
    </div>
  );
};

const WeekActivity = ({ visitDates = [], visitDurations = {} }: WeekActivityProps) => {
  const { t } = useTranslation();

  const { days, activeDays } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let active = 0;

    const result = labels.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
      const minutes = visitDurations[dateStr] ?? (visitDates.includes(dateStr) ? 1 : 0);
      if (minutes > 0) active += 1;
      return { label, minutes, isToday };
    });

    return { days: result, activeDays: active };
  }, [visitDates, visitDurations]);

  const maxMinutes = useMemo(
    () => Math.max(1, ...days.map((d) => d.minutes)),
    [days],
  );

  if (visitDates.length === 0) return null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        className="flex items-stretch gap-1 w-full pt-2 flex-1 min-h-[140px]"
        role="img"
        aria-label={t('student.dashboard.streak.ariaWeek', {
          total: activeDays,
          active: activeDays,
          defaultValue: `Activity: ${activeDays} of 7 days this week`,
        })}
      >
        {days.map((d) => (
          <DayBar
            key={d.label}
            label={d.label}
            minutes={d.minutes}
            isToday={d.isToday}
            maxMinutes={maxMinutes}
          />
        ))}
      </div>
      <div className="mt-3 text-center shrink-0">
        <span className="text-[10px] font-mono text-text-muted">
          {activeDays}{' '}
          {t('student.dashboard.streak.activeDays', 'active days')}{' '}
          {t('student.dashboard.streak.thisWeek', 'this week')}
        </span>
      </div>
    </div>
  );
};

export default WeekActivity;