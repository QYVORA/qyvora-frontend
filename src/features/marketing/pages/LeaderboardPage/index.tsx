import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Shield, ArrowRight } from 'lucide-react';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import SnapSection from '@/shared/components/SnapSection';
import { ScrollReveal, Identicon, BootcampBadge, StreakIcon } from '@/shared/components';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';

const PERIODS = [
  { key: 'all',  label: 'All Time'   },
  { key: 'week',  label: 'This Week'  },
  { key: 'month', label: 'This Month' },
] as const;

type Period = (typeof PERIODS)[number]['key'];

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  hackerHandle: string;
  organization: string;
  cp: number;
  rankLabel: string;
  roomsCompleted: number;
  streakDays: number;
  bootcampCompleted?: boolean;
}

const INITIAL_SHOW = 5;

const TOP_THREE_COLORS = [
  'text-yellow-400',
  'text-gray-300',
  'text-amber-600',
];

const RANK_COLORS: Record<string, string> = {
  Vanguard: 'text-accent',
  Architect: 'text-amber-400',
  Specialist: 'text-purple-400',
  Contributor: 'text-blue-400',
  Candidate: 'text-zinc-400',
};

const RankBadge = ({ label }: { label: string }) => {
  const color = RANK_COLORS[label] || 'text-text-muted';
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
      {label}
    </span>
  );
};

const LeaderboardRow = ({ entry, user, isExpanded }: { entry: LeaderboardEntry; user: any; isExpanded: boolean }) => {
  const isTopThree = entry.rank <= 3;
  const isCurrentUser = user && entry.userId === user.uid;
  const bootcampCompleted = !!entry.bootcampCompleted;

  return (
    <Link
      to={`/${entry.hackerHandle}`}
      className={`
        grid grid-cols-[36px_1fr] md:grid-cols-[48px_1fr_140px_100px_80px] gap-2 md:gap-4 px-4 md:px-6 py-4 rounded-2xl border transition-all duration-300 items-center
        ${isCurrentUser
          ? 'border-accent/40 bg-accent-dim/10'
          : isTopThree
          ? 'border-accent/20 bg-accent-dim/5 shadow-[0_0_20px_-8px] shadow-accent/10'
          : 'border-border bg-bg-card hover:border-accent/20'
        }
        hover:brightness-110 active:scale-[0.99]
      `}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        {isTopThree ? (
          <Medal className={`w-5 h-5 ${TOP_THREE_COLORS[entry.rank - 1]}`} />
        ) : (
          <span className="text-sm font-mono font-bold text-text-muted/60">
            {entry.rank}
          </span>
        )}
      </div>

      {/* Operator info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full shrink-0 overflow-hidden border border-accent/20 [&_svg]:w-full [&_svg]:h-full">
          <Identicon value={entry.userId} size={40} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-text-primary truncate flex items-center gap-1.5">
              {entry.hackerHandle || entry.name || 'Anonymous'}
              <BootcampBadge completed={bootcampCompleted} className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-accent text-bg">
                You
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
          {entry.cp.toLocaleString()}
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
            {entry.roomsCompleted} rooms
          </span>
        </div>
        <span className="text-sm font-black font-mono text-accent">
          {entry.cp.toLocaleString()} CP
        </span>
      </div>
    </Link>
  );
};

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { isMobile } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLeaderboard = useCallback(async (activePeriod: Period) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/public/leaderboard?period=${activePeriod}&limit=50&offset=0`);
      const data = res.data;
      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      } else {
        setError('Failed to load leaderboard.');
      }
    } catch {
      setError('Failed to load leaderboard. Check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const topEntries = entries.slice(0, INITIAL_SHOW);

  return (
    <div
      ref={containerRef}
      className="w-full h-auto md:h-screen md:overflow-y-auto md:snap-y md:snap-mandatory relative z-10 scroll-smooth bg-bg"
      style={{ scrollbarWidth: 'none' }}
    >
      <SEO
        title="Operator Leaderboard"
        description="Top-ranked cybersecurity operators on QYVORA. Ranked by CP earned and verified on the QYVORA Chain."
      />

      {/* ══ HERO SECTION ══ */}
      <section className="relative min-h-screen md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-border/5" />
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-border/10" />
          <div className="absolute top-1/4 left-1/6 w-[1px] h-64 bg-gradient-to-b from-accent/0 via-accent/10 to-accent/0" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-28 md:pt-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-12">
            {/* Left — heading + description */}
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-accent block">
                  // Global Rankings
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                  Operator <span className="text-accent">Leaderboard</span>
                </h1>
              </div>
              <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
                Ranking Africa&apos;s top cybersecurity operators by CyberPoints earned.
                All balances verified on the QYVORA Chain — immutable, tamper-proof,
                and fully on-ledger.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-muted/60">
                <Shield className="w-4 h-4 text-accent" />
                CP verified on QYVORA Chain
              </div>
            </div>

            {/* Right — stats summary */}
            {entries.length > 0 && (
              <div className="grid grid-cols-3 gap-3 md:gap-4 md:min-w-[280px] lg:min-w-[320px] pt-8 md:pt-0">
                <div className="rounded-2xl border border-border/30 bg-bg-card/50 px-4 py-3 md:px-5 md:py-4 text-center">
                  <span className="text-xl md:text-2xl font-black text-text-primary">{total.toLocaleString()}</span>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Operators</p>
                </div>
                <div className="rounded-2xl border border-border/30 bg-bg-card/50 px-4 py-3 md:px-5 md:py-4 text-center">
                  <span className="text-xl md:text-2xl font-black text-accent">
                    {entries.slice(0, 20).reduce((s, e) => s + e.cp, 0).toLocaleString()}
                  </span>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Total CP</p>
                </div>
                <div className="rounded-2xl border border-border/30 bg-bg-card/50 px-4 py-3 md:px-5 md:py-4 text-center">
                  <span className="text-xl md:text-2xl font-black text-text-primary">{entries[0].cp.toLocaleString()}</span>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Top CP</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ LEADERBOARD SECTION ══ */}
      <section className="relative md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="h-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 flex flex-col pt-16 md:pt-24 pb-6 md:pb-10">
          {/* Period tabs */}
          <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePeriodChange(p.key)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    period === p.key
                      ? 'bg-accent text-bg'
                      : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Link
              to="/leaderboard/all"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shrink-0 bg-accent text-bg hover:brightness-110"
            >
              View All ({total}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {error && (
            <div className="mb-4 shrink-0">
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
                <span className="text-sm text-red-400">{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3 flex-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center w-full">
                <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
                <p className="text-lg text-text-muted font-bold">No operators ranked yet</p>
                <p className="text-sm text-text-muted mt-1">Complete bootcamp rooms to earn CP and appear on the leaderboard.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-0 flex-1">
              {/* Desktop header row */}
              <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40 shrink-0">
                <span>#</span>
                <span>Operator</span>
                <span>Rank</span>
                <span className="text-right">CP</span>
                <span className="text-right">Streak</span>
              </div>

              {/* Top 5 entries — no scroll */}
              <div className="space-y-2 py-2">
                {topEntries.map((entry) => (
                  <ScrollReveal key={entry.userId} amount={0.05}>
                    <LeaderboardRow entry={entry} user={user} isExpanded={false} />
                  </ScrollReveal>
                ))}
              </div>

              {/* Chain verification badge */}
              <div className="flex items-center justify-center gap-2 pt-3 shrink-0 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                <Shield className="w-3 h-3 text-accent" />
                CP balances verified on QYVORA Chain &middot; {total} operators
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <SnapSection id="cta">
        <LandingFinalCtaSection user={user} />
      </SnapSection>

      {/* ══ FOOTER SECTION ══ */}
      <section className="relative md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default LeaderboardPage;
