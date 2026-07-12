interface LabIconProps {
  className?: string;
}

export function PrivescIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="privesc-gold" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="shield-grad" x1="64" y1="28" x2="64" y2="98">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Outer metallic badge circle */}
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#privesc-gold)" strokeWidth="6" filter="url(#glow-shadow)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Main emblem: Green Shield */}
      <path d="M64 28L36 38v30c0 18 12 30 28 35 16-5 28-17 28-35V38L64 28z" fill="url(#shield-grad)" filter="url(#glow-shadow)" />
      {/* Cartoonish Upward Chevron representing elevation */}
      <path d="M64 42L44 60h12v22h16V60h12L64 42z" fill="#ffffff" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
      {/* Decorative Sparkles */}
      <circle cx="94" cy="36" r="3" fill="#FBBF24" />
      <circle cx="34" cy="88" r="2" fill="#FBBF24" />
    </svg>
  );
}

export function PasswordIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pass-copper" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="lock-body" x1="64" y1="52" x2="64" y2="98">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="drop-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#pass-copper)" strokeWidth="6" filter="url(#drop-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Padlock Shackle */}
      <path d="M44 58V44a20 20 0 1140 0v14" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" filter="url(#drop-sh)" />
      {/* Padlock Body */}
      <rect x="34" y="54" width="60" height="44" rx="10" fill="url(#lock-body)" stroke="#92400e" strokeWidth="3" filter="url(#drop-sh)" />
      {/* Cracked Keyhole representing cracking */}
      <path d="M64 66v10M64 76l-3 6h6l-3-6z" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#000" />
      <path d="M64 66l8-8M60 92l4-6" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function WebExploitIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="web-crimson" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="screen-grad" x1="64" y1="36" x2="64" y2="84">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <filter id="badge-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#web-crimson)" strokeWidth="6" filter="url(#badge-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Cartoon CRT Monitor */}
      <rect x="26" y="32" width="76" height="54" rx="8" fill="url(#screen-grad)" stroke="#4b5563" strokeWidth="4" filter="url(#badge-sh)" />
      <rect x="32" y="38" width="64" height="42" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="2" />
      {/* Monitor Stand */}
      <path d="M54 86l-6 16h32l-6-16H54z" fill="#4b5563" stroke="#374151" strokeWidth="2" />
      <rect x="42" y="100" width="44" height="6" rx="2" fill="#374151" />
      {/* Skull representation (exploit) inside screen */}
      <circle cx="64" cy="54" r="8" fill="#ef4444" />
      <rect x="60" y="58" width="8" height="6" rx="2" fill="#ef4444" />
      <circle cx="61" cy="54" r="2" fill="#000" />
      <circle cx="67" cy="54" r="2" fill="#000" />
      <line x1="62" y1="62" x2="62" y2="64" stroke="#000" strokeWidth="1.5" />
      <line x1="66" y1="62" x2="66" y2="64" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

export function SqlIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sql-cyan" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#06B66F" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="db-grad" x1="64" y1="30" x2="64" y2="98">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="sql-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#sql-cyan)" strokeWidth="6" filter="url(#sql-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Database Cylinders */}
      <g filter="url(#sql-sh)">
        <ellipse cx="64" cy="40" rx="26" ry="10" fill="url(#db-grad)" stroke="#0369a1" strokeWidth="3" />
        <path d="M38 40v16c0 5.5 11.6 10 26 10s26-4.5 26-10V40" fill="url(#db-grad)" stroke="#0369a1" strokeWidth="3" />
        <ellipse cx="64" cy="56" rx="26" ry="10" fill="#0284c7" stroke="#0369a1" strokeWidth="2" fillOpacity="0.3" />
        <path d="M38 56v16c0 5.5 11.6 10 26 10s26-4.5 26-10V56" fill="url(#db-grad)" stroke="#0369a1" strokeWidth="3" />
        <ellipse cx="64" cy="72" rx="26" ry="10" fill="#0284c7" stroke="#0369a1" strokeWidth="2" fillOpacity="0.3" />
      </g>
      {/* Glowing Green Injection Syringe */}
      <g filter="url(#sql-sh)">
        <path d="M86 36l12-12m-6-6l6 6" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        <rect x="76" y="32" width="8" height="24" rx="2" transform="rotate(-45 76 32)" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
        <line x1="72" y1="46" x2="60" y2="58" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function PhishingIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="phish-violet" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="envelope-grad" x1="64" y1="42" x2="64" y2="92">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="phish-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#phish-violet)" strokeWidth="6" filter="url(#phish-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Cartoon Envelope */}
      <rect x="28" y="44" width="72" height="46" rx="6" fill="url(#envelope-grad)" stroke="#475569" strokeWidth="3" filter="url(#phish-sh)" />
      <path d="M28 46l36 24 36-24" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
      {/* Sharp Red Hook piercing the envelope */}
      <path d="M64 24v50c0 8-6 12-12 12s-8-4-8-8" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" fill="none" filter="url(#phish-sh)" />
      <path d="M42 70l2 8-8-2" fill="#ef4444" />
      {/* Glowing Warning Alert */}
      <circle cx="94" cy="38" r="10" fill="#ef4444" filter="url(#phish-sh)" />
      <text x="91" y="45" fill="#ffffff" fontSize="18" fontFamily="Arial, sans-serif" fontWeight="bold">!</text>
    </svg>
  );
}

export function ProxyIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="proxy-emerald" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="proxy-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#proxy-emerald)" strokeWidth="6" filter="url(#proxy-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Connectors */}
      <path d="M34 64h60" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" strokeLinecap="round" />
      {/* Node Left (Source) */}
      <circle cx="34" cy="64" r="12" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" filter="url(#proxy-sh)" />
      <circle cx="34" cy="64" r="4" fill="#fff" />
      {/* Node Right (Destination) */}
      <circle cx="94" cy="64" r="12" fill="#10b981" stroke="#047857" strokeWidth="3" filter="url(#proxy-sh)" />
      <circle cx="94" cy="64" r="4" fill="#fff" />
      {/* Intercepting Proxy / Lens */}
      <rect x="52" y="44" width="24" height="40" rx="6" fill="#f59e0b" fillOpacity="0.2" stroke="#d97706" strokeWidth="3" filter="url(#proxy-sh)" />
      <circle cx="64" cy="64" r="6" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

export function TrafficIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="traffic-lime" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="traffic-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#traffic-lime)" strokeWidth="6" filter="url(#traffic-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Radar screen grids */}
      <circle cx="64" cy="64" r="36" stroke="#4d7c0f" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="64" cy="64" r="22" stroke="#4d7c0f" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="64" cy="64" r="10" stroke="#4d7c0f" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="64" y1="20" x2="64" y2="108" stroke="#4d7c0f" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="20" y1="64" x2="108" y2="64" stroke="#4d7c0f" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Radar Sweep Line */}
      <line x1="64" y1="64" x2="92" y2="40" stroke="#84cc16" strokeWidth="3.5" strokeLinecap="round" filter="url(#traffic-sh)" />
      {/* Glowing Signals */}
      <circle cx="86" cy="48" r="4" fill="#ea580c" filter="url(#traffic-sh)" />
      <circle cx="48" cy="76" r="3" fill="#84cc16" filter="url(#traffic-sh)" />
    </svg>
  );
}

export function OsintIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="osint-sky" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="osint-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#osint-sky)" strokeWidth="6" filter="url(#osint-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Globe grid */}
      <circle cx="60" cy="56" r="26" stroke="#4338ca" strokeWidth="2" strokeOpacity="0.5" />
      <ellipse cx="60" cy="56" rx="26" ry="10" stroke="#4338ca" strokeWidth="1.5" strokeOpacity="0.4" />
      <ellipse cx="60" cy="56" rx="10" ry="26" stroke="#4338ca" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Cartoon Magnifying Glass looking at globe */}
      <g filter="url(#osint-sh)">
        <line x1="76" y1="72" x2="102" y2="98" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
        <line x1="78" y1="74" x2="98" y2="94" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="68" cy="64" r="16" fill="#38bdf8" fillOpacity="0.25" stroke="#e2e8f0" strokeWidth="4" />
        <path d="M58 56a12 12 0 0116 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      </g>
    </svg>
  );
}

export function WirelessIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wifi-amber" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="wifi-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#wifi-amber)" strokeWidth="6" filter="url(#wifi-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Glowing wireless waves */}
      <g filter="url(#wifi-sh)">
        <path d="M32 46a44 44 0 0164 0" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <path d="M42 56a28 28 0 0144 0" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M52 66a12 12 0 0124 0" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <circle cx="64" cy="76" r="5" fill="#fff" />
      </g>
      {/* Heavy Locked Badge overlay */}
      <g filter="url(#wifi-sh)">
        <rect x="80" y="70" width="22" height="18" rx="4" fill="#10b981" stroke="#047857" strokeWidth="2" />
        <path d="M85 70v-5a6 6 0 1112 0v5" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function KillChainIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 128 128" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kill-target" x1="0" y1="0" x2="128" y2="128">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        <filter id="kill-sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx="64" cy="64" r="56" fill="#0f172a" stroke="url(#kill-target)" strokeWidth="6" filter="url(#kill-sh)" />
      <circle cx="64" cy="64" r="48" fill="#1e293b" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.05" />
      {/* Target Reticles */}
      <circle cx="64" cy="64" r="32" stroke="#dc2626" strokeWidth="3" fill="none" filter="url(#kill-sh)" />
      <circle cx="64" cy="64" r="18" stroke="#dc2626" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      <circle cx="64" cy="64" r="6" fill="#dc2626" />
      {/* crosshair lines */}
      <line x1="64" y1="20" x2="64" y2="108" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="64" x2="108" y2="64" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      {/* Small glowing targets */}
      <circle cx="38" cy="38" r="4" fill="#fbbf24" filter="url(#kill-sh)" />
      <circle cx="88" cy="80" r="4" fill="#fbbf24" filter="url(#kill-sh)" />
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
