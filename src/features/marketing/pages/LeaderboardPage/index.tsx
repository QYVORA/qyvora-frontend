import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconShield, IconArrowRight, IconLeaderboard } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import type { Period } from '@/shared/components/leaderboard';

const INITIAL_SHOW = 5;

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const PERIOD_LABELS = [
    { key: 'all' as const, label: t('leaderboardPage.periods.all') },
    { key: 'week' as const, label: t('leaderboardPage.periods.week') },
    { key: 'month' as const, label: t('leaderboardPage.periods.month') },
  ];

  const [period, setPeriod] = useState<Period>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const { entries, loading, error, total, fetchLeaderboard } = useLeaderboard({
    errorMessages: {
      loadFailed: t('leaderboardPage.loadError'),
      networkFailed: t('leaderboardPage.loadErrorNetwork'),
    },
  });

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const topEntries = entries.slice(0, INITIAL_SHOW);

  return (
    <div className="min-h-screen w-full relative z-10 bg-bg">
      <SEO
        title={t('leaderboardPage.seo.title')}
        description={t('leaderboardPage.seo.description')}
      />

      {/* ══ HERO SECTION ══ */}
      <PublicHeroSection showGlobe mask="right">
        <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
          <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
            {t('leaderboardPage.hero.title')} <span className="text-bg/80">{t('leaderboardPage.hero.titleHighlight')}</span>
          </span>
        </h1>
        <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          {t('leaderboardPage.hero.description')}
        </p>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-bg/50">
          <IconShield className="w-4 h-4 text-bg/80" />
          {t('leaderboardPage.hero.chainBadge')}
        </div>
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm pt-2">
            <div className="rounded-2xl border border-bg/20 bg-bg/10 px-4 py-3 md:px-5 md:py-4 text-center">
              <span className="text-xl md:text-2xl font-black text-bg">{Number(total).toLocaleString()}</span>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-bg/40 mt-1">{t('leaderboardPage.stats.operators')}</p>
            </div>
            <div className="rounded-2xl border border-bg/20 bg-bg/10 px-4 py-3 md:px-5 md:py-4 text-center">
              <span className="text-xl md:text-2xl font-black text-bg">
                {Number(entries.slice(0, 20).reduce((s, e) => s + Number(e.cp), 0)).toLocaleString()}
              </span>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-bg/40 mt-1">{t('leaderboardPage.stats.totalCp')}</p>
            </div>
            <div className="rounded-2xl border border-bg/20 bg-bg/10 px-4 py-3 md:px-5 md:py-4 text-center">
              <span className="text-xl md:text-2xl font-black text-bg">{Number(entries[0].cp).toLocaleString()}</span>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-bg/40 mt-1">{t('leaderboardPage.stats.topCp')}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
            {t('button.startTraining')} <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PublicHeroSection>

      {/* ══ LEADERBOARD SECTION ══ */}
      <section className="relative w-full bg-bg overflow-hidden py-20 md:py-28 lg:py-36">
        <GridBoxedBackground opacity={0.04} mask="right" />
        <div className="h-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 flex flex-col pt-16 md:pt-24 pb-6 md:pb-10">
          {/* Period tabs */}
          <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              {PERIOD_LABELS.map((p) => (
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
              View All ({total}) <IconArrowRight className="w-3.5 h-3.5" />
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
                <IconLeaderboard className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
                <p className="text-lg text-text-muted font-bold">{t('leaderboardPage.empty.title')}</p>
                <p className="text-sm text-text-muted mt-1">{t('leaderboardPage.empty.description')}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-0 flex-1">
              {/* Desktop header row */}
              <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40 shrink-0">
                <span>{t('leaderboardPage.table.rank')}</span>
                <span>{t('leaderboardPage.table.operator')}</span>
                <span>{t('leaderboardPage.table.rankLabel')}</span>
                <span className="text-right">{t('leaderboardPage.table.cp')}</span>
                <span className="text-right">{t('leaderboardPage.table.streak')}</span>
              </div>

              {/* Top 5 entries — no scroll */}
              <div className="space-y-2 py-2">
                {topEntries.map((entry) => (
                  <ScrollReveal key={entry.userId} amount={0.05}>
                    <LeaderboardRow
                      entry={entry}
                      user={user}
                      anonymousLabel={t('landing.leaderboard.anonFallback')}
                      youLabel={t('badge.you')}
                      roomsLabel={t('leaderboardPage.rooms')}
                    />
                  </ScrollReveal>
                ))}
              </div>

              {/* Chain verification badge */}
              <div className="flex items-center justify-center gap-2 pt-3 shrink-0 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                <IconShield className="w-3 h-3 text-accent" />
                CP balances verified on QYVORA Chain &middot; {t('leaderboardPage.footer', { count: total })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section id="cta" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ══ FOOTER SECTION ══ */}
      <section className="relative w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default LeaderboardPage;
