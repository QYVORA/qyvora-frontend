import { useMemo } from 'react';

interface WeekActivityProps {
  visitDates?: string[];
}

const DayBar = ({ label, active, maxActive }: { label: string; active: boolean; maxActive: number }) => {
  const height = active ? Math.max(12, 100 - (maxActive > 1 ? 0 : 0)) : 4;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="relative w-full flex justify-center" style={{ height: 32 }}>
        <div
          className={`absolute bottom-0 w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${
            active
              ? 'bg-accent shadow-[0_0_6px_rgba(102,184,112,0.5)]'
              : 'bg-border/20'
          }`}
          style={{ height: `${height}%` }}
        />
      </div>
      <span className={`text-[8px] font-bold uppercase ${
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
    <div className="flex items-end gap-[2px] w-full pt-1" title="Mon-Sun activity">
      {days.map((d) => (
        <DayBar key={d.label} label={d.label} active={d.active} maxActive={maxActive} />
      ))}
    </div>
  );
};

export default WeekActivity;
