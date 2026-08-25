import React from 'react';

interface LabBadgeProps {
  labId: string;
  accentColor?: string;
  className?: string;
}

const BADGE_BG = '#0c1222';
const BADGE_BG_INNER = '#080e1a';

/**
 * Generates tick-mark SVG elements radiating outward at regular angular intervals.
 * Creates a compass/scope-like aesthetic around the badge ring.
 */
function TickMarks({ color }: { color: string }) {
  const ticks = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const angle = (i * 360) / count;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const innerR = isMajor ? 89 : 91;
    const outerR = 95;
    const x1 = 100 + innerR * Math.cos(rad);
    const y1 = 100 + innerR * Math.sin(rad);
    const x2 = 100 + outerR * Math.cos(rad);
    const y2 = 100 + outerR * Math.sin(rad);
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={isMajor ? 1.8 : 0.8}
        opacity={isMajor ? 0.7 : 0.35}
        strokeLinecap="round"
      />
    );
  }
  return <>{ticks}</>;
}

/* ── Privesc Illustration — Shield with upward escalation arrow ──────────── */
const PrivescIllustration: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M50 12 L78 26 L78 54 Q78 76 50 92 Q22 76 22 54 L22 26 Z" fill="#FBBF24" stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M50 18 L74 30 L74 53 Q74 72 50 86 Q26 72 26 53 L26 30 Z" fill="#1a1a2e" />
    <path d="M50 28 L66 44 L58 44 L58 64 L42 64 L42 44 L34 44 Z" fill="#FBBF24" />
    <path d="M50 38 L58 44 L58 56 L42 56 L42 44 Z" fill="#FDE68A" opacity="0.7" />
    <circle cx="50" cy="72" r="3" fill="#FBBF24" opacity="0.5" />
    <line x1="50" y1="76" x2="50" y2="82" stroke="#FBBF24" strokeWidth="1.5" opacity="0.4" />
  </svg>
);

/* ── Passwords Illustration — Key with hash/mask symbols ────────────────── */
const PasswordsIllustration: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle cx="34" cy="40" r="16" fill="none" stroke="#F59E0B" strokeWidth="4" />
    <circle cx="34" cy="40" r="8" fill="#F59E0B" />
    <circle cx="34" cy="40" r="4" fill="#1a1a2e" />
    <rect x="48" y="36" width="38" height="8" rx="1" fill="#F59E0B" />
    <rect x="62" y="30" width="4" height="20" rx="1" fill="#F59E0B" />
    <rect x="74" y="32" width="4" height="16" rx="1" fill="#F59E0B" />
    <text x="70" y="20" fill="#FDE68A" fontSize="10" fontFamily="monospace" textAnchor="middle" opacity="0.6">*</text>
    <text x="82" y="24" fill="#FDE68A" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.4">*</text>
    <text x="88" y="18" fill="#FDE68A" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.3">*</text>
    <text x="24" y="72" fill="#F59E0B" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.5">0x</text>
    <text x="50" y="80" fill="#F59E0B" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.3">a3f</text>
  </svg>
);

/* ── SQL Injection Illustration — Database cylinder with syringe ─────────── */
const SqlInjectionIllustration: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <ellipse cx="52" cy="28" rx="24" ry="10" fill="#06B66F" />
    <ellipse cx="52" cy="28" rx="24" ry="10" fill="#0c1222" stroke="#06B66F" strokeWidth="2" />
    <path d="M28 28 L28 62 Q28 72 52 72 Q76 72 76 62 L76 28" fill="#059669" stroke="#06B66F" strokeWidth="2" />
    <ellipse cx="52" cy="62" rx="24" ry="10" fill="#06B66F" />
    <line x1="28" y1="40" x2="76" y2="40" stroke="#0c1222" strokeWidth="1.5" opacity="0.5" />
    <line x1="28" y1="52" x2="76" y2="52" stroke="#0c1222" strokeWidth="1.5" opacity="0.5" />
    <rect x="74" y="42" width="18" height="4" rx="1" fill="#A7F3D0" transform="rotate(-30 74 44)" />
    <circle cx="90" cy="36" r="3" fill="#A7F3D0" opacity="0.6" />
    <line x1="86" y1="38" x2="82" y2="48" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

/* ── OSINT Illustration — Magnifying glass with network nodes ───────────── */
const OsintIllustration: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <circle cx="42" cy="40" r="22" fill="none" stroke="#0EA5E9" strokeWidth="4" />
    <circle cx="42" cy="40" r="18" fill="#1a1a2e" stroke="#0EA5E9" strokeWidth="1" opacity="0.5" />
    <line x1="58" y1="56" x2="78" y2="78" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
    <circle cx="34" cy="34" r="3" fill="#7DD3FC" />
    <circle cx="48" cy="30" r="2.5" fill="#BAE6FD" />
    <circle cx="40" cy="46" r="2" fill="#7DD3FC" opacity="0.7" />
    <circle cx="50" cy="42" r="1.5" fill="#BAE6FD" opacity="0.5" />
    <line x1="34" y1="34" x2="48" y2="30" stroke="#7DD3FC" strokeWidth="1" opacity="0.4" />
    <line x1="34" y1="34" x2="40" y2="46" stroke="#7DD3FC" strokeWidth="1" opacity="0.3" />
    <line x1="48" y1="30" x2="50" y2="42" stroke="#BAE6FD" strokeWidth="1" opacity="0.3" />
    <circle cx="82" cy="22" r="6" fill="none" stroke="#0EA5E9" strokeWidth="1" opacity="0.3" />
    <circle cx="82" cy="22" r="2" fill="#0EA5E9" opacity="0.4" />
    <line x1="82" y1="28" x2="82" y2="36" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
  </svg>
);

/* ── Kill Chain Illustration — Chain links with crosshair ───────────────── */
const KillChainIllustration: React.FC = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect x="18" y="38" width="24" height="14" rx="7" fill="none" stroke="#DC2626" strokeWidth="3.5" />
    <rect x="34" y="38" width="24" height="14" rx="7" fill="none" stroke="#EF4444" strokeWidth="3.5" />
    <rect x="50" y="38" width="24" height="14" rx="7" fill="none" stroke="#DC2626" strokeWidth="3.5" />
    <circle cx="50" cy="50" r="18" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
    <line x1="50" y1="28" x2="50" y2="72" stroke="#FCA5A5" strokeWidth="1" opacity="0.4" />
    <line x1="28" y1="50" x2="72" y2="50" stroke="#FCA5A5" strokeWidth="1" opacity="0.4" />
    <circle cx="50" cy="50" r="3" fill="#DC2626" />
    <circle cx="50" cy="50" r="6" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
  </svg>
);

/* ── Lab badge registry ──────────────────────────────────────────────────── */
const LAB_BADGE_CONFIG: Record<string, {
  ringColor: string;
  illustration: React.FC;
}> = {
  privesc:    { ringColor: '#FBBF24', illustration: PrivescIllustration },
  passwords:  { ringColor: '#F59E0B', illustration: PasswordsIllustration },
  sqli:       { ringColor: '#06B66F', illustration: SqlInjectionIllustration },
  osint:      { ringColor: '#0EA5E9', illustration: OsintIllustration },
  killchain:  { ringColor: '#DC2626', illustration: KillChainIllustration },
};

/**
 * Circular cybersecurity insignia badge for lab cards.
 *
 * Each lab receives a custom illustrated badge with the same structure
 * as CourseBadge for visual consistency:
 * thick colored outer ring with tick marks → secondary decorative ring →
 * dark circular interior → inner boundary → lab-specific illustration.
 */
const LabBadge: React.FC<LabBadgeProps> = ({ labId, accentColor, className = '' }) => {
  const config = LAB_BADGE_CONFIG[labId];
  if (!config) return null;

  const ringColor = accentColor || config.ringColor;
  const Illustration = config.illustration;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label="Lab badge"
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer thick ring — establishes the badge silhouette */}
        <circle cx="100" cy="100" r="94" stroke={ringColor} strokeWidth="12" fill="none" />

        {/* Tick marks — compass/scope aesthetic around the ring */}
        <TickMarks color={ringColor} />

        {/* Secondary decorative ring — thin, adds depth */}
        <circle cx="100" cy="100" r="85" stroke={ringColor} strokeWidth="1" fill="none" opacity="0.25" />

        {/* Dark circular interior — contrast field for the artwork */}
        <circle cx="100" cy="100" r="82" fill={BADGE_BG} />

        {/* Inner gradient ring — subtle radial depth */}
        <circle cx="100" cy="100" r="82" fill="none" stroke={BADGE_BG_INNER} strokeWidth="8" opacity="0.4" />

        {/* Inner boundary ring — separates outer structure from artwork */}
        <circle cx="100" cy="100" r="74" stroke={ringColor} strokeWidth="0.8" fill="none" opacity="0.3" />

        {/* Cardinal accent dots — N/S/E/W positions */}
        <circle cx="100" cy="16" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="100" cy="184" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="16" cy="100" r="2" fill={ringColor} opacity="0.55" />
        <circle cx="184" cy="100" r="2" fill={ringColor} opacity="0.55" />

        {/* Intercardinal accent dots — NE/SE/SW/NW */}
        <circle cx="33.5" cy="33.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="166.5" cy="33.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="33.5" cy="166.5" r="1.2" fill={ringColor} opacity="0.25" />
        <circle cx="166.5" cy="166.5" r="1.2" fill={ringColor} opacity="0.25" />

        {/* Subtle radial lines — structural detail at cardinal axes */}
        <line x1="100" y1="22" x2="100" y2="30" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="100" y1="170" x2="100" y2="178" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="22" y1="100" x2="30" y2="100" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />
        <line x1="170" y1="100" x2="178" y2="100" stroke={ringColor} strokeWidth="0.5" opacity="0.2" />

        {/* Inner arc accents — quarter-circle details at intercardinal positions */}
        <path d="M 60 60 A 40 40 0 0 1 74 48" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 140 60 A 40 40 0 0 0 126 48" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 60 140 A 40 40 0 0 0 74 152" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
        <path d="M 140 140 A 40 40 0 0 1 126 152" fill="none" stroke={ringColor} strokeWidth="0.6" opacity="0.15" />
      </svg>

      {/* Lab illustration — centered, with subtle glow for depth */}
      <div className="relative z-10 flex items-center justify-center w-[52%] h-[52%]">
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-md"
          style={{ backgroundColor: ringColor }}
        />
        <Illustration />
      </div>
    </div>
  );
};

export default LabBadge;
