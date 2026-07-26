import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconShield, IconTerminal, IconTarget } from '@/shared/components/icons';
import { Logo } from '@/shared/components/brand';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const bullets = [
  { icon: IconTerminal, text: 'Hands-on penetration testing labs' },
  { icon: IconShield, text: 'Real-world offensive security scenarios' },
  { icon: IconTarget, text: 'Capture the flag challenges & rankings' },
];

const AuthHero: React.FC = () => (
  <div className="hidden md:flex relative w-full min-h-dvh md:h-dvh overflow-hidden flex-col bg-bg" data-nav-invert>
    <GridBoxedBackground opacity={0.5} blur={0} mask="right" />

    {/* Back to Home — top-left */}
    <div className="absolute top-6 left-6 z-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
      >
        <IconArrowLeft size={16} /> Back to Home
      </Link>
    </div>

    {/* Grid content */}
    <div className="relative z-10 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center h-full">
      <div className="flex flex-col items-start justify-center px-3 md:px-4 lg:px-6 pt-20 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 space-y-0 w-full h-full">
        <div className="flex flex-col items-start w-full space-y-6 sm:space-y-8">
          <Logo size="md" variant="full" />

          <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full text-3xl sm:text-4xl md:text-5xl lg:text-[2.5rem] xl:text-[3rem]">
            Train like a <span className="text-accent">hacker</span>.<br />
            Become one.
          </h1>

          <p className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl">
            Africa&apos;s offensive security platform built to sharpen your skills
            from the ground up.
          </p>

          <ul className="flex flex-col gap-4">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex-none w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </span>
                <span className="text-text-primary text-sm sm:text-base font-bold">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden lg:block" />
    </div>
  </div>
);

export default AuthHero;
