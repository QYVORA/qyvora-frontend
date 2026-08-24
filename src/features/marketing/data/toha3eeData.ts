import { Network, Eye, Key, Radar, Router, Wifi, FileText, Search, ListChecks, Globe, Terminal, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface Toha3eeCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  modules: string[];
}

export const MODULES: Toha3eeCategory[] = [
  {
    id: 'mitm',
    name: 'MITM',
    icon: Network,
    desc: 'Man-in-the-middle primitives. ARP, DHCP, DNS, IPv6 and LLMNR poisoning with inline interception.',
    modules: ['arp.spoof', 'dns.spoof', 'dns.rebind', 'dhcp.rogue', 'dhcp.starve', 'dhcp6.spoof', 'icmp.redirect', 'ipv6.ra', 'ipv6.ndp', 'llmnr.poison', 'wpad.poison'],
  },
  {
    id: 'espionage',
    name: 'Espionage',
    icon: Eye,
    desc: 'Inline HTTP/HTTPS interception, credential harvesting and SSL stripping through the MITM proxy.',
    modules: ['http.harvest', 'http.proxy', 'https.proxy', 'ssl.strip', 'phish.inject'],
  },
  {
    id: 'auth',
    name: 'Auth',
    icon: Key,
    desc: 'Credential and authentication attacks: relay, signing checks, spraying, brute force and AS-REP.',
    modules: ['default.creds', 'ntlm.relay', 'smb.signing', 'smb.kerberoast', 'auth.spray', 'auth.brute', 'auth.userenum', 'auth.asrep'],
  },
  {
    id: 'recon',
    name: 'Recon',
    icon: Radar,
    desc: 'Network discovery and fingerprinting that feeds the store and ranks attack vectors.',
    modules: ['net.scan', 'net.ping', 'net.traceroute', 'net.osdetect', 'service.synscan', 'service.tcpconnect', 'service.udpscan', 'service.finxmas', 'service.ack', 'service.protoscan', 'service.idle', 'service.fingerprint', 'service.tls', 'web.dir', 'cve.suggest'],
  },
  {
    id: 'osint',
    name: 'OSINT',
    icon: Search,
    desc: 'Open-source intelligence - DNS, WHOIS, CT logs, ASN, Shodan, buckets, wayback and GitHub dorks.',
    modules: ['osint.dns', 'osint.whois', 'osint.ct', 'osint.asn', 'osint.shodan', 'osint.bucket', 'osint.wayback', 'osint.github', 'osint.hibp', 'osint.metadata', 'osint.dork', 'osint.harvest'],
  },
  {
    id: 'enum',
    name: 'Enumeration',
    icon: ListChecks,
    desc: 'Service-level enumeration - SMTP, SNMP, LDAP, NFS and SMB users plus IPv6 host sweeps.',
    modules: ['smtp.enum', 'snmp.enum', 'ldap.enum', 'nfs.enum', 'smb.enum', 'net.ip6sweep'],
  },
  {
    id: 'web',
    name: 'Web',
    icon: Globe,
    desc: 'Web-layer assessment: misconfiguration discovery on top of the recon fingerprints.',
    modules: ['web.misconfig'],
  },
  {
    id: 'switch',
    name: 'Switch',
    icon: Router,
    desc: 'Layer-2 switch exploitation: flooding, port stealing, VLAN hopping and STP/CDP abuse.',
    modules: ['switch.flood', 'switch.portsteal', 'switch.vlanhop', 'switch.cdp', 'switch.stp'],
  },
  {
    id: 'wireless',
    name: 'Wireless',
    icon: Wifi,
    desc: '802.11 attacks: scanning, deauth, handshake capture, evil twin, PMKID and KARMA.',
    modules: ['wlan.scan', 'wlan.deauth', 'wlan.handshake', 'wlan.eviltwin', 'wlan.pmkid', 'wlan.beaconflood', 'wlan.karma'],
  },
  {
    id: 'post',
    name: 'Post',
    icon: FileText,
    desc: 'Reporting and session tooling on top of the in-memory store and event log.',
    modules: ['report.generate', 'session.replay', 'pcap.export'],
  },
];

export const GITHUB_URL = 'https://github.com/qyvora/qyvora-toha3ee';
export const INSTALLER_UNIX = 'https://raw.githubusercontent.com/qyvora/qyvora-toha3ee/main/scripts/install.sh';
export const INSTALLER_WINDOWS = 'https://raw.githubusercontent.com/qyvora/qyvora-toha3ee/main/scripts/install.ps1';

export interface InstallOption {
  id: string;
  label: string;
  icon: LucideIcon;
  cmd: string;
  note: string;
}

export const INSTALLERS: InstallOption[] = [
  {
    id: 'unix',
    label: 'Linux / macOS',
    icon: Terminal,
    cmd: `curl -fsSL ${INSTALLER_UNIX} | sh`,
    note: 'Fetches the prebuilt binary, verifies its SHA-256 checksum and adds it to your PATH.',
  },
  {
    id: 'windows',
    label: 'Windows (PowerShell)',
    icon: Terminal,
    cmd: `irm ${INSTALLER_WINDOWS} | iex`,
    note: 'Installs to %LOCALAPPDATA%\\Programs\\toha3ee\\bin and updates your user PATH.',
  },
  {
    id: 'checkout',
    label: 'From a checkout',
    icon: Terminal,
    cmd: 'make install',
    note: 'Installs ~/.local/bin/toha3ee and adds it to PATH.',
  },
];

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ and libpcap headers.',
  steps: [
    { cmd: 'git clone https://github.com/qyvora/qyvora-toha3ee' },
    { cmd: 'cd qyvora-toha3ee' },
    { cmd: 'sudo apt install libpcap-dev', note: 'Debian/Ubuntu only; macOS ships libpcap with Xcode CLT' },
    { cmd: 'go build ./cmd/toha3ee', note: 'Linux builds need libpcap headers' },
  ],
};

export const QUICK_START = [
  'sudo ./toha3ee --iface eth0',
  'sudo ./toha3ee wizard --iface eth0',
  'sudo ./toha3ee --eval "net.scan; net.show" --iface eth0',
  'sudo ./toha3ee run --iface eth0 caplets/basic-recon.caplet',
];

export const CONSOLE_SESSION: { cmd: string; note: string }[] = [
  { cmd: 'modules recon', note: 'module catalogue filtered by category' },
  { cmd: 'on net.scan', note: 'run a module; preflight checks shown first' },
  { cmd: 'net.show', note: 'discovered hosts' },
  { cmd: 'net.profile', note: 'profile + ranked attack vectors' },
  { cmd: 'quit', note: 'cleanup lifecycle tears every attack down' },
];

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'contract',
    filename: 'internal/attacks/registry.go',
    label: 'Module contract',
    description: 'Every attack implements the same lifecycle so the framework can enforce preflight, verification and cleanup consistently.',
    code: 'type Module interface {\n\tMeta() ModuleMeta\n\tPreflight(ctx *AttackCtx) (*PreflightReport, error)\n\tRun(ctx *AttackCtx, opts map[string]string) error\n\tVerify(ctx *AttackCtx) (*Impact, error)\n\tCleanup(ctx *AttackCtx) error\n}',
  },
  {
    id: 'register',
    filename: 'internal/attacks/registry.go',
    label: 'Self-registration',
    description: 'Modules register themselves during Go initialisation; duplicate IDs panic so mistakes surface at startup.',
    code: 'var Registry = map[string]Module{}\n\nfunc Register(m Module) {\n\tmeta := m.Meta()\n\tif meta.ID == "" {\n\t\tpanic("attacks: module registered with empty ID")\n\t}\n\tif _, dup := Registry[meta.ID]; dup {\n\t\tpanic(fmt.Sprintf("attacks: duplicate module ID %q", meta.ID))\n\t}\n\tRegistry[meta.ID] = m\n}',
  },
  {
    id: 'arp',
    filename: 'internal/attacks/mitm/arp_spoof.go',
    label: 'ARPSpoof registration',
    description: 'The flagship MITM module self-registers under "arp.spoof" with its metadata, risk level and required capabilities.',
    code: 'func init() {\n\tattacks.Register(&ARPSpoof{})\n}\n\ntype ARPSpoof struct{}\n\nfunc (*ARPSpoof) Meta() attacks.ModuleMeta {\n\treturn attacks.ModuleMeta{\n\t\tID:       "arp.spoof",\n\t\tCategory: "mitm",\n\t\tRisk:     attacks.RiskMedium,\n\t\tTargets:  []string{"gateway", "host"},\n\t\tRequires: []string{"cap.raw_socket", "cap.ip_forward"},\n\t}\n}',
  },
  {
    id: 'cleanup',
    filename: 'internal/safety/manager.go',
    label: 'Cleanup registry',
    description: 'Modules register restore actions; the safety layer runs them in reverse order on SIGINT, panic or module error.',
    code: 'func (m *Manager) RegisterCleanup(id, desc string, restore func() error) {\n\tm.mu.Lock()\n\tdefer m.mu.Unlock()\n\tfor i := range m.actions {\n\t\tif m.actions[i].ID == id {\n\t\t\tm.actions[i].Desc = desc\n\t\t\tm.actions[i].Restore = restore\n\t\t\treturn\n\t\t}\n\t}\n\tm.actions = append(m.actions, Action{ID: id, Desc: desc, Restore: restore})\n}',
  },
];
