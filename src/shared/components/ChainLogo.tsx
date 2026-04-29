import React from 'react';

/**
 * HSOCIETY CHAIN — Logo Component
 *
 * A chain-link hexagon mark with the HSOCIETY aesthetic:
 * dark background, accent green glow, monospace feel.
 *
 * Usage:
 *   <ChainLogo />                    — default 40×40
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
}) => {
  const id = React.useId().replace(/:/g, '');

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HSOCIETY CHAIN"
        role="img"
      >
        <defs>
          {/* Accent green glow */}
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b7ff99" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#b7ff99" stopOpacity="0" />
          </radialGradient>

          {/* Inner hex fill */}
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d1a0d" />
            <stop offset="100%" stopColor="#0a120a" />
          </linearGradient>

          {/* Accent stroke gradient */}
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b7ff99" />
            <stop offset="100%" stopColor="#5aff5a" />
          </linearGradient>

          <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
          </filter>
        </defs>

        {/* Glow halo behind hex */}
        <circle cx="32" cy="32" r="28" fill={`url(#${id}-glow)`} />

        {/* Outer hexagon — border */}
        <polygon
          points="32,4 56,18 56,46 32,60 8,46 8,18"
          fill={`url(#${id}-fill)`}
          stroke={`url(#${id}-stroke)`}
          strokeWidth="1.5"
        />

        {/* Subtle inner hex ring */}
        <polygon
          points="32,10 51,21 51,43 32,54 13,43 13,21"
          fill="none"
          stroke="#b7ff99"
          strokeWidth="0.4"
          strokeOpacity="0.2"
        />

        {/* Chain link — left oval */}
        <ellipse
          cx="22"
          cy="32"
          rx="7"
          ry="4.5"
          fill="none"
          stroke="#b7ff99"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform="rotate(-35 22 32)"
        />

        {/* Chain link — right oval (offset, interlocked) */}
        <ellipse
          cx="42"
          cy="32"
          rx="7"
          ry="4.5"
          fill="none"
          stroke="#b7ff99"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform="rotate(-35 42 32)"
        />

        {/* Connecting bar between links */}
        <line
          x1="27"
          y1="29"
          x2="37"
          y2="35"
          stroke="#b7ff99"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Accent dot — top right corner */}
        <circle cx="50" cy="14" r="2.5" fill="#b7ff99" opacity="0.8" />

        {/* Hash mark — bottom left, subtle */}
        <text
          x="10"
          y="52"
          fontFamily="monospace"
          fontSize="6"
          fill="#b7ff99"
          fillOpacity="0.4"
          fontWeight="bold"
        >
          #
        </text>
      </svg>

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
};

export default ChainLogo;
