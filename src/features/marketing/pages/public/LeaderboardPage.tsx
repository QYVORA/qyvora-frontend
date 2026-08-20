import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Shield, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
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

interface Cohort {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';
  const cohortId = searchParams.get('cohortId') || null;

  const { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore } = useLeaderboard({
    limit: 50,
    cohortId,
    errorMessages: {
      loadFailed: t('leaderboardPage.loadError'),
      networkFailed: t('leaderboardPage.loadErrorNetwork'),
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
    <div className="bg-bg min-h-full">
      <SEO
        title={t('leaderboardPage.seo.title')}
        description={t('leaderboardPage.seo.description')}
      />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
        <StudentHeroSection
          title={t('leaderboardPage.hero.title')}
          accentWord={t('leaderboardPage.hero.titleHighlight')}
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description={t('leaderboardPage.hero.description')}
          stats={[
            { label: t('leaderboardPage.hero.operatorsStat'), value: Number(total).toLocaleString() },
          ]}
        />
        </section>

        {/* ── Period + Cohort Filters ──────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex items-center gap-2 flex-wrap mb-4">
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

          {myCohorts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8 md:mb-12">
              <button
                onClick={() => handleCohortChange(null)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  !cohortId
                    ? 'bg-accent text-on-accent'
                    : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                }`}
              >
                <Users size={12} className="inline-block mr-1" />
                {t('leaderboardPage.hero.operatorsStat')}
              </button>
              {myCohorts.map((cohort) => (
                <button
                  key={cohort.id}
                  onClick={() => handleCohortChange(cohort.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    cohortId === cohort.id
                      ? 'bg-accent text-on-accent'
                      : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  <Users size={12} className="inline-block mr-1" />
                  {cohort.name}
                </button>
              ))}
            </div>
          )}

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
              <p className="text-lg text-text-muted font-bold">{t('leaderboardPage.empty.title')}</p>
              <p className="text-sm text-text-muted mt-1">{t('leaderboardPage.empty.description')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
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
        </PublicSnapSection>

        {/* ── Remaining list ──────────────────────────────────────────── */}
        {rest.length > 0 && (
          <LeaderboardRestSection rest={rest} user={user} total={total} />
        )}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

const LeaderboardRestSection: React.FC<{ rest: any[]; user: any; total: number }> = ({ rest, user, total }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const BATCH_SIZE = 5;

  const totalPages = Math.ceil(rest.length / BATCH_SIZE);
  const currentBatch = rest.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <PublicSnapSection>
      <div className="flex flex-col justify-between flex-1 min-h-0">
        <div>
          <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
            <span>{t('leaderboardPage.table.rank')}</span>
            <span>{t('leaderboardPage.table.operator')}</span>
            <span>{t('leaderboardPage.table.rankLabel')}</span>
            <span className="text-right">{t('leaderboardPage.table.cp')}</span>
            <span className="text-right">{t('leaderboardPage.table.streak')}</span>
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
                    anonymousLabel={t('leaderboardPage.hero.operatorsStat')}
                    youLabel="You"
                    roomsLabel={t('leaderboardPage.rooms')}
                    avatarShape="rounded-xl"
                    normalBorderColor="border-border/30"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
            <Shield className="w-3 h-3 text-accent" />
            {t('leaderboardPage.footer', { count: Number(total).toLocaleString() })}
          </div>
        </div>
      </div>
    </PublicSnapSection>
  );
};

export default LeaderboardPage;
