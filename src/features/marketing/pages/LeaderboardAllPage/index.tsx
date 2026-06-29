import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Shield, Search, X, ArrowLeft } from 'lucide-react';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal, Identicon, BootcampBadge, StreakIcon } from '@/shared/components';
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
  bootcampStatus?: string;
}

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

const LeaderboardRow = ({ entry, user }: { entry: LeaderboardEntry; user: any }) => {
  const isTopThree = entry.rank <= 3;
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
          : 'border-border bg-bg-card hover:border-accent/20'
        }
        hover:brightness-110 active:scale-[0.99]
      `}
    >
      <div className="flex items-center justify-center">
        {isTopThree ? (
          <Medal className={`w-5 h-5 ${TOP_THREE_COLORS[entry.rank - 1]}`} />
        ) : (
          <span className="text-sm font-mono font-bold text-text-muted/60">
            {entry.rank}
          </span>
        )}
      </div>

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

      <div className="hidden md:flex items-center">
        <RankBadge label={entry.rankLabel} />
      </div>

      <div className="hidden md:block text-right">
        <span className="text-sm font-black font-mono text-text-primary">
          {entry.cp.toLocaleString()}
        </span>
      </div>

      <div className="hidden md:flex items-center justify-end">
        <StreakIcon days={entry.streakDays} />
      </div>

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

const LeaderboardAllPage = () => {
  const { user } = useAuth();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

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

  const filtered = search.trim()
    ? entries.filter((e) =>
        [e.hackerHandle, e.name, e.organization].some((f) =>
          f?.toLowerCase().includes(search.toLowerCase().trim())
        )
      )
    : entries;

  return (
    <div className="min-h-screen bg-bg">
      <SEO
        title="Full Operator Leaderboard"
        description="All ranked cybersecurity operators on QYVORA."
      />

      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-24 md:pt-32 pb-6">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Leaderboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-none">
              Full <span className="text-accent">Leaderboard</span>
            </h1>
            <p className="text-sm md:text-base text-text-muted mt-2 font-mono">
              {total.toLocaleString()} operators ranked by CyberPoints
            </p>
          </div>

          {/* Period tabs */}
          <div className="flex items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => { setPeriod(p.key); setSearch(''); }}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                  period === p.key
                    ? 'bg-accent text-bg'
                    : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by handle, name, or organization..."
            className="w-full bg-bg-card border border-border rounded-xl py-3 pl-10 pr-9 text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pb-12">
        {error && (
          <div className="mb-4 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center w-full">
            <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
            <p className="text-lg text-text-muted font-bold">
              {search ? 'No operators match your search' : 'No operators ranked yet'}
            </p>
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
              <span>#</span>
              <span>Operator</span>
              <span>Rank</span>
              <span className="text-right">CP</span>
              <span className="text-right">Streak</span>
            </div>
            <div className="space-y-2 py-2">
              {filtered.map((entry) => (
                <ScrollReveal key={entry.userId} amount={0.02}>
                  <LeaderboardRow entry={entry} user={user} />
                </ScrollReveal>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
              <Shield className="w-3 h-3 text-accent" />
              CP balances verified on QYVORA Chain &middot; {filtered.length} of {total} operators
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardAllPage;
