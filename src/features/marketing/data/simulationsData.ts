import type React from 'react';
import { IconNetwork, IconTerminal } from '@/shared/components/icons';

/**
 * PUBLIC SIMULATION CATALOGUE — single source of truth.
 *
 * Both `/simulations` and `/simulations/:slug` render from this file so the
 * listing and the detail page can never disagree about a title, description,
 * or capability list. `SIMULATIONS` is re-exported from SimulationsPage
 * because LearnPage imports it from there.
 */

export type SimulationId = 'terminal' | 'network';

/** Selects which live tool the detail page mounts. */
export type SimulationKind = 'terminal' | 'network';

export interface PublicSimulation {
  id: SimulationId;
  kind: SimulationKind;
  /** Absolute public path, e.g. `/simulations/terminal`. */
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Short title for cards and listings. */
  title: string;
  /** Second half of the detail-page H1, e.g. "Browser Terminal Linux Shell". */
  titleAccent: string;
  /** One-line category label used as the detail-page kicker and card badge. */
  tag: string;
  description: string;
  /** Heading for the live-demo block. */
  demoTitle: string;
  demoDescription: string;
  features: string[];
  /**
   * Monospace reference shown beside the demo launcher. This is real
   * capability surface taken from the shipped tool, not filler sample code.
   */
  reference: { filename: string; code: string };
}

export const SIMULATIONS: PublicSimulation[] = [
  {
    id: 'terminal',
    kind: 'terminal',
    slug: '/simulations/terminal',
    icon: IconTerminal,
    title: 'Browser Terminal',
    titleAccent: 'Linux Shell',
    tag: 'Linux Shell',
    description:
      'A full Linux shell running in your browser. Navigate a realistic filesystem, inspect permissions, and chain commands with pipes and redirects.',
    demoTitle: 'Live Terminal',
    demoDescription:
      'This is a real simulated shell. Type help or run commands like ls, cat, whoami, and history.',
    features: [
      'Realistic Linux filesystem',
      'Pipes, redirects, and environment variables',
      'Persistent session state',
      'Typed output with realistic timing',
    ],
    reference: {
      filename: 'command-reference',
      code: `# Start here
help              list every supported command
qyvora-help       course-related commands

FILESYSTEM
ls [-la] [path]   list directory contents
cd <path>         change directory
cat <file>        print a file
mkdir / touch     create directories and files
grep / find       search file contents and names
chmod             change permissions

NETWORK
ping [-c n] host  ping a host
curl <url>        HTTP request
nmap [-sV] target port scanner
dig <domain>      DNS lookup
ssh [user@]host   SSH connection

SECURITY TOOLS
nmap / nikto / sqlmap / hydra / hashcat / john
enum4linux / smbclient / searchsploit / binwalk`,
    },
  },
  {
    id: 'network',
    kind: 'network',
    slug: '/simulations/network-visualizer',
    icon: IconNetwork,
    title: 'Network',
    titleAccent: 'Visualizer',
    tag: 'Topology Mapper',
    description:
      'Map live network topologies: hosts, subnets, ports, and services, the same way operators build a picture of a target environment.',
    demoTitle: 'Live Network Map',
    demoDescription:
      'Inspect hosts, subnets, and connections. Click nodes to see service details.',
    features: [
      'Interactive topology canvas',
      'Host and service discovery',
      'Subnet grouping',
      'Drag and connect nodes',
    ],
    reference: {
      filename: 'device-palette',
      code: `# Device palette

INFRASTRUCTURE
router  switch  layer3-switch  hub  modem

SECURITY
firewall  ids  ips  vpn-gateway
reverse-proxy  load-balancer

WIRELESS
wireless-router  access-point  wireless-controller

ENDPOINTS
workstation  laptop  smartphone  tablet
printer  iot  camera

SERVERS
web-server  dns-server  dhcp-server  database-server
file-server  ldap-server  domain-controller  ca-server
proxy-server  ntp-server  syslog-server  siem-server
vpn-server  container-host  virtualization-host

CONNECTION MEDIA
ethernet  rj45  crossover  single-mode fiber
multi-mode fiber  serial  mpls  leased-line
wifi  bluetooth`,
    },
  },
];

/** Resolve a `/simulations/:slug` param to its catalogue entry. */
export const getSimulationBySlug = (slug: string | undefined): PublicSimulation | undefined =>
  SIMULATIONS.find((sim) => sim.slug === `/simulations/${slug ?? ''}`);
