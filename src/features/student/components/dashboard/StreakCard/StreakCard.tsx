import { Circle, Flame, FlameKindling, Zap, Sparkles, Trophy } from 'lucide-react';

interface StreakCardProps {
  streakDays: number;
  lastVisitDate?: string;
  variant?: 'card' | 'badge';
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface StreakTheme {
  gradient: string;
  bg: string;
  border: string;
  glow: string;
  circleFill: string;
  circleEmpty: string;
}

function getStreakTheme(streak: number): StreakTheme {
  if (streak >= 7) {
    return {
      gradient: 'bg-gradient-to-b from-blue-400 via-green-400 to-red-500',
      bg: 'bg-gradient-to-br from-red-500/15 via-amber-500/5 to-bg-card',
      border: 'border-red-500/30',
      glow: 'shadow-red-500/25',
      circleFill: 'fill-red-500 text-red-500',
      circleEmpty: 'text-red-800/25',
    };
  }
  if (streak >= 5) {
    return {
      gradient: 'bg-gradient-to-b from-blue-400 via-green-400 to-orange-400',
      bg: 'bg-gradient-to-br from-orange-400/12 via-amber-400/5 to-bg-card',
      border: 'border-orange-400/25',
      glow: 'shadow-orange-400/20',
      circleFill: 'fill-orange-400 text-orange-400',
      circleEmpty: 'text-orange-800/25',
    };
  }
  if (streak >= 3) {
    return {
      gradient: 'bg-gradient-to-b from-blue-400 via-green-400 to-accent',
      bg: 'bg-gradient-to-br from-accent/10 to-bg-card',
      border: 'border-accent/20',
      glow: 'shadow-accent/15',
      circleFill: 'fill-accent text-accent',
      circleEmpty: 'text-accent/20',
    };
  }
  if (streak >= 1) {
    return {
      gradient: 'bg-gradient-to-b from-blue-400 to-cyan-400',
      bg: 'bg-bg-card',
      border: 'border-border/30',
      glow: 'shadow-transparent',
      circleFill: 'fill-gray-400 text-gray-400',
      circleEmpty: 'text-gray-700/30',
    };
  }
  return {
    gradient: 'text-gray-600',
    bg: 'bg-bg-card',
    border: 'border-border/20',
    glow: 'shadow-transparent',
    circleFill: 'fill-gray-600 text-gray-600',
    circleEmpty: 'text-gray-700/25',
  };
}

function GradientFlame({ className, gradient }: { className: string; gradient: string }) {
  return (
    <div className={`${gradient} bg-clip-text text-transparent ${className}`}>
      <Flame className="w-full h-full" />
    </div>
  );
}

function StreakIcon({ streak, theme }: { streak: number; theme: StreakTheme }) {
  if (streak >= 7) {
    return (
      <div className="relative flex items-center">
        <GradientFlame className="w-16 h-16" gradient={theme.gradient} />
        <Sparkles className="w-5 h-5 text-amber-400 -ml-3 -mt-10" />
        <Trophy className="w-7 h-7 text-yellow-400 -ml-3 -mt-8" />
        <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl -z-10" />
      </div>
    );
  }
  if (streak >= 5) {
    return (
      <div className="relative flex items-center">
        <GradientFlame className="w-14 h-14" gradient={theme.gradient} />
        <Zap className="w-4 h-4 text-amber-300 -ml-2 -mb-6" />
        <div className="absolute inset-0 rounded-full bg-orange-400/10 blur-lg -z-10" />
      </div>
    );
  }
  if (streak >= 3) {
    return (
      <div className="relative flex items-center">
        <GradientFlame className="w-12 h-12" gradient={theme.gradient} />
        <div className="absolute inset-0 rounded-full bg-accent/10 blur-md -z-10" />
      </div>
    );
  }
  if (streak >= 1) {
    return (
      <div className="relative flex items-center">
        <div className={`bg-gradient-to-b from-blue-400 to-cyan-400 bg-clip-text text-transparent`}>
          <FlameKindling className="w-10 h-10" />
        </div>
      </div>
    );
  }
  return (
    <Zap className="w-8 h-8 text-gray-500" />
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
        <div className={`${theme.gradient} bg-clip-text text-transparent`}>
          <Flame className="h-4 w-4" />
        </div>
        <span className={`font-mono text-sm font-black ${theme.gradient} bg-clip-text text-transparent`}>{streakDays}</span>
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
            <span className={`text-3xl font-black font-mono tracking-tighter ${theme.gradient} bg-clip-text text-transparent tabular-nums`}>
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
