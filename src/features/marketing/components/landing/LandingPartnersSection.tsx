import React from 'react';
import { motion } from 'motion/react';

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
        className="text-center mb-4 md:mb-6"
      >
        <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
          Backed by <span className="text-accent">Industry Leaders</span>
        </motion.h2>
      </motion.div>

      <div className="relative overflow-hidden py-6 md:py-10">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-bg z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-bg z-10 pointer-events-none" />

        <div className="marquee-track">
          <div className="flex gap-8 md:gap-16 lg:gap-24 items-center marquee-content">
            {Array.from({ length: 10 }).map((_, i) => {
              const partner = PARTNERS[i % PARTNERS.length];
              return (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center h-28 md:h-40 lg:h-44 px-10 md:px-16 lg:px-20 rounded-2xl bg-bg-card/40"
                >
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-h-16 md:max-h-24 lg:max-h-28 w-auto object-contain"
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
