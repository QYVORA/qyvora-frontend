import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Shield, Terminal, Network, Globe, Users, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroBackground } from '@/shared/components/backgrounds';
import { Footer } from '@/shared/components/layout';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import SEO from '@/shared/components/SEO';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import SnapSection from '@/shared/components/SnapSection';

const PHASES = [
  {
    id: '01',
    name: 'Hacker Mindset',
    icon: Shield,
    desc: 'Offensive security is a proactive mindset. Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
    image: '/assets/bootcamp/rooms/phaseOne.webp',
  },
  {
    id: '02',
    name: 'Linux Foundations',
    icon: Terminal,
    desc: 'Master navigation, user privilege escalation, file permissions, and directory structures. Transition from a GUI observer to a terminal-proficient operator.',
    image: '/assets/bootcamp/rooms/phaseTwo.webp',
  },
  {
    id: '03',
    name: 'Networking',
    icon: Network,
    desc: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
    image: '/assets/bootcamp/rooms/phaseThree.webp',
  },
  {
    id: '04',
    name: 'Web & Backend Systems',
    icon: Globe,
    desc: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
    image: '/assets/bootcamp/rooms/phaseFour.webp',
  },
  {
    id: '05',
    name: 'Social Engineering',
    icon: Users,
    desc: 'Understand the human factor in the defensive boundary. Study pretexting, psychological vectors, coordinates of trust, and human spoofing.',
    image: '/assets/bootcamp/rooms/phaseFive.webp',
  },
];

const LearnPage: React.FC = () => {
  const { isMobile } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Carousel autoplay logic
  const handleNextPhase = useCallback(() => {
    setDirection(1);
    setActivePhaseIndex((prev) => (prev + 1) % PHASES.length);
  }, []);

  const handlePrevPhase = useCallback(() => {
    setDirection(-1);
    setActivePhaseIndex((prev) => (prev - 1 + PHASES.length) % PHASES.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(handleNextPhase, 6000);
    return () => clearInterval(interval);
  }, [handleNextPhase, shouldReduceMotion]);

  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(8px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(8px)',
    }),
  };

  const currentPhase = PHASES[activePhaseIndex];

  return (
    <div className="bg-bg select-none">
      <SEO
        title="Learn | Hacker Protocol Bootcamp"
        description="Master the 5 core phases of offensive security in the HPB Bootcamp. Train in mindset, Linux, networking, web systems, and social engineering."
      />

      {/* Snap Scroll Wrapper */}
      <div
        ref={containerRef}
        className="
          w-full h-full
          md:h-screen md:overflow-y-auto
          md:snap-y md:snap-mandatory
          relative z-10 scroll-smooth
        "
        style={{ scrollbarWidth: 'none' }}
      >
        {/* ── 1. Hero Section ── */}
        <SnapSection id="hero" className="overflow-hidden">
          <HeroBackground />
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-24 md:pt-0">
            <div className="max-w-4xl space-y-8 text-left w-full">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-accent block">
                  // TRAINING PROGRAMME
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
                  Hacker Protocol <br />
                  <span className="text-accent">Bootcamp</span>
                </h1>
              </div>

              <p className="text-lg md:text-xl text-text-secondary font-mono leading-relaxed max-w-2xl">
                Offensive security requires understanding systems from first principles. 
                The HPB curriculum transforms you from a tool runner to a specialized security operator.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Training
                </Link>
                <a
                  href="#phases"
                  className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
                  onClick={(e) => {
                    if (!isMobile) {
                      e.preventDefault();
                      const el = document.getElementById('phases');
                      if (el && containerRef.current) {
                        containerRef.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  Explore Phases
                </a>
              </div>
            </div>
          </div>
        </SnapSection>

        {/* ── 2. Phases Section (Carousel) ── */}
        <SnapSection id="phases" innerClassName="lg:pt-28 lg:pb-12">
          <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-0">
            <div className="max-w-[1600px] mx-auto w-full relative group/carousel">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activePhaseIndex}
                  custom={direction}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.4 },
                  }}
                  className="relative w-full"
                >
                  <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card/40 dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none lg:h-[480px] xl:h-[520px]">
                    {/* Image Section */}
                    <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[240px] sm:h-[300px] lg:h-full bg-accent/5">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {currentPhase.image ? (
                          <img
                            src={currentPhase.image}
                            alt={currentPhase.name}
                            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                          />
                        ) : (
                          <currentPhase.icon className="w-32 h-32 md:w-40 md:h-40 text-accent relative z-10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />

                        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-10">
                          <div className="px-6 py-3 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
                            <span className="text-base sm:text-lg font-black text-accent uppercase tracking-widest whitespace-nowrap">
                              PHASE {currentPhase.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col p-8 sm:p-10 lg:p-14 xl:p-16 justify-center">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                            // BOOTCAMP CURRICULUM
                          </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-6 lg:mb-8">
                          {currentPhase.name}
                        </h2>

                        <p className="text-base sm:text-lg lg:text-base xl:text-lg text-text-secondary font-mono leading-relaxed mb-8 lg:mb-10">
                          {currentPhase.desc}
                        </p>

                        <div className="flex items-center gap-3 text-accent/60">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
                            Practical Laboratory Tasks Included
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Desktop Navigation Arrows */}
              <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
                <button
                  onClick={handlePrevPhase}
                  className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                  aria-label="Previous phase"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNextPhase}
                  className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                  aria-label="Next phase"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="flex lg:hidden items-center justify-center gap-3 mt-8">
                {PHASES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > activePhaseIndex ? 1 : -1);
                      setActivePhaseIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activePhaseIndex ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-text-muted/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SnapSection>

        {/* ── 3. Call to Action ── */}
        <SnapSection id="cta">
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-20 md:pt-0">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 w-full">
              <div className="flex-1 space-y-10 text-left">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                    Establish Your Profile
                  </h2>
                  <p className="text-xl text-text-secondary font-mono max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Gain immediate access to our custom learning labs, sandbox terminal server connections, 
                    and live operations training rooms.
                  </p>
                </div>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-[0.4em] text-sm hover:gap-6 transition-all"
                >
                  Create Trainee Operator Account <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-1 max-w-[400px] lg:max-w-none"
              >
                <img
                  src="/qyvora-cta-logo.png"
                  alt="QYVORA Bootcamp Certification"
                  loading="lazy"
                  className="w-full max-w-[600px] xl:max-w-[850px] mx-auto filter drop-shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.15)]"
                />
              </motion.div>
            </div>
          </div>
        </SnapSection>

        {/* ── 4. Footer ── */}
        <section id="footer" className="md:snap-start md:snap-always w-full bg-bg">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
