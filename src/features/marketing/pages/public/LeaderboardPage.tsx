import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Users, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { LeaderboardRow, PodiumCard, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import EmptyState from '@/shared/components/ui/EmptyState';
import { ErrorState, BatchPagination, Skeleton } from '@/shared/components/ui';
import type { Period } from '@/shared/components/leaderboard';

interface Cohort {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';
  const cohortId = searchParams.get('cohortId') || null;

  const { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore } = useLeaderboard({
    limit: 50,
    cohortId,
    errorMessages: {
      loadFailed: "Failed to load leaderboard.",
      networkFailed: "Failed to load leaderboard. Check connection and try again.",
    },
  });

  const [myCohorts, setMyCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    if (user) {
      api.get('/student/cohorts').then(res => {
        if (res.data?.success) setMyCohorts(res.data.cohorts || []);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard(period, 'reset', cohortId);
  }, [period, cohortId, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: Period) => {
    const params: Record<string, string> = { period: newPeriod };
    if (cohortId) params.cohortId = cohortId;
    setSearchParams(params);
  };

  const handleCohortChange = (newCohortId: string | null) => {
    const params: Record<string, string> = { period };
    if (newCohortId) params.cohortId = newCohortId;
    setSearchParams(params);
  };

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const remainingCount = Math.max(total - entries.length, 0);

  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean) as typeof podium;

  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO
        title={"Leaderboard | QYVORA"}
        description={"Ranking Africa's top cybersecurity operators by CyberPoints earned."}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Operators"}
          title={"Operator"}
          description={"Ranking Africa's top cybersecurity operators by CyberPoints earned on the QYVORA Chain."}
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{Number(total).toLocaleString()}</span>
              {"Operators"}
            </span>
          }
        />

        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePeriodChange(p.key)}
                aria-pressed={period === p.key}
                className={`min-h-[44px] rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  period === p.key
                    ? 'bg-accent text-on-accent'
                    : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {myCohorts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCohortChange(null)}
                aria-pressed={!cohortId}
                className={`min-h-[44px] rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                  !cohortId
                    ? 'bg-accent text-on-accent'
                    : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                <Users className="mr-1.5 inline-block h-3.5 w-3.5" />
                {"Operators"}
              </button>
              {myCohorts.map((cohort) => (
                <button
                  key={cohort.id}
                  onClick={() => handleCohortChange(cohort.id)}
                  aria-pressed={cohortId === cohort.id}
                  className={`min-h-[44px] rounded-xl px-4 text-xs font-black uppercase tracking-widest transition-colors ${
                    cohortId === cohort.id
                      ? 'bg-accent text-on-accent'
                      : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent'
                  }`}
                >
                  <Users className="mr-1.5 inline-block h-3.5 w-3.5" />
                  {cohort.name}
                </button>
              ))}
            </div>
          )}

          {error ? (
            <ErrorState message={error} title="Leaderboard Unavailable" bare />
          ) : loading ? (
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-full flex-col items-center gap-3 rounded-2xl border border-border/50 bg-bg-card p-6 text-center md:order-2 md:p-8 ${i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
                >
                  <Skeleton variant="icon" className="h-24 w-24 rounded-full md:h-28 md:w-28" />
                  <Skeleton variant="title" className="mt-2 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton variant="stat-value" className="mt-2 h-8 w-24" />
                </div>
              ))}
            </div>
          ) : podium.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-6 w-6" />}
              title={"No operators ranked yet"}
              description={"Complete bootcamp rooms to earn CP and appear on the leaderboard."}
            />
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-6">
              <AnimatePresence mode="popLayout">
                {podiumOrder.map((entry) => {
                  const rank = entry === podium[0] ? 1 : entry === podium[1] ? 2 : 3;
                  const orderClass =
                    rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3';
                  return (
                    <motion.div
                      key={entry.userId}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: rank === 1 ? 0.15 : rank === 2 ? 0 : 0.08 }}
                      className={`h-full ${orderClass}`}
                    >
                      <PodiumCard entry={entry} rank={rank} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {rest.length > 0 && <LeaderboardRestSection rest={rest} user={user} total={total} />}
        </div>
      </div>
    </div>
  );
};

const LeaderboardRestSection: React.FC<{ rest: any[]; user: any; total: number }> = ({ rest, user, total }) => {
  const [page, setPage] = useState(0);
  const BATCH_SIZE = 5;

  const totalPages = Math.ceil(rest.length / BATCH_SIZE);
  const currentBatch = rest.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 border-b border-border/40 type-meta font-black uppercase tracking-widest text-text-muted/50">
        <span>{"#"}</span>
        <span>{"Operator"}</span>
        <span>{"Rank"}</span>
        <span className="text-right">{"CP"}</span>
        <span className="text-right">{"Streak"}</span>
      </div>
      <div className="space-y-2 py-2">
        <AnimatePresence mode="popLayout">
          {currentBatch.map((entry, i) => (
            <motion.div
              key={entry.userId}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            >
              <LeaderboardRow
                entry={entry}
                user={user}
                rank={entry.rank}
                anonymousLabel={"Operators"}
                youLabel="You"
                roomsLabel={"rooms"}
                avatarShape="rounded-xl"
                normalBorderColor="border-border/50"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <div className="type-meta flex items-center justify-center gap-2 pb-4 font-bold uppercase tracking-widest text-text-muted/40">
        <Shield className="h-3 w-3 text-accent" />
        {`CP balances verified on QYVORA Chain · ${Number(total).toLocaleString()} operators`}
      </div>
    </div>
  );
};

export default LeaderboardPage;