import React from 'react';
import { Link } from 'react-router-dom';
import { IconPlay } from '@/shared/components/icons';
import chatGptImage from '@/assets/bootcamp/ChatGPT Image Jul 6, 2026, 12_54_02 AM.webp';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const LearnHeroSection: React.FC = () => {
  return (
    <PublicHeroSection mask="none" rightContent={
      <div className="relative hidden lg:flex items-center justify-center w-full h-full">
        <div className="relative z-10 w-full max-w-[95%] flex items-center justify-center">
          <img
            src={chatGptImage}
            alt="ChatGPT Bootcamp"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    }>
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          Hacker Protocol{' '}
          <span className="text-bg/80">Bootcamp</span>
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        Master offensive security through hands-on challenges that transform you into a specialized operator.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link
          to="/register"
          className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap"
        >
          <IconPlay size={16} className="fill-current" /> Start Training
        </Link>
        <a
          href="#phases"
          className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 text-center whitespace-nowrap"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('phases');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Explore Phases
        </a>
      </div>
    </PublicHeroSection>
  );
};

export default LearnHeroSection;
export { LearnHeroSection };
