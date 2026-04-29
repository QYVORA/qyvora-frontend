import React from 'react';
/**
 * HSOCIETY CHAIN — Logo Component
 *
 * Uses the generated PNG logo by default.
 * Falls back to inline SVG for very small sizes.
 *
 * Usage:
 *   <ChainLogo />                    — default 40×40 PNG
 *   <ChainLogo size={64} />          — custom size
 *   <ChainLogo className="w-8 h-8" /> — Tailwind sizing
 *   <ChainLogo showLabel />          — with "HSOCIETY CHAIN" wordmark
 */

interface ChainLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

const ChainLogo: React.FC<ChainLogoProps> = ({
  size = 40,
  className = '',
  showLabel = false,
  labelClassName = '',
}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <img
      src="/images/HSOCIETY_CHAIN_LOGO.png"
      alt="HSOCIETY CHAIN"
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
        HSOCIETY CHAIN
      </span>
    )}
  </span>
);

export default ChainLogo;
