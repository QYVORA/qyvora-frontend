import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { HeroBackground } from '@/shared/components/backgrounds';
import { BLOG_POSTS } from './blogContent';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

const BlogsPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { isMobile } = useAdaptiveUi();
  const { user } = useAuth();
  useScrollLock(!isMobile);
  const containerRef = useRef<HTMLDivElement>(null);

  const AUTOPLAY_DURATION = 6000;

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % BLOG_POSTS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + BLOG_POSTS.length) % BLOG_POSTS.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(handleNext, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [handleNext, shouldReduceMotion]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const post = BLOG_POSTS[activeIndex];

  return (
    <div
      ref={containerRef}
      className="
        w-full h-full
        md:h-[calc(100dvh-80px)] md:overflow-y-auto
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
      <section className="relative min-h-screen md:snap-start md:snap-always md:min-h-full w-full flex-shrink-0 bg-bg overflow-hidden flex items-center">
        <HeroBackground />
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-8 md:pt-10 lg:pt-12">
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
      <section className="relative md:snap-start md:snap-always md:min-h-full w-full flex-shrink-0 bg-bg flex flex-col justify-center pt-8 md:pt-0 pb-32 md:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 w-full">
          <div className="w-full relative group/carousel">
            {/* Wrapper for card + arrows — keeps arrows centered to card not dots */}
            <div className="relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                  }}
                  className="relative w-full"
                >
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="group flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none transition-all duration-500 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(102,184,112,0.06)] h-[620px] sm:h-[650px] lg:h-[480px] xl:h-[520px]"
                    style={{ boxShadow: 'var(--card-shimmer)' }}
                  >
                    {/* Image */}
                    <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[220px] sm:h-[260px] lg:h-full">
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

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 xl:p-14 justify-center min-h-0">
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
                </motion.div>
              </AnimatePresence>

              {/* Desktop arrows — positioned relative to card wrapper */}
              <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
                <button
                  onClick={handlePrev}
                  className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                  aria-label="Previous blog"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                  aria-label="Next blog"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {BLOG_POSTS.map((_, idx) => (
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
                  aria-label={`Go to blog ${idx + 1}`}
                />
              ))}
            </div>

            {/* Mobile prev/next */}
            <div className="flex items-center justify-between mt-4 px-2 lg:hidden">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                aria-label="Previous blog"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-[10px] font-mono text-text-muted/40">
                {activeIndex + 1} / {BLOG_POSTS.length}
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                aria-label="Next blog"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative md:snap-start md:snap-always min-h-screen md:min-h-full w-full flex-shrink-0 bg-bg flex flex-col justify-center">
        <LandingFinalCtaSection user={user} />
      </section>
    </div>
  );
};

export default BlogsPage;
