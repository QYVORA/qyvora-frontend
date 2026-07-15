import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconArrowRight, IconShield } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Identicon } from '@/shared/components';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  hackerHandle: string;
  name: string;
  cp: number;
  streakDays: number;
  roomsCompleted: number;
  bootcampStatus?: string;
}

const TOP_THREE_BORDER = [
  'border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.35)]',
  'border-gray-300 shadow-[0_0_10px_rgba(209,213,219,0.25)]',
  'border-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.25)]',
];

const TOP_THREE_RANK = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

const LandingLeaderboardSection = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTop = async () => {
      try {
        const res = await api.get('/public/leaderboard?period=all&limit=35');
        const data = res.data;
        if (data.success && !cancelled) {
          setEntries(data.entries || []);
          setTotal(data.total || 0);
        }
      } catch {
        // silently fail on landing
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTop();
    return () => { cancelled = true; };
  }, []);

  const gridCells = useMemo(() => {
    const cells: { entry: LeaderboardEntry | null; idx: number }[] = [];
    for (let i = 0; i < 35; i++) {
      cells.push({
        entry: i < entries.length ? entries[i] : null,
        idx: i,
      });
    }
    return cells;
  }, [entries]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Left column — title + description */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12">
        <div className="md:w-[380px] lg:w-[420px]">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
            Top <span className="text-accent">Operators</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm mb-6">
            Ranked by CyberPoints earned. All balances verified on the QYVORA Chain.
          </p>
          {total > 0 && (
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:brightness-110 transition-all active:scale-95"
            >
              View Full Leaderboard ({total}) <IconArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Right column — identicon grid (Athens-style) */}
      <div
        className="absolute top-0 bottom-0 right-0 z-0 overflow-hidden pointer-events-none"
        style={{
          left: 'min(42%, 420px)',
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 8%, rgba(0,0,0,0.1) 18%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.9) 75%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 8%, rgba(0,0,0,0.1) 18%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.9) 75%, black 100%)',
        }}
      >
        {loading ? (
          <div className="flex flex-wrap gap-[3px] p-3 content-start">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="w-[clamp(48px,8vw,72px)] aspect-square rounded-lg bg-bg-card border border-border/20 animate-pulse"
                style={{ animationDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? null : (
          <div className="pointer-events-auto flex flex-wrap gap-[3px] p-3 content-start">
            {gridCells.map(({ entry, idx }) => {
              const isFilled = entry !== null;
              const isTopThree = isFilled && entry!.rank <= 3;
              const isHovered = hoveredIdx === idx;

              if (!isFilled) {
                return (
                  <div
                    key={idx}
                    className="w-[clamp(48px,8vw,72px)] aspect-square rounded-lg bg-bg/40 border border-border/5"
                  />
                );
              }

              return (
                <Link
                  key={idx}
                  to={`/@${entry!.hackerHandle}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={[
                    'w-[clamp(48px,8vw,72px)] aspect-square rounded-lg border relative overflow-hidden transition-all duration-300 group cursor-pointer',
                    'hover:z-10 hover:scale-110 hover:shadow-lg',
                    isTopThree
                      ? TOP_THREE_BORDER[entry!.rank - 1]
                      : 'border-accent/10 hover:border-accent/40',
                    isHovered && 'z-10 scale-110 shadow-lg',
                  ].join(' ')}
                >
                  {/* Identicon fill */}
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-card [&_svg]:w-full [&_svg]:h-full">
                    <Identicon value={entry!.userId} size={80} />
                  </div>

                  {/* Rank badge */}
                  <div className="absolute top-0.5 left-0.5 z-10">
                    {isTopThree ? (
                      <Medal className={`w-3 h-3 ${TOP_THREE_RANK[entry!.rank - 1]}`} />
                    ) : (
                      <span className="text-[8px] font-mono font-bold text-text-muted/50 bg-bg/80 rounded px-0.5 leading-none">
                        {entry!.rank}
                      </span>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div
                    className={[
                      'absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg/95 via-bg/80 to-transparent',
                      'flex flex-col items-center justify-end p-1 pt-3',
                      'transition-opacity duration-200',
                      isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                    ].join(' ')}
                  >
                    <span className="text-[8px] font-black text-text-primary truncate w-full text-center leading-tight">
                      {entry!.hackerHandle || entry!.name || 'Anon'}
                    </span>
                    <span className="text-[7px] font-mono font-bold text-accent">
                      {Number(entry!.cp).toLocaleString()} CP
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
        <IconShield size={12} className="text-accent" />
        CP verified on QYVORA Chain
      </div>
    </div>
  );
};

export default LandingLeaderboardSection;
