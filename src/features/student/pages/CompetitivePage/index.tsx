import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Trophy, Medal, Shield } from 'lucide-react';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal, Identicon, BootcampBadge, StreakIcon } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import { CompetitiveSkeleton } from '@/features/student/components/StudentSkeletons';
import LearningOverviewCard from '@/features/student/components/learning/LearningOverviewCard';

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

const LeaderboardRow = ({ entry, user, rank }: { entry: LeaderboardEntry; user: any; rank: number }) => {
  const { t } = useTranslation();
  const isTopThree = rank <= 3;
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
          : 'border-border/30 bg-bg-card hover:border-accent/20'
        }
        hover:brightness-110 active:scale-[0.99]
      `}
    >
      {/* Rank */}
      <div className="flex items-center justify-center">
        {isTopThree ? (
          <Medal className={`w-5 h-5 ${TOP_THREE_COLORS[rank - 1]}`} />
        ) : (
          <span className="text-sm font-mono font-bold text-text-muted/60">
            {rank}
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
              {entry.hackerHandle || entry.name || t('student.competitive.anonymous')}
              <BootcampBadge completed={bootcampCompleted} className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-accent text-bg">
                {t('student.competitive.youBadge')}
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
          {Number(entry.cp).toLocaleString()}
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
          {Number(entry.cp).toLocaleString()} CP
        </span>
      </div>
    </Link>
  );
};

const CompetitivePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const period = (searchParams.get('period') as Period) || 'all';

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
    setSearchParams({ period: newPeriod });
  };

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Competitive Leaderboard" description="Operator leaderboard ranked by CP earned." />

      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Header */}
        <LearningOverviewCard
          icon={<Trophy className="w-6 h-6 text-bg" />}
          title={t('student.competitive.title')}
          description={t('student.competitive.description', { count: total })}
          stats={[{ label: 'Operators', value: Number(total).toLocaleString() }]}
          action={{
            label: t('button.viewPublicBoard'),
            to: '/leaderboard',
            icon: <Trophy className="w-4 h-4" />,
          }}
        />

        {/* Period tabs */}
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
              {t(`student.competitive.periods.${p.key}`)}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {loading ? (
          <CompetitiveSkeleton />
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
            <p className="text-lg text-text-muted font-bold">{t('student.competitive.empty.title')}</p>
            <p className="text-sm text-text-muted mt-1">{t('student.competitive.empty.description')}</p>
          </div>
        ) : (
          <div>
            {/* Desktop header row */}
            <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
              <span>{t('student.competitive.tableHeaders.rank')}</span>
              <span>{t('student.competitive.tableHeaders.operator')}</span>
              <span>{t('student.competitive.tableHeaders.rankLabel')}</span>
              <span className="text-right">{t('student.competitive.tableHeaders.cp')}</span>
              <span className="text-right">{t('student.competitive.tableHeaders.streak')}</span>
            </div>

            {/* Entries */}
            <div className="space-y-2 py-2">
              {entries.map((entry, idx) => (
                <ScrollReveal key={entry.userId} amount={0.05}>
                  <LeaderboardRow entry={entry} user={user} rank={entry.rank} />
                </ScrollReveal>
              ))}
            </div>

            {/* Chain verification badge */}
            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
              <Shield className="w-3 h-3 text-accent" />
              {t('student.competitive.footer', { count: total })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitivePage;
