import type { NetworkProfile } from './types';

export const NETWORK_PROFILES: NetworkProfile[] = [
  {
    id: 'default',
    label: 'Default Network',
    subnet: '10.0.0.0/24',
    gateway: '10.0.0.1',
    dns: ['10.0.0.2', '8.8.8.8'],
    devices: [
      { ip: '10.0.0.1', hostname: 'gateway', os: 'Cisco IOS 15.7', vendor: 'Cisco', role: 'Router', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4', state: 'open' }, { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24', state: 'open' }], discoverable: true },
      { ip: '10.0.0.2', hostname: 'dns-server', os: 'Ubuntu 22.04 LTS', vendor: 'Linux', role: 'DNS Server', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9', state: 'open' }, { port: 53, protocol: 'udp', service: 'dns', version: 'BIND 9.18', state: 'open' }], discoverable: true },
    ],
  },
  {
    id: 'sql-injection',
    label: 'SQL Injection Lab',
    subnet: '10.0.0.0/24',
    gateway: '10.0.0.1',
    dns: ['10.0.0.2'],
    devices: [
      { ip: '10.0.0.1', hostname: 'gateway', os: 'Cisco IOS 15.7', vendor: 'Cisco', role: 'Router', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4', state: 'open' }], discoverable: true },
      { ip: '10.0.0.5', hostname: 'web-server', os: 'Debian 12', vendor: 'Linux', role: 'Web Server', ports: [{ port: 80, protocol: 'tcp', service: 'http', version: 'nginx 1.24', state: 'open' }, { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24', state: 'open' }], discoverable: true },
      { ip: '10.0.0.6', hostname: 'db-server', os: 'Ubuntu 20.04 LTS', vendor: 'Linux', role: 'Database', ports: [{ port: 3306, protocol: 'tcp', service: 'mysql', version: 'MySQL 8.0.35', state: 'open' }], discoverable: true },
    ],
  },
  {
    id: 'kill-chain',
    label: 'Kill Chain Lab',
    subnet: '10.0.0.0/24',
    gateway: '10.0.0.1',
    dns: ['10.0.0.2', '10.0.0.50'],
    devices: [
      { ip: '10.0.0.1', hostname: 'gateway', os: 'Cisco IOS 15.7', vendor: 'Cisco', role: 'Router', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4', state: 'open' }], discoverable: true },
      { ip: '10.0.0.5', hostname: 'web-server', os: 'Debian 12', vendor: 'Linux', role: 'Web Server', ports: [{ port: 80, protocol: 'tcp', service: 'http', version: 'nginx 1.24', state: 'open' }, { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24', state: 'open' }], discoverable: true },
      { ip: '10.0.0.6', hostname: 'db-server', os: 'Ubuntu 20.04 LTS', vendor: 'Linux', role: 'Database', ports: [{ port: 3306, protocol: 'tcp', service: 'mysql', version: 'MySQL 8.0.35', state: 'open' }], discoverable: true },
      { ip: '10.0.0.10', hostname: 'file-server', os: 'Windows Server 2022', vendor: 'Microsoft', role: 'File Server', ports: [{ port: 445, protocol: 'tcp', service: 'smb', version: 'SMB 3.1.1', state: 'open' }], discoverable: true },
      { ip: '10.0.0.20', hostname: 'admin-pc', os: 'Windows 11 Pro', vendor: 'Microsoft', role: 'Workstation', ports: [{ port: 445, protocol: 'tcp', service: 'smb', version: 'SMB 3.1.1', state: 'open' }, { port: 3389, protocol: 'tcp', service: 'rdp', version: 'RDP', state: 'open' }], discoverable: true },
      { ip: '10.0.0.50', hostname: 'bastion-host', os: 'Ubuntu 22.04 LTS', vendor: 'Linux', role: 'Bastion', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9', state: 'open' }], discoverable: false },
      { ip: '10.0.0.51', hostname: 'vulnerable-app', os: 'Ubuntu 20.04 LTS', vendor: 'Linux', role: 'Target', ports: [{ port: 80, protocol: 'tcp', service: 'http', version: 'Apache 2.4', state: 'open' }, { port: 8080, protocol: 'tcp', service: 'http', version: 'Tomcat', state: 'open' }], discoverable: false },
      { ip: '10.0.0.100', hostname: 'backup-server', os: 'Debian 12', vendor: 'Linux', role: 'Backup', ports: [{ port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 9.2', state: 'open' }, { port: 873, protocol: 'tcp', service: 'rsync', version: 'rsync 3.2.7', state: 'open' }], discoverable: false },
      { ip: '10.0.0.200', hostname: 'security-cam', os: 'Embedded Linux', vendor: 'Custom', role: 'IoT', ports: [{ port: 80, protocol: 'tcp', service: 'http', version: 'GoAhead', state: 'open' }, { port: 554, protocol: 'tcp', service: 'rtsp', version: 'Live555', state: 'open' }], discoverable: false },
    ],
  },
];

export function getNetworkProfileForLab(labId: string): NetworkProfile {
  const map: Record<string, string> = {
    privesc: 'default',
    passwords: 'default',
    'sql-injection': 'sql-injection',
    osint: 'default',
    'kill-chain': 'kill-chain',
  };
  return NETWORK_PROFILES.find(p => p.id === (map[labId] || 'default')) || NETWORK_PROFILES[0];
}

export function getNetworkProfileForBootcamp(phaseId: string): NetworkProfile {
  const map: Record<string, string> = {
    phase1: 'default',
    phase2: 'default',
    phase3: 'default',
    phase4: 'sql-injection',
    phase5: 'default',
  };
  return NETWORK_PROFILES.find(p => p.id === (map[phaseId] || 'default')) || NETWORK_PROFILES[0];
}
