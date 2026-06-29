import { Search, Globe, Lock, Shield, FileCode, AlertTriangle, type LucideIcon } from 'lucide-react';
import discoveryImg from '@/assets/anansi/discovery.webp';
import probeImg from '@/assets/anansi/probe.webp';
import tlsImg from '@/assets/anansi/tls.webp';
import headersImg from '@/assets/anansi/headers.webp';
import pathsImg from '@/assets/anansi/paths.webp';
import takeoverImg from '@/assets/anansi/takeover.webp';

export interface AnansiPhase {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  image: string;
}

export const PHASES: AnansiPhase[] = [
  { id: '01', name: 'DISCOVERY', icon: Search, desc: 'Subdomains via crt.sh CT logs + DNS brute-force', image: discoveryImg },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts, status codes, and titles', image: probeImg },
  { id: '03', name: 'TLS', icon: Lock, desc: 'Certificate analysis, SANs, and protocol audit', image: tlsImg },
  { id: '04', name: 'HEADERS', icon: Shield, desc: 'Security headers and CORS misconfigurations', image: headersImg },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), admin panels, and backups', image: pathsImg },
  { id: '06', name: 'TAKEOVER', icon: AlertTriangle, desc: 'Dangling CNAME detection for cloud services', image: takeoverImg },
];

export interface AnansiRelease {
  id: string;
  label: string;
  arch: string;
  icon: 'linux' | 'apple' | 'windows';
  file: string;
  size: string;
  curl: string;
  steps: { cmd: string; note?: string }[];
}

const BASE = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';

export const RELEASES: AnansiRelease[] = [
  {
    id: 'linux-amd64',
    label: 'Linux',
    arch: 'x86_64',
    icon: 'linux',
    file: 'anansi-linux-amd64',
    size: '~9.6 MB',
    curl: `curl -L ${BASE}/anansi-linux-amd64 -o anansi`,
    steps: [
      { cmd: `curl -L ${BASE}/anansi-linux-amd64 -o anansi` },
      { cmd: 'chmod +x anansi' },
      { cmd: 'sudo mv anansi /usr/local/bin/' },
      { cmd: 'anansi target.com --deep', note: 'Run a scan' },
    ],
  },
  {
    id: 'linux-arm64',
    label: 'Linux',
    arch: 'ARM64',
    icon: 'linux',
    file: 'anansi-linux-arm64',
    size: '~8.9 MB',
    curl: `curl -L ${BASE}/anansi-linux-arm64 -o anansi`,
    steps: [
      { cmd: `curl -L ${BASE}/anansi-linux-arm64 -o anansi` },
      { cmd: 'chmod +x anansi' },
      { cmd: 'sudo mv anansi /usr/local/bin/' },
      { cmd: 'anansi target.com --deep', note: 'Run a scan' },
    ],
  },
  {
    id: 'macos-amd64',
    label: 'macOS',
    arch: 'Intel',
    icon: 'apple',
    file: 'anansi-macos-amd64',
    size: '~9.8 MB',
    curl: `curl -L ${BASE}/anansi-macos-amd64 -o anansi`,
    steps: [
      { cmd: `curl -L ${BASE}/anansi-macos-amd64 -o anansi` },
      { cmd: 'chmod +x anansi' },
      { cmd: 'sudo mv anansi /usr/local/bin/' },
      { cmd: 'anansi target.com --deep', note: 'Run a scan' },
    ],
  },
  {
    id: 'macos-arm64',
    label: 'macOS',
    arch: 'Apple Silicon',
    icon: 'apple',
    file: 'anansi-macos-arm64',
    size: '~9.2 MB',
    curl: `curl -L ${BASE}/anansi-macos-arm64 -o anansi`,
    steps: [
      { cmd: `curl -L ${BASE}/anansi-macos-arm64 -o anansi` },
      { cmd: 'chmod +x anansi' },
      { cmd: 'sudo mv anansi /usr/local/bin/' },
      { cmd: 'anansi target.com --deep', note: 'Run a scan' },
    ],
  },
  {
    id: 'windows-amd64',
    label: 'Windows',
    arch: 'x86_64',
    icon: 'windows',
    file: 'anansi-windows-amd64.exe',
    size: '~9.9 MB',
    curl: `curl -L ${BASE}/anansi-windows-amd64.exe -o anansi.exe`,
    steps: [
      { cmd: `curl -L ${BASE}/anansi-windows-amd64.exe -o anansi.exe` },
      { cmd: 'Rename anansi.exe to anansi.exe', note: 'Already named' },
      { cmd: 'anansi target.com --deep', note: 'Run in PowerShell' },
    ],
  },
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

export const BUILD_FROM_SOURCE = {
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-anansi-cli' },
    { cmd: 'cd qyvora-anansi-cli' },
    { cmd: './install.sh', note: 'Auto-builds & installs to PATH' },
  ],
};
