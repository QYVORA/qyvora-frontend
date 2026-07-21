import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Identicon } from '@/shared/components';
import { useTranslation } from 'react-i18next';

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

const CELL_SIZE_SM = 48;
const CELL_SIZE_LG = 60;
const GAP = 4;

const LandingLeaderboardSection = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cellSize = isDesktop ? CELL_SIZE_LG : CELL_SIZE_SM;

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

  const medalSizes = isDesktop ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row gap-20 sm:gap-10 lg:gap-20 lg:items-center">
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
              {t('landing.leaderboard.heading')}
            </h2>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
              {t('landing.leaderboard.description')}
            </p>
          {total > 0 && (
            <Link
              to="/leaderboard"
              className="btn-secondary inline-flex items-center gap-2.5"
            >
               {t('landing.leaderboard.viewFull')} ({total}) <IconArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center justify-center">
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
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
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
                      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
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
                      'cursor-pointer shrink-0 relative',
                      'transition-all duration-300',
                      'rounded-lg border border-border/30 overflow-hidden',
                      'hover:z-20 hover:border-accent/30',
                      isHovered && 'z-20 border-accent/30',
                    ].join(' ')}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  >
                    <div className="flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                      <Identicon value={entry!.hackerHandle || entry!.name} size={cellSize} />
                    </div>

                    <div className="absolute top-[2px] left-[2px] z-10">
                      {isTopThree ? (
                        <Medal className={`${medalSizes} ${TOP_THREE_RANK_COLOR[entry!.rank - 1]}`} />
                      ) : (
                        <span className="text-[7px] font-mono font-bold text-text-muted/40 bg-bg/70 rounded px-0.5 leading-none">
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
                       <span className="text-[8px] font-black text-text-primary truncate w-full text-center leading-none px-0.5">
                         {entry!.hackerHandle || entry!.name || t('landing.leaderboard.anonFallback')}
                       </span>
                       <span className="text-[7px] font-mono font-bold text-accent leading-none">
                         {Number(entry!.cp).toLocaleString()} {t('landing.leaderboard.cpSuffix')}
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
