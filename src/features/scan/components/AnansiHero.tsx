import React from 'react';

interface AnansiHeroProps {
  className?: string;
}

/**
 * AnansiHero
 * ─────────────────────────────────────────────────────────────────────────────
 * A static, high-resolution display of the Anansi logo.
 * All animations and glow effects removed for a clean, stable look.
 */
const AnansiHero: React.FC<AnansiHeroProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center lg:justify-start w-full max-w-[560px] h-72 sm:h-80 md:h-[24rem] lg:h-[28rem] ${className}`}>
      <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
        <img
          src="/ANANSI-LOGO.png"
          alt="ANANSI Intelligence"
          className="relative z-10 w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default AnansiHero;
