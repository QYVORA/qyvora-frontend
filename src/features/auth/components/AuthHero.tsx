import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import HackerGlobe from '../../marketing/components/HackerGlobe';

const AuthHero: React.FC = () => (
  <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen relative flex-col justify-between overflow-hidden p-8 xl:p-12">
    <div className="absolute inset-0 dot-grid opacity-20 z-0" />

    {/* Globe - properly centered with responsive sizing */}
    <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none px-8">
      <div className="relative w-full h-full max-w-[420px] max-h-[420px] xl:max-w-[520px] xl:max-h-[520px] mx-auto my-auto">
        <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="w-full h-full"><HackerGlobe scale={0.95} /></div>
      </div>
    </div>

    {/* Back to Home — top-left */}
    <div className="relative z-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
    
    {/* Bottom spacer to push content up */}
    <div className="relative z-20 h-8" />
  </div>
);

export default AuthHero;
