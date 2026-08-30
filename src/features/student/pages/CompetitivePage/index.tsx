import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Trophy, Shield } from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import SEO from '@/shared/components/SEO';
import { CompetitiveSkeleton } from '@/features/student/components/StudentSkeletons';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import FadeIn from '@/shared/components/ui/FadeIn';
import { Link } from 'react-router-dom';
import type { Period } from '@/shared/components/leaderboard';

const CompetitivePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const period = (searchParams.get('period') as Period) || 'all';

  const { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore } = useLeaderboard({
    limit: 50,
    errorMessages: {
      loadFailed: t('toast.leaderboardLoadFailed'),
      networkFailed: t('toast.leaderboardLoadFailedNetwork'),
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
    <div className="min-h-full">
      <SEO title={t('student.competitive.seoTitle')} description={t('student.competitive.seoDesc')} noindex />

      <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
        <StudentHeroSection
          fullHeight={false}
          title={t('student.competitive.title')}
          accentWord={t('student.competitive.title').split(' ').pop()}
          description={t('student.competitive.description', { count: total })}
          stats={[{ label: t('stat.operators'), value: Number(total).toLocaleString() }]}
        >
          <Link
            to="/leaderboard"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Trophy className="w-4 h-4" />
            {t('button.viewPublicBoard')}
          </Link>
        </StudentHeroSection>
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-6">

        {/* Period tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => handlePeriodChange(p.key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-[background-color,color,border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
                period === p.key
                  ? 'bg-accent text-on-accent'
                  : 'bg-bg-card border border-border text-text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {t(`student.competitive.periods.${p.key}`)}
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
              {entries.map((entry) => (
                <ScrollReveal key={entry.userId} amount={0.05}>
                  <LeaderboardRow
                    entry={entry}
                    user={user}
                    rank={entry.rank}
                    anonymousLabel={t('student.competitive.anonymous')}
                    youLabel={t('student.competitive.youBadge')}
                    roomsLabel={t('student.competitive.rooms')}
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
                  {loadingMore ? t('student.competitive.loadingMore') : t('student.competitive.showMore')}
                </button>
              </div>
            )}

            {/* Chain verification badge */}
            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
              <Shield className="w-3 h-3 text-accent" />
              {t('student.competitive.footer', { count: total })}
            </div>
          </div>
        )}
      </div>
    </div>
    </FadeIn>
  );
};

export default CompetitivePage;
