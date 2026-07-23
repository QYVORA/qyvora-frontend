import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Identicon } from '@/shared/components';
import { useTranslation } from 'react-i18next';
import { FilterTabs } from '@/shared/components/ui';

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

const CELL_SIZE_SM = 56;
const CELL_SIZE_LG = 72;
const GAP = 4;

type Period = 'all' | 'week' | 'month';

const LandingLeaderboardSection = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await api.get(`/public/leaderboard?period=${p}&limit=40`);
      const data = res.data;
      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silently fail on landing
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
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column — same height as grid on desktop */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col justify-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-2">
              {t('landing.leaderboard.heading')}
            </h2>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
              {t('landing.leaderboard.description')}
            </p>
            <div className="mb-4">
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
                      'rounded-lg overflow-hidden',
                      isTopThree
                        ? `${TOP_THREE_RING[entry!.rank - 1]} ${TOP_THREE_GLOW[entry!.rank - 1]} border-2`
                        : '',
                      'hover:z-20',
                      isHovered && 'z-20',
                    ].join(' ')}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  >
                    <div className="flex items-center justify-center [&_svg]:w-full [&_svg]:h-full">
                      <Identicon value={entry!.hackerHandle || entry!.name} size={cellSize} className={isTopThree ? 'border-0' : ''} />
                    </div>

                    <div className="absolute top-[3px] left-[3px] z-10">
                      {isTopThree ? (
                        <Medal className={`${medalSizes} ${TOP_THREE_RANK_COLOR[entry!.rank - 1]}`} />
                      ) : (
                        <span className="text-[8px] font-mono font-bold text-text-muted/40 bg-bg/70 rounded px-0.5 leading-none">
                          {entry!.rank}
                        </span>
                      )}
                    </div>

                    <div
                      className={[
                        'absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/90 to-transparent',
                        'flex flex-col items-center justify-end pb-1.5 pt-4',
                        'transition-opacity duration-300',
                        isHovered ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                    >
                       <span className="text-[9px] font-black text-text-primary truncate w-full text-center leading-none px-1">
                         {entry!.hackerHandle || entry!.name || t('landing.leaderboard.anonFallback')}
                       </span>
                       <span className="text-[8px] font-mono font-bold text-accent leading-none mt-0.5">
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
