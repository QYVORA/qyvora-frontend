import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { IconArrowRight, IconClock } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import StickySidebarLayout from '@/shared/components/layout/StickySidebarLayout';
import { BLOG_POSTS } from '@/features/marketing/pages/BlogsPage/blogContent';

const LandingBlogsSection = () => {
  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col justify-center">
        <StickySidebarLayout
          heading={
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
                Intelligence <span className="text-text-secondary">Reports</span>
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
                Field notes, tool philosophy, and the thinking behind Africa's offensive security ecosystem.
              </p>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/30 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors"
              >
                View All Posts <IconArrowRight size={14} />
              </Link>
            </div>
          }
        >
          <Carousel
            slides={BLOG_POSTS}
            renderCard={(post) => (
              <a
                href={`/blogs/${post.slug}`}
                className="block relative min-h-[260px] md:min-h-[360px] group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center hidden dark:block"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[360px]">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80 mt-1">
                    {post.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-border/50 w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-primary truncate">
                          {post.author.name}
                        </div>
                        <div className="text-[8px] sm:text-[10px] font-mono text-text-muted truncate">
                          {post.author.handle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono text-text-muted shrink-0">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <IconClock size={12} className="sm:w-3.5 sm:h-3.5 shrink-0" /> {post.readTime}
                      </span>
                      <span className="flex items-center gap-1 text-accent group-hover:gap-1.5 transition-all whitespace-nowrap">
                        Read <IconArrowRight size={12} className="sm:w-3.5 sm:h-3.5 shrink-0" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            )}
          />
        </StickySidebarLayout>
      </div>
    </div>
  );
};

export default LandingBlogsSection;
