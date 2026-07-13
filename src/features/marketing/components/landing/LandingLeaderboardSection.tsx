import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { IconLeaderboard, IconArrowRight, IconShield } from '@/shared/components/icons';
import api from '@/core/services/api';
import { ScrollReveal, Identicon, StreakIcon } from '@/shared/components';

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

const TOP_THREE_COLORS = [
  'text-yellow-400',
  'text-gray-300',
  'text-amber-600',
];

const LandingLeaderboardSection = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchTop = async () => {
      try {
        const res = await api.get('/public/leaderboard?period=all&limit=5');
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

  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
            Top <span className="text-accent">Operators</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm">
            Ranked by CyberPoints earned. All balances verified on the QYVORA Chain.
          </p>
        </div>

        <div className="md:w-[65%] lg:w-[62%]">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
              <IconLeaderboard size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
              <p className="text-sm text-text-muted font-bold">No operators ranked yet</p>
              <p className="text-xs text-text-muted mt-1">Complete bootcamp rooms to earn CP and appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, i) => {
                const isTopThree = entry.rank <= 3;
                return (
                  <ScrollReveal key={entry.userId} direction="up" amount={0.05} delay={i * 0.03}>
                    <Link
                      to={`/@${entry.hackerHandle}`}
                      className="grid grid-cols-[32px_1fr_auto] md:grid-cols-[40px_1fr_100px_80px] gap-2 md:gap-4 px-4 md:px-5 py-3 rounded-2xl border border-border bg-bg-card hover:border-accent/20 hover:brightness-110 active:scale-[0.99] transition-all duration-300 items-center"
                    >
                      <div className="flex items-center justify-center">
                        {isTopThree ? (
                          <Medal className={`w-4 h-4 md:w-5 md:h-5 ${TOP_THREE_COLORS[entry.rank - 1]}`} />
                        ) : (
                          <span className="text-xs font-mono font-bold text-text-muted/60">{entry.rank}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 overflow-hidden border border-accent/20 [&_svg]:w-full [&_svg]:h-full">
                          <Identicon value={entry.userId} size={32} />
                        </div>
                        <span className="text-sm font-black text-text-primary truncate">
                          {entry.hackerHandle || entry.name || 'Anonymous'}
                        </span>
                      </div>

                      <div className="text-right md:col-span-1">
                        <span className="text-sm font-black font-mono text-accent">
                          {Number(entry.cp).toLocaleString()} <span className="hidden md:inline text-[10px] font-bold text-text-muted/60">CP</span>
                        </span>
                      </div>

                      <div className="hidden md:flex items-center justify-end">
                        <StreakIcon days={entry.streakDays} />
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}

              {total > 5 && (
                <div className="pt-3 text-center">
                  <Link
                    to="/leaderboard"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:brightness-110 transition-all active:scale-95"
                  >
                    View Full Leaderboard ({total}) <IconArrowRight size={14} />
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                <IconShield size={12} className="text-accent" />
                CP verified on QYVORA Chain
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingLeaderboardSection;
