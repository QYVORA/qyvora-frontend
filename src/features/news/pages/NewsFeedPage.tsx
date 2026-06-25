import { useEffect, useState, useCallback, useRef } from 'react';
import { Shield, Radio, AlertTriangle, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { CardMedia } from '@/shared/components/ui/Card';
import { CardGrid } from '@/shared/components/card-grid';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
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

const NewsCard = ({ article }: { article: Article }) => {
  const [imgError, setImgError] = useState(false);

  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <CardMedia
      image={article.imageUrl || ''}
      imageAlt=""
      imageAspect="aspect-video"
      href={article.url}
      external
      imageBadges={
        article.categories.length > 0 ? (
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap gap-1.5">
            {article.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : undefined
      }
      imageClassName={imgError ? 'hidden' : ''}
    >
      {imgError ? null : (
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
      )}

      <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2">
        {article.title}
      </h3>

      {article.description && (
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mt-2 line-clamp-3">
          {article.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-2 transition-all mt-auto pt-3">
        Read intelligence <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </div>
    </CardMedia>
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
      <section className="relative min-h-screen md:h-screen w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-24 md:pt-24 lg:pt-28">
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

      {/* ══ NEWS FEED ══ */}
      <section className="relative w-full bg-bg py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 lg:px-12 xl:px-16">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-bg-card overflow-hidden animate-pulse">
                  <div className="aspect-video bg-accent-dim/20" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-accent-dim/20 rounded w-1/3" />
                    <div className="h-5 bg-accent-dim/30 rounded w-3/4" />
                    <div className="h-3 bg-accent-dim/20 rounded w-full" />
                    <div className="h-3 bg-accent-dim/20 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasArticles ? (
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-24 text-center">
              <Shield className="mx-auto mb-4 h-14 w-14 text-text-muted opacity-30" />
              <p className="text-lg text-text-muted font-bold">No intelligence feeds available</p>
              <p className="text-sm text-text-muted mt-1">New cyber threat data will appear here as it's published.</p>
            </div>
          ) : (
            <CardGrid
              slides={articles}
              cols={2}
              containerClassName="w-full"
              renderCard={(article) => <NewsCard article={article} />}
            />
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
