import { useMemo } from 'react';

interface WeekActivityProps {
  visitDates?: string[];
  visitDurations?: Record<string, number>;
}

interface DayBarProps {
  label: string;
  minutes: number;
  isToday: boolean;
  maxMinutes: number;
}

const DayBar = ({ label, minutes, isToday, maxMinutes }: DayBarProps) => {
  const active = minutes > 0;
  const heightPercent = active && maxMinutes > 0
    ? Math.max(12, (minutes / maxMinutes) * 100)
    : 12;

  const minutesLabel = active
    ? (Math.round(minutes * 10) / 10 === minutes
        ? `${minutes}m`
        : `${Math.round(minutes)}m`)
    : '';

  return (
    <div
      className="group flex min-w-0 flex-1 flex-col items-center"
      title={active ? `${label} · ${minutesLabel}` : label}
    >
      {/* Minutes value — reserved line so every bar shares one top edge */}
      <span
        className={`mb-1.5 text-[10px] font-mono font-black transition-opacity duration-200 ${
          active ? 'text-accent opacity-100' : 'opacity-0'
        }`}
      >
        {minutesLabel || '0m'}
      </span>

      {/* Bar track — bottom-anchored, grows into the reserved zone above */}
      <div className="flex min-h-[72px] w-full flex-1 items-end justify-center">
        <div
          className={`w-full max-w-[34px] rounded-t-md transition-[height,background-color] duration-500 ${
            isToday
              ? 'bg-gradient-to-t from-accent/40 via-accent/70 to-accent'
              : active
                ? 'bg-accent/70'
                : 'bg-border/25'
          }`}
          style={{ height: `${heightPercent}%` }}
        />
      </div>

      {/* Day label */}
      <div className="flex flex-col items-center gap-1 pt-1.5">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
            isToday ? 'text-accent' : active ? 'text-text-secondary' : 'text-text-muted/40'
          }`}
        >
          {label}
        </span>
        {isToday && <span className="h-1 w-1 rounded-full bg-accent" />}
      </div>
    </div>
  );
};

const WeekActivity = ({ visitDates = [], visitDurations = {} }: WeekActivityProps) => {
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

  const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const summaryMinutes = totalMinutes >= 60
    ? `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m`
    : `${Math.round(totalMinutes)}m`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex min-h-[164px] w-full flex-1 items-stretch gap-2 pt-2 md:gap-3"
        role="img"
        aria-label={`Activity: ${activeDays} of 7 active days this week — ${summaryMinutes} total`}
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
      <div className="mt-4 text-center">
        <span className="type-label text-text-muted">
          {summaryMinutes}
          {" · "}
          {activeDays}{' '}
          {"days"}
        </span>
      </div>
    </div>
  );
};

export default WeekActivity;