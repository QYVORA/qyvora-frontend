import React from 'react';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
import SEO from '@/shared/components/SEO';
import { HeroBackground } from '@/shared/components/backgrounds';
import { BLOG_POSTS } from './blogContent';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';

const BlogsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full bg-bg">
      <SEO
        title="Blogs"
        description="Read about cybersecurity, offensive security tooling, and Africa's growing security ecosystem."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Blogs', item: '/blogs' },
        ]}
      />

      {/* ── Hero Section ── */}
      <section className="relative min-h-[85svh] md:min-h-screen w-full flex-shrink-0 bg-bg overflow-hidden grid place-items-center">
        <HeroBackground />
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-28 md:pt-24 lg:pt-28 pb-16">
          <div className="max-w-4xl space-y-8 text-left w-full">
            <div className="space-y-4">
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

      {/* ── Blog Card Carousel ── */}
      <section className="relative w-full bg-bg py-20 md:py-28 lg:py-36">
        <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
          <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
            <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                Latest <span className="text-accent">Posts</span>
              </h2>
            </div>
            <div className="md:w-[65%] lg:w-[62%]">
              <Carousel
                slides={BLOG_POSTS}
                renderCard={(post) => (
                  <a
                    href={`/blogs/${post.slug}`}
                    className="block relative min-h-[320px] md:min-h-[400px] group"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center hidden dark:block"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                    <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[320px] md:min-h-[400px]">
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
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {post.readTime}
                          </span>
                          <span className="flex items-center gap-1 text-accent group-hover:gap-1.5 transition-all whitespace-nowrap">
                            Read <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative w-full bg-bg py-20 md:py-28 lg:py-36">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* ── Footer Section ── */}
      <section className="relative w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default BlogsPage;
