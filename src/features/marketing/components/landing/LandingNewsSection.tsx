import { useEffect, useState } from 'react';
import { Radio, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import StickySidebarLayout from '@/shared/components/layout/StickySidebarLayout';
import api from '@/core/services/api';

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

const LandingNewsSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/news').then((res) => {
      if (!mounted) return;
      const data = res.data;
      const items = Array.isArray(data.articles) ? data.articles : [];
      setArticles(items.slice(0, 6));
    }).catch(() => {}).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading || articles.length === 0) return null;

  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden">
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col justify-center">
        <StickySidebarLayout
          heading={
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
                Cyber <span className="text-accent">Feed</span>
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
                African-focused cybersecurity threat intelligence and digital safety alerts.
              </p>
              <a
                href="/news"
                className="btn-secondary inline-flex items-center gap-2.5"
              >
                View Full Feed <IconArrowRight size={14} />
              </a>
            </div>
          }
        >
          <Carousel
            slides={articles}
            renderCard={(article) => {
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
                  className="block relative min-h-[260px] md:min-h-[360px] group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center hidden dark:block"
                    style={{ backgroundImage: `url(${article.imageUrl || ''})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                  <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[360px]">
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
                      Read Intelligence <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>
                </a>
              );
            }}
          />
        </StickySidebarLayout>
      </div>
    </div>
  );
};

export default LandingNewsSection;
