import { Circle, Flame, Zap } from 'lucide-react';

interface StreakCardProps {
  streakDays: number;
  lastVisitDate?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getStreakColor(streak: number): { circle: string; flame: string; bg: string; border: string } {
  if (streak >= 6) return { circle: 'text-red-500', flame: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  if (streak >= 4) return { circle: 'text-amber-400', flame: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' };
  if (streak >= 1) return { circle: 'text-gray-400', flame: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
  return { circle: 'text-gray-600', flame: 'text-gray-600', bg: 'bg-gray-500/5', border: 'border-gray-500/10' };
}

const StreakCard: React.FC<StreakCardProps> = ({ streakDays, lastVisitDate }) => {
  const colors = getStreakColor(streakDays);
  const clampedStreak = Math.min(streakDays, 7);
  const daysWithActivity = clampedStreak;

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 md:p-6`}>
      <div className="flex items-center gap-3 mb-4">
        {streakDays >= 6 ? (
          <Flame className={`h-6 w-6 ${colors.flame}`} />
        ) : (
          <Zap className={`h-6 w-6 ${colors.flame}`} />
        )}
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono ${colors.flame}`}>{streakDays}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Day Streak</span>
          </div>
          {lastVisitDate && (
            <p className="text-[10px] text-text-muted mt-0.5">
              Last active: {new Date(lastVisitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-1">
        {DAY_LABELS.map((label, i) => {
          const isActive = i < daysWithActivity;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Circle
                className={`h-5 w-5 transition-colors duration-300 ${
                  isActive ? colors.circle : 'text-gray-700/30'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
                fillOpacity={isActive ? 0.4 : 0}
              />
              <span className="text-[8px] font-mono font-bold uppercase text-text-muted/60">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakCard;
