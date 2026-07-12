interface LabIconProps {
  className?: string;
}

export function PrivescIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="privesc-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#06B66F" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06B66F" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="privesc-shield" x1="32" y1="8" x2="32" y2="56">
          <stop offset="0%" stopColor="#06B66F" />
          <stop offset="100%" stopColor="#049A5C" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#privesc-bg)" />
      <path d="M32 10L14 20v16c0 12 8 20 18 24 10-4 18-12 18-24V20L32 10z"
        fill="url(#privesc-shield)" fillOpacity="0.2" stroke="url(#privesc-shield)" strokeWidth="2" />
      <path d="M24 38l8-20 8 20" stroke="#06B66F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 32h10" stroke="#06B66F" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 8v-4M30 10l2-4 2 4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="16" r="3" fill="#F59E0B" fillOpacity="0.6" />
      <path d="M44 16l4 0M46 14l0 4" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function PasswordIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="pass-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#pass-bg)" />
      <rect x="18" y="30" width="28" height="22" rx="4" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="2" />
      <path d="M26 30v-8a6 6 0 1112 0v8" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 30v-4a6 6 0 1112 0v4" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="32" cy="39" r="3" fill="#F59E0B" fillOpacity="0.6" />
      <path d="M32 42v4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <text x="42" y="22" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">$</text>
      <text x="12" y="26" fill="#06B66F" fontSize="6" fontFamily="monospace" opacity="0.4">a3f!</text>
      <circle cx="48" cy="44" r="6" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="1.5" />
      <path d="M46 44l3 3M49 44l-3 3" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function WebExploitIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="web-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06B66F" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#web-bg)" />
      <rect x="10" y="14" width="44" height="32" rx="4" stroke="#06B66F" strokeWidth="2" fill="#06B66F" fillOpacity="0.03" />
      <line x1="10" y1="24" x2="54" y2="24" stroke="#06B66F" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="15" cy="19" r="1.5" fill="#EF4444" fillOpacity="0.7" />
      <circle cx="20" cy="19" r="1.5" fill="#F59E0B" fillOpacity="0.7" />
      <circle cx="25" cy="19" r="1.5" fill="#06B66F" fillOpacity="0.7" />
      <text x="14" y="34" fill="#06B66F" fontSize="6" fontFamily="monospace" opacity="0.4">&lt;div&gt;</text>
      <text x="14" y="40" fill="#EF4444" fontSize="6" fontFamily="monospace" opacity="0.7">&lt;script&gt;</text>
      <path d="M36 30l10 12M46 30l-10 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="41" cy="36" r="9" stroke="#EF4444" strokeWidth="1.5" fill="#EF4444" fillOpacity="0.06" strokeDasharray="3 3" />
    </svg>
  );
}

export function SqlIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="sql-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#06B66F" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#sql-bg)" />
      <ellipse cx="32" cy="20" rx="14" ry="7" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="2" />
      <path d="M18 20v24c0 3.9 6.3 7 14 7s14-3.1 14-7V20" stroke="#3B82F6" strokeWidth="2" />
      <path d="M18 32c0 3.9 6.3 7 14 7s14-3.1 14-7" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M18 26c0 3.9 6.3 7 14 7s14-3.1 14-7" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="44" y1="16" x2="50" y2="42" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="44" r="4" fill="#EF4444" fillOpacity="0.15" stroke="#EF4444" strokeWidth="1.5" />
      <path d="M42 38l6-6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

export function PhishingIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="phish-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#phish-bg)" />
      <rect x="10" y="18" width="44" height="28" rx="3" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.04" />
      <path d="M10 21l22 14 22-14" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 38v10M32 48l-4-4M32 48l4-4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="40" r="2" fill="#EF4444" fillOpacity="0.7" />
      <path d="M26 44c2-3 4-4 6-4s4 1 6 4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="14" r="5" fill="#EF4444" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1.5" />
      <text x="45.5" y="17" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">!</text>
    </svg>
  );
}

export function ProxyIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="proxy-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#06B66F" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#proxy-bg)" />
      <circle cx="12" cy="32" r="6" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
      <circle cx="52" cy="32" r="6" fill="#06B66F" fillOpacity="0.15" stroke="#06B66F" strokeWidth="1.5" />
      <rect x="24" y="22" width="16" height="20" rx="3" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="2" />
      <path d="M18 32h6M40 32h6" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill="#F59E0B" fillOpacity="0.6" />
      <path d="M28 32h8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 28v8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <text x="27" y="50" fill="#F59E0B" fontSize="5" fontFamily="monospace" fontWeight="bold" opacity="0.6">MITM</text>
    </svg>
  );
}

export function TrafficIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="traffic-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#06B66F" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#traffic-bg)" />
      <path d="M8 44V30M13 44V22M18 44V34M23 44V18M28 44V28M33 44V14M38 44V24M43 44V20M48 44V30M53 44V26"
        stroke="#06B66F" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
      <circle cx="33" cy="14" r="3" fill="#EF4444" fillOpacity="0.5" />
      <circle cx="23" cy="18" r="2" fill="#F59E0B" fillOpacity="0.4" />
      <path d="M8 48h48" stroke="#06B66F" strokeWidth="1" strokeOpacity="0.2" />
      <circle cx="50" cy="12" r="4" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1" />
      <path d="M48 12h4M50 10v4" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function OsintIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="osint-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06B66F" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#osint-bg)" />
      <circle cx="28" cy="28" r="14" fill="#3B82F6" fillOpacity="0.06" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="28" cy="28" r="8" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="28" cy="28" r="3" fill="#3B82F6" fillOpacity="0.4" />
      <line x1="38" y1="38" x2="54" y2="54" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="16" cy="14" r="2" fill="#06B66F" fillOpacity="0.5" />
      <circle cx="46" cy="18" r="2" fill="#F59E0B" fillOpacity="0.5" />
      <circle cx="42" cy="48" r="2" fill="#EF4444" fillOpacity="0.5" />
      <path d="M18 16l8 10M44 20l-12 6" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />
      <text x="10" y="12" fill="#06B66F" fontSize="5" fontFamily="monospace" opacity="0.5">@</text>
      <text x="48" y="16" fill="#F59E0B" fontSize="5" fontFamily="monospace" opacity="0.5">#</text>
    </svg>
  );
}

export function WirelessIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="wifi-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#06B66F" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#wifi-bg)" />
      <path d="M32 44a3 3 0 100-6 3 3 0 000 6z" fill="#06B66F" fillOpacity="0.8" />
      <path d="M22 38c2.8-2.8 6.2-4 10-4s7.2 1.2 10 4" stroke="#06B66F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 32c4.4-4.4 9.8-6 16-6s11.6 1.6 16 6" stroke="#06B66F" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 26c5.6-5.6 12.4-8 22-8s16.4 2.4 22 8" stroke="#06B66F" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="32" cy="10" r="5" fill="#EF4444" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1.5" />
      <path d="M30 10l2 2 4-4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="40" y="14" fill="#F59E0B" fontSize="4" fontFamily="monospace" opacity="0.5">WPA2</text>
    </svg>
  );
}

export function KillChainIcon({ className = 'w-16 h-16' }: LabIconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="kill-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#kill-bg)" />
      <circle cx="32" cy="32" r="18" stroke="#EF4444" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="12" stroke="#EF4444" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
      <circle cx="32" cy="32" r="6" stroke="#EF4444" strokeWidth="1" fill="none" strokeOpacity="0.3" />
      <line x1="32" y1="8" x2="32" y2="56" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="8" y1="32" x2="56" y2="32" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="32" cy="32" r="3" fill="#EF4444" fillOpacity="0.8" />
      <circle cx="44" cy="18" r="4" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M42 18l4 0M44 16l0 4" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M20 44l4-4M24 44l-4-4" stroke="#06B66F" strokeWidth="1.5" strokeLinecap="round" />
      <text x="46" y="16" fill="#F59E0B" fontSize="4" fontFamily="monospace" opacity="0.4">01</text>
      <text x="8" y="48" fill="#06B66F" fontSize="4" fontFamily="monospace" opacity="0.4">05</text>
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
