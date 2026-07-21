import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconShield, IconSearch, IconX, IconArrowLeft, IconLeaderboard } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { ScrollReveal } from '@/shared/components';
import { LeaderboardRow, useLeaderboard, PERIODS } from '@/shared/components/leaderboard';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import SEO from '@/shared/components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { Footer } from '@/shared/components/layout';
import type { Period } from '@/shared/components/leaderboard';

const LeaderboardAllPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [period, setPeriod] = useState<Period>('all');
  const [search, setSearch] = useState('');

  const { entries, loading, error, total, fetchLeaderboard } = useLeaderboard({
    errorMessages: {
      loadFailed: t('leaderboardPage.loadError'),
      networkFailed: t('leaderboardPage.loadErrorNetwork'),
    },
  });

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
        title={t('leaderboardAll.seo.title')}
        description={t('leaderboardAll.seo.description')}
      />

      {/* ══ HERO ══ */}
      <PublicHeroSection showGlobe mask="right">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-bg/60 hover:text-bg transition-colors mb-4"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          {t('leaderboardAll.backToLeaderboard')}
        </Link>
        <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
          <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
            {t('leaderboardAll.hero.title')} <span className="text-bg/80">{t('leaderboardAll.hero.titleHighlight')}</span>
          </span>
        </h1>
        <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          {t('leaderboardAll.hero.description', { count: Number(total).toLocaleString() })}
        </p>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-bg/50">
          <IconShield className="w-4 h-4 text-bg/80" />
          {t('leaderboardAll.hero.chainBadge')}
        </div>
      </PublicHeroSection>

      {/* ══ LEADERBOARD CONTENT ══ */}
      <section className="relative w-full bg-bg overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36">
          {/* Period tabs */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setPeriod(p.key); setSearch(''); }}
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                    period === p.key
                      ? 'bg-accent text-bg'
                      : 'bg-bg-card border border-border text-text-muted hover:border-accent/30 hover:text-accent'
                  }`}
                >
                  {t(`leaderboardAll.periods.${p.key}`)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full md:w-auto">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('leaderboardAll.searchPlaceholder')}
                className="w-full bg-bg-card border border-border rounded-xl py-2.5 pl-10 pr-9 text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-primary transition-colors"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-bg-card border border-border/30 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center w-full">
              <IconLeaderboard className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
              <p className="text-lg text-text-muted font-bold">
                {search ? t('leaderboardAll.empty.search') : t('leaderboardAll.empty.default')}
              </p>
            </div>
          ) : (
            <div>
              <div className="hidden md:grid grid-cols-[48px_1fr_140px_100px_80px] gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted/50 border-b border-border/40">
                <span>{t('leaderboardAll.table.rank')}</span>
                <span>{t('leaderboardAll.table.operator')}</span>
                <span>{t('leaderboardAll.table.rankLabel')}</span>
                <span className="text-right">{t('leaderboardAll.table.cp')}</span>
                <span className="text-right">{t('leaderboardAll.table.streak')}</span>
              </div>
              <div className="space-y-2 py-2">
                {filtered.map((entry) => (
                  <ScrollReveal key={entry.userId} amount={0.02}>
                    <LeaderboardRow
                      entry={entry}
                      user={user}
                      youLabel={t('badge.you')}
                      roomsLabel={t('leaderboardAll.rooms')}
                    />
                  </ScrollReveal>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                <IconShield className="w-3 h-3 text-accent" />
                {t('leaderboardAll.footer', { filtered: filtered.length, total })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ══ FOOTER ══ */}
      <section className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default LeaderboardAllPage;
