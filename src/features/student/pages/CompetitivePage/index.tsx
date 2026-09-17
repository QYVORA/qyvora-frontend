import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import SEO from '@/shared/components/SEO';
import { CompetitiveSkeleton } from '@/features/student/components/StudentSkeletons';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import FadeIn from '@/shared/components/ui/FadeIn';
import type { Period } from '@/shared/components/leaderboard';

const CompetitivePage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';

  const { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore } = useLeaderboard({
    limit: 50,
    errorMessages: {
      loadFailed: "Failed to load leaderboard.",
      networkFailed: "Failed to load leaderboard. Check connection and try again.",
    },
  });

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: Period) => {
    setSearchParams({ period: newPeriod });
  };

  return (
    <FadeIn>
    <div className="min-h-full bg-canvas">
      <SEO title={"Competitive Leaderboard"} description={"Operator leaderboard ranked by CP earned."} noindex />

      <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <PageHeader
          kicker={"QYVORA · Battle"}
          title={"Competitive Leaderboard"}
          description={`${total} operators ranked by CyberPoints`}
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{Number(total).toLocaleString()}</span>
              {"Operators"}
            </span>
          }
          actions={
            <Button to="/leaderboard">
              <Trophy className="h-4 w-4" />
              {"View Public Board"}
            </Button>
          }
        />

        <div className="w-full space-y-6">

        {/* Period tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => handlePeriodChange(p.key)}
              aria-pressed={period === p.key}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-[background-color,color,border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
                period === p.key
                  ? 'bg-accent text-on-accent'
                  : 'bg-bg-card border border-border text-text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-danger/30 bg-danger/5">
            <span className="text-sm text-danger">{error}</span>
          </div>
        )}

        {loading ? (
          <CompetitiveSkeleton />
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <Trophy className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
            <p className="text-lg text-text-muted font-bold">{"No operators ranked yet"}</p>
            <p className="text-sm text-text-muted mt-1">{"Complete bootcamp rooms to earn CP and appear on the leaderboard."}</p>
          </div>
        ) : (
          <div>
            {/* Desktop header row */}
            <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
              <span>{"#"}</span>
              <span>{"Operator"}</span>
              <span>{"Rank"}</span>
              <span className="text-right">{"CP"}</span>
              <span className="text-right">{"Streak"}</span>
            </div>

            {/* Entries */}
            <div className="space-y-2 py-2">
              {entries.map((entry) => (
                <ScrollReveal key={entry.userId} amount={0.05}>
                  <LeaderboardRow
                    entry={entry}
                    user={user}
                    rank={entry.rank}
                    anonymousLabel={"Anonymous"}
                    youLabel={"You"}
                    roomsLabel={"rooms"}
                    avatarShape="rounded-xl"
                    normalBorderColor="border-border/50"
                  />
                </ScrollReveal>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => loadMore(period)}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-border/50 bg-bg-card text-text-muted hover:border-accent/50 hover:text-accent transition-[border-color,color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Show more"}
                </button>
              </div>
            )}

            {/* Chain verification badge */}
            <div className="flex items-center justify-center gap-2 pt-4 text-xs font-bold uppercase tracking-widest text-text-muted/40">
              <Shield className="w-3 h-3 text-accent" />
              {`CP balances verified on QYVORA Chain · ${total} operators`}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
    </FadeIn>
  );
};

export default CompetitivePage;
