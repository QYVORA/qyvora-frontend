/**
 * QYVORA Custom Icon Set
 * Hacker-themed SVG icons matching the cybersecurity aesthetic
 * All icons use currentColor for easy theming
 */

import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const defaultProps = {
  size: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Dashboard Icon - Hex grid pattern
export const IconDashboard: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M3 4h7v7H3zM14 4h7v7h-7zM3 15h7v5H3zM14 15h7v5h-7z" />
    <circle cx="6.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="17.5" cy="7.5" r="0.5" fill="currentColor" />
    <circle cx="6.5" cy="17.5" r="0.5" fill="currentColor" />
    <circle cx="17.5" cy="17.5" r="0.5" fill="currentColor" />
  </svg>
);

// Bootcamp Icon - Terminal with code brackets
export const IconBootcamp: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M7 12l3 3-3 3" />
    <path d="M13 18h4" />
  </svg>
);

// Labs Icon - Flask with binary
export const IconLabs: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M9 3h6v7l5 9a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-9V3z" />
    <path d="M9 3v7M15 3v7" strokeWidth="2" />
    <text x="12" y="16" fontSize="6" textAnchor="middle" fill="currentColor" strokeWidth="0">01</text>
  </svg>
);

// CTF Icon - Flag on circuit board
export const IconCTF: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M4 21V4h6c2 0 3 1 3 3s-1 3-3 3H4" />
    <path d="M4 10h6" strokeWidth="2.5" />
    <circle cx="17" cy="6" r="0.5" fill="currentColor" />
    <circle cx="19" cy="8" r="0.5" fill="currentColor" />
    <circle cx="17" cy="10" r="0.5" fill="currentColor" />
    <circle cx="15" cy="8" r="0.5" fill="currentColor" />
    <path d="M15 14l6-2M17 16l4-1M16 18l5-1" strokeWidth="1" />
  </svg>
);

// Challenges Icon - Puzzle pieces with hex pattern
export const IconChallenges: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
    <path d="M10 7h4M7 10v4M17 10v4M14 17h4" strokeWidth="2" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="17" r="1" fill="currentColor" />
  </svg>
);

// Leaderboard Icon - Trophy with rank badge
export const IconLeaderboard: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M6 9H3v3c0 1.5 1 2.5 3 2.5M18 9h3v3c0 1.5-1 2.5-3 2.5" />
    <path d="M8 9v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9" />
    <path d="M10 5h4a2 2 0 0 1 2 2v2H8V7a2 2 0 0 1 2-2z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M12 13.5V15" strokeWidth="1.5" />
  </svg>
);

// Marketplace Icon - Shopping bag with code symbol
export const IconMarketplace: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M6 6h12l2 14H4L6 6z" />
    <path d="M8 6V5a4 4 0 0 1 8 0v1" />
    <path d="M10 12l2 2 2-2" />
    <path d="M12 14v-2" strokeWidth="1.5" />
    <circle cx="9" cy="16" r="0.5" fill="currentColor" />
    <circle cx="15" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

// Wallet Icon - Crypto wallet with CP symbol
export const IconWallet: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M3 8h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8z" />
    <path d="M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
    <path d="M17 14h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2" />
    <circle cx="18.5" cy="15.5" r="1" fill="currentColor" />
    <text x="9" y="15" fontSize="5" fontWeight="bold" fill="currentColor" strokeWidth="0">CP</text>
  </svg>
);

// Profile Icon - User with shield
export const IconProfile: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    <path d="M12 13v-1M10 16l2-1 2 1" strokeWidth="1" />
  </svg>
);

// Settings Icon - Gear with hex nut
export const IconSettings: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Lock Icon - Padlock with circuit lines
export const IconLock: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    <path d="M12 17.5V19" strokeWidth="1.5" />
    <circle cx="9" cy="19" r="0.5" fill="currentColor" />
    <circle cx="15" cy="19" r="0.5" fill="currentColor" />
  </svg>
);

// Unlock Icon - Open padlock
export const IconUnlock: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    <path d="M12 17.5V19" strokeWidth="1.5" />
  </svg>
);

// Terminal Icon - Command prompt
export const IconTerminal: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 9l4 3-4 3" />
    <path d="M13 15h5" strokeWidth="2" />
  </svg>
);

// Shield Icon - Security shield with checkmark
export const IconShield: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M12 3l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V6l8-3z" />
    <path d="M9 12l2 2 4-4" strokeWidth="2.5" />
  </svg>
);

// Badge Icon - Achievement badge with star
export const IconBadge: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="10" r="7" />
    <path d="M8 17l1 5 3-2 3 2 1-5" />
    <path d="M12 7l1.5 3 3 .5-2 2 .5 3-3-1.5L9 15.5l.5-3-2-2 3-.5L12 7z" fill="currentColor" strokeWidth="1" />
  </svg>
);

// Code Icon - Code brackets with dots
export const IconCode: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    <circle cx="12" cy="16" r="0.5" fill="currentColor" />
  </svg>
);

// Hack Icon - Skull with terminal eyes
export const IconHack: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M8 2h8a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-2v3l-2-1.5L10 24v-3H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
    <rect x="7" y="9" width="3" height="3" rx="0.5" />
    <rect x="14" y="9" width="3" height="3" rx="0.5" />
    <path d="M9 16h6" strokeWidth="1.5" />
  </svg>);

// Network Icon - Connected nodes
export const IconNetwork: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M12 7v10M7 12h10M10 8l-3 3M14 8l3 3M10 16l-3-3M14 16l3-3" strokeWidth="1.5" />
  </svg>
);

// Target Icon - Crosshair target
export const IconTarget: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeWidth="1.5" />
  </svg>
);

// Binary Icon - Binary code stream
export const IconBinary: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" strokeWidth="1" opacity="0.3" />
    <text x="3" y="8" fontSize="4" fill="currentColor" strokeWidth="0">1</text>
    <text x="7" y="12" fontSize="4" fill="currentColor" strokeWidth="0">0</text>
    <text x="11" y="7" fontSize="4" fill="currentColor" strokeWidth="0">1</text>
    <text x="15" y="15" fontSize="4" fill="currentColor" strokeWidth="0">1</text>
    <text x="19" y="10" fontSize="4" fill="currentColor" strokeWidth="0">0</text>
    <text x="3" y="16" fontSize="4" fill="currentColor" strokeWidth="0">0</text>
    <text x="7" y="19" fontSize="4" fill="currentColor" strokeWidth="0">1</text>
    <text x="11" y="18" fontSize="4" fill="currentColor" strokeWidth="0">0</text>
  </svg>
);

// Exploit Icon - Penetration arrow
export const IconExploit: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="3" y="8" width="14" height="10" rx="1" />
    <path d="M20 8l-4 4 4 4" strokeWidth="2.5" />
    <circle cx="6" cy="11" r="0.5" fill="currentColor" />
    <circle cx="8" cy="11" r="0.5" fill="currentColor" />
    <circle cx="10" cy="11" r="0.5" fill="currentColor" />
  </svg>
);

// Bug Icon - Software bug
export const IconBug: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M12 7a5 5 0 0 1 5 5v4a5 5 0 0 1-10 0v-4a5 5 0 0 1 5-5z" />
    <path d="M12 7V4M9 4h6M7 10H3M7 14H3M21 10h-4M21 14h-4" />
    <path d="M18 18l-2-2M6 18l2-2M18 6l-3 2M6 6l3 2" />
    <circle cx="10" cy="11" r="0.5" fill="currentColor" />
    <circle cx="14" cy="11" r="0.5" fill="currentColor" />
  </svg>
);

// Certificate Icon - Certificate with seal
export const IconCertificate: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <rect x="3" y="3" width="14" height="18" rx="1" />
    <path d="M6 7h8M6 11h8M6 15h5" strokeWidth="1.5" />
    <circle cx="19" cy="16" r="4" />
    <path d="M19 14v2l1.5 1.5" strokeWidth="1.5" />
    <path d="M18 20l1 3 2-1" />
  </svg>
);

// Clock Icon - Time/Progress
export const IconClock: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" strokeWidth="2" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

// Rank Icon - Military rank chevron
export const IconRank: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M4 8l8-4 8 4" strokeWidth="2.5" />
    <path d="M4 12l8-4 8 4" strokeWidth="2.5" />
    <path d="M4 16l8-4 8 4" strokeWidth="2.5" />
    <circle cx="12" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Fire Icon - Streak/Hot
export const IconFire: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M12 2c1 3 4 5 4 9 0 3-2 5-4 5s-4-2-4-5c0-2 1-3 2-4-1 0-2 1-2 3 0 2.5 1.5 4 3 5-2 0-4-2-4-5 0-4 2-6 5-8z" />
    <path d="M12 16c1.5 0 3 1.5 3 3.5S13.5 23 12 23s-3-1.5-3-3.5S10.5 16 12 16z" />
  </svg>
);

// Notification Icon - Bell with dot
export const IconNotification: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    <circle cx="18" cy="6" r="3" fill="currentColor" />
  </svg>
);

// Search Icon - Magnifying glass with hex
export const IconSearch: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" strokeWidth="2.5" />
    <path d="M11 8l-2 2 2 2M13 8l2 2-2 2" strokeWidth="1" />
  </svg>
);

// Star Icon - Favorite/Featured
export const IconStar: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16l-6.5 5 2-7.5L2 9h7l3-7z" />
  </svg>
);

// Heart Icon - Like/Favorite
export const IconHeart: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Download Icon - Download arrow
export const IconDownload: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 15V3" strokeWidth="2.5" />
  </svg>
);

// Upload Icon - Upload arrow
export const IconUpload: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5M12 3v12" strokeWidth="2.5" />
  </svg>
);

// Play Icon - Start/Play
export const IconPlay: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8l6 4-6 4V8z" fill="currentColor" strokeWidth="1" />
  </svg>
);

// Stop Icon - Stop/Pause
export const IconStop: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="9" width="6" height="6" fill="currentColor" strokeWidth="1" />
  </svg>
);

// Check Icon - Success/Complete
export const IconCheck: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-6" strokeWidth="2.5" />
  </svg>
);

// X Icon - Close/Delete
export const IconX: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8l8 8M16 8l-8 8" strokeWidth="2.5" />
  </svg>
);

// Plus Icon - Add/Create
export const IconPlus: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" strokeWidth="2.5" />
  </svg>
);

// Minus Icon - Remove/Subtract
export const IconMinus: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" strokeWidth="2.5" />
  </svg>
);

// Arrow Right Icon
export const IconArrowRight: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" />
  </svg>
);

// Arrow Left Icon
export const IconArrowLeft: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2.5" />
  </svg>
);

// Chevron Right Icon
export const IconChevronRight: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M9 18l6-6-6-6" strokeWidth="2.5" />
  </svg>
);

// Menu Icon - Hamburger menu
export const IconMenu: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2.5" />
  </svg>
);

// Eye Icon - View/Show
export const IconEye: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Eye Off Icon - Hide
export const IconEyeOff: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <path d="M1 1l22 22" strokeWidth="2" />
  </svg>
);

// Info Icon - Information
export const IconInfo: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" strokeWidth="2.5" />
  </svg>
);

// Warning Icon - Alert/Warning
export const IconWarning: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...defaultProps}
    {...props}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4M12 17h.01" strokeWidth="2.5" />
  </svg>
);

// Export default icon map for easy access
export const QyvoraIcons = {
  Dashboard: IconDashboard,
  Bootcamp: IconBootcamp,
  Labs: IconLabs,
  CTF: IconCTF,
  Challenges: IconChallenges,
  Leaderboard: IconLeaderboard,
  Marketplace: IconMarketplace,
  Wallet: IconWallet,
  Profile: IconProfile,
  Settings: IconSettings,
  Lock: IconLock,
  Unlock: IconUnlock,
  Terminal: IconTerminal,
  Shield: IconShield,
  Badge: IconBadge,
  Code: IconCode,
  Hack: IconHack,
  Network: IconNetwork,
  Target: IconTarget,
  Binary: IconBinary,
  Exploit: IconExploit,
  Bug: IconBug,
  Certificate: IconCertificate,
  Clock: IconClock,
  Rank: IconRank,
  Fire: IconFire,
  Notification: IconNotification,
  Search: IconSearch,
  Star: IconStar,
  Heart: IconHeart,
  Download: IconDownload,
  Upload: IconUpload,
  Play: IconPlay,
  Stop: IconStop,
  Check: IconCheck,
  X: IconX,
  Plus: IconPlus,
  Minus: IconMinus,
  ArrowRight: IconArrowRight,
  ArrowLeft: IconArrowLeft,
  ChevronRight: IconChevronRight,
  Menu: IconMenu,
  Eye: IconEye,
  EyeOff: IconEyeOff,
  Info: IconInfo,
  Warning: IconWarning,
};

export default QyvoraIcons;
