interface LabIconProps {
  className?: string;
}

export function PrivescIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity gold gradient for outer bevel */}
        <linearGradient id="privesc-gold-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#FDE047" />
          <stop offset="35%" stopColor="#CA8A04" />
          <stop offset="50%" stopColor="#FEF08A" />
          <stop offset="65%" stopColor="#854D0E" />
          <stop offset="85%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        {/* Reverse gradient for inner bevel to create 3D indentation */}
        <linearGradient id="privesc-gold-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#854D0E" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        {/* Shield Gradient */}
        <linearGradient id="shield-grad-new" x1="64" y1="28" x2="64" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        {/* Glow and Shadow Filters */}
        <filter id="badge-heavy-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-green" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>
      
      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#privesc-gold-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#090d16" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#privesc-gold-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#0f172a" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Shield contour crosshair markings */}
      <path d="M64 -2v5M64 133v5M6 42h5M117 42h5" stroke="#eab308" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Main Emblem: 3D-Look Emerald Shield */}
      <g filter="url(#neon-glow-green)">
        {/* Shield Outlines and Bevel */}
        <path d="M64 31 L38 41v26c0 16 11 28 26 33 15-5 26-17 26-33V41L64 31z" fill="url(#shield-grad-new)" stroke="#34D399" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Glossy Highlight on Shield */}
        <path d="M64 33 L41 42v23c0 10 6 18 16 23C61 81 64 61 64 33z" fill="#ffffff" fillOpacity="0.08" />
        {/* Golden Shield Rim */}
        <path d="M64 31 L38 41v26c0 16 11 28 26 33 15-5 26-17 26-33V41L64 31z" fill="none" stroke="url(#privesc-gold-outer)" strokeWidth="1" opacity="0.6"/>
      </g>

      {/* Upward Chevron representing elevation (glowing cyan-white) */}
      <g filter="url(#neon-glow-green)">
        <path d="M64 43L44 61h12v20h16V61h12L64 43z" fill="#ffffff" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
        {/* Inner glow path */}
        <path d="M64 46L49 59h10v18h10V59h10L64 46z" fill="#e6fffa" opacity="0.7"/>
      </g>

      {/* Decorative Sparkles and tech indicators */}
      <circle cx="94" cy="39" r="2.5" fill="#fde047" filter="url(#neon-glow-green)" />
      <circle cx="34" cy="91" r="1.5" fill="#fde047" />
      <line x1="90" y1="45" x2="98" y2="45" stroke="#fde047" strokeWidth="1" opacity="0.8"/>
      <line x1="94" y1="41" x2="94" y2="49" stroke="#fde047" strokeWidth="1" opacity="0.8"/>
    </svg>
  );
}

export function PasswordIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity copper/bronze gradient */}
        <linearGradient id="pass-copper-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#FB923C" />
          <stop offset="35%" stopColor="#C2410C" />
          <stop offset="50%" stopColor="#FFEDD5" />
          <stop offset="65%" stopColor="#7C2D12" />
          <stop offset="85%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="pass-copper-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#7C2D12" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        {/* Lock Body Gradient */}
        <linearGradient id="lock-body-grad" x1="64" y1="52" x2="64" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <filter id="badge-heavy-shadow-pwd" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-red" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-pwd)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#pass-copper-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#0d0a08" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#pass-copper-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#140f0c" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Shield contour detail */}
      <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.2" />

      {/* Padlock Shackle (Steel Chrome) */}
      <g filter="url(#badge-heavy-shadow-pwd)">
        <path d="M44 50V32a20 20 0 1140 0v18" stroke="url(#pass-copper-outer)" strokeWidth="8" strokeLinecap="round" />
        <path d="M44 50V32a20 20 0 1140 0v18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" opacity="0.3" />
      </g>

      {/* Padlock Body */}
      <g filter="url(#badge-heavy-shadow-pwd)">
        <rect x="34" y="46" width="60" height="42" rx="8" fill="url(#lock-body-grad)" stroke="#92400e" strokeWidth="2" />
        {/* Highlights on Lock Body */}
        <rect x="36" y="48" width="56" height="6" fill="#ffffff" fillOpacity="0.15" rx="3" />
        {/* Keyhole representing cracking */}
        <circle cx="64" cy="62" r="5" fill="#000000" />
        <path d="M64 66v12" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
        {/* Glitched/cracked overlay inside keyhole */}
        <path d="M64 62v16" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" filter="url(#neon-glow-red)" />
      </g>

      {/* Red laser/crack lines across lock */}
      <g filter="url(#neon-glow-red)">
        <path d="M38 80l16-16M70 62l20-20M52 78l6-6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        <circle cx="54" cy="72" r="1.5" fill="#ef4444" />
        <circle cx="70" cy="62" r="1.5" fill="#ef4444" />
      </g>
    </svg>
  );
}

export function WebExploitIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity crimson metal gradient */}
        <linearGradient id="web-crimson-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#F87171" />
          <stop offset="35%" stopColor="#B91C1C" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="65%" stopColor="#7F1D1D" />
          <stop offset="85%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="web-crimson-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#7F1D1D" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        {/* CRT Monitor gradient */}
        <linearGradient id="screen-grad-new" x1="64" y1="36" x2="64" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <filter id="badge-heavy-shadow-web" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-red-web" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* CRT scanline pattern inside screen */}
        <pattern id="crt-scanline-pat" width="4" height="2" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1" x2="4" y2="1" stroke="#000000" strokeWidth="0.8" opacity="0.4" />
        </pattern>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-web)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#web-crimson-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#140808" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#web-crimson-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#1c0f0f" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* CRT Monitor Base */}
      <g filter="url(#badge-heavy-shadow-web)">
        <path d="M54 82l-6 14h32l-6-16H54z" fill="#4b5563" stroke="#1f2937" strokeWidth="1.5" />
        <rect x="42" y="94" width="44" height="5" rx="2" fill="#1f2937" />
      </g>

      {/* Realistic CRT Monitor */}
      <g filter="url(#badge-heavy-shadow-web)">
        <rect x="24" y="28" width="80" height="56" rx="6" fill="url(#screen-grad-new)" stroke="#4b5563" strokeWidth="3" />
        {/* Glowing green console screen */}
        <rect x="29" y="33" width="70" height="46" rx="3" fill="#011c10" stroke="#10b981" strokeWidth="1.5" />
        {/* Scanlines overlay */}
        <rect x="29" y="33" width="70" height="46" rx="3" fill="url(#crt-scanline-pat)" pointer-events="none" />
      </g>

      {/* Skull representation (glowing red exploit) inside screen */}
      <g filter="url(#neon-glow-red-web)">
        {/* Skull Main Head */}
        <path d="M64 40 c-6 0-10 4-10 9 0 3 1.5 6 3 7.5L59 65h10l2-8.5c1.5-1.5 3-4.5 3-7.5 0-5-4-9-10-9z" fill="#ef4444" />
        {/* Skull Eyes */}
        <circle cx="60.5" cy="49" r="2" fill="#000" />
        <circle cx="67.5" cy="49" r="2" fill="#000" />
        {/* Teeth lines */}
        <line x1="61" y1="60" x2="61" y2="63" stroke="#000" strokeWidth="1.5" />
        <line x1="64" y1="60" x2="64" y2="63" stroke="#000" strokeWidth="1.5" />
        <line x1="67" y1="60" x2="67" y2="63" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* Glowing sparkles on the badge edges */}
      <circle cx="94" cy="36" r="2" fill="#ef4444" filter="url(#neon-glow-red-web)" />
    </svg>
  );
}

export function SqlIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity teal/cyan metal gradient */}
        <linearGradient id="sql-cyan-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#22D3EE" />
          <stop offset="35%" stopColor="#0891B2" />
          <stop offset="50%" stopColor="#ECFEFF" />
          <stop offset="65%" stopColor="#164E63" />
          <stop offset="85%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="sql-cyan-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#164E63" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        {/* Database stack cylinder gradient */}
        <linearGradient id="db-grad-new" x1="64" y1="30" x2="64" y2="98" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <filter id="badge-heavy-shadow-sql" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-green-sql" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-sql)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#sql-cyan-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#040b0d" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#sql-cyan-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#0a171a" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Database Cylinders Stack */}
      <g filter="url(#badge-heavy-shadow-sql)">
        {/* Bottom Cylinder */}
        <ellipse cx="64" cy="76" rx="24" ry="8" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <path d="M40 76v12c0 4.4 10.7 8 24 8s24-3.6 24-8V76" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <ellipse cx="64" cy="84" rx="24" ry="8" fill="#22d3ee" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
        
        {/* Middle Cylinder */}
        <ellipse cx="64" cy="58" rx="24" ry="8" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <path d="M40 58v12c0 4.4 10.7 8 24 8s24-3.6 24-8V58" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <ellipse cx="64" cy="66" rx="24" ry="8" fill="#22d3ee" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />

        {/* Top Cylinder */}
        <ellipse cx="64" cy="40" rx="24" ry="8" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <path d="M40 40v12c0 4.4 10.7 8 24 8s24-3.6 24-8V40" fill="url(#db-grad-new)" stroke="#0e7490" strokeWidth="1.5" />
        <ellipse cx="64" cy="48" rx="24" ry="8" fill="#22d3ee" fillOpacity="0.1" stroke="#06b6d4" strokeWidth="1" />
      </g>

      {/* Database Glowing Status LEDs */}
      <circle cx="48" cy="48" r="1.5" fill="#10b981" filter="url(#neon-glow-green-sql)" />
      <circle cx="48" cy="66" r="1.5" fill="#10b981" filter="url(#neon-glow-green-sql)" />
      <circle cx="48" cy="84" r="1.5" fill="#ef4444" filter="url(#neon-glow-cyan)" />

      {/* Glowing Green Syringe / SQL injection probe */}
      <g filter="url(#badge-heavy-shadow-sql)">
        {/* Syringe Plunger (silver) */}
        <path d="M84 34l10-10M88 26l5 5" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        {/* Syringe Tube */}
        <rect x="74" y="30" width="6" height="22" rx="1.5" transform="rotate(-45 74 30)" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
        {/* Glowing liquid volume ticks */}
        <line x1="82" y1="38" x2="80" y2="36" stroke="#10b981" strokeWidth="1" />
        <line x1="85" y1="41" x2="83" y2="39" stroke="#10b981" strokeWidth="1" />
        {/* Needle piercing top cylinder */}
        <line x1="70" y1="46" x2="58" y2="58" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" filter="url(#neon-glow-green-sql)" />
      </g>
    </svg>
  );
}

export function PhishingIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity fuchsia/violet metal gradient */}
        <linearGradient id="phish-violet-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#D946EF" />
          <stop offset="35%" stopColor="#7E22CE" />
          <stop offset="50%" stopColor="#FAE8FF" />
          <stop offset="65%" stopColor="#581C87" />
          <stop offset="85%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="phish-violet-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="50%" stopColor="#581C87" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        {/* Envelope metallic look gradient */}
        <linearGradient id="envelope-grad-new" x1="64" y1="42" x2="64" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="badge-heavy-shadow-ph" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-red-ph" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-ph)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#phish-violet-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#0c0412" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#phish-violet-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#140722" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Envelope (Visual target of phishing) */}
      <g filter="url(#badge-heavy-shadow-ph)">
        <rect x="28" y="39" width="72" height="46" rx="4" fill="url(#envelope-grad-new)" stroke="#475569" strokeWidth="2.5" />
        <path d="M28 41l36 24 36-24" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Digital layout line details on the envelope */}
        <line x1="36" y1="73" x2="60" y2="73" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="78" x2="50" y2="78" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Glowing Red Fishhook piercing the envelope */}
      <g filter="url(#neon-glow-red-ph)">
        {/* Curved hook stem */}
        <path d="M64 19v46c0 8-6 13-12 13s-9-4-9-9c0-6 5-10 10-10" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Arrowhead barb */}
        <path d="M51 63l5 6-9-1" fill="#ef4444" />
      </g>

      {/* Red Alert Badge overlay (top-right) */}
      <g filter="url(#badge-heavy-shadow-ph)">
        <circle cx="94" cy="33" r="11" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle cx="94" cy="33" r="11" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
        <text x="94" y="39" fill="#ffffff" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="black" textAnchor="middle">!</text>
      </g>
    </svg>
  );
}

export function ProxyIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity emerald metal gradient */}
        <linearGradient id="proxy-emerald-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#34D399" />
          <stop offset="35%" stopColor="#047857" />
          <stop offset="50%" stopColor="#E6F4EA" />
          <stop offset="65%" stopColor="#064E3B" />
          <stop offset="85%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="proxy-emerald-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        {/* Intercepting Lens Gradient */}
        <linearGradient id="lens-grad-new" x1="64" y1="44" x2="64" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="badge-heavy-shadow-px" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-amber-px" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-px)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#proxy-emerald-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#030c08" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#proxy-emerald-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#041a12" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Data flow connection lines */}
      <path d="M34 62h60" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" opacity="0.7" />

      {/* Left Source Node (Blue Glow) */}
      <g filter="url(#badge-heavy-shadow-px)">
        <circle cx="34" cy="62" r="11" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2.5" />
        <circle cx="34" cy="62" r="4" fill="#ffffff" />
      </g>

      {/* Right Dest Node (Green Glow) */}
      <g filter="url(#badge-heavy-shadow-px)">
        <circle cx="94" cy="62" r="11" fill="#10b981" stroke="#064e3b" strokeWidth="2.5" />
        <circle cx="94" cy="62" r="4" fill="#ffffff" />
      </g>

      {/* Center Intercepting Hexagonal Lens */}
      <g filter="url(#neon-glow-amber-px)">
        {/* Outer Glass Frame */}
        <polygon points="64,36 78,45 78,79 64,88 50,79 50,45" fill="url(#lens-grad-new)" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2.5" />
        {/* Reflective Center Prism */}
        <circle cx="64" cy="62" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        {/* Glare Highlights */}
        <path d="M53,47 L64,39 L64,62 L53,62 Z" fill="#ffffff" fillOpacity="0.1" />
      </g>

      {/* Floating packet signal details */}
      <circle cx="48" cy="62" r="2.5" fill="#f59e0b" filter="url(#neon-glow-amber-px)" />
      <circle cx="80" cy="62" r="2.5" fill="#ffffff" />
    </svg>
  );
}

export function TrafficIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity lime/green metal gradient */}
        <linearGradient id="traffic-lime-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#A3E635" />
          <stop offset="35%" stopColor="#4D7C0F" />
          <stop offset="50%" stopColor="#F7FEE7" />
          <stop offset="65%" stopColor="#365314" />
          <stop offset="85%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="traffic-lime-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="50%" stopColor="#365314" />
          <stop offset="100%" stopColor="#4D7C0F" />
        </linearGradient>
        <filter id="badge-heavy-shadow-tr" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-lime-tr" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Radar radar sweep wedge gradient */}
        <radialGradient id="radar-sweep-wedge" cx="64" cy="64" r="38" fx="64" fy="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-tr)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#traffic-lime-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#070a04" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#traffic-lime-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#0d1406" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#84cc16" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Sonar / Radar Screens */}
      <circle cx="64" cy="62" r="38" stroke="#365314" strokeWidth="2.5" opacity="0.6" />
      <circle cx="64" cy="62" r="26" stroke="#365314" strokeWidth="1.5" opacity="0.5" />
      <circle cx="64" cy="62" r="14" stroke="#365314" strokeWidth="1" opacity="0.4" />
      
      {/* Sonar Grids Lines */}
      <line x1="64" y1="24" x2="64" y2="100" stroke="#365314" strokeWidth="1.5" opacity="0.5" />
      <line x1="26" y1="62" x2="102" y2="62" stroke="#365314" strokeWidth="1.5" opacity="0.5" />
      <line x1="37.5" y1="35.5" x2="90.5" y2="88.5" stroke="#365314" strokeWidth="1" opacity="0.3" />
      <line x1="37.5" y1="88.5" x2="90.5" y2="35.5" stroke="#365314" strokeWidth="1" opacity="0.3" />

      {/* Glowing Sonar Sweep Radar Wedge */}
      <path d="M64 62 L90 36 A 38 38 0 0 1 102 62 Z" fill="url(#radar-sweep-wedge)" />
      
      {/* Sonar Sweep Line */}
      <g filter="url(#neon-glow-lime-tr)">
        <line x1="64" y1="62" x2="90" y2="36" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Targets Identified (glowing signals) */}
      <g filter="url(#neon-glow-lime-tr)">
        {/* Malicious host warning (orange-red glow) */}
        <circle cx="85" cy="46" r="4.5" fill="#f97316" />
        <circle cx="48" cy="78" r="3.5" fill="#84cc16" />
        <circle cx="52" cy="42" r="2.5" fill="#84cc16" />
      </g>
    </svg>
  );
}

export function OsintIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity sky/indigo metal gradient */}
        <linearGradient id="osint-sky-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#0369A1" />
          <stop offset="50%" stopColor="#F0F9FF" />
          <stop offset="65%" stopColor="#0C4A6E" />
          <stop offset="85%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="osint-sky-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0C4A6E" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        {/* Globe grids gradients */}
        <linearGradient id="globe-glow" x1="64" y1="36" x2="64" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <filter id="badge-heavy-shadow-os" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-sky" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-os)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#osint-sky-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#03090c" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#osint-sky-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#07151c" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Global coordinate wireframe (Globe Grid) */}
      <g filter="url(#badge-heavy-shadow-os)">
        <circle cx="58" cy="58" r="26" fill="#0ea5e9" fillOpacity="0.05" stroke="url(#globe-glow)" strokeWidth="2.5" />
        <ellipse cx="58" cy="58" rx="26" ry="9" stroke="url(#globe-glow)" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="58" cy="58" rx="9" ry="26" stroke="url(#globe-glow)" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* Target node indicators on the globe */}
      <circle cx="48" cy="48" r="2" fill="#ef4444" filter="url(#neon-glow-sky)" />
      <circle cx="68" cy="68" r="2" fill="#ef4444" filter="url(#neon-glow-sky)" />
      <line x1="48" y1="48" x2="68" y2="68" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />

      {/* Highly detailed futuristic Magnifying Glass */}
      <g filter="url(#badge-heavy-shadow-os)">
        {/* Solid handle with silver gradient */}
        <line x1="74" y1="74" x2="102" y2="102" stroke="url(#osint-sky-outer)" strokeWidth="7.5" strokeLinecap="round" />
        <line x1="77" y1="77" x2="99" y2="99" stroke="#0c4a6e" strokeWidth="2.5" strokeLinecap="round" />
        {/* Magnifying Ring */}
        <circle cx="66" cy="66" r="16" stroke="url(#osint-sky-outer)" strokeWidth="3" />
        {/* Glass lens shade (semi-transparent blue reflection) */}
        <circle cx="66" cy="66" r="14.5" fill="#38bdf8" fillOpacity="0.2" />
        <path d="M57 58a12 12 0 0115 0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      </g>
    </svg>
  );
}

export function WirelessIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity amber/gold metal gradient */}
        <linearGradient id="wifi-amber-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#FBBF24" />
          <stop offset="35%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#FEF3C7" />
          <stop offset="65%" stopColor="#78350F" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="wifi-amber-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="badge-heavy-shadow-wf" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-amber-wf" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-wf)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#wifi-amber-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#0c0803" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#wifi-amber-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#1b1207" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Tech radar/emissions circular coordinates */}
      <circle cx="64" cy="70" r="32" stroke="#78350f" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />

      {/* Glowing Wireless Wave Rings */}
      <g filter="url(#neon-glow-amber-wf)">
        <path d="M30 40a46 46 0 0168 0" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M40 50a30 30 0 0148 0" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M50 60a14 14 0 0128 0" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="64" cy="70" r="5.5" fill="#ffffff" />
      </g>

      {/* Heavy Security Padlock Overlay (bottom right representing WPA/WEP security) */}
      <g filter="url(#badge-heavy-shadow-wf)">
        {/* Silver Padlock Shackle */}
        <path d="M84 68v-6a5 5 0 0110 0v6" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Green Lock Body (secured state) */}
        <rect x="79" y="68" width="20" height="16" rx="3.5" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
        <circle cx="89" cy="75" r="2" fill="#047857" />
      </g>
    </svg>
  );
}

export function KillChainIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 -8 128 144" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* High-fidelity blood ruby / dark steel metal gradient */}
        <linearGradient id="kill-ruby-outer" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="15%" stopColor="#EF4444" />
          <stop offset="35%" stopColor="#7F1D1D" />
          <stop offset="50%" stopColor="#FEE2E2" />
          <stop offset="65%" stopColor="#450A0A" />
          <stop offset="85%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="kill-ruby-inner" x1="128" y1="128" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#450A0A" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
        <filter id="badge-heavy-shadow-kc" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="neon-glow-red-kc" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 3D Beveled Outer Shield Badge Ring */}
      <g filter="url(#badge-heavy-shadow-kc)">
        <path d="M64 -8 L128 10 V69 C128 104 100 124 64 136 C28 124 0 104 0 69 V10 Z" fill="url(#kill-ruby-outer)" />
        <path d="M64 -1 L122 15 V66 C122 98 96 116 64 127 C32 116 6 98 6 66 V15 Z" fill="#0f0202" />
        <path d="M64 3 L118 18 V65 C118 96 93 112 64 123 C35 112 10 96 10 65 V18 Z" fill="url(#kill-ruby-inner)" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="#1c0707" />
        <path d="M64 8 L112 21 V64 C112 92 90 108 64 116 C38 108 16 92 16 64 V21 Z" fill="none" stroke="#dc2626" strokeWidth="2" strokeOpacity="0.15" />
      </g>

      {/* Tactical Reticle Details */}
      <g filter="url(#badge-heavy-shadow-kc)">
        <circle cx="64" cy="62" r="34" stroke="#7f1d1d" strokeWidth="2.5" fill="none" />
        <circle cx="64" cy="62" r="20" stroke="#7f1d1d" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
        <circle cx="64" cy="62" r="6" fill="#dc2626" filter="url(#neon-glow-red-kc)" />
      </g>

      {/* Tactical Crosshair lines */}
      <line x1="64" y1="18" x2="64" y2="106" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="62" x2="108" y2="62" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Glowing indicators representing Kill Chain steps */}
      <g filter="url(#neon-glow-red-kc)">
        {/* Brackets */}
        <path d="M40 38h6v-6M40 86h6v6M88 38h-6v-6M88 86h-6v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Discovered vulnerabilities indicators */}
        <circle cx="48" cy="46" r="3.5" fill="#fde047" />
        <circle cx="80" cy="78" r="3.5" fill="#fde047" />
      </g>
    </svg>
  );
}

export const LAB_ICONS: Record<string, React.FC<LabIconProps>> = {
  privesc: PrivescIcon,
  passwords: PasswordIcon,
  webapp: WebExploitIcon,
  sqli: SqlIcon,
  phishing: PhishingIcon,
  proxy: ProxyIcon,
  traffic: TrafficIcon,
  osint: OsintIcon,
  wireless: WirelessIcon,
  killchain: KillChainIcon,
};
