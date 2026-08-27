import { memo } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';
import { useTranslation } from 'react-i18next';

const LandingBlogsSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-8">
            {t('landing.blogs.title')} <span className="text-accent">{t('landing.blogs.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-10">
            {t('landing.blogs.description')}
          </p>
          <Link
            to="/blogs"
            className="btn-secondary inline-flex items-center gap-2.5 self-start"
          >
            {t('landing.blogs.viewAll')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center">
          <Carousel
            slides={BLOG_POSTS}
            showArrows={false}
            className="w-full"
              renderCard={(post) => (
                <Link
                  to={`/blogs/${post.slug}`}
                  className="group flex flex-col md:flex-row bg-bg-card overflow-hidden h-full min-h-[500px] md:min-h-[380px] transition-all duration-300 hover:bg-bg-elevated"
                >
                  <div className="relative md:w-[45%] lg:w-[48%] shrink-0 h-[200px] md:h-full md:aspect-auto overflow-hidden bg-bg-elevated">
                    <img
                      src={post.image}
                      alt={post.title}
                      width={1536}
                      height={1024}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative flex flex-col items-start text-left p-5 sm:p-6 md:p-7 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-accent/10 border border-accent/20 rounded-full text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80 mb-3">
                      {post.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono border-l-2 border-accent/40 pl-3 py-1.5 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between gap-3 w-full pt-3 mt-auto">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full shrink-0 bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-primary truncate">
                            {post.author.name}
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-mono text-text-muted truncate">
                            {post.author.handle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono text-text-muted shrink-0">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <IconClock size={12} className="shrink-0" /> {post.readTime}
                        </span>
                        <span className="flex items-center gap-1 text-accent group-hover:gap-1.5 transition-all whitespace-nowrap">
                          {t('landing.blogs.read')} <IconArrowRight size={12} className="shrink-0" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            />
        </div>
      </div>
    </div>
  );
};

export default memo(LandingBlogsSection);
