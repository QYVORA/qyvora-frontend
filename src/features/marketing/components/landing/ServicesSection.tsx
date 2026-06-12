import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { openServiceRequestModal } from '../ServiceRequestModal';

const SERVICES_DATA = [
  {
    id: 'basic-pentest',
    title: 'Basic Web-App Pentesting',
    price: 'GH₵ 4,000+',
    subtitle: 'Essential Security Audit',
    image: '/assets/sections/services/basic-package.webp',
    features: [
      'OWASP Top 10 Coverage',
      'Authentication Testing',
      'XSS & SQLi Discovery',
      'Vulnerability Report',
    ],
    accent: false,
  },
  {
    id: 'standard-pentest',
    title: 'Standard Penetration Test',
    price: 'GH₵ 8,000+',
    subtitle: 'Full Stack Assessment',
    image: '/assets/sections/services/standard-package.webp',
    features: [
      'Authenticated Pentesting',
      'Business Logic Analysis',
      'IDOR & JWT Security',
      'Remediation Retest',
    ],
    accent: true,
  },
];

const ServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const shouldReduceMotion = useReducedMotion();

  const AUTOPLAY_DURATION = 6000; 

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SERVICES_DATA.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SERVICES_DATA.length) % SERVICES_DATA.length);
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

  const service = SERVICES_DATA[activeIndex];

  return (
    <div className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10 relative z-10 py-20 sm:py-24 md:py-20 lg:pt-28 lg:pb-12 overflow-x-hidden md:overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative group/carousel">
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
              filter: { duration: 0.4 }
            }}
            className="relative w-full"
          >
            <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 bg-bg-card/40 backdrop-blur-sm shadow-2xl">
              
              {/* Image Section */}
              <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group">
                {/* Mobile: taller image for better visual impact */}
                <div className="relative w-full aspect-[3/2] sm:aspect-[16/10] lg:aspect-auto lg:h-[480px] xl:h-[520px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20" />
                
                  {/* Price Badge */}
                  <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                    <div className="px-5 py-2.5 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-bg-card/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                      <span className="text-base sm:text-base font-black text-accent uppercase tracking-widest">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {service.accent && (
                    <div className="absolute top-5 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
                      <div className="px-4 py-2 sm:px-4 sm:py-2 bg-accent text-bg rounded-lg sm:rounded-xl text-xs sm:text-[11px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">
                        Popular Choice
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col p-5 sm:p-8 lg:p-10 xl:p-14 justify-center">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                      {service.subtitle}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-8 sm:mb-8">
                    {service.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 mb-10 sm:mb-10">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 sm:gap-4">
                        <CheckCircle2 className="w-5 h-5 text-accent/60 mt-0.5 flex-shrink-0" />
                        <span className="text-base text-text-secondary leading-normal font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => openServiceRequestModal(service.title)}
                      className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-accent text-bg rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 shadow-lg shadow-accent/10 flex items-center justify-center gap-3 sm:gap-4 min-h-[52px]"
                    >
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                      Request Assessment
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2 opacity-40">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-widest">
                        ISO COMPLIANT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile dot indicators */}
        <div className="flex lg:hidden items-center justify-center gap-3 mt-6">
          {SERVICES_DATA.map((_, idx) => (
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
              aria-label={`Go to ${SERVICES_DATA[idx].title}`}
            />
          ))}
        </div>

        {/* Mobile swipe arrows — subtle, below card */}
        <div className="flex lg:hidden items-center justify-between mt-4 px-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-text-muted/50 hover:text-accent transition-colors text-xs font-bold uppercase tracking-widest"
            aria-label="Next service"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-white/10 text-text-primary flex items-center justify-center transition-all hover:bg-accent hover:text-bg hover:border-accent active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-white/10 text-text-primary flex items-center justify-center transition-all hover:bg-accent hover:text-bg hover:border-accent active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100"
            aria-label="Next service"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;