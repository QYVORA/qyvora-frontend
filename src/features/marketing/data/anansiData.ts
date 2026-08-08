import { Globe, FileCode, Cpu, Users, GitBranch, type LucideIcon } from 'lucide-react';
import { IconSearch, IconLock, IconShield, IconWarning } from '@/shared/components/icons';

export interface AnansiPhase {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<{ size?: number | string; className?: string }>;
  desc: string;
}

export const PHASES: AnansiPhase[] = [
  { id: '01', name: 'DISCOVERY', icon: IconSearch, desc: 'Subdomains via crt.sh CT logs + DNS brute-force wordlist' },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts — status codes, servers, redirect chains, titles' },
  { id: '03', name: 'TLS', icon: IconLock, desc: 'Certificate expiry, SANs, protocol version, cipher, self-signed detection' },
  { id: '04', name: 'HEADERS', icon: IconShield, desc: 'Missing security headers and CORS misconfigurations' },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), configs, admin panels, backups, API docs' },
  { id: '06', name: 'TECH-STACK', icon: Cpu, desc: 'Deep audit of detected platforms — version detection, WordPress plugins/themes, XML-RPC, user enumeration, config backups, known-vulnerable version matching' },
  { id: '07', name: 'TAKEOVER', icon: IconWarning, desc: 'Dangling CNAMEs pointing to unclaimed cloud services' },
  { id: '08', name: 'OSINT', icon: Users, desc: 'Emails, phone numbers, employees, WHOIS registrant data' },
  { id: '09', name: 'CHAIN', icon: GitBranch, desc: 'Assembles findings into multi-step exploit paths (low → high → critical) with per-step exploitation techniques' },
];

export interface AnansiRelease {
  id: string;
  label: string;
  arch: string;
  file: string;
  size: string;
}

const BASE = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';

export const RELEASES: AnansiRelease[] = [
  { id: 'linux-amd64', label: 'Linux', arch: 'x86_64', file: 'anansi-linux-amd64', size: '~10.0 MB' },
  { id: 'linux-arm64', label: 'Linux', arch: 'ARM64', file: 'anansi-linux-arm64', size: '~9.3 MB' },
  { id: 'macos-amd64', label: 'macOS', arch: 'Intel', file: 'anansi-macos-amd64', size: '~10.2 MB' },
  { id: 'macos-arm64', label: 'macOS', arch: 'Apple Silicon', file: 'anansi-macos-arm64', size: '~9.6 MB' },
  { id: 'windows-amd64', label: 'Windows', arch: 'x86_64', file: 'anansi-windows-amd64.exe', size: '~10.3 MB' },
];

export const ONE_LINER = 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi-cli/main/install.sh | bash';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.22+ and an active internet connection.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-anansi-cli' },
    { cmd: 'cd qyvora-anansi-cli' },
    { cmd: './install.sh', note: 'Auto-detects your OS/arch, downloads the checksum-verified binary, or falls back to building from source. Installs to ~/.local/bin and adds it to your shell config.' },
  ],
};

export const USAGE_EXAMPLES = [
  'anansi target.com',
  'anansi target.com --deep',
  'anansi target.com -v',
  'anansi target.com --modules discovery,tls,takeover',
  'anansi target.com --out json > results.json',
];

export const SCAN_OUTPUT: { label: string; text: string }[] = [
  { label: 'discovery', text: '312 subdomains resolved via crt.sh + brute-force' },
  { label: 'probe', text: '48 live hosts — status codes and titles extracted' },
  { label: 'tls', text: '3 SANs mapped · weak protocol flagged' },
  { label: 'headers', text: '12 security header misconfigurations found' },
  { label: 'paths', text: '.env exposed · backup archive discoverable' },
  { label: 'tech', text: 'WordPress 6.x detected · known-vulnerable plugin flagged' },
  { label: 'takeover', text: '1 dangling CNAME pointing to AWS S3' },
  { label: 'chain', text: '2 exploit paths assembled · Critical: 3 · High: 7' },
];
