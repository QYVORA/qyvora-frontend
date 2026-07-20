import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getDateKey } from '@/shared/utils/dateUtils';

interface ContributionCalendarProps {
  activityDates: Record<string, number>;
  totalDays?: number;
  className?: string;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const WEEKS = 52;
const DAYS_IN_WEEK = 7;

const INTENSITY_LEVELS = [
  'bg-accent/5',
  'bg-accent/25',
  'bg-accent/50',
  'bg-accent',
];

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

function buildCalendarGrid(activityDates: Record<string, number>, totalWeeks = WEEKS) {
  const today = new Date();
  const todayKey = getDateKey(today);

  // Find the end date (today or the last activity date)
  const endDate = new Date(today);
  endDate.setUTCHours(0, 0, 0, 0);

  // Start from totalWeeks * 7 days ago, aligned to Sunday
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (totalWeeks * 7 - 1));
  // Align to Sunday (day 0)
  const dayOfWeek = startDate.getUTCDay();
  if (dayOfWeek !== 0) {
    startDate.setDate(startDate.getDate() - dayOfWeek);
  }

  const cells: Array<{ date: string; count: number; intensity: number; isToday: boolean }> = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateKey = getDateKey(current);
    const count = activityDates[dateKey] || 0;
    cells.push({
      date: dateKey,
      count,
      intensity: getIntensity(count),
      isToday: dateKey === todayKey,
    });
    current.setDate(current.getDate() + 1);
  }

  return cells;
}

function getMonthLabels(gridWidth: number) {
  const today = new Date();
  const labels: Array<{ label: string; x: number }> = [];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));
  const dayOfWeek = startDate.getUTCDay();
  if (dayOfWeek !== 0) {
    startDate.setDate(startDate.getDate() - dayOfWeek);
  }

  let lastMonth = -1;
  for (let week = 0; week < WEEKS; week++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + week * 7);
    const month = weekDate.getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      labels.push({
        label: MONTH_LABELS[month],
        x: week * (CELL_SIZE + CELL_GAP),
      });
    }
  }
  return labels;
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  activityDates,
  totalDays = 365,
  className,
}) => {
  const { t } = useTranslation();

  const totalWeeks = Math.ceil(totalDays / 7);

  const cells = useMemo(() => buildCalendarGrid(activityDates, totalWeeks), [activityDates, totalWeeks]);

  const totalActivities = useMemo(
    () => Object.values(activityDates).reduce((sum, count) => sum + count, 0),
    [activityDates]
  );

  const activeDays = useMemo(
    () => Object.keys(activityDates).filter((k) => activityDates[k] > 0).length,
    [activityDates]
  );

  const gridWidth = totalWeeks * (CELL_SIZE + CELL_GAP);
  const gridHeight = DAYS_IN_WEEK * (CELL_SIZE + CELL_GAP);
  const monthLabels = useMemo(() => getMonthLabels(gridWidth), [gridWidth]);

  // Pad cells to fill complete weeks
  const paddedCells = useMemo(() => {
    const remainder = cells.length % DAYS_IN_WEEK;
    if (remainder === 0) return cells;
    const padding = DAYS_IN_WEEK - remainder;
    const lastDate = cells.length > 0 ? new Date(cells[cells.length - 1].date + 'T00:00:00.000Z') : new Date();
    const padded = [...cells];
    for (let i = 0; i < padding; i++) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + (i + 1));
      padded.push({
        date: getDateKey(d),
        count: 0,
        intensity: 0,
        isToday: false,
      });
    }
    return padded;
  }, [cells]);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
          {t('profile.contributionCalendar.title')}
        </h3>
        <span className="text-[10px] font-mono text-text-muted/60">
          {totalActivities} {t('profile.contributionCalendar.activities')} &middot; {activeDays} {t('profile.contributionCalendar.activeDays')}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <svg
          width={gridWidth}
          height={gridHeight + 20}
          viewBox={`0 0 ${gridWidth} ${gridHeight + 20}`}
          className="block"
        >
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={`month-${i}`}
              x={m.x}
              y={8}
              className="fill-text-muted/50"
              style={{ fontSize: '9px', fontFamily: 'inherit' }}
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((label, i) => (
            label ? (
              <text
                key={`day-${i}`}
                x={-4}
                y={20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 3}
                textAnchor="end"
                className="fill-text-muted/40"
                style={{ fontSize: '9px', fontFamily: 'inherit' }}
              >
                {label}
              </text>
            ) : null
          ))}

          {/* Contribution cells */}
          {paddedCells.map((cell, idx) => {
            const week = Math.floor(idx / DAYS_IN_WEEK);
            const day = idx % DAYS_IN_WEEK;
            const x = week * (CELL_SIZE + CELL_GAP);
            const y = 14 + day * (CELL_SIZE + CELL_GAP);
            const colorClass = INTENSITY_LEVELS[cell.intensity];

            return (
              <g key={cell.date}>
                <rect
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={2}
                  ry={2}
                  className={`${colorClass} ${cell.isToday ? 'stroke-accent stroke-1' : ''}`}
                >
                  <title>{`${cell.date}: ${cell.count} ${t('profile.contributionCalendar.activities')}`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-[9px] font-mono text-text-muted/50">
        <span>{t('profile.contributionCalendar.less')}</span>
        {INTENSITY_LEVELS.map((cls, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-sm ${cls}`}
          />
        ))}
        <span>{t('profile.contributionCalendar.more')}</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;
