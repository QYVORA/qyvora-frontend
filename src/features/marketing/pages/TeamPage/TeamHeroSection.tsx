import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const TeamHeroSection: React.FC = () => {
  return (
    <PublicHeroSection showGlobe mask="right">
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          THE <span className="text-bg/80">TEAM</span>
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        Meet the core developers, security researchers, and operators building QYVORA&apos;s offensive security ecosystem.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
          Start Training <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PublicHeroSection>
  );
};

export default TeamHeroSection;
export { TeamHeroSection };
