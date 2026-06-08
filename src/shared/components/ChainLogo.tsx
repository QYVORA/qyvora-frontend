import React from 'react';

/**
 * QYVORA CHAIN — Logo Component
 *
 * variant="3d"   → 3D render (QYVORA-CHAIN-3D.webp)  — use in hero sections & large displays
 * variant="flat" → flat transparent PNG (QYVORA_CHAIN_LOGO.webp) — use inline & small sizes
 *
 * Usage:
 *   <ChainLogo />                          — default flat, 40×40
 *   <ChainLogo variant="3d" size={220} />  — 3D hero version
 *   <ChainLogo size={18} />                — small inline flat
 *   <ChainLogo showLabel />                — with "QYVORA CHAIN" wordmark
 */

interface ChainLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
  /** "3d" = 3D render for hero/large; "flat" = transparent PNG for small/inline (default) */
  variant?: '3d' | 'flat';
}

const LOGO_SRC: Record<'3d' | 'flat', string> = {
  '3d':   '/qyvora-full-logo.webp',
  'flat': '/qyvora-full-logo.webp',
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
