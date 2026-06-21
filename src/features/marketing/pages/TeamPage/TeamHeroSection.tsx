import React from 'react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';

const TeamHeroSection: React.FC = () => {
  return (
    <motion.div
      className="relative z-20 h-full max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 pb-12"
    >
      <div className="max-w-3xl lg:max-w-xl flex-shrink-0">
        <ScrollReveal>
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
          Meet the core developers, security researchers, and operators building QYVORA&apos;s offensive security ecosystem.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default TeamHeroSection;
export { TeamHeroSection };
