import React from 'react';
import logoSrc from '@/assets/branding/logos/qyvora-full-logo.webp';

interface ChainLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
  variant?: '3d' | 'flat';
}

const LOGO_SRC: Record<'3d' | 'flat', string> = {
  '3d':   logoSrc,
  'flat': logoSrc,
};

const ChainLogo: React.FC<ChainLogoProps> = ({
  size = 40,
  className = '',
  showLabel = false,
  labelClassName = '',
  variant = 'flat',
}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <img
      src={LOGO_SRC[variant]}
      alt="QYVORA CHAIN"
      width={size}
      height={size}
      className="object-contain inline-block align-middle"
      style={{ width: size, height: size }}
    />
    {showLabel && (
      <span
        className={`font-mono font-black uppercase tracking-widest text-accent ${labelClassName}`}
        style={{ fontSize: size * 0.28 }}
      >
        QYVORA CHAIN
      </span>
    )}
  </span>
);

export default ChainLogo;
