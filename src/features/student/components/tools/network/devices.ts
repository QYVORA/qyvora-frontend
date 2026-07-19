import {
  Router, Wifi, Server, Shield, Monitor, Printer, Cpu,
  Globe, Laptop, Smartphone, Tablet, Camera,
  Scale, KeyRound, Eye, Network, Radio,
  HardDrive, Mail, Cloud, FileCode, Database, FolderOpen,
  Lock, Users, Clock, Activity, Box, Container,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DeviceType =
  | 'router' | 'switch' | 'layer3-switch' | 'hub' | 'firewall'
  | 'server' | 'workstation' | 'laptop' | 'smartphone' | 'printer' | 'iot'
  | 'wireless-router' | 'access-point' | 'load-balancer' | 'vpn-gateway'
  | 'ids' | 'ips' | 'reverse-proxy' | 'modem' | 'wireless-controller'
  | 'web-server' | 'dns-server' | 'dhcp-server' | 'smtp-server' | 'ftp-server'
  | 'database-server' | 'file-server' | 'proxy-server' | 'ldap-server'
  | 'domain-controller' | 'ca-server' | 'ntp-server' | 'syslog-server'
  | 'siem-server' | 'vpn-server' | 'container-host' | 'virtualization-host'
  | 'camera' | 'tablet';

export type DeviceCategory = 'infrastructure' | 'endpoint' | 'server' | 'wireless' | 'security';

export interface DeviceDefinition {
  type: DeviceType;
  label: string;
  icon: LucideIcon;
  color: string;
  category: DeviceCategory;
}

export const DEVICE_REGISTRY: Record<DeviceType, DeviceDefinition> = {
  // Infrastructure
  router:              { type: 'router',              label: 'Router',              icon: Router,            color: '#f59e0b', category: 'infrastructure' },
  switch:              { type: 'switch',              label: 'L2 Switch',           icon: Wifi,              color: '#3b82f6', category: 'infrastructure' },
  'layer3-switch':     { type: 'layer3-switch',       label: 'L3 Switch',           icon: Wifi,              color: '#6366f1', category: 'infrastructure' },
  hub:                 { type: 'hub',                  label: 'Hub',                 icon: Network,           color: '#64748b', category: 'infrastructure' },
  modem:               { type: 'modem',                label: 'Modem',              icon: Globe,             color: '#78716c', category: 'infrastructure' },

  // Security
  firewall:            { type: 'firewall',             label: 'Firewall',           icon: Shield,            color: '#ef4444', category: 'security' },
  ids:                 { type: 'ids',                  label: 'IDS',                icon: Eye,               color: '#f97316', category: 'security' },
  ips:                 { type: 'ips',                  label: 'IPS',                icon: Eye,               color: '#dc2626', category: 'security' },
  'vpn-gateway':       { type: 'vpn-gateway',          label: 'VPN Gateway',        icon: Lock,              color: '#8b5cf6', category: 'security' },
  'reverse-proxy':     { type: 'reverse-proxy',        label: 'Reverse Proxy',      icon: Shield,            color: '#a855f7', category: 'security' },
  'load-balancer':     { type: 'load-balancer',        label: 'Load Balancer',      icon: Scale,             color: '#06b66f', category: 'security' },

  // Wireless
  'wireless-router':   { type: 'wireless-router',      label: 'Wireless Router',    icon: Radio,             color: '#0ea5e9', category: 'wireless' },
  'access-point':      { type: 'access-point',         label: 'Access Point',       icon: Radio,             color: '#38bdf8', category: 'wireless' },
  'wireless-controller': { type: 'wireless-controller', label: 'Wireless Controller', icon: Radio,           color: '#0284c7', category: 'wireless' },

  // Endpoints
  workstation:         { type: 'workstation',          label: 'Workstation',        icon: Monitor,           color: '#a855f7', category: 'endpoint' },
  laptop:              { type: 'laptop',               label: 'Laptop',             icon: Laptop,            color: '#c084fc', category: 'endpoint' },
  smartphone:          { type: 'smartphone',           label: 'Smartphone',         icon: Smartphone,        color: '#e879f9', category: 'endpoint' },
  tablet:              { type: 'tablet',               label: 'Tablet',             icon: Tablet,            color: '#d946ef', category: 'endpoint' },
  printer:             { type: 'printer',              label: 'Printer',            icon: Printer,           color: '#f97316', category: 'endpoint' },
  iot:                 { type: 'iot',                  label: 'IoT Device',         icon: Cpu,               color: '#06b6d6', category: 'endpoint' },
  camera:              { type: 'camera',               label: 'Security Camera',    icon: Camera,            color: '#f43f5e', category: 'endpoint' },

  // Servers
  server:              { type: 'server',               label: 'Server',             icon: Server,            color: '#06b66f', category: 'server' },
  'web-server':        { type: 'web-server',           label: 'Web Server',         icon: Globe,             color: '#10b981', category: 'server' },
  'dns-server':        { type: 'dns-server',           label: 'DNS Server',         icon: Globe,             color: '#34d399', category: 'server' },
  'dhcp-server':       { type: 'dhcp-server',          label: 'DHCP Server',        icon: Network,           color: '#6ee7b7', category: 'server' },
  'smtp-server':       { type: 'smtp-server',          label: 'SMTP Server',        icon: Mail,              color: '#a7f3d0', category: 'server' },
  'ftp-server':        { type: 'ftp-server',           label: 'FTP Server',         icon: FolderOpen,        color: '#059669', category: 'server' },
  'database-server':   { type: 'database-server',      label: 'Database Server',    icon: Database,          color: '#047857', category: 'server' },
  'file-server':       { type: 'file-server',          label: 'File Server',        icon: HardDrive,         color: '#065f46', category: 'server' },
  'proxy-server':      { type: 'proxy-server',         label: 'Proxy Server',       icon: Shield,            color: '#6d28d9', category: 'server' },
  'ldap-server':       { type: 'ldap-server',          label: 'LDAP Server',        icon: Users,             color: '#7c3aed', category: 'server' },
  'domain-controller': { type: 'domain-controller',    label: 'Domain Controller',  icon: Users,             color: '#5b21b6', category: 'server' },
  'ca-server':         { type: 'ca-server',            label: 'Certificate Auth',   icon: KeyRound,          color: '#4c1d95', category: 'server' },
  'ntp-server':        { type: 'ntp-server',           label: 'NTP Server',         icon: Clock,             color: '#8b5cf6', category: 'server' },
  'syslog-server':     { type: 'syslog-server',        label: 'Syslog Server',      icon: Activity,          color: '#a78bfa', category: 'server' },
  'siem-server':       { type: 'siem-server',          label: 'SIEM Server',        icon: Activity,          color: '#c4b5fd', category: 'server' },
  'vpn-server':        { type: 'vpn-server',           label: 'VPN Server',         icon: Lock,              color: '#7e22ce', category: 'server' },
  'container-host':    { type: 'container-host',       label: 'Container Host',     icon: Box,               color: '#2563eb', category: 'server' },
  'virtualization-host': { type: 'virtualization-host', label: 'Virtualization Host', icon: Container,       color: '#1d4ed8', category: 'server' },
};

export const DEVICE_CATEGORIES: { id: DeviceCategory; label: string; types: DeviceType[] }[] = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    types: ['router', 'switch', 'layer3-switch', 'hub', 'modem'],
  },
  {
    id: 'security',
    label: 'Security',
    types: ['firewall', 'ids', 'ips', 'vpn-gateway', 'reverse-proxy', 'load-balancer'],
  },
  {
    id: 'wireless',
    label: 'Wireless',
    types: ['wireless-router', 'access-point', 'wireless-controller'],
  },
  {
    id: 'endpoint',
    label: 'Endpoints',
    types: ['workstation', 'laptop', 'smartphone', 'tablet', 'printer', 'iot', 'camera'],
  },
  {
    id: 'server',
    label: 'Servers',
    types: [
      'server', 'web-server', 'dns-server', 'dhcp-server', 'smtp-server',
      'ftp-server', 'database-server', 'file-server', 'proxy-server', 'ldap-server',
      'domain-controller', 'ca-server', 'ntp-server', 'syslog-server', 'siem-server',
      'vpn-server', 'container-host', 'virtualization-host',
    ],
  },
];

export const CONNECTION_MEDIA = [
  {
    category: 'Copper',
    items: [
      { id: 'ethernet', label: 'Ethernet', icon: '🔌' },
      { id: 'rj45', label: 'RJ45', icon: '🔌' },
      { id: 'straight-through', label: 'Straight-through', icon: '🔌' },
      { id: 'crossover', label: 'Crossover', icon: '🔀' },
    ],
  },
  {
    category: 'Fiber',
    items: [
      { id: 'single-mode', label: 'Single-mode Fiber', icon: '💡' },
      { id: 'multi-mode', label: 'Multi-mode Fiber', icon: '💡' },
    ],
  },
  {
    category: 'WAN',
    items: [
      { id: 'serial', label: 'Serial', icon: '📡' },
      { id: 'mpls', label: 'MPLS', icon: '📡' },
      { id: 'leased-line', label: 'Leased Line', icon: '📡' },
    ],
  },
  {
    category: 'Wireless',
    items: [
      { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
      { id: 'bluetooth', label: 'Bluetooth', icon: '🔵' },
    ],
  },
];

export function getDeviceDef(type: DeviceType): DeviceDefinition {
  return DEVICE_REGISTRY[type];
}

export function getIcon(type: DeviceType): LucideIcon {
  return DEVICE_REGISTRY[type].icon;
}

export function getColor(type: DeviceType): string {
  return DEVICE_REGISTRY[type].color;
}
