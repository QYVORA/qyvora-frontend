import { useEffect, useState, useCallback, useRef, lazy, Suspense } from 'react';
import { Radio, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { IconShield, IconWarning } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

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

const NewsCard = ({ article }: { article: Article }) => {
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative min-h-[320px] md:min-h-[400px] group"
    >
      <div
        className="absolute inset-0 bg-cover bg-center hidden dark:block"
        style={{ backgroundImage: `url(${article.imageUrl || ''})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
      <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[320px] md:min-h-[400px]">
        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {article.source}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {dateStr}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mt-2">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-2 transition-all mt-auto pt-3">
          Read intelligence <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
      </div>
    </a>
  );
};

const NewsFeedPage = () => {
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
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

  const hasArticles = articles.length > 0;

  return (
    <div className="w-full bg-bg">
      <SEO
        title="Cyber Feed"
        description="African-focused cybersecurity threat intelligence and situational awareness. Curated cyber events, advisories, and digital safety alerts."
      />

      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col overflow-hidden bg-accent" data-nav-invert>

        {/* ── Globe ── */}
        <div className="absolute inset-0 z-0 flex items-end justify-end">
          <div className="relative w-full h-full flex items-end justify-end">
            <ErrorBoundary scope="HackerGlobe" fallback={null}>
              <Suspense fallback={null}>
                <HackerGlobe scale={1.0} offset={[0.9, -0.7, 0]} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
          <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-20 sm:pt-28 lg:pt-24 pb-10 sm:pb-12 lg:pb-16 w-full h-full">
            <div className="flex flex-col items-start w-full space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-bg">
                Cyber <span className="text-bg/80">Feed</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-bg/70 font-mono leading-relaxed max-w-xl">
                African-focused cybersecurity threat intelligence and situational awareness.
                Curated cyber events, advisories, and digital safety alerts.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => fetchNews(true)}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-bg/30 bg-bg/10 text-bg text-xs font-black uppercase tracking-wider hover:bg-bg/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Updating' : 'Refresh Feed'}
                </button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* ══ NEWS FEED ══ */}
      <section className="relative w-full bg-bg py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-12 xl:px-16">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
              <IconWarning size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-400">Feed Error</p>
                <p className="text-sm text-text-secondary mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
              <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  Latest <span className="text-accent">Intel</span>
                </h2>
              </div>
              <div className="md:w-[65%] lg:w-[62%]">
                <div className="rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim overflow-hidden animate-pulse min-h-[320px] md:min-h-[400px]">
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="h-4 bg-accent-dim/30 rounded w-1/4" />
                    <div className="h-3 bg-accent-dim/20 rounded w-1/3" />
                    <div className="h-8 bg-accent-dim/30 rounded w-3/4" />
                    <div className="h-4 bg-accent-dim/20 rounded w-1/2" />
                    <div className="h-4 bg-accent-dim/20 rounded w-5/6" />
                    <div className="h-4 bg-accent-dim/20 rounded w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          ) : !hasArticles ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-24 text-center">
              <IconShield size={56} className="mx-auto mb-4 text-text-muted opacity-30" />
              <p className="text-lg text-text-muted font-bold">No intelligence feeds available</p>
              <p className="text-sm text-text-muted mt-1">New cyber threat data will appear here as it's published.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
              <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  Latest <span className="text-accent">Intel</span>
                </h2>
              </div>
              <div className="md:w-[65%] lg:w-[62%]">
                <Carousel
                  slides={articles}
                  renderCard={(article) => <NewsCard article={article} />}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section id="cta" className="relative w-full">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ══ FOOTER SECTION ══ */}
      <section className="relative w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default NewsFeedPage;
