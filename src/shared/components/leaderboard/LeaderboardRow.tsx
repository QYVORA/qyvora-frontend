import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { Identicon, BootcampBadge, StreakIcon } from '@/shared/components';
import RankBadge from './RankBadge';
import { TOP_THREE_COLORS } from './types';
import type { LeaderboardEntry } from './types';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  user: any;
  rank?: number;
  anonymousLabel?: string;
  youLabel?: string;
  roomsLabel?: string;
  avatarShape?: 'rounded-xl' | 'rounded-full';
  normalBorderColor?: string;
}

const LeaderboardRow = ({
  entry,
  user,
  rank,
  anonymousLabel = 'Anonymous',
  youLabel = 'You',
  roomsLabel = 'rooms',
  avatarShape = 'rounded-full',
  normalBorderColor = 'border-border',
}: LeaderboardRowProps) => {
  const effectiveRank = rank ?? entry.rank;
  const isTopThree = effectiveRank <= 3;
  const isCurrentUser = user && entry.userId === user.uid;
  const bootcampCompleted = entry.bootcampStatus === 'completed';

  return (
    <Link
      to={`/@${entry.hackerHandle}`}
      className={`
        grid grid-cols-[36px_1fr] md:grid-cols-[48px_1fr_140px_100px_80px] gap-2 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border transition-all duration-300 items-center
        ${isCurrentUser
          ? 'border-accent/40 bg-accent-dim/10'
          : isTopThree
          ? 'border-accent/20 bg-accent-dim/5 shadow-[0_0_20px_-8px] shadow-accent/10'
          : `${normalBorderColor} bg-bg-card hover:border-accent/20`
        }
        hover:brightness-110 active:scale-[0.99]
      `}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        {isTopThree ? (
          <Medal className={`w-5 h-5 ${TOP_THREE_COLORS[effectiveRank - 1]}`} />
        ) : (
          <span className="text-sm font-mono font-bold text-text-muted/60">
            {effectiveRank}
          </span>
        )}
      </div>

      {/* Operator info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 md:w-10 md:h-10 ${avatarShape} shrink-0 overflow-hidden border border-accent/20 [&_svg]:w-full [&_svg]:h-full`}>
          <Identicon value={entry.userId} size={40} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-text-primary truncate flex items-center gap-1.5">
              {entry.hackerHandle || entry.name || anonymousLabel}
              <BootcampBadge completed={bootcampCompleted} className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-accent text-bg">
                {youLabel}
              </span>
            )}
          </div>
          {entry.organization && (
            <div className="text-[10px] font-mono text-text-muted truncate">
              {entry.organization}
            </div>
          )}
        </div>
      </div>

      {/* Rank label (desktop) */}
      <div className="hidden md:flex items-center">
        <RankBadge label={entry.rankLabel} />
      </div>

      {/* CP (desktop) */}
      <div className="hidden md:block text-right">
        <span className="text-sm font-black font-mono text-text-primary">
          {Number(entry.cp).toLocaleString()}
        </span>
      </div>

      {/* Streak (desktop) */}
      <div className="hidden md:flex items-center justify-end">
        <StreakIcon days={entry.streakDays} />
      </div>

      {/* Mobile stats row */}
      <div className="md:hidden col-span-2 flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <RankBadge label={entry.rankLabel} />
          <span className="text-[10px] font-mono text-text-muted/60">
            {entry.roomsCompleted} {roomsLabel}
          </span>
        </div>
        <span className="text-sm font-black font-mono text-accent">
          {Number(entry.cp).toLocaleString()} CP
        </span>
      </div>
    </Link>
  );
};

export default LeaderboardRow;
