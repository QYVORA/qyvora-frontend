export interface DevicePort {
  port: number;
  protocol: 'tcp' | 'udp';
  service: string;
  version: string;
  state: 'open' | 'filtered' | 'closed';
}

export interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string;
  os: string;
  vendor: string;
  ports: DevicePort[];
  discoverable: boolean;
  hidden: boolean;
  description: string;
  vulnerabilities?: string[];
  notes?: string;
}

export interface NetworkConfig {
  subnet: string;
  netmask: string;
  cidr: number;
  gateway: string;
  broadcast: string;
  dns: string[];
  dhcpRange: string;
}

export const NETWORK_CONFIG: NetworkConfig = {
  subnet: '10.0.0.0',
  netmask: '255.255.255.0',
  cidr: 24,
  gateway: '10.0.0.1',
  broadcast: '10.0.0.255',
  dns: ['10.0.0.2', '8.8.8.8'],
  dhcpRange: '10.0.0.100 - 10.0.0.200',
};

export const STUDENT_IP = '10.0.0.42';
export const STUDENT_MAC = '08:00:27:4e:66:a1';
export const STUDENT_HOSTNAME = 'kali';

export const DEVICES: NetworkDevice[] = [
  {
    ip: '10.0.0.1',
    mac: '00:50:56:00:00:01',
    hostname: 'gateway',
    os: 'Cisco IOS 15.7',
    vendor: 'Cisco',
    discoverable: true,
    hidden: false,
    description: 'Main network gateway / router',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'Cisco SSH 2.0', state: 'open' },
      { port: 23, protocol: 'tcp', service: 'telnet', version: 'Cisco Telnet', state: 'closed' },
      { port: 443, protocol: 'tcp', service: 'https', version: 'Cisco IOS HTTPS', state: 'open' },
      { port: 161, protocol: 'udp', service: 'snmp', version: 'SNMP v2c', state: 'filtered' },
    ],
  },
  {
    ip: '10.0.0.2',
    mac: '00:50:56:00:00:02',
    hostname: 'dns-server',
    os: 'Ubuntu 22.04 LTS',
    vendor: 'Linux',
    discoverable: true,
    hidden: false,
    description: 'Internal DNS server (BIND9)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu', state: 'open' },
      { port: 53, protocol: 'tcp', service: 'domain', version: 'BIND 9.18.12', state: 'open' },
      { port: 53, protocol: 'udp', service: 'domain', version: 'BIND 9.18.12', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.5',
    mac: '00:50:56:00:00:05',
    hostname: 'web-server',
    os: 'Debian 12 Bookworm',
    vendor: 'Linux',
    discoverable: true,
    hidden: false,
    description: 'Corporate web server hosting internal apps',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4p1 Debian 5', state: 'open' },
      { port: 80, protocol: 'tcp', service: 'http', version: 'nginx 1.24.0', state: 'open' },
      { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24.0', state: 'open' },
      { port: 8080, protocol: 'tcp', service: 'http-proxy', version: 'nginx 1.24.0', state: 'filtered' },
    ],
  },
  {
    ip: '10.0.0.6',
    mac: '00:50:56:00:00:06',
    hostname: 'db-server',
    os: 'Ubuntu 20.04 LTS',
    vendor: 'Linux',
    discoverable: true,
    hidden: false,
    description: 'Internal MySQL database server',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.2p1 Ubuntu', state: 'open' },
      { port: 3306, protocol: 'tcp', service: 'mysql', version: 'MySQL 8.0.35', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.10',
    mac: '00:50:56:00:00:0a',
    hostname: 'file-server',
    os: 'Windows Server 2022',
    vendor: 'Microsoft',
    discoverable: true,
    hidden: false,
    description: 'Corporate file share server (SMB)',
    ports: [
      { port: 135, protocol: 'tcp', service: 'msrpc', version: 'Microsoft RPC', state: 'open' },
      { port: 139, protocol: 'tcp', service: 'netbios-ssn', version: 'Microsoft NetBIOS', state: 'open' },
      { port: 445, protocol: 'tcp', service: 'microsoft-ds', version: 'SMB 3.1.1', state: 'open' },
      { port: 3389, protocol: 'tcp', service: 'ms-wbt-server', version: 'RDP 10.0', state: 'filtered' },
    ],
  },
  {
    ip: '10.0.0.15',
    mac: '00:50:56:00:00:0f',
    hostname: 'mail-server',
    os: 'Debian 11 Bullseye',
    vendor: 'Linux',
    discoverable: true,
    hidden: false,
    description: 'Corporate mail server (Postfix + Dovecot)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4p1 Debian 5', state: 'open' },
      { port: 25, protocol: 'tcp', service: 'smtp', version: 'Postfix smtpd 3.5.17', state: 'open' },
      { port: 143, protocol: 'tcp', service: 'imap', version: 'Dovecot 2.3.16', state: 'open' },
      { port: 587, protocol: 'tcp', service: 'submission', version: 'Postfix smtpd 3.5.17', state: 'open' },
      { port: 993, protocol: 'tcp', service: 'imaps', version: 'Dovecot 2.3.16', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.20',
    mac: '00:50:56:00:00:14',
    hostname: 'admin-pc',
    os: 'Windows 11 Pro 23H2',
    vendor: 'Microsoft',
    discoverable: true,
    hidden: false,
    description: 'IT administrator workstation',
    ports: [
      { port: 135, protocol: 'tcp', service: 'msrpc', version: 'Microsoft RPC', state: 'open' },
      { port: 139, protocol: 'tcp', service: 'netbios-ssn', version: 'Microsoft NetBIOS', state: 'open' },
      { port: 445, protocol: 'tcp', service: 'microsoft-ds', version: 'SMB 3.1.1', state: 'open' },
      { port: 3389, protocol: 'tcp', service: 'ms-wbt-server', version: 'RDP 10.0', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.21',
    mac: '00:50:56:00:00:15',
    hostname: 'dev-workstation',
    os: 'Fedora 39',
    vendor: 'Linux',
    discoverable: true,
    hidden: false,
    description: 'Developer workstation',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 9.3p1 Fedora', state: 'open' },
      { port: 3000, protocol: 'tcp', service: 'http', version: 'Node.js Dev Server 20.11', state: 'open' },
      { port: 5432, protocol: 'tcp', service: 'postgresql', version: 'PostgreSQL 16.1', state: 'filtered' },
    ],
  },
  {
    ip: '10.0.0.25',
    mac: '00:50:56:00:00:19',
    hostname: 'network-printer',
    os: 'HP JetDirect 42.x',
    vendor: 'HP',
    discoverable: true,
    hidden: false,
    description: 'Network printer / multifunction device',
    ports: [
      { port: 80, protocol: 'tcp', service: 'http', version: 'HP JetDirect Web', state: 'open' },
      { port: 443, protocol: 'tcp', service: 'https', version: 'HP JetDirect Web', state: 'open' },
      { port: 631, protocol: 'tcp', service: 'ipp', version: 'CUPS 2.4.6', state: 'open' },
      { port: 9100, protocol: 'tcp', service: 'jetdirect', version: 'HP PDL', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.30',
    mac: '00:50:56:00:00:1e',
    hostname: 'iot-sensor',
    os: 'Embedded Linux 5.4',
    vendor: 'Custom',
    discoverable: true,
    hidden: false,
    description: 'Environmental monitoring sensor (temperature/humidity)',
    ports: [
      { port: 80, protocol: 'tcp', service: 'http', version: 'lighttpd 1.4.69', state: 'open' },
      { port: 443, protocol: 'tcp', service: 'https', version: 'lighttpd 1.4.69', state: 'closed' },
    ],
    vulnerabilities: ['Default credentials (admin:admin)'],
  },
  {
    ip: '10.0.0.50',
    mac: '00:50:56:00:00:32',
    hostname: 'bastion-host',
    os: 'Ubuntu 22.04 LTS',
    vendor: 'Linux',
    discoverable: false,
    hidden: true,
    description: 'SSH bastion / jump server (restricted access)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.51',
    mac: '00:50:56:00:00:33',
    hostname: 'vulnerable-app',
    os: 'Ubuntu 20.04 LTS',
    vendor: 'Linux',
    discoverable: false,
    hidden: true,
    description: 'Legacy internal application server (known vulnerable)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 7.9p1 Ubuntu', state: 'open' },
      { port: 80, protocol: 'tcp', service: 'http', version: 'Apache httpd 2.4.41', state: 'open' },
      { port: 8080, protocol: 'tcp', service: 'http-proxy', version: 'Tomcat 9.0.65', state: 'open' },
      { port: 8443, protocol: 'tcp', service: 'https', version: 'Tomcat 9.0.65', state: 'filtered' },
    ],
    vulnerabilities: [
      'Apache Struts2 RCE (CVE-2023-XXXX)',
      'Default Tomcat credentials (tomcat:tomcat)',
    ],
  },
  {
    ip: '10.0.0.100',
    mac: '00:50:56:00:00:64',
    hostname: 'backup-server',
    os: 'Debian 12 Bookworm',
    vendor: 'Linux',
    discoverable: false,
    hidden: true,
    description: 'Automated backup server (rsync + BorgBackup)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4p1 Debian 5', state: 'open' },
      { port: 873, protocol: 'tcp', service: 'rsync', version: 'rsync 3.2.7', state: 'open' },
    ],
  },
  {
    ip: '10.0.0.200',
    mac: '00:50:56:00:00:c8',
    hostname: 'security-cam',
    os: 'Embedded Linux 4.19',
    vendor: 'Hikvision',
    discoverable: false,
    hidden: true,
    description: 'IP security camera (Hikvision DS-2CD2xxx)',
    ports: [
      { port: 80, protocol: 'tcp', service: 'http', version: 'Hikvision Web 5.6.1', state: 'open' },
      { port: 554, protocol: 'tcp', service: 'rtsp', version: 'Hikvision RTSP 1.0', state: 'open' },
      { port: 8000, protocol: 'tcp', service: 'http', version: 'Hikvision SDK', state: 'open' },
    ],
    vulnerabilities: ['Default credentials (admin:12345)', 'Known backdoor CVE-2021-36260'],
  },
  {
    ip: '10.0.0.250',
    mac: '00:50:56:00:00:fa',
    hostname: 'internal-dashboard',
    os: 'Ubuntu 22.04 LTS',
    vendor: 'Linux',
    discoverable: false,
    hidden: true,
    description: 'Internal admin dashboard (classified)',
    ports: [
      { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu', state: 'filtered' },
      { port: 443, protocol: 'tcp', service: 'https', version: 'nginx 1.24.0', state: 'open' },
      { port: 3000, protocol: 'tcp', service: 'http', version: 'Grafana 10.2.2', state: 'open' },
    ],
    notes: 'Classified. Access restricted to level 3+ operators.',
  },
];

export function getDeviceByIp(ip: string): NetworkDevice | undefined {
  return DEVICES.find(d => d.ip === ip);
}

export function getDeviceByHostname(hostname: string): NetworkDevice | undefined {
  return DEVICES.find(d => d.hostname === hostname);
}

export function resolveTarget(target: string): string | null {
  if (target === 'localhost' || target === '127.0.0.1') return '127.0.0.1';
  const byIp = getDeviceByIp(target);
  if (byIp) return byIp.ip;
  const byHostname = getDeviceByHostname(target);
  if (byHostname) return byHostname.ip;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target)) return target;
  return null;
}

export function getDiscoverableIps(): string[] {
  return DEVICES.filter(d => d.discoverable).map(d => d.ip);
}

export function getHiddenIps(): string[] {
  return DEVICES.filter(d => d.hidden).map(d => d.ip);
}

export function getAllDeviceIps(): string[] {
  return DEVICES.map(d => d.ip);
}

export function isInSubnet(ip: string): boolean {
  if (ip === '127.0.0.1') return false;
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) return false;
  const parts = ip.split('.').map(Number);
  if (parts.some(p => isNaN(p) || p < 0 || p > 255)) return false;
  return parts[0] === 10 && parts[1] === 0 && parts[2] === 0;
}

export function getHostnameForIp(ip: string): string {
  const device = getDeviceByIp(ip);
  return device ? device.hostname : ip;
}

export function getMacForIp(ip: string): string {
  const device = getDeviceByIp(ip);
  return device ? device.mac : '00:00:00:00:00:00';
}

export function getOsForIp(ip: string): string | null {
  const device = getDeviceByIp(ip);
  return device ? device.os : null;
}
