import React from 'react';
import { Download, Zap } from 'lucide-react';
import anansiLogo from '@/assets/anansi/anansi-main-logo.png';

const AnansiHeroSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col bg-accent" data-nav-invert>
      <div className="relative z-30 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
        <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-bg">
              ANANSI <span className="text-bg/80">CLI</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-bg/70 font-mono leading-relaxed max-w-xl">
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
                className="px-8 py-4 border border-bg/30 bg-bg/10 hover:bg-bg/20 rounded-xl text-xs font-black uppercase tracking-[0.15em] text-bg transition-all text-center"
              >
                <Zap className="w-4 h-4 inline-block mr-2" /> View Source
              </a>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:flex items-center justify-center w-full h-full pt-20 xl:pt-24">
          <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center p-8">
            <img
              src={anansiLogo}
              alt="Anansi CLI"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
