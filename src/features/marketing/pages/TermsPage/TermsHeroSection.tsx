import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import { termsData } from './termsData';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const TermsHeroSection: React.FC = () => {
  return (
    <PublicHeroSection showGlobe mask="right">
      <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          TERMS <span className="text-accent">OF SERVICE</span>
        </span>
      </h1>
      <p className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        By accessing or using QYVORA services you agree to these terms before participating in any training, community, or professional engagement.
      </p>
      <div className="flex flex-wrap gap-6 text-[11px] font-mono text-text-muted uppercase tracking-[0.2em]">
        {termsData.effectiveDate && (
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>Effective: {termsData.effectiveDate}</span>
          </div>
        )}
        {termsData.lastUpdated && (
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>Updated: {termsData.lastUpdated}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
          Start Training <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PublicHeroSection>
  );
};

export default TermsHeroSection;
export { TermsHeroSection };
