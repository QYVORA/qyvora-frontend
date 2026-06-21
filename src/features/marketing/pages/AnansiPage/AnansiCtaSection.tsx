import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';

const AnansiCtaSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-20 md:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center w-full">
        <div className="max-w-2xl space-y-8">
          <SimpleHeading text="Own the Perimeter" align="left" className="mb-0" />
          <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed">
            No web UI. No cloud account. No API keys.
            Just high-signal intelligence delivered straight to your terminal.
          </p>
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
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-4xl flex items-center justify-center lg:justify-end">
            <img
              src="/qyvora-single-logo.png"
              alt="Anansi CLI"
              className="relative z-10 w-full max-w-[400px] lg:max-w-[500px] h-auto block opacity-60"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnansiCtaSection;
export { AnansiCtaSection };
