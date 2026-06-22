import { useEffect, useState, useCallback, useRef } from 'react';
import { Shield, Radio, AlertTriangle, RefreshCw, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import SnapSection from '@/shared/components/SnapSection';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  categories: string[];
  countries: string[];
}

const AUTOPLAY_DURATION = 8000;

const NewsCardSlide = ({ article }: { article: Article }) => {
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(102,184,112,0.06)] h-[520px] sm:h-[560px] lg:h-[440px] xl:h-[480px]"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {article.imageUrl && !imgError && (
        <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[200px] sm:h-[240px] lg:h-full">
          <div className="relative w-full h-full bg-bg">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20" />
            {article.categories.length > 0 && (
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 flex flex-wrap gap-2">
                {article.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 xl:p-14 justify-center min-h-0">
        <div className={`${article.imageUrl && !imgError ? 'max-w-2xl' : 'max-w-4xl mx-auto'} space-y-5`}>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              {article.source}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {dateStr}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-3">
            {article.title}
          </h2>

          {article.description && (
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-5 py-2 line-clamp-3">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
            Read intelligence <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
};

const NewsFeedPage = () => {
  const { user } = useAuth();
  const { isMobile } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNews = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const res = await api.get('/news');
      const data = res.data;
      const items = Array.isArray(data.articles) ? data.articles : [];
      setArticles(items);
      setActiveIndex(0);
    } catch {
      setError('Failed to fetch threat intelligence feed. Check connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleNext = useCallback(() => {
    if (articles.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    if (articles.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  useEffect(() => {
    if (shouldReduceMotion || articles.length <= 1) return;
    const interval = setInterval(handleNext, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [handleNext, shouldReduceMotion, articles.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 120 : -120,
      opacity: 0,
    }),
  };

  const hasArticles = articles.length > 0;
  const current = articles[activeIndex];

  return (
    <div
      ref={containerRef}
      className="
        w-full h-auto
        md:h-screen md:overflow-y-auto
        md:snap-y md:snap-mandatory
        relative z-10 scroll-smooth bg-bg
      "
      style={{ scrollbarWidth: 'none' }}
    >
      <SEO
        title="Cyber Feed"
        description="African-focused cybersecurity threat intelligence and situational awareness. Curated cyber events, advisories, and digital safety alerts."
      />

      {/* ══ HERO SECTION ══ */}
      <section className="relative min-h-screen md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-24 md:pt-10 lg:pt-12">
          <div className="max-w-4xl space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-accent block">
                // Threat Intelligence
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                Cyber <span className="text-accent">Feed</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
              African-focused cybersecurity threat intelligence and situational awareness.
              Curated cyber events, advisories, and digital safety alerts.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => fetchNews(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-accent/30 bg-accent-dim text-accent text-xs font-black uppercase tracking-wider hover:bg-accent-dim/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating' : 'Refresh Feed'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CAROUSEL SECTION ══ */}
      <section className="relative md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg flex flex-col justify-center pt-8 md:pt-24 pb-32 md:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 w-full">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Feed Error</p>
                <p className="text-sm text-text-secondary mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card overflow-hidden animate-pulse">
              <div className="flex flex-col lg:flex-row h-[520px] sm:h-[560px] lg:h-[440px] xl:h-[480px]">
                <div className="w-full lg:w-[48%] xl:w-[52%] h-[200px] sm:h-[240px] lg:h-full bg-accent-dim/20" />
                <div className="flex-1 p-8 lg:p-10 xl:p-14 space-y-5">
                  <div className="h-4 bg-accent-dim/20 rounded w-1/3" />
                  <div className="h-8 bg-accent-dim/30 rounded w-3/4" />
                  <div className="h-8 bg-accent-dim/30 rounded w-1/2" />
                  <div className="h-4 bg-accent-dim/20 rounded w-full" />
                  <div className="h-4 bg-accent-dim/20 rounded w-2/3" />
                </div>
              </div>
            </div>
          ) : !hasArticles ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-24 text-center">
              <Shield className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
              <p className="text-lg text-text-muted font-bold">No intelligence feeds available</p>
              <p className="text-sm text-text-muted mt-1">New cyber threat data will appear here as it's published.</p>
            </div>
          ) : (
            <div className="w-full relative group/carousel">
              <div className="relative">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                    }}
                    className="relative w-full"
                  >
                    <NewsCardSlide article={current} />
                  </motion.div>
                </AnimatePresence>

                <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
                  <button
                    onClick={handlePrev}
                    className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Previous article"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100"
                    aria-label="Next article"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-8">
                {articles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > activeIndex ? 1 : -1);
                      setActiveIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activeIndex
                        ? 'w-6 h-2 bg-accent'
                        : 'w-2 h-2 bg-text-muted/40'
                    }`}
                    aria-label={`Go to article ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 px-2 lg:hidden">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                  aria-label="Previous article"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {activeIndex + 1} / {articles.length}
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                  aria-label="Next article"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="hidden lg:flex mt-6 items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/50">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Live intelligence feed &middot; {articles.length} reports &middot; {activeIndex + 1} of {articles.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <SnapSection id="cta">
        <LandingFinalCtaSection user={user} />
      </SnapSection>

      {/* ══ FOOTER SECTION ══ */}
      <section className="relative md:snap-start md:snap-always w-full flex-shrink-0 bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default NewsFeedPage;
