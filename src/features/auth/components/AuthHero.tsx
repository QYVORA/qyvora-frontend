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
  <div className="hidden md:flex md:sticky md:top-0 md:h-screen relative flex-col justify-between overflow-hidden bg-accent p-8 xl:p-12" data-nav-invert>
    <GridBoxedBackground opacity={0.3} blur={0} mask="none" />

    {/* Back to Home — top-left */}
    <div className="relative z-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-bg rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
      >
        <IconArrowLeft size={16} /> Back to Home
      </Link>
    </div>

    {/* Centered content */}
    <div className="relative z-20 flex-1 flex flex-col items-start justify-center gap-10 max-w-md mx-auto w-full">
      <Logo size="xl" variant="full" color="#000000" />

      <p className="text-bg/80 text-sm font-bold leading-relaxed max-w-sm">
        Africa&apos;s offensive security platform built to sharpen your skills
        from the ground up.
      </p>

      <ul className="flex flex-col gap-4">
        {bullets.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <span className="flex-none w-9 h-9 rounded-xl bg-bg/10 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-bg" />
            </span>
            <span className="text-bg text-sm font-bold">{text}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="relative z-20 h-8" />
  </div>
);

export default AuthHero;
