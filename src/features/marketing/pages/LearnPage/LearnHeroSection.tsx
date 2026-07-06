import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import chatGptImage from '@/assets/bootcamp/ChatGPT Image Jul 6, 2026, 12_54_02 AM.webp';

const LearnHeroSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-dvh md:min-h-screen flex flex-col pt-28 sm:pt-20 lg:pt-24">
      <div className="relative z-30 w-full flex-1 mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full w-full h-full">
          <div className="flex flex-col items-start justify-center pt-8 sm:pt-4 lg:pt-0 pb-14 sm:pb-16 lg:pb-16 w-full h-full lg:pr-8 xl:pr-12">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              Hacker Protocol <br />
              <span className="text-accent">Bootcamp</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-xl">
              Master offensive security through hands-on challenges.
              The HPB curriculum transforms you into a specialized operator.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
              >
                <Play className="w-4 h-4 fill-current" /> Start Training
              </Link>
              <a
                href="#phases"
                className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
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
          </div>
        </div>
        <div className="relative hidden lg:flex items-center justify-center w-full pt-20 xl:pt-24">
          <div className="relative z-10 w-full max-w-[95%] flex items-center justify-center">
            <img
              src={chatGptImage}
              alt="ChatGPT Bootcamp"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LearnHeroSection;
export { LearnHeroSection };
