import React from 'react';

interface AnansiLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  minimal?: boolean;
}

const LOGO_SRC = '/ANANSI-LOGO.png';

const AnansiLogo: React.FC<AnansiLogoProps> = ({
  size = 64,
  className = '',
  showLabel = false,
  minimal = false,
}) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div 
      className={`relative flex items-center justify-center group ${minimal ? '' : 'rounded-2xl overflow-visible'}`}
      style={{ width: size, height: size }}
    >
      {!minimal && (
        <>
          {/* Dynamic Background Glow */}
          <div className="absolute inset-[-20%] bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors duration-500" />
          <div className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl backdrop-blur-sm" />
        </>
      )}
      
      <img
        src={LOGO_SRC}
        alt="ANANSI"
        className={`relative z-10 object-contain ${minimal ? 'w-full h-full' : 'w-[80%] h-[80%]'} transition-transform duration-500 group-hover:scale-110`}
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
