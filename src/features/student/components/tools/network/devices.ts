import {
  Router, Wifi, Server, Shield, Monitor, Printer, Cpu,
  Globe, Laptop, Smartphone, Tablet, Camera,
  Scale, KeyRound, Eye, Network, Radio,
  HardDrive, Mail, Cloud, FileCode, Database, FolderOpen,
  Lock, Users, Clock, Activity, Box, Container,
  Cable, Plug, ArrowRightLeft, Merge,
  Lightbulb,
  Satellite, Signal, Waves,
  Bluetooth,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DeviceType, DeviceCategory, DeviceDefinition, DeviceShape, InterfaceType, InterfaceTemplate } from './types';
import { getDefaultInterfaceTemplates } from './interfaces';

export type { DeviceType, DeviceCategory, DeviceDefinition };

function def(
  type: DeviceType,
  label: string,
  icon: LucideIcon,
  color: string,
  category: DeviceCategory,
  shape: DeviceShape,
): DeviceDefinition {
  return { type, label, icon, color, category, shape, defaultInterfaces: getDefaultInterfaceTemplates(type) };
}

export const DEVICE_REGISTRY: Record<DeviceType, DeviceDefinition> = {
  router:              def('router',              'Router',              Router,            '#f59e0b', 'infrastructure', 'router-appliance'),
  switch:              def('switch',              'L2 Switch',           Wifi,              '#3b82f6', 'infrastructure', 'rack-switch'),
  'layer3-switch':     def('layer3-switch',       'L3 Switch',           Wifi,              '#6366f1', 'infrastructure', 'rack-switch'),
  hub:                 def('hub',                  'Hub',                 Network,           '#64748b', 'infrastructure', 'rack-switch'),
  modem:               def('modem',                'Modem',              Globe,             '#78716c', 'infrastructure', 'embedded-device'),
  firewall:            def('firewall',             'Firewall',           Shield,            '#ef4444', 'security',       'firewall-appliance'),
  ids:                 def('ids',                  'IDS',                Eye,               '#f97316', 'security',       'rack-server'),
  ips:                 def('ips',                  'IPS',                Eye,               '#dc2626', 'security',       'rack-server'),
  'vpn-gateway':       def('vpn-gateway',          'VPN Gateway',        Lock,              '#8b5cf6', 'security',       'firewall-appliance'),
  'reverse-proxy':     def('reverse-proxy',        'Reverse Proxy',      Shield,            '#a855f7', 'security',       'rack-server'),
  'load-balancer':     def('load-balancer',        'Load Balancer',      Scale,             '#06b66f', 'security',       'rack-server'),
  'wireless-router':   def('wireless-router',      'Wireless Router',    Radio,             '#0ea5e9', 'wireless',       'router-appliance'),
  'access-point':      def('access-point',         'Access Point',       Radio,             '#38bdf8', 'wireless',       'access-point-round'),
  'wireless-controller': def('wireless-controller', 'Wireless Controller', Radio,           '#0284c7', 'wireless',       'rack-server'),
  workstation:         def('workstation',          'Workstation',        Monitor,           '#a855f7', 'endpoint',       'desktop-tower'),
  laptop:              def('laptop',               'Laptop',             Laptop,            '#c084fc', 'endpoint',       'laptop-silhouette'),
  smartphone:          def('smartphone',           'Smartphone',         Smartphone,        '#e879f9', 'endpoint',       'phone-device'),
  tablet:              def('tablet',               'Tablet',             Tablet,            '#d946ef', 'endpoint',       'phone-device'),
  printer:             def('printer',              'Printer',            Printer,           '#f97316', 'endpoint',       'embedded-device'),
  iot:                 def('iot',                  'IoT Device',         Cpu,               '#06b6d6', 'endpoint',       'embedded-device'),
  camera:              def('camera',               'Security Camera',    Camera,            '#f43f5e', 'endpoint',       'camera-device'),
  server:              def('server',               'Server',             Server,            '#06b66f', 'server',         'rack-server'),
  'web-server':        def('web-server',           'Web Server',         Globe,             '#10b981', 'server',         'rack-server'),
  'dns-server':        def('dns-server',           'DNS Server',         Globe,             '#34d399', 'server',         'rack-server'),
  'dhcp-server':       def('dhcp-server',          'DHCP Server',        Network,           '#6ee7b7', 'server',         'rack-server'),
  'smtp-server':       def('smtp-server',          'SMTP Server',        Mail,              '#a7f3d0', 'server',         'rack-server'),
  'ftp-server':        def('ftp-server',           'FTP Server',         FolderOpen,        '#059669', 'server',         'rack-server'),
  'database-server':   def('database-server',      'Database Server',    Database,          '#047857', 'server',         'rack-server'),
  'file-server':       def('file-server',          'File Server',        HardDrive,         '#065f46', 'server',         'rack-server'),
  'proxy-server':      def('proxy-server',         'Proxy Server',       Shield,            '#6d28d9', 'server',         'rack-server'),
  'ldap-server':       def('ldap-server',          'LDAP Server',        Users,             '#7c3aed', 'server',         'rack-server'),
  'domain-controller': def('domain-controller',    'Domain Controller',  Users,             '#5b21b6', 'server',         'rack-server'),
  'ca-server':         def('ca-server',            'Certificate Auth',   KeyRound,          '#4c1d95', 'server',         'rack-server'),
  'ntp-server':        def('ntp-server',           'NTP Server',         Clock,             '#8b5cf6', 'server',         'rack-server'),
  'syslog-server':     def('syslog-server',        'Syslog Server',      Activity,          '#a78bfa', 'server',         'rack-server'),
  'siem-server':       def('siem-server',          'SIEM Server',        Activity,          '#c4b5fd', 'server',         'rack-server'),
  'vpn-server':        def('vpn-server',           'VPN Server',         Lock,              '#7e22ce', 'server',         'rack-server'),
  'container-host':    def('container-host',       'Container Host',     Box,               '#2563eb', 'server',         'cloud-appliance'),
  'virtualization-host': def('virtualization-host', 'Virtualization Host', Container,       '#1d4ed8', 'server',         'cloud-appliance'),
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

export const CONNECTION_MEDIUM: { category: string; items: { id: string; label: string; icon: LucideIcon }[] }[] = [
  {
    category: 'Copper',
    items: [
      { id: 'ethernet', label: 'Ethernet', icon: Cable },
      { id: 'rj45', label: 'RJ45', icon: Plug },
      { id: 'straight-through', label: 'Straight-through', icon: Cable },
      { id: 'crossover', label: 'Crossover', icon: ArrowRightLeft },
    ],
  },
  {
    category: 'Fiber',
    items: [
      { id: 'single-mode', label: 'Single-mode Fiber', icon: Lightbulb },
      { id: 'multi-mode', label: 'Multi-mode Fiber', icon: Lightbulb },
    ],
  },
  {
    category: 'WAN',
    items: [
      { id: 'serial', label: 'Serial', icon: Satellite },
      { id: 'mpls', label: 'MPLS', icon: Signal },
      { id: 'leased-line', label: 'Leased Line', icon: Waves },
    ],
  },
  {
    category: 'Wireless',
    items: [
      { id: 'wifi', label: 'Wi-Fi', icon: Radio },
      { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
    ],
  },
];

export const CONNECTION_MEDIA = CONNECTION_MEDIUM;

// ── Medium ↔ Interface compatibility ─────────────────────────────────────────

export const MEDIUM_INTERFACE_COMPAT: Record<string, InterfaceType[]> = {
  'ethernet':        ['ethernet', 'fast-ethernet', 'gigabit-ethernet', '10g-ethernet'],
  'rj45':            ['ethernet', 'fast-ethernet', 'gigabit-ethernet'],
  'straight-through': ['ethernet', 'fast-ethernet', 'gigabit-ethernet'],
  'crossover':       ['ethernet', 'fast-ethernet', 'gigabit-ethernet'],
  'single-mode':     ['fiber-single'],
  'multi-mode':      ['fiber-multi'],
  'serial':          ['serial', 'console'],
  'mpls':            ['wan'],
  'leased-line':     ['wan'],
  'wifi':            ['wifi-2.4', 'wifi-5', 'wifi-6'],
  'bluetooth':       ['bluetooth'],
};

export function isMediumCompatibleWithInterface(mediumId: string, ifaceType: InterfaceType): boolean {
  const allowed = MEDIUM_INTERFACE_COMPAT[mediumId];
  if (!allowed) return false;
  return allowed.includes(ifaceType);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getDeviceDef(type: string): DeviceDefinition {
  return DEVICE_REGISTRY[type as DeviceType] ?? DEVICE_REGISTRY.server;
}

export function getIcon(type: string): LucideIcon {
  return getDeviceDef(type).icon;
}

export function getColor(type: string): string {
  return getDeviceDef(type).color;
}

export function getShape(type: string): DeviceShape {
  return getDeviceDef(type).shape;
}
