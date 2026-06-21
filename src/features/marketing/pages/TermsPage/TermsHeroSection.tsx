import React from 'react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';
import { termsData } from './termsData';

const TermsHeroSection: React.FC = () => {
  return (
    <motion.div
      className="relative z-20 h-full max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-12 pt-32 pb-12"
    >
      <div className="max-w-3xl lg:max-w-xl flex-shrink-0">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4 lg:mb-3">
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
              Legal Documentation
            </span>
          </div>
          <SimpleHeading text="TERMS" align="left" className="mb-8" />
        </ScrollReveal>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-secondary text-sm sm:text-base md:text-lg max-w-lg mb-8 leading-relaxed opacity-80"
        >
          By accessing or using QYVORA services you agree to these terms. Read them carefully
          before participating in any training, community, or professional engagement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-6 text-[11px] font-mono text-text-muted uppercase tracking-[0.2em]"
        >
          {termsData.effectiveDate && (
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Effective: {termsData.effectiveDate}</span>
            </div>
          )}
          {termsData.lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Updated: {termsData.lastUpdated}</span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsHeroSection;
export { TermsHeroSection };
