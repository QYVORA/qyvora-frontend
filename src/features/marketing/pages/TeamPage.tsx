import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground.tsx';
import Footer from '../components/layout/Footer';
import SimpleHeading from '../../../shared/components/ui/SimpleHeading';
import SEO from '../../../shared/components/SEO';
import { teamData, TeamMember } from '../content/teamData';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import { useScrollLock } from '../../../core/hooks/useScrollLock';

import BrandGithubIcon from '../../../shared/components/icons/BrandGithubIcon';
import BrandLinkedinIcon from '../../../shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '../../../shared/components/icons/BrandYoutubeIcon';
import BrandXIcon from '../../../shared/components/icons/BrandXIcon';
import BrandTiktokIcon from '../../../shared/components/icons/BrandTiktokIcon';
import BrandInstagramIcon from '../../../shared/components/icons/BrandInstagramIcon';

const SnapSection: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  return (
    <section
      id={id}
      className={`relative md:snap-start md:snap-always md:h-full w-full flex-shrink-0 box-border bg-transparent overflow-x-hidden md:overflow-hidden ${className}`}
    >
      <div
        className="w-full h-full relative z-10 flex flex-col justify-center py-20 md:py-0 lg:pt-28 lg:pb-12 overflow-x-hidden md:overflow-hidden"
        data-snap-child=""
      >
        {children}
      </div>
    </section>
  );
};

const TeamPage: React.FC = () => {
  const { isMobile, constrainedDevice } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  const AUTOPLAY_DURATION = 6000; 

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
    const interval = setInterval(handleNext, AUTOPLAY_DURATION);
    return () => clearInterval(interval);
  }, [handleNext, shouldReduceMotion]);

  // Social icon mapping
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
    })
  };

  const member = teamData[activeIndex];
  const hasMultipleMembers = teamData.length > 1;

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO 
        title="Team - Meet the Operators"
        description="Learn more about the core operators and engineers building QYVORA's offensive security platform and ecosystem in Africa."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Team', item: '/team' }
        ]}
      />
      {/* ── Global Background ── */}
      <HeroBackground className="opacity-70" />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-auto md:h-[100svh] w-full overflow-y-visible md:overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        {/* ── 1. Hero Section ── */}
        <section className="md:snap-start md:snap-always md:h-full md:flex-shrink-0 md:box-border relative bg-transparent overflow-hidden">
          <motion.div 
            style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
            className="relative z-20 h-full max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 pb-12"
          >
            {/* Left: Content */}
            <div className="max-w-3xl lg:max-w-xl flex-shrink-0">
              <ScrollReveal>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4 lg:mb-3">
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                    Operator Directory
                  </span>
                </div>
                <SimpleHeading text="THE TEAM" align="left" className="mb-8" />
              </ScrollReveal>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-text-secondary text-sm sm:text-base md:text-lg max-w-lg mb-8 leading-relaxed opacity-80"
              >
                Meet the core developers, security researchers, and operators building QYVORA's offensive security ecosystem.
              </motion.p>
            </div>

            {/* Right: Illustration (Desktop Only) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center flex-1 max-w-lg"
            >
              <div className="relative w-full aspect-square max-w-md">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 rounded-3xl" />
                <div className="absolute inset-4 border border-accent/20 rounded-3xl" />
                
                {/* Main illustration */}
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <img
                    src="/assets/illustrations/team.svg"
                    alt="QYVORA Team Illustration"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-icon')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'fallback-icon w-full h-full flex items-center justify-center text-accent/30';
                        fallback.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                {/* Floating accent dots */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 w-3 h-3 rounded-full bg-accent/40"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-accent/30"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── 2. Carousel Section ── */}
        <SnapSection id="operators-directory">
          <div className="w-full px-2 sm:px-4 md:px-10 max-w-[1600px] mx-auto">
            {/* Carousel Wrapper */}
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
                    
                    {/* Image Section */}
                    <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[220px] sm:h-[260px] lg:h-full">
                      <div className="relative w-full h-full bg-bg flex items-center justify-center">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover grayscale brightness-90 transition-transform duration-[2000ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
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

                        {/* Role Badge */}
                        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10">
                          <div className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
                            <span className="text-lg sm:text-xl lg:text-2xl font-black text-accent uppercase tracking-widest whitespace-nowrap">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
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
                          "{member.bio}"
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 border-t border-border/60 pt-6">
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
                                className="
                                  flex h-12 w-12 items-center justify-center
                                  rounded-xl border border-border bg-bg/40
                                  text-text-secondary transition-all duration-300
                                  hover:border-accent/50 hover:text-accent hover:-translate-y-0.5
                                  hover:shadow-[0_6px_18px_var(--color-accent-glow)]
                                "
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

              {/* Carousel Controls (only visible if multiple members exist) */}
              {hasMultipleMembers && (
                <>
                  {/* Dot Indicators */}
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

                  {/* Mobile Swipe Navigation */}
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

                  {/* Desktop Swipe Navigation */}
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
        </SnapSection>

        {/* ── 3. Footer Section ── */}
        <section id="footer" className="md:snap-start md:snap-always md:min-h-full md:flex md:flex-shrink-0 bg-transparent overflow-hidden">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default TeamPage;
