import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Youtube, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';
import { teamData } from '@/features/marketing/pages/TeamPage/teamData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
};

const LandingTeamSection: React.FC = () => {
  const members = teamData.slice(0, 2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const member = members[activeIndex];

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

        {/* Left — heading */}
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none"
          >
            Built by <span className="text-accent">Hackers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-sm md:text-base text-text-muted leading-relaxed"
          >
            Two operators, one mission — building Africa's offensive security platform
          </motion.p>
        </div>

        {/* Right — carousel */}
        <div className="md:w-[65%] lg:w-[62%]">
          <div className="relative">
            <div className="text-center md:text-left mb-3">
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-text-muted/50">
                Team {activeIndex + 1} of {members.length}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Previous team member"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>

              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card min-h-[200px] md:min-h-[240px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={member.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="p-8 md:p-10 lg:p-12"
                  >
                    <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start text-left">
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl border-2 border-border/40 bg-bg-elevated overflow-hidden shadow-sm">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tight">
                          {member.name}
                        </h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-accent/10 text-accent text-[10px] md:text-xs font-black rounded-lg uppercase tracking-widest">
                          {member.role}
                        </span>
                        <p className="mt-2 md:mt-3 text-sm md:text-base text-text-muted leading-relaxed">
                          {member.bio}
                        </p>

                        <div className="mt-3 md:mt-4 flex items-center gap-2.5 justify-center md:justify-start">
                          {Object.entries(member.socials || {}).map(([platform, url]) => {
                            const Icon = SOCIAL_ICONS[platform];
                            if (!Icon) return null;
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-bg-elevated border border-border/20 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                              >
                                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleNext}
                className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Next team member"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            {/* Mobile arrows + dots */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-5">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Previous team member"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {members.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-8 bg-accent' : 'bg-border hover:bg-text-muted/40'
                    }`}
                    aria-label={`Team member ${i + 1}: ${m.name}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Next team member"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingTeamSection;
