import React from 'react';

interface AnansiLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  minimal?: boolean;
}

const LOGO_SRC = '/assets/branding/logos/anansi-logo.webp';

/**
 * AnansiLogo
 * ─────────────────────────────────────────────────────────────────────────────
 * Clean, high-fidelity brand icon.
 * Removed all decorative glows, borders, and background fills per system update.
 * Prioritizes raw visual identity and clear lines.
 */
const AnansiLogo: React.FC<AnansiLogoProps> = ({
  size = 64,
  className = '',
  showLabel = false,
}) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div 
      className="relative flex items-center justify-center group"
      style={{ width: size, height: size }}
    >
      <img
        src={LOGO_SRC}
        alt="ANANSI"
        className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
        draggable={false}
      />
    </div>
    
    {showLabel && (
      <div className="flex flex-col">
        <span className="font-mono font-black uppercase tracking-[0.4em] text-cyan-500 text-xl leading-none">
          ANANSI
        </span>
        <span className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] mt-1">
          Asset Intelligence
        </span>
      </div>
    )}
  </div>
);

export default AnansiLogo;
