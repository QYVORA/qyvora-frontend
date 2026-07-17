import React from 'react';
import { Zap } from 'lucide-react';
import { IconDownload } from '@/shared/components/icons';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const AnansiHeroSection: React.FC = () => {
  return (
    <PublicHeroSection mask="none" rightContent={
      <div className="relative hidden lg:flex items-center justify-center w-full h-full">
        <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center p-8">
          <img
            src={anansiLogo}
            alt="Anansi CLI"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    }>
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          ANANSI <span className="text-bg/80">CLI</span>
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        Terminal-first attack surface intelligence engine built for speed, portability, and raw technical signal.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <a
          href="#install"
          className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap"
        >
          <IconDownload size={16} /> Get Binary
        </a>
        <a
          href="https://github.com/QYVORA/qyvora-anansi-cli"
          target="_blank"
           rel="noopener noreferrer"
          className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 text-center whitespace-nowrap"
        >
          <Zap className="w-4 h-4 inline-block mr-2" /> View Source
        </a>
      </div>
    </PublicHeroSection>
  );
};

export default AnansiHeroSection;
export { AnansiHeroSection };
