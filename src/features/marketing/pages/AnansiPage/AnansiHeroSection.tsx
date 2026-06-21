import React from 'react';
import { motion } from 'motion/react';
import { Download, Zap } from 'lucide-react';

const AnansiHeroSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-0 lg:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl space-y-10"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-accent font-mono text-[10px] font-black uppercase tracking-[0.3em]">
              Available Now // v1.0.0
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[1.05]">
            ANANSI <span className="text-accent">CLI</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-2xl font-mono leading-relaxed">
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
    </div>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
