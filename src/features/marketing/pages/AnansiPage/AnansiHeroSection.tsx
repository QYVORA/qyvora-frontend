import React from 'react';
import { Download, Zap } from 'lucide-react';

const AnansiHeroSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full min-h-[85svh] md:min-h-screen flex items-center pt-28 md:pt-24 lg:pt-28">
      <div className="max-w-4xl space-y-8 text-left w-full">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
            ANANSI <span className="text-accent">CLI</span>
          </h1>
        </div>
        <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
          Terminal-first attack surface intelligence engine. Built for speed, portability, and raw technical signal.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href="#install"
              className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
            >
              <Download className="w-4 h-4" /> Get Binary
            </a>
            <a
              href="https://github.com/QYVORA/qyvora-anansi-cli"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
            >
              <Zap className="w-4 h-4 inline-block mr-2" /> View Source
            </a>
          </div>
      </div>
    </div>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
