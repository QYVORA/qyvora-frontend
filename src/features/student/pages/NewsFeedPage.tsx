import { useCallback, useEffect, useState } from 'react';
import {
  Radio, AlertTriangle, RefreshCw, ExternalLink, Calendar,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import api from '@/core/services/api';
import ScrollReveal from '@/shared/components/ScrollReveal';
import NewsCard from '@/features/news/components/NewsCard';
import { NewsFeedSkeleton } from '@/features/student/components/StudentSkeletons';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  categories: string[];
}

const AUTOPLAY_DURATION = 8000;

const NewsFeedPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

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

  useEffect(() => { fetchNews(); }, [fetchNews]);

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

  const { containerProps } = useAutoPlay({ onNext: handleNext, duration: AUTOPLAY_DURATION, disabled: shouldReduceMotion || articles.length <= 1 });

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 80 : -80, opacity: 0 }),
  };

  const hasArticles = articles.length > 0;
  const current = articles[activeIndex];

  if (loading) return <NewsFeedSkeleton />;

  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="px-2 sm:px-6 md:px-8 pt-6 pb-16">

          <ScrollReveal>
            <div className="mb-6 md:mb-8">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-accent">
                Threat Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary">Cyber Feed</h1>
              <p className="mt-2 max-w-2xl text-base text-text-muted">
                African-focused cybersecurity threat intelligence and situational awareness.
              </p>
              <button
                onClick={() => fetchNews(true)}
                disabled={refreshing}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-accent/30 bg-accent-dim text-accent text-[10px] font-black uppercase tracking-wider hover:bg-accent-dim/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating' : 'Refresh Feed'}
              </button>
            </div>
          </ScrollReveal>

          {error && (
            <ScrollReveal>
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl border border-red-400/30 bg-red-400/5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-400">Feed Error</p>
                  <p className="text-sm text-text-secondary mt-1">{error}</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Featured Carousel */}
          {!hasArticles ? (
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-text-muted opacity-30" />
                <p className="text-base text-text-muted font-bold">No intelligence feeds available</p>
                <p className="text-sm text-text-muted mt-1">New cyber threat data will appear here as it's published.</p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <div className="w-full relative group/carousel mb-10 lg:mb-12" {...containerProps}>
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
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col lg:flex-row w-full overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_30px_rgba(6,182,111,0.06)]"
                      >
                        {current.imageUrl && (
                          <div className="w-full lg:w-[45%] relative overflow-hidden group h-[180px] sm:h-[200px] lg:h-[280px]">
                            <img
                              src={current.imageUrl}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20" />
                            {current.categories.length > 0 && (
                              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5">
                                {current.categories.slice(0, 2).map((cat) => (
                                  <span key={cat} className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-8 justify-center min-h-0">
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">
                            <span className="flex items-center gap-1.5">
                              <Radio className="w-3 h-3" />
                              {current.source}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              {current.publishedAt
                                ? new Date(current.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                : '—'}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2 mb-3">
                            {current.title}
                          </h2>
                          {current.description && (
                            <p className="text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-4 py-1.5 line-clamp-2">
                              {current.description}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
                            Read intelligence <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  </AnimatePresence>

                  {/* Desktop nav arrows */}
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-5 -right-5 items-center justify-between pointer-events-none z-20">
                    <button
                      onClick={handlePrev}
                      className="w-12 h-12 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-lg opacity-0 group-hover/carousel:opacity-100"
                      aria-label="Previous article"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="w-12 h-12 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-lg opacity-0 group-hover/carousel:opacity-100"
                      aria-label="Next article"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {articles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDirection(idx > activeIndex ? 1 : -1); setActiveIndex(idx); }}
                      className={`transition-all duration-300 rounded-full ${
                        idx === activeIndex
                          ? 'w-5 h-2 bg-accent'
                          : 'w-2 h-2 bg-text-muted/40'
                      }`}
                      aria-label={`Go to article ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile prev/next */}
                <div className="flex items-center justify-between mt-3 px-1 lg:hidden">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 text-text-muted/50 hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest"
                    aria-label="Previous article"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 text-text-muted/50 hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest"
                    aria-label="Next article"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* News Grid */}
          {hasArticles && (
            <div>
              <ScrollReveal>
                <div className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-text-muted">
                  All Intelligence Reports
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {articles.map((article, idx) => (
                  <ScrollReveal key={article.id}>
                    <NewsCard
                      title={article.title}
                      description={article.description}
                      imageUrl={article.imageUrl}
                      source={article.source}
                      publishedAt={article.publishedAt}
                      url={article.url}
                      categories={article.categories}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedPage;
