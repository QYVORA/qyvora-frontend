import React, { useRef, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Download, Shield, Zap, Search, Globe, Lock, FileCode, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground.tsx';
import Footer from '../components/layout/Footer';
import { useScrollLock } from '../../../core/hooks/useScrollLock';
import SEO from '../../../shared/components/SEO';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';

const PHASES = [
  { id: '01', name: 'DISCOVERY', icon: Search, desc: 'Subdomains via crt.sh CT logs + DNS brute-force' },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts, status codes, and titles' },
  { id: '03', name: 'TLS', icon: Lock, desc: 'Certificate analysis, SANs, and protocol audit' },
  { id: '04', name: 'HEADERS', icon: Shield, desc: 'Security headers and CORS misconfigurations' },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), admin panels, and backups' },
  { id: '06', name: 'TAKEOVER', icon: AlertTriangle, desc: 'Dangling CNAME detection for cloud services' },
];

// ── Snap section ──────────────────────────────────────────────────────────────
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
        className="w-full h-full relative z-10 flex flex-col justify-center py-20 md:py-0 overflow-x-hidden md:overflow-hidden"
        data-snap-child=""
      >
        {children}
      </div>
    </section>
  );
};

const AnansiPage: React.FC = () => {
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
      filter: 'blur(8px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(8px)'
    })
  };

  // Detect which section is currently in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const detectionPoint = scrollTop + containerHeight * 0.3;

      const sections = ['hero', 'install', 'pipeline', 'cta', 'footer'];
      let foundSection = sections[0];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = scrollTop + rect.top;

        if (detectionPoint >= elementTop) {
          foundSection = id;
          break;
        }
      }

      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, isMobile]);

  const currentPhase = PHASES[activePhaseIndex];

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO 
        title="Anansi CLI - Attack Surface Intelligence"
        description="Anansi CLI is a terminal-first attack surface intelligence engine built for speed, portability, and raw technical signal. Automate discovery, probing, and takeover detection."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Anansi CLI', item: '/anansi' }
        ]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'Anansi CLI',
          'operatingSystem': 'Linux, macOS, Windows',
          'applicationCategory': 'SecurityApplication',
          'description': 'Terminal-first attack surface intelligence engine built for speed, portability, and raw technical signal.',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }}
      />
      {/* ── Global Background ── */}
      <HeroBackground 
        className={`
          z-0 transition-opacity duration-700 
          ${activeSection === 'hero' ? 'opacity-65' : 'opacity-90'}
        `} 
      />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-auto md:h-[100svh] w-full overflow-y-visible md:overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        {/* ── 1. Hero ── */}
        <SnapSection id="hero">
          <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 px-6 md:px-12 pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-0 lg:pb-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-[1.2] space-y-10"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-accent font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                    Available Now // v1.0.0
                  </span>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[1.05]">
                  ANANSI <span className="text-accent">CLI</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-mono leading-relaxed">
                  Terminal-first attack surface intelligence engine. Built for speed, portability, and raw technical signal.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <a 
                  href="#install" 
                  className="btn-primary flex items-center justify-center gap-3 !px-10 !py-4 min-h-[58px] sm:min-h-[52px] text-base"
                >
                  <Download className="w-5 h-5" /> 
                  <span>Get Binary</span>
                </a>
                <a 
                  href="https://github.com/QYVORA/qyvora-anansi-cli" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary flex items-center justify-center gap-3 !px-10 !py-4 min-h-[58px] sm:min-h-[52px] text-base"
                >
                  <Zap className="w-5 h-5" /> View Source
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex-1 hidden lg:block relative"
            >
              <img 
                src="/anansi-main-logo.webp" 
                alt="Anansi CLI - Offensive Security Intelligence Engine" 
                fetchPriority="high"
                className="relative z-10 w-full max-w-[620px] mx-auto filter drop-shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.2)]"
              />
            </motion.div>
          </div>
        </SnapSection>

        {/* ── 2. Terminal Box Section ── */}
        <SnapSection id="install">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
            >
              <div className="bg-[#121212] border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase font-bold">
                  operator@qyvora:~
                </div>
                <div className="w-10 hidden sm:block" />
              </div>
              <div className="p-6 sm:p-8 md:p-12 font-mono text-xs sm:text-sm md:text-lg space-y-10 overflow-x-auto custom-scrollbar">
                <div className="space-y-4">
                  <div className="text-accent/40 font-bold uppercase tracking-[0.2em] text-[10px]"># Step 01: Download for Linux (AMD64)</div>
                  <div className="flex gap-4 items-start group min-w-max">
                    <span className="text-accent font-bold mt-1">$</span>
                    <code className="text-white whitespace-nowrap bg-white/5 p-2 rounded-lg group-hover:text-accent transition-colors">
                      curl -L https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/anansi-linux-amd64 -o anansi
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-accent/40 font-bold uppercase tracking-[0.2em] text-[10px]"># Step 02: Make Executable & Install</div>
                  <div className="flex gap-4 items-start group min-w-max">
                    <span className="text-accent font-bold mt-1">$</span>
                    <code className="text-white whitespace-nowrap bg-white/5 p-2 rounded-lg group-hover:text-accent transition-colors">
                      chmod +x anansi && sudo mv anansi /usr/local/bin/
                    </code>
                  </div>
                </div>

                <div className="pt-8 space-y-4 border-t border-white/5">
                  <div className="text-accent/40 font-bold uppercase tracking-[0.2em] text-[10px]"># Step 03: Run Initial Scan</div>
                  <div className="flex gap-4 items-start group min-w-max">
                    <span className="text-accent font-bold mt-1">$</span>
                    <code className="text-white group-hover:text-accent transition-colors">anansi target.com --deep</code>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </SnapSection>

        {/* ── 3. Pipeline Section (Carousel) ── */}
        <SnapSection id="pipeline">
          <div className="w-full px-4 sm:px-6 md:px-10 py-20 md:py-0">
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
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.4 }
                  }}
                  className="relative w-full"
                >
                  <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card/40 dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none lg:h-[480px] xl:h-[520px]">

                    {/* Icon Section */}
                    <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group bg-accent/5 flex items-center justify-center p-12 lg:p-0">
                      <div className="relative w-full aspect-square sm:aspect-[16/10] lg:aspect-auto lg:h-full flex items-center justify-center">
                        <currentPhase.icon className="w-32 h-32 md:w-40 md:h-40 text-accent relative z-10" />

                        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10">
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
                            // PIPELINE LIFECYCLE
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
                          <span className="font-mono text-[11px] uppercase tracking-widest font-bold">Autonomous Execution</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Desktop Navigation Arrows - Attached to cards */}
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
                      idx === activePhaseIndex
                        ? 'w-6 h-2 bg-accent'
                        : 'w-2 h-2 bg-text-muted/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SnapSection>

        {/* ── 4. Call to Action ── */}
        <SnapSection id="cta">
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-20 md:pt-0">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
              <div className="flex-1 space-y-10 text-center lg:text-left">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Own the Perimeter</h2>
                  <p className="text-xl text-text-secondary font-mono max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    No web UI. No cloud account. No API keys. 
                    Just high-signal intelligence delivered straight to your terminal.
                  </p>
                </div>

                <a 
                  href="https://github.com/QYVORA/qyvora-anansi-cli"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-4 text-accent font-black uppercase tracking-[0.4em] text-sm hover:gap-6 transition-all"
                >
                  Explore the Repository <Zap className="w-5 h-5" />
                </a>
              </div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-1 max-w-[400px] lg:max-w-none"
              >
                <img 
                  src="/anansi-main-logo.webp" 
                  alt="Anansi CLI Offensive Security Tool" 
                  loading="lazy"
                  className="w-full max-w-[480px] mx-auto filter drop-shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.15)]"
                />
              </motion.div>
            </div>
          </div>
        </SnapSection>

        <section
          id="footer"
          className="md:snap-start md:snap-always w-full bg-bg"
        >
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default AnansiPage;