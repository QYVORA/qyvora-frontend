import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { CardMedia } from '@/shared/components/ui/Card';
import { CardGrid } from '@/shared/components/card-grid';
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
      <section className="relative min-h-screen md:h-screen w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
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

      {/* ── Blog Card Grid ── */}
      <section className="relative w-full bg-bg py-20 md:py-28 lg:py-36">
        <CardGrid
          slides={BLOG_POSTS}
          cols={2}
          containerClassName="w-full px-4 md:px-10 lg:px-12 xl:px-16"
          renderCard={(post) => (
            <CardMedia
              image={post.image}
              imageAspect="aspect-video"
              href={`/blogs/${post.slug}`}
              imageBadges={
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-bg/80 backdrop-blur-sm border border-accent/20 rounded-full text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            >
              <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-accent/80 mt-1">
                {post.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mt-3 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border/50">
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
            </CardMedia>
          )}
        />
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
