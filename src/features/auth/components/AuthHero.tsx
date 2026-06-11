import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import HackerGlobe from '../../marketing/components/HackerGlobe';

const AuthHero: React.FC = () => (
  <div className="hidden md:flex md:sticky md:top-0 md:h-screen relative flex-col justify-between overflow-hidden p-8 xl:p-12">
    {/* Background ambient glow - smoother than dot-grid for this area */}
    <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent z-0" />

    {/* Globe - properly centered with responsive sizing */}
    <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none px-8">
      <div className="relative w-full h-full max-w-[420px] max-h-[420px] xl:max-w-[520px] xl:max-h-[520px] mx-auto my-auto flex items-center justify-center">
        <div className="absolute w-[140%] h-[140%] rounded-full bg-accent/[0.05] blur-[120px] pointer-events-none" />
        <div className="w-full h-full"><HackerGlobe scale={1.2} /></div>
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
