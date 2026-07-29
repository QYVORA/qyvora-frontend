import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { ErrorState } from '@/shared/components/ui';
import type { Period } from '@/shared/components/leaderboard';

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';

  const { entries, loading, error, total, fetchLeaderboard } = useLeaderboard({
    limit: 100,
    errorMessages: {
      loadFailed: 'Failed to load leaderboard.',
      networkFailed: 'Failed to load leaderboard. Check connection.',
    },
  });

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: Period) => {
    setSearchParams({ period: newPeriod });
  };

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Leaderboard - QYVORA" description="Top offensive security operators ranked by CP earnings." />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
        <StudentHeroSection
          icon={<Trophy className="w-8 h-8 text-accent" />}
          title="Leaderboard"
          description="Top operators ranked by CP earnings. The leaderboard is verified by the QYVORA Chain."
          stats={[{ label: 'Operators', value: Number(total).toLocaleString() }]}
        />

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
              {t(p.labelKey)}
            </button>
          ))}
        </div>

        {error && <ErrorState message={error} title="Leaderboard Unavailable" />}

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-bg-card border border-border/30 animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
            <p className="text-lg text-text-muted font-bold">No entries yet</p>
            <p className="text-sm text-text-muted mt-1">Complete labs and bootcamps to earn CP and rank up.</p>
          </div>
        ) : (
          <div>
            <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
              <span>Rank</span>
              <span>Operator</span>
              <span>Rank Label</span>
              <span className="text-right">CP</span>
              <span className="text-right">Streak</span>
            </div>
            <div className="space-y-2 py-2">
              {entries.map((entry) => (
                <ScrollReveal key={entry.userId} amount={0.05}>
                  <LeaderboardRow
                    entry={entry}
                    user={user}
                    rank={entry.rank}
                    anonymousLabel="Anonymous"
                    youLabel="You"
                    roomsLabel="rooms"
                    avatarShape="rounded-xl"
                    normalBorderColor="border-border/30"
                  />
                </ScrollReveal>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
              <Shield className="w-3 h-3 text-accent" />
              Verified by QYVORA Chain — {total} total operators
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
