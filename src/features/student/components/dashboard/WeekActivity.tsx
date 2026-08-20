import { useMemo } from 'react';

interface WeekActivityProps {
  visitDates?: string[];
}

const DayBar = ({ label, active, maxActive }: { label: string; active: boolean; maxActive: number }) => {
  const height = active ? Math.max(32, 70 + (maxActive > 3 ? 15 : 0)) : 12;
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="relative w-full flex justify-center" style={{ height: 64 }}>
        <div
          className={`absolute bottom-0 w-full max-w-[28px] rounded-t-md transition-all duration-500 ${
            active
              ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]'
              : 'bg-border/20'
          }`}
          style={{ height: `${height}%` }}
        />
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${
        active ? 'text-accent/80' : 'text-text-muted/30'
      }`}>
        {label}
      </span>
    </div>
  );
};

const WeekActivity = ({ visitDates = [] }: WeekActivityProps) => {
  const days = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      return { label, active: visitDates.includes(dateStr) };
    });
  }, [visitDates]);

  const maxActive = days.filter(d => d.active).length;

  if (visitDates.length === 0) return null;

  return (
    <div className="flex items-end gap-1 w-full pt-2" title="Mon-Sun activity" role="img" aria-label={`Activity: ${days.filter(d => d.active).length} of 7 days active`}>
      {days.map((d) => (
        <DayBar key={d.label} label={d.label} active={d.active} maxActive={maxActive} />
      ))}
    </div>
  );
};

export default WeekActivity;
