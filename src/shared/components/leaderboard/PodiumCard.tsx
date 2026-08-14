import { Link } from 'react-router-dom';
import { Medal, Crown } from 'lucide-react';
import { Identicon, BootcampBadge } from '@/shared/components';
import type { LeaderboardEntry } from './types';

interface PodiumCardProps {
  entry: LeaderboardEntry;
  rank: number;
  className?: string;
}

const PODIUM_STYLES = [
  {
    border: 'border-yellow-400/70',
    glow: 'shadow-[0_0_40px_-8px_rgba(250,204,21,0.5)]',
    rankColor: 'text-yellow-400',
    avatarSize: 'w-24 h-24 md:w-28 md:h-28',
    title: 'text-lg md:text-xl',
    chip: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400',
    scale: 'md:scale-105',
    crown: true,
  },
  {
    border: 'border-gray-300/70',
    glow: 'shadow-[0_0_36px_-8px_rgba(209,213,219,0.4)]',
    rankColor: 'text-gray-300',
    avatarSize: 'w-20 h-20 md:w-24 md:h-24',
    title: 'text-base md:text-lg',
    chip: 'bg-gray-300/10 border-gray-300/30 text-gray-300',
    scale: '',
    crown: false,
  },
  {
    border: 'border-amber-600/70',
    glow: 'shadow-[0_0_36px_-8px_rgba(217,119,6,0.4)]',
    rankColor: 'text-amber-600',
    avatarSize: 'w-20 h-20 md:w-24 md:h-24',
    title: 'text-base md:text-lg',
    chip: 'bg-amber-600/10 border-amber-600/30 text-amber-600',
    scale: '',
    crown: false,
  },
];

const PodiumCard = ({ entry, rank, className = '' }: PodiumCardProps) => {
  const s = PODIUM_STYLES[rank - 1];
  const bootcampCompleted = entry.bootcampStatus === 'completed';

  return (
    <Link
      to={`/@${entry.hackerHandle}`}
      className={`group relative flex flex-col items-center text-center gap-3 rounded-2xl border ${s.border} ${s.glow} bg-bg-card p-6 md:p-8 transition-all duration-300 hover:brightness-110 active:scale-[0.99] h-full ${s.scale} ${className}`}
    >
      <div className={`absolute top-3 left-3 flex items-center gap-1.5 ${s.rankColor}`}>
        {s.crown && <Crown className="w-4 h-4" />}
        <Medal className="w-4 h-4" />
      </div>

      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${s.chip}`}>
        Rank #{rank}
      </span>

      <div className={`${s.avatarSize} rounded-full overflow-hidden bg-black shrink-0 border border-accent/40`}>
        <Identicon
          value={entry.hackerHandle || entry.name}
          size={112}
          className="w-full h-full rounded-full"
        />
      </div>

      <div className="min-w-0 w-full">
        <div className={`flex items-center justify-center gap-1.5 ${s.title} font-black text-text-primary truncate group-hover:text-accent transition-colors`}>
          <span className="truncate">{entry.hackerHandle || entry.name}</span>
          <BootcampBadge completed={bootcampCompleted} className="w-5 h-5 shrink-0" />
        </div>
        {entry.organization && (
          <div className="text-[10px] font-mono text-text-muted truncate mt-0.5">{entry.organization}</div>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center gap-1 pt-1 w-full border-t border-border/20">
        <span className="text-base md:text-xl font-black font-mono text-text-primary">
          {Number(entry.cp).toLocaleString()} <span className="text-[9px] uppercase tracking-widest text-accent">CP</span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
          {entry.rankLabel}
        </span>
      </div>
    </Link>
  );
};

export default PodiumCard;
