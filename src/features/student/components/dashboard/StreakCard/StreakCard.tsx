import { Circle, Flame, FlameKindling, Zap, Sparkles, Trophy } from 'lucide-react';

interface StreakCardProps {
  streakDays: number;
  lastVisitDate?: string;
  variant?: 'card' | 'badge';
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface StreakTheme {
  primary: string;
  secondary: string;
  bg: string;
  border: string;
  glow: string;
  circleFill: string;
  circleEmpty: string;
}

function getStreakTheme(streak: number): StreakTheme {
  if (streak >= 7) {
    return {
      primary: 'text-red-500',
      secondary: 'text-amber-400',
      bg: 'bg-gradient-to-br from-red-500/15 via-amber-500/5 to-bg-card',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/25',
      circleFill: 'fill-red-500 text-red-500',
      circleEmpty: 'text-red-800/25',
    };
  }
  if (streak >= 5) {
    return {
      primary: 'text-orange-400',
      secondary: 'text-amber-300',
      bg: 'bg-gradient-to-br from-orange-400/12 via-amber-400/5 to-bg-card',
      border: 'border-orange-400/25',
      glow: 'shadow-orange-400/20',
      circleFill: 'fill-orange-400 text-orange-400',
      circleEmpty: 'text-orange-800/25',
    };
  }
  if (streak >= 3) {
    return {
      primary: 'text-accent',
      secondary: 'text-emerald-300',
      bg: 'bg-gradient-to-br from-accent/10 to-bg-card',
      border: 'border-accent/20',
      glow: 'shadow-accent/15',
      circleFill: 'fill-accent text-accent',
      circleEmpty: 'text-accent/20',
    };
  }
  if (streak >= 1) {
    return {
      primary: 'text-blue-400',
      secondary: 'text-blue-300',
      bg: 'bg-gradient-to-br from-blue-400/8 to-bg-card',
      border: 'border-blue-400/15',
      glow: 'shadow-blue-400/10',
      circleFill: 'fill-blue-400 text-blue-400',
      circleEmpty: 'text-blue-800/25',
    };
  }
  return {
    primary: 'text-gray-500',
    secondary: 'text-gray-600',
    bg: 'bg-bg-card',
    border: 'border-border/30',
    glow: 'shadow-transparent',
    circleFill: 'fill-gray-500 text-gray-500',
    circleEmpty: 'text-gray-700/30',
  };
}

function StreakIcon({ streak, theme }: { streak: number; theme: StreakTheme }) {
  if (streak >= 7) {
    return (
      <div className="relative flex items-center gap-0.5">
        <Flame className={`h-9 w-9 ${theme.primary} drop-shadow-[0_0_8px_var(--tw-shadow-color)]`} style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' }} />
        <Sparkles className={`h-4 w-4 ${theme.secondary} -ml-1 -mt-6`} />
        <Trophy className={`h-5 w-5 text-yellow-400 -ml-1 -mt-5`} />
      </div>
    );
  }
  if (streak >= 5) {
    return (
      <div className="relative flex items-center">
        <Flame className={`h-8 w-8 ${theme.primary} drop-shadow-[0_0_6px_var(--tw-shadow-color)]`} style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.4))' }} />
        <Zap className={`h-3.5 w-3.5 ${theme.secondary} -ml-1.5 -mb-4`} />
      </div>
    );
  }
  if (streak >= 3) {
    return (
      <Flame className={`h-7 w-7 ${theme.primary} drop-shadow-[0_0_4px_var(--tw-shadow-color)]`} style={{ filter: 'drop-shadow(0 0 4px rgba(102,184,112,0.3))' }} />
    );
  }
  if (streak >= 1) {
    return (
      <FlameKindling className={`h-6 w-6 ${theme.primary}`} />
    );
  }
  return (
    <Zap className="h-5 w-5 text-gray-500" />
  );
}

function StreakRing({ days, theme }: { days: number; theme: StreakTheme }) {
  const clamped = Math.min(days, 7);
  const dotSizes = ['h-4 w-4', 'h-4 w-4', 'h-4.5 w-4.5', 'h-4.5 w-4.5', 'h-5 w-5', 'h-5 w-5', 'h-5.5 w-5.5'];

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-1.5">
      {DAY_LABELS.map((label, i) => {
        const isActive = i < clamped;
        const size = dotSizes[i] || 'h-4 w-4';
        return (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Circle
              className={`${size} transition-all duration-500 ${
                isActive ? theme.circleFill : theme.circleEmpty
              }`}
              fill={isActive ? 'currentColor' : 'none'}
              fillOpacity={isActive ? 0.5 : 0}
            />
            <span className="text-[8px] font-mono font-bold uppercase text-text-muted/50">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

const StreakCard: React.FC<StreakCardProps> = ({ streakDays, lastVisitDate, variant = 'card' }) => {
  const theme = getStreakTheme(streakDays);

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme.border} ${theme.bg}`}>
        <Flame className={`h-4 w-4 ${theme.primary}`} />
        <span className={`font-mono text-sm font-black ${theme.primary}`}>{streakDays}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Day Streak</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} p-5 md:p-6 ${theme.glow} transition-all duration-500`}>
      <div className="flex items-center gap-4 mb-5">
        <StreakIcon streak={streakDays} theme={theme} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5">
            <span className={`text-3xl font-black font-mono tracking-tighter ${theme.primary} tabular-nums`}>
              {streakDays}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/70">Day Streak</span>
          </div>
          {lastVisitDate && (
            <p className="text-[10px] text-text-muted/50 mt-0.5 font-mono">
              Last active: {new Date(lastVisitDate).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      <StreakRing days={streakDays} theme={theme} />
    </div>
  );
};

export default StreakCard;
