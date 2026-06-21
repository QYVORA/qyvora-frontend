import { Search, Globe, Lock, Shield, FileCode, AlertTriangle, type LucideIcon } from 'lucide-react';

export interface AnansiPhase {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  image: string;
}

export const PHASES: AnansiPhase[] = [
  { id: '01', name: 'DISCOVERY', icon: Search, desc: 'Subdomains via crt.sh CT logs + DNS brute-force', image: '/assets/anansi/discovery.webp' },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts, status codes, and titles', image: '/assets/anansi/probe.webp' },
  { id: '03', name: 'TLS', icon: Lock, desc: 'Certificate analysis, SANs, and protocol audit', image: '/assets/anansi/tls.webp' },
  { id: '04', name: 'HEADERS', icon: Shield, desc: 'Security headers and CORS misconfigurations', image: '/assets/anansi/headers.webp' },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), admin panels, and backups', image: '/assets/anansi/paths.webp' },
  { id: '06', name: 'TAKEOVER', icon: AlertTriangle, desc: 'Dangling CNAME detection for cloud services', image: '/assets/anansi/takeover.webp' },
];

export const INSTALL_COMMANDS = [
  {
    step: '# Step 01: Download for Linux (AMD64)',
    cmd: 'curl -L https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/anansi-linux-amd64 -o anansi',
  },
  {
    step: '# Step 02: Make Executable & Install',
    cmd: 'chmod +x anansi && sudo mv anansi /usr/local/bin/',
  },
  {
    step: '# Step 03: Run Initial Scan',
    cmd: 'anansi target.com --deep',
  },
];
