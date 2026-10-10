import React from 'react';

/**
 * Privesc Lab Logo — Transparent shield with upward escalation arrow.
 */
export const PrivescLabIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Privilege Escalation Lab Insignia"
  >
    <path
      d="M50 12 L78 26 L78 54 Q78 76 50 92 Q22 76 22 54 L22 26 Z"
      fill="#FBBF24"
      stroke="#B8860B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M50 18 L74 30 L74 53 Q74 72 50 86 Q26 72 26 53 L26 30 Z" fill="#1a1a2e" />
    <path d="M50 28 L66 44 L58 44 L58 64 L42 64 L42 44 L34 44 Z" fill="#FBBF24" />
    <path d="M50 38 L58 44 L58 56 L42 56 L42 44 Z" fill="#FDE68A" opacity="0.7" />
    <circle cx="50" cy="72" r="3" fill="#FBBF24" opacity="0.5" />
    <line x1="50" y1="76" x2="50" y2="82" stroke="#FBBF24" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

/**
 * Passwords Lab Logo — Transparent key with hash & mask symbols.
 */
export const PasswordsLabIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Password Cracking Lab Insignia"
  >
    <circle cx="34" cy="40" r="16" fill="none" stroke="#F59E0B" strokeWidth="4" />
    <circle cx="34" cy="40" r="8" fill="#F59E0B" />
    <circle cx="34" cy="40" r="4" fill="#1a1a2e" />
    <rect x="48" y="36" width="38" height="8" rx="1" fill="#F59E0B" />
    <rect x="62" y="30" width="4" height="20" rx="1" fill="#F59E0B" />
    <rect x="74" y="32" width="4" height="16" rx="1" fill="#F59E0B" />
    <text x="70" y="20" fill="#FDE68A" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.8">*</text>
    <text x="82" y="24" fill="#FDE68A" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.6">*</text>
    <text x="88" y="18" fill="#FDE68A" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.5">*</text>
    <text x="24" y="72" fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">0x</text>
    <text x="50" y="80" fill="#F59E0B" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.5">a3f</text>
  </svg>
);

/**
 * SQL Injection Lab Logo — Transparent database cylinder with extraction syringe.
 */
export const SqlInjectionLabIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="SQL Injection Lab Insignia"
  >
    <ellipse cx="52" cy="28" rx="24" ry="10" fill="#06B66F" />
    <ellipse cx="52" cy="28" rx="24" ry="10" fill="#0c1222" stroke="#06B66F" strokeWidth="2" />
    <path d="M28 28 L28 62 Q28 72 52 72 Q76 72 76 62 L76 28" fill="#059669" stroke="#06B66F" strokeWidth="2" />
    <ellipse cx="52" cy="62" rx="24" ry="10" fill="#06B66F" />
    <line x1="28" y1="40" x2="76" y2="40" stroke="#0c1222" strokeWidth="1.5" opacity="0.5" />
    <line x1="28" y1="52" x2="76" y2="52" stroke="#0c1222" strokeWidth="1.5" opacity="0.5" />
    <rect x="74" y="42" width="18" height="4" rx="1" fill="#A7F3D0" transform="rotate(-30 74 44)" />
    <circle cx="90" cy="36" r="3" fill="#A7F3D0" opacity="0.8" />
    <line x1="86" y1="38" x2="82" y2="48" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.7" />
  </svg>
);

/**
 * OSINT Lab Logo — Transparent magnifying glass with network intelligence nodes.
 */
export const OsintLabIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="OSINT Recon Lab Insignia"
  >
    <circle cx="42" cy="40" r="22" fill="none" stroke="#0EA5E9" strokeWidth="4" />
    <circle cx="42" cy="40" r="18" fill="#1a1a2e" stroke="#0EA5E9" strokeWidth="1" opacity="0.5" />
    <line x1="58" y1="56" x2="78" y2="78" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
    <circle cx="34" cy="34" r="3" fill="#7DD3FC" />
    <circle cx="48" cy="30" r="2.5" fill="#BAE6FD" />
    <circle cx="40" cy="46" r="2" fill="#7DD3FC" opacity="0.8" />
    <circle cx="50" cy="42" r="1.5" fill="#BAE6FD" opacity="0.7" />
    <line x1="34" y1="34" x2="48" y2="30" stroke="#7DD3FC" strokeWidth="1" opacity="0.5" />
    <line x1="34" y1="34" x2="40" y2="46" stroke="#7DD3FC" strokeWidth="1" opacity="0.4" />
    <line x1="48" y1="30" x2="50" y2="42" stroke="#BAE6FD" strokeWidth="1" opacity="0.4" />
    <circle cx="82" cy="22" r="6" fill="none" stroke="#0EA5E9" strokeWidth="1" opacity="0.4" />
    <circle cx="82" cy="22" r="2" fill="#0EA5E9" opacity="0.6" />
    <line x1="82" y1="28" x2="82" y2="36" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
  </svg>
);

/**
 * Kill Chain Lab Logo — Transparent chain links with crosshair targeting reticle.
 */
export const KillChainLabIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Cyber Kill Chain Lab Insignia"
  >
    <rect x="18" y="38" width="24" height="14" rx="7" fill="none" stroke="#DC2626" strokeWidth="3.5" />
    <rect x="34" y="38" width="24" height="14" rx="7" fill="none" stroke="#EF4444" strokeWidth="3.5" />
    <rect x="50" y="38" width="24" height="14" rx="7" fill="none" stroke="#DC2626" strokeWidth="3.5" />
    <circle cx="50" cy="50" r="18" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
    <line x1="50" y1="28" x2="50" y2="72" stroke="#FCA5A5" strokeWidth="1" opacity="0.5" />
    <line x1="28" y1="50" x2="72" y2="50" stroke="#FCA5A5" strokeWidth="1" opacity="0.5" />
    <circle cx="50" cy="50" r="3" fill="#DC2626" />
    <circle cx="50" cy="50" r="6" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.7" />
  </svg>
);

export const LAB_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  privesc: PrivescLabIcon,
  passwords: PasswordsLabIcon,
  sqli: SqlInjectionLabIcon,
  'sql-injection': SqlInjectionLabIcon,
  osint: OsintLabIcon,
  killchain: KillChainLabIcon,
  'kill-chain': KillChainLabIcon,
};
