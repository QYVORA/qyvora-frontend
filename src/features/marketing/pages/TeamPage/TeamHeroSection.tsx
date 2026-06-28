import React from 'react';
import { motion } from 'motion/react';

const TeamHeroSection: React.FC = () => {
  return (
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full min-h-[85svh] md:min-h-screen flex items-center pt-28 md:pt-24 lg:pt-40">
        <div className="max-w-4xl space-y-8 text-left w-full">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              THE <span className="text-accent">TEAM</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
            Meet the core developers, security researchers, and operators building QYVORA&apos;s offensive security ecosystem.
          </p>
        </div>
      </div>
  );
};

export default TeamHeroSection;
export { TeamHeroSection };
