import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { SharedCarousel } from '@/shared/components/carousel';
import SEO from '@/shared/components/SEO';
import { HeroBackground } from '@/shared/components/backgrounds';
import { BLOG_POSTS } from './blogContent';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';

const BlogsPage: React.FC = () => {
  const { isMobile } = useAdaptiveUi();
  const { user } = useAuth();
  useScrollLock(!isMobile);
  const containerRef = useRef<HTMLDivElement>(null);

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
        title="Blogs"
        description="Read about cybersecurity, offensive security tooling, and Africa's growing security ecosystem."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Blogs', item: '/blogs' },
        ]}
      />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
        <HeroBackground />
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-24 md:pt-24 lg:pt-28">
          <div className="max-w-4xl space-y-8 text-left w-full">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-accent block">
                // The QYVORA Blog
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                Intelligence <span className="text-accent">Reports</span>
              </h1>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
              Field notes, tool philosophy, and the thinking behind Africa's offensive security ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* ── Blog Carousel ── */}
      <section className="relative md:snap-start md:snap-always w-full flex-shrink-0 bg-bg">
        <div className="max-w-[1440px] mx-auto w-full">
          <SharedCarousel
            slides={BLOG_POSTS}
            renderCard={(post) => (
              <Link
                to={`/blogs/${post.slug}`}
                className="group flex flex-col lg:flex-row w-full max-w-5xl xl:max-w-6xl mx-auto overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(102,184,112,0.06)] h-auto lg:min-h-[420px] xl:min-h-[460px]"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group lg:self-stretch h-[220px] sm:h-[260px] lg:h-auto">
                  <div className="relative w-full h-full bg-bg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20" />
                    <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 xl:p-14 justify-start md:justify-center min-h-0">
                  <div className="max-w-2xl space-y-6">
                    <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-sm font-bold uppercase tracking-widest text-accent/80">
                      {post.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-5 py-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full shrink-0 bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black uppercase tracking-widest text-text-primary truncate">
                            {post.author.name}
                          </div>
                          <div className="text-[10px] font-mono text-text-muted truncate">
                            {post.author.handle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-text-muted shrink-0">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Clock className="w-4 h-4 shrink-0" /> {post.readTime}
                        </span>
                        <span className="flex items-center gap-1.5 text-accent group-hover:gap-2.5 transition-all whitespace-nowrap">
                          Read <ArrowRight className="w-4 h-4 shrink-0" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          />
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg flex flex-col justify-center min-h-screen">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ── Footer Section ── */}
      <section className="relative md:h-screen md:snap-start md:snap-always w-full flex-shrink-0 bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default BlogsPage;
