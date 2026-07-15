import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconArrowRight, IconShield } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Identicon } from '@/shared/components';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

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

const TOP_THREE_GLOW = [
  'shadow-[0_0_16px_rgba(250,204,21,0.4)]',
  'shadow-[0_0_14px_rgba(209,213,219,0.3)]',
  'shadow-[0_0_14px_rgba(217,119,6,0.3)]',
];

const TOP_THREE_RING = [
  'border-yellow-400',
  'border-gray-300',
  'border-amber-600',
];

const TOP_THREE_RANK_COLOR = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];

const CELL_SIZE = 42;
const GAP = 3;

const LandingLeaderboardSection = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTop = async () => {
      try {
        const res = await api.get('/public/leaderboard?period=all&limit=40');
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

  const cells = useMemo(() => {
    const arr: { entry: LeaderboardEntry | null; idx: number }[] = [];
    for (let i = 0; i < 40; i++) {
      arr.push({ entry: i < entries.length ? entries[i] : null, idx: i });
    }
    return arr;
  }, [entries]);

  return (
    <div className="relative bg-bg h-full flex flex-col overflow-hidden">
      <GridBoxedBackground opacity={0.15} blur={0} mask="none" />

      <div className="relative z-10 w-full h-full px-6 md:px-16 lg:px-24 py-12 md:py-16 lg:py-20 flex flex-col">
        <div className="w-full lg:max-w-6xl lg:mx-auto shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.25em] text-text-primary mb-3">
            <IconShield size={12} className="text-accent" /> Community
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
            Top <span className="text-accent">Operators</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            Ranked by CyberPoints earned. All balances verified on the QYVORA Chain.
          </p>
          {total > 0 && (
            <Link
              to="/leaderboard"
              className="btn-secondary inline-flex items-center gap-2.5"
            >
              View Full Leaderboard ({total}) <IconArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="relative flex-1 min-h-0 mt-6 md:mt-8 overflow-hidden">
          {loading ? (
            <div
              className="flex flex-wrap content-start"
              style={{ gap: `${GAP}px` }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-bg-card border border-border/20 animate-pulse shrink-0"
                  style={{
                    width: `${CELL_SIZE}px`,
                    height: `${CELL_SIZE}px`,
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              ))}
            </div>
          ) : entries.length === 0 ? null : (
            <div
              className="flex flex-wrap content-start"
              style={{ gap: `${GAP}px` }}
            >
              {cells.map(({ entry, idx }) => {
                const isFilled = entry !== null;
                const isTopThree = isFilled && entry!.rank <= 3;
                const isHovered = hoveredIdx === idx;

                if (!isFilled) {
                  return (
                    <div
                      key={idx}
                      className="rounded-lg bg-bg-elevated/40 border border-border/10 shrink-0"
                      style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
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
                      'rounded-lg border-2 overflow-hidden cursor-pointer shrink-0 relative',
                      'transition-all duration-300',
                      'hover:z-20',
                      isTopThree
                        ? `${TOP_THREE_RING[entry!.rank - 1]} ${TOP_THREE_GLOW[entry!.rank - 1]}`
                        : 'border-accent/15 hover:border-accent/40',
                      isHovered && 'z-20',
                    ].join(' ')}
                    style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-card [&_svg]:w-full [&_svg]:h-full">
                      <Identicon value={entry!.hackerHandle || entry!.userId} size={CELL_SIZE} />
                    </div>

                    <div className="absolute top-[2px] left-[2px] z-10">
                      {isTopThree ? (
                        <Medal className={`w-2.5 h-2.5 ${TOP_THREE_RANK_COLOR[entry!.rank - 1]}`} />
                      ) : (
                        <span className="text-[6px] font-mono font-bold text-text-muted/40 bg-bg/70 rounded px-0.5 leading-none">
                          {entry!.rank}
                        </span>
                      )}
                    </div>

                    <div
                      className={[
                        'absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/90 to-transparent',
                        'flex flex-col items-center justify-end pb-1 pt-3',
                        'transition-opacity duration-300',
                        isHovered ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                    >
                      <span className="text-[7px] font-black text-text-primary truncate w-full text-center leading-none px-0.5">
                        {entry!.hackerHandle || entry!.name || 'Anon'}
                      </span>
                      <span className="text-[6px] font-mono font-bold text-accent leading-none">
                        {Number(entry!.cp).toLocaleString()} CP
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingLeaderboardSection;
