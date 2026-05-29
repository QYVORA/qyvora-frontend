import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AnansiHeroProps {
  className?: string;
}

const AnansiHero: React.FC<AnansiHeroProps> = ({ className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative flex items-center justify-center lg:justify-start w-full max-w-[560px] h-72 sm:h-80 md:h-[24rem] lg:h-[28rem] ${className}`}>
      {/* Ambient Glow */}
      <div className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 68%)' }}
        />
        <motion.img
          src="/ANANSI-LOGO.png"
          alt="ANANSI Intelligence"
          className="relative z-10 w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 0 48px rgba(6, 182, 212, 0.3))' }}
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default AnansiHero;
