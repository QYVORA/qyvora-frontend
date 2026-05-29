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
    <div className={`relative flex items-center justify-center lg:justify-start ${className}`}>
      <img
        src="/ANANSI-LOGO.png"
        alt="ANANSI Intelligence"
        className="relative z-10 w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default AnansiHero;
