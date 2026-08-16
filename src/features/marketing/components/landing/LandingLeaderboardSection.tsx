import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import Identicon from '@/shared/components/Identicon';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import api from '@/core/services/api';

import { useTranslation } from 'react-i18next';
import { FilterTabs, ErrorState } from '@/shared/components/ui';

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

const CELL_SIZE_SM = 64;
const CELL_SIZE_LG = 64;
const GAP = 4;
const GRID_COLUMNS = 8;

type Period = 'all' | 'week' | 'month';

const LandingLeaderboardSection = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [period, setPeriod] = useState<Period>('all');

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const cellSize = isDesktop ? CELL_SIZE_LG : CELL_SIZE_SM;

  const fetchLeaderboard = useCallback(async (p: Period) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/public/leaderboard?period=${p}&limit=40`);
      const data = res.data;
      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      } else {
        setError('Failed to load leaderboard.');
      }
    } catch {
      setError('Failed to load leaderboard. Check connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const cells = useMemo(() => {
    const arr: { entry: LeaderboardEntry | null; idx: number }[] = [];
    for (let i = 0; i < 40; i++) {
      arr.push({ entry: i < entries.length ? entries[i] : null, idx: i });
    }
    return arr;
  }, [entries]);

  const medalSizes = isDesktop ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden">
      <GridBoxedBackground blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column — same height as grid on desktop */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-8">
              {t('landing.leaderboard.heading1')} <span className="text-accent">{t('landing.leaderboard.heading2')}</span>
            </h2>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-10">
              {t('landing.leaderboard.description')}
            </p>
            <div className="mb-8">
              <FilterTabs
                tabs={[
                  { key: 'all', label: t('leaderboardPage.periods.all') },
                  { key: 'week', label: t('leaderboardPage.periods.week') },
                  { key: 'month', label: t('leaderboardPage.periods.month') },
                ]}
                activeKey={period}
                onChange={(key) => setPeriod(key as Period)}
              />
            </div>
          {total > 0 && (
            <Link
              to="/leaderboard"
              className="btn-secondary inline-flex items-center gap-2.5"
            >
               {t('landing.leaderboard.viewFull')} ({total}) <IconArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Grid column — fills same height as header */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-x-auto overflow-y-hidden no-scrollbar flex items-center">
          {loading ? (
            <div
              className="relative grid content-center mx-auto"
              style={{ gap: `${GAP}px`, gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${cellSize}px)` }}
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
          ) : error ? (
            <ErrorState message={error} title="Leaderboard Unavailable" bare className="w-full" />
          ) : entries.length === 0 ? null : (
            <div
              className="relative grid content-center mx-auto"
              style={{ gap: `${GAP}px`, gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${cellSize}px)` }}
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
                      'group cursor-pointer shrink-0 relative',
                      'transition-all duration-300',
                      'rounded-lg overflow-hidden',
                      isTopThree
                        ? `${TOP_THREE_RING[entry!.rank - 1]} ${TOP_THREE_GLOW[entry!.rank - 1]} border-2`
                        : '',
                      'hover:z-20',
                      isHovered && 'z-20',
                    ].join(' ')}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  >
                    <div className="flex items-center justify-center w-full h-full bg-bg-elevated transition-transform duration-300 group-hover:scale-110">
                      <Identicon value={entry!.hackerHandle || entry!.name || '?'} size={cellSize} className="w-full h-full" />
                    </div>

                    <div className="absolute top-[3px] left-[3px] z-10 rounded bg-black/75 px-1 py-0.5 shadow-sm">
                      {isTopThree ? (
                        <Medal className={`${medalSizes} ${TOP_THREE_RANK_COLOR[entry!.rank - 1]}`} />
                      ) : (
                        <span className="block text-[9px] font-mono font-black leading-none text-white">
                          {entry!.rank}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 via-black/65 to-transparent pb-1 pt-5">
                       <span className="w-full truncate px-1 text-center text-[8px] font-black leading-none text-white">
                         {entry!.hackerHandle || entry!.name || t('landing.leaderboard.anonFallback')}
                       </span>
                       <span className="mt-0.5 text-[7px] font-mono font-black leading-none text-accent">
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
