import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, PodiumCard, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { ErrorState, BatchPagination } from '@/shared/components/ui';
import type { Period } from '@/shared/components/leaderboard';

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';

  const { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore } = useLeaderboard({
    limit: 50,
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

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const remainingCount = Math.max(total - entries.length, 0);

  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean) as typeof podium;

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Leaderboard - QYVORA" description="Top offensive security operators ranked by CP earnings." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Operator"
          accentWord="Leaderboard"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Top operators ranked by CP earnings. The leaderboard is verified by the QYVORA Chain."
          stats={[{ label: 'Operators', value: Number(total).toLocaleString() }]}
        />

        {/* ── Period + Podium ─────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex items-center gap-2 flex-wrap mb-8 md:mb-12">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePeriodChange(p.key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  period === p.key
                    ? 'bg-accent text-on-accent'
                    : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>

          {error ? (
            <ErrorState message={error} title="Leaderboard Unavailable" bare />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-bg-card border border-border/30 animate-pulse" />
              ))}
            </div>
          ) : podium.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
              <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
              <p className="text-lg text-text-muted font-bold">No entries yet</p>
              <p className="text-sm text-text-muted mt-1">Complete labs and bootcamps to earn CP and rank up.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
              {podiumOrder.map((entry, i) => {
                const rank = entry === podium[0] ? 1 : entry === podium[1] ? 2 : 3;
                const orderClass =
                  rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3';
                return (
                  <ScrollReveal key={entry.userId} amount={0.1} className="h-full">
                    <PodiumCard entry={entry} rank={rank} className={orderClass} />
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </PublicSnapSection>

        {/* ── Remaining list ──────────────────────────────────────────── */}
        {rest.length > 0 && (
          <LeaderboardRestSection rest={rest} user={user} total={total} />
        )}
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

const LeaderboardRestSection: React.FC<{ rest: any[]; user: any; total: number }> = ({ rest, user, total }) => {
  const [page, setPage] = useState(0);
  const BATCH_SIZE = 5;

  const totalPages = Math.ceil(rest.length / BATCH_SIZE);
  const currentBatch = rest.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <PublicSnapSection>
      <div className="flex flex-col justify-between flex-1 min-h-0">
        <div>
          <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
            <span>Rank</span>
            <span>Operator</span>
            <span>Rank Label</span>
            <span className="text-right">CP</span>
            <span className="text-right">Streak</span>
          </div>
          <div className="space-y-2 py-2">
            {currentBatch.map((entry) => (
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
        </div>
        <div>
          <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
            <Shield className="w-3 h-3 text-accent" />
            Verified by QYVORA Chain — {Number(total).toLocaleString()} total operators
          </div>
        </div>
      </div>
    </PublicSnapSection>
  );
};

export default LeaderboardPage;
