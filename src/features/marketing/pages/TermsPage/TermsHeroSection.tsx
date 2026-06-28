import React from 'react';
import { motion } from 'motion/react';
import { termsData } from './termsData';

const TermsHeroSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-28 md:pt-24 lg:pt-28">
        <div className="max-w-4xl space-y-8 text-left w-full">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              TERMS <span className="text-accent">OF SERVICE</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
            By accessing or using QYVORA services you agree to these terms. Read them carefully
            before participating in any training, community, or professional engagement.
          </p>
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
      </div>
  );
};

export default TermsHeroSection;
export { TermsHeroSection };
