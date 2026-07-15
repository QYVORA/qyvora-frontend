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

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface CellPos {
  x: number;
  y: number;
  size: number;
  floatDuration: number;
  floatDelay: number;
  floatDistance: number;
}

function computePositions(count: number): CellPos[] {
  const positions: CellPos[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    const curve = Math.pow(t, 0.55);
    const x = 96 - curve * 78;
    const randY = seededRandom(i * 7 + 3);
    const y = 4 + randY * 92;
    const size = 7 - t * 3.5;
    const floatDuration = 4 + seededRandom(i * 13 + 1) * 4;
    const floatDelay = seededRandom(i * 17 + 5) * -6;
    const floatDistance = 3 + seededRandom(i * 23 + 9) * 5;
    positions.push({ x, y, size, floatDuration, floatDelay, floatDistance });
  }
  return positions;
}

const LandingLeaderboardSection = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTop = async () => {
      try {
        const res = await api.get('/public/leaderboard?period=all&limit=20');
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

  const positions = useMemo(() => computePositions(20), []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Visualization layer ── */}
      <div className="absolute inset-0 z-0">
        {loading ? (
          <div className="absolute inset-0">
            {positions.map((pos, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-bg-card border border-border/15 animate-pulse"
                style={{
                  right: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.size}vw`,
                  height: `${pos.size}vw`,
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? null : (
          <>
            {/* Empty scatter cells — ambient particles */}
            {positions.slice(entries.length).map((pos, i) => (
              <div
                key={`empty-${i}`}
                className="absolute rounded-full bg-bg/30 border border-border/5"
                style={{
                  right: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.size}vw`,
                  height: `${pos.size}vw`,
                }}
              />
            ))}

            {/* User identicon cells */}
            {entries.map((entry, i) => {
              const pos = positions[i];
              if (!pos) return null;
              const isTopThree = entry.rank <= 3;
              const isHovered = hoveredIdx === i;

              return (
                <Link
                  key={entry.userId}
                  to={`/@${entry.hackerHandle}`}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={[
                    'absolute rounded-full border-2 overflow-hidden cursor-pointer',
                    'transition-all duration-500 ease-out',
                    'hover:z-20',
                    isTopThree
                      ? `${TOP_THREE_RING[entry.rank - 1]} ${TOP_THREE_GLOW[entry.rank - 1]}`
                      : 'border-accent/20 hover:border-accent/50',
                    isHovered && 'z-20',
                  ].join(' ')}
                  style={{
                    right: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${pos.size}vw`,
                    height: `${pos.size}vw`,
                    animation: `leaderboard-float ${pos.floatDuration}s ease-in-out ${pos.floatDelay}s infinite`,
                    transform: isHovered ? 'scale(1.25)' : undefined,
                  }}
                >
                  {/* Identicon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-bg-card [&_svg]:w-full [&_svg]:h-full">
                    <Identicon value={entry.userId} size={80} />
                  </div>

                  {/* Rank dot */}
                  <div className="absolute top-0.5 left-0.5 z-10">
                    {isTopThree ? (
                      <Medal className={`w-2.5 h-2.5 ${TOP_THREE_RANK_COLOR[entry.rank - 1]}`} />
                    ) : (
                      <span className="text-[6px] font-mono font-bold text-text-muted/40 bg-bg/70 rounded-full w-3 h-3 flex items-center justify-center leading-none">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Hover tooltip */}
                  <div
                    className={[
                      'absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/90 to-transparent',
                      'flex flex-col items-center justify-end pb-1 pt-3',
                      'transition-opacity duration-300',
                      isHovered ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                  >
                    <span className="text-[7px] font-black text-text-primary truncate w-full text-center leading-none px-0.5">
                      {entry.hackerHandle || entry.name || 'Anon'}
                    </span>
                    <span className="text-[6px] font-mono font-bold text-accent leading-none">
                      {Number(entry.cp).toLocaleString()} CP
                    </span>
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>

      {/* ── Content layer ── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12">
        <div className="max-w-md">
          <h2 className="font-black text-text-primary leading-[1.08] tracking-tight w-full mb-4">
            <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] uppercase">
              Top <span className="text-accent">Operators</span>
            </span>
          </h2>
          <p className="text-text-muted text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed max-w-sm font-mono mb-6">
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
      </div>

      {/* ── Footer badge ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
        <IconShield size={12} className="text-accent" />
        CP verified on QYVORA Chain
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes leaderboard-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default LandingLeaderboardSection;
