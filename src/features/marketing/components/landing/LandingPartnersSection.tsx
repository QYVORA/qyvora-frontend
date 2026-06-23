import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const PARTNERS = [
  { name: 'Wsuits Industries', src: '/assets/partners/WsuitsIndustries.webp' },
  { name: 'RedSpectre AI',      src: '/assets/partners/RedSpectreAI.webp' },
  { name: 'Sorbit',             src: '/assets/partners/Sorbit.webp' },
];

const ROW_COUNT = 8;

const LandingPartnersSection: React.FC = () => {
  const row = (reverse: boolean) => (
    <div className="flex gap-8 md:gap-12 lg:gap-16 items-center" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
      {Array.from({ length: ROW_COUNT }).map((_, i) => {
        const partner = PARTNERS[i % PARTNERS.length];
        return (
          <div
            key={`${i}-${reverse}`}
            className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 lg:h-24 px-6 md:px-8 rounded-xl border border-border/20 bg-bg-card/40 backdrop-blur-sm"
          >
            <img
              src={partner.src}
              alt={partner.name}
              className="max-h-8 md:max-h-10 lg:max-h-12 w-auto object-contain brightness-0 invert-[0.7] dark:invert-0"
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-accent mb-3"
        >
          <Star className="w-3 h-3" /> Trusted Partners
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter"
        >
          Backed by <span className="text-accent">Industry Leaders</span>
        </motion.h2>
      </motion.div>

      <div className="relative overflow-hidden py-4 md:py-6">
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        {/* Top row — scroll right */}
        <div className="marquee-track mb-6 md:mb-8">
          <div
            className="flex gap-8 md:gap-12 lg:gap-16 items-center marquee-content"
          >
            {row(false)}
          </div>
        </div>

        {/* Bottom row — scroll left */}
        <div className="marquee-track marquee-reverse">
          <div
            className="flex gap-8 md:gap-12 lg:gap-16 items-center marquee-content"
          >
            {row(true)}
          </div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-text-muted/50 mt-6 font-bold uppercase tracking-widest"
      >
        And more — partners across Africa and beyond
      </motion.p>
    </div>
  );
};

export default LandingPartnersSection;
