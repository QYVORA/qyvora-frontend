import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { teamData } from './teamData';
import BrandGithubIcon from '@/shared/components/icons/BrandGithubIcon';
import BrandLinkedinIcon from '@/shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '@/shared/components/icons/BrandYoutubeIcon';
import BrandXIcon from '@/shared/components/icons/BrandXIcon';
import BrandTiktokIcon from '@/shared/components/icons/BrandTiktokIcon';
import BrandInstagramIcon from '@/shared/components/icons/BrandInstagramIcon';

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  youtube: BrandYoutubeIcon,
  twitter: BrandXIcon,
  tiktok: BrandTiktokIcon,
  instagram: BrandInstagramIcon,
};

const carouselVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? 30 : -30,
    opacity: 0,
  }),
};

const TeamCarouselSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    if (teamData.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % teamData.length);
  }, []);

  const handlePrev = useCallback(() => {
    if (teamData.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + teamData.length) % teamData.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || teamData.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext, shouldReduceMotion]);

  const member = teamData[activeIndex];
  const hasMultipleMembers = teamData.length > 1;

  return (
    <div className="w-full px-2 sm:px-4 md:px-10 max-w-[1600px] mx-auto">
      <div className="max-w-[1440px] mx-auto w-full relative group/carousel">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            className="relative w-full"
          >
            <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none h-[620px] sm:h-[650px] lg:h-[480px] xl:h-[520px]">
              <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[220px] sm:h-[260px] lg:h-full">
                <div className="relative w-full h-full bg-bg flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.fallback-avatar')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-avatar w-full h-full flex items-center justify-center text-accent/20 bg-bg-card';
                          fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent/20 bg-bg-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />
                  <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10">
                    <div className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
                      <span className="text-lg sm:text-xl lg:text-2xl font-black text-accent uppercase tracking-widest whitespace-nowrap">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 xl:p-14 justify-center min-h-0">
                <div className="max-w-2xl">
                  {member.handle && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                        @{member.handle}
                      </span>
                    </div>
                  )}
                  <h2 className="text-3xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-8">
                    {member.name}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-5 py-2 mb-10 italic">
                    &ldquo;{member.bio}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-6">
                    {Object.entries(member.socials).map(([key, href]) => {
                      if (!href) return null;
                      const IconComponent = socialIcons[key];
                      if (!IconComponent) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} on ${key}`}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg/40 text-text-secondary transition-all duration-300 hover:border-accent/50 hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_6px_18px_var(--color-accent-glow)]"
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {hasMultipleMembers && (
          <>
            <div className="flex lg:hidden items-center justify-center gap-3 mt-6">
              {teamData.map((_, idx) => (
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
                  aria-label={`Go to ${teamData[idx].name}`}
                />
              ))}
            </div>
            <div className="flex lg:hidden items-center justify-between mt-4 px-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                aria-label="Previous team member"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
                aria-label="Next team member"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
              <button
                onClick={handlePrev}
                className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                aria-label="Previous team member"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                aria-label="Next team member"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamCarouselSection;
export { TeamCarouselSection };
