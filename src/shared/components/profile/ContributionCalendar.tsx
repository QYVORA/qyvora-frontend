import { useMemo } from 'react';
import { getDateKey } from '@/shared/utils/dateUtils';

interface ContributionCalendarProps {
  activityDates: Record<string, number>;
  totalDays?: number;
  className?: string;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const STEP = CELL_SIZE + CELL_GAP;
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

interface CalendarCell {
  date: string;
  count: number;
  intensity: number;
  isToday: boolean;
}

/**
 * Calendar window — everything is derived from one pair of (start, end) dates
 * so the grid cells and the month labels can never drift apart. The end is
 * always "today"; the start is pulled back `totalDays` and aligned to a
 * Sunday so the window forms complete weeks with no future padding.
 */
function getCalendarWindow(totalDays: number): { start: Date; end: Date } {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);

  const totalWeeks = Math.max(1, Math.ceil(totalDays / DAYS_IN_WEEK));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (totalWeeks * DAYS_IN_WEEK - 1));
  const dayOfWeek = start.getUTCDay();
  if (dayOfWeek !== 0) {
    start.setUTCDate(start.getUTCDate() - dayOfWeek);
  }

  return { start, end };
}

function buildCells(
  start: Date,
  end: Date,
  activityDates: Record<string, number>,
  todayKey: string,
): CalendarCell[] {
  const cells: CalendarCell[] = [];
  const current = new Date(start);
  while (current.getTime() <= end.getTime()) {
    const dateKey = getDateKey(current);
    const count = activityDates[dateKey] || 0;
    cells.push({
      date: dateKey,
      count,
      intensity: getIntensity(count),
      isToday: dateKey === todayKey,
    });
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return cells;
}

function buildMonthLabels(start: Date, totalCells: number): Array<{ label: string; x: number }> {
  const labels: Array<{ label: string; x: number }> = [];
  const totalWeeks = Math.ceil(totalCells / DAYS_IN_WEEK);
  let lastMonth = -1;
  for (let week = 0; week < totalWeeks; week++) {
    const weekDate = new Date(start);
    weekDate.setUTCDate(start.getUTCDate() + week * DAYS_IN_WEEK);
    const month = weekDate.getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      labels.push({ label: MONTH_LABELS[month], x: week * STEP });
    }
  }
  return labels;
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  activityDates,
  totalDays = 365,
  className,
}) => {
  const todayKey = getDateKey();

  const { cells, weekCount, monthLabels } = useMemo(() => {
    const { start, end } = getCalendarWindow(totalDays);
    const built = buildCells(start, end, activityDates, todayKey);
    return {
      cells: built,
      weekCount: Math.max(1, Math.ceil(built.length / DAYS_IN_WEEK)),
      monthLabels: buildMonthLabels(start, built.length),
    };
  }, [activityDates, totalDays, todayKey]);

  const totalActivities = useMemo(
    () => Object.values(activityDates).reduce((sum, count) => sum + count, 0),
    [activityDates],
  );

  const activeDays = useMemo(
    () => Object.keys(activityDates).filter((k) => activityDates[k] > 0).length,
    [activityDates],
  );

  const gridWidth = weekCount * STEP;
  const gridHeight = DAYS_IN_WEEK * STEP;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
          {"Activity"}
        </h3>
        <span className="text-xs font-mono text-text-muted/60">
          {totalActivities} {"activities"} &middot; {activeDays} {"active days"}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="-mx-2 overflow-x-auto px-2 pb-2">
        <svg
          width={gridWidth}
          height={gridHeight + 22}
          viewBox={`0 0 ${gridWidth} ${gridHeight + 22}`}
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
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={`day-${i}`}
                x={-4}
                y={14 + i * STEP + CELL_SIZE / 2 + 3}
                textAnchor="end"
                className="fill-text-muted/40"
                style={{ fontSize: '9px', fontFamily: 'inherit' }}
              >
                {label}
              </text>
            ) : null,
          )}

          {/* Contribution cells */}
          {cells.map((cell, idx) => {
            const week = Math.floor(idx / DAYS_IN_WEEK);
            const day = idx % DAYS_IN_WEEK;
            const x = week * STEP;
            const y = 14 + day * STEP;
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
                  <title>{`${cell.date}: ${cell.count} ${"activities"}`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-text-muted/50">
        <span>{"Less"}</span>
        {INTENSITY_LEVELS.map((cls, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
        ))}
        <span>{"More"}</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;