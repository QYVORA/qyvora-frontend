import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const AuthHero: React.FC = () => (
  <div className="hidden md:flex relative w-full min-h-dvh md:h-dvh flex-col bg-bg" data-nav-invert>
    <GridBoxedBackground blur={0} mask="right" />

    {/* Back to Home — top-left */}
    <div className="absolute top-6 left-6 z-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
      >
        <IconArrowLeft size={16} /> Back to Home
      </Link>
    </div>

  </div>
);

export default AuthHero;
