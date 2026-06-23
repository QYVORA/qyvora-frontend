import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const PARTNERS = [
  { name: 'Wsuits Industries', src: '/assets/partners/WsuitsIndustries.webp' },
  { name: 'RedSpectre AI',      src: '/assets/partners/RedSpectreAI.webp' },
  { name: 'Sorbit',             src: '/assets/partners/Sorbit.webp' },
];

const LandingPartnersSection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 md:mb-8"
      >
        <motion.span className="inline-flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-[0.35em] text-accent mb-4">
          <Star className="w-3 h-3 md:w-4 md:h-4" /> Trusted Partners
        </motion.span>
        <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
          Backed by <span className="text-accent">Industry Leaders</span>
        </motion.h2>
      </motion.div>

      <div className="relative overflow-hidden py-4 md:py-6">
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-bg z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-bg z-10 pointer-events-none" />

        <div className="marquee-track">
          <div className="flex gap-8 md:gap-14 lg:gap-20 items-center marquee-content">
            {Array.from({ length: 10 }).map((_, i) => {
              const partner = PARTNERS[i % PARTNERS.length];
              return (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center h-24 md:h-32 lg:h-36 px-8 md:px-12 lg:px-16 rounded-2xl border border-border/15 bg-bg-card/40"
                >
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-h-14 md:max-h-20 lg:max-h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPartnersSection;
