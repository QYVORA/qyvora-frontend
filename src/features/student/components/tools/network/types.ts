import type { Position } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';

// ── Interface Types ──────────────────────────────────────────────────────────

export type InterfaceType =
  | 'ethernet' | 'fast-ethernet' | 'gigabit-ethernet' | '10g-ethernet'
  | 'fiber-single' | 'fiber-multi'
  | 'serial' | 'console'
  | 'wifi-2.4' | 'wifi-5' | 'wifi-6'
  | 'bluetooth'
  | 'usb' | 'thunderbolt'
  | 'poe' | 'management' | 'loopback' | 'tunnel'
  | 'wan' | 'lan' | 'dmz' | 'ha' | 'vpn';

export type OperationalState = 'up' | 'down' | 'testing' | 'unknown' | 'dormant' | 'not-present' | 'lower-layer-down';
export type AdminState = 'up' | 'down';

// ── Device Shapes ────────────────────────────────────────────────────────────

export type DeviceShape =
  | 'router-appliance'
  | 'rack-switch'
  | 'tower-server'
  | 'rack-server'
  | 'firewall-appliance'
  | 'laptop-silhouette'
  | 'desktop-tower'
  | 'phone-device'
  | 'camera-device'
  | 'embedded-device'
  | 'cloud-appliance'
  | 'access-point-round';

// ── Link & Traffic ───────────────────────────────────────────────────────────

export type LinkState = 'disconnected' | 'connected' | 'negotiating' | 'blocked' | 'disabled' | 'error' | 'loop-detected';
export type TrafficLevel = 'idle' | 'low' | 'medium' | 'high' | 'saturated';

export interface ProtocolColor {
  protocol: string;
  color: string;
  port?: number;
}

// ── Network Interface ────────────────────────────────────────────────────────

export interface InterfaceStatistics {
  rxPackets: number;
  txPackets: number;
  rxBytes: number;
  txBytes: number;
  rxErrors: number;
  txErrors: number;
  rxDrops: number;
  txDrops: number;
}

export interface NetworkInterface {
  id: string;
  name: string;
  type: InterfaceType;
  speed: number;
  duplex: 'half' | 'full';
  vlan?: number;
  ip?: string;
  mac?: string;
  operationalState: OperationalState;
  adminState: AdminState;
  connectedTo?: { nodeId: string; interfaceId: string };
  statistics: InterfaceStatistics;
}

export interface InterfaceTemplate {
  name: string;
  type: InterfaceType;
  speed: number;
  duplex: 'half' | 'full';
  operationalState: OperationalState;
  adminState: AdminState;
}

// ── Device Node Data ─────────────────────────────────────────────────────────

export type DeviceStatus = 'online' | 'offline' | 'degraded' | 'warning';

export interface DeviceNodeData {
  deviceType: string;
  label: string;
  ip: string;
  hostname?: string;
  interfaces: NetworkInterface[];
  shape: DeviceShape;
  status: DeviceStatus;
  uptime?: string;
  cpu?: number;
  memory?: number;
  traffic?: TrafficLevel;
  [key: string]: unknown;
}

// ── Network Link (Edge Data) ─────────────────────────────────────────────────

export interface NetworkLinkData {
  mediumId: string;
  mediumLabel: string;
  state: LinkState;
  bandwidth: number;
  latency: number;
  sourceInterface: string;
  targetInterface: string;
  trafficLevel: TrafficLevel;
}

// ── Packets ──────────────────────────────────────────────────────────────────

export interface Packet {
  id: string;
  protocol: string;
  color: string;
  sourceIp: string;
  destIp: string;
  size: number;
  progress: number;
  speed: number;
}

export interface PacketState extends Packet {
  edgeId: string;
}

// ── Interface Hitbox (for smart connection) ──────────────────────────────────

export interface InterfaceHitbox {
  nodeId: string;
  interfaceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  compatible: boolean;
  interfaceType: InterfaceType;
}

// ── Zoom ─────────────────────────────────────────────────────────────────────

export type ZoomLevel = 'low' | 'medium' | 'high' | 'very-high';

// ── Device Registry Types ────────────────────────────────────────────────────

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
  shape: DeviceShape;
  defaultInterfaces: InterfaceTemplate[];
}

// ── Topology State ───────────────────────────────────────────────────────────

export interface TopologyState {
  nodes: Map<string, { id: string; data: DeviceNodeData; position: { x: number; y: number } }>;
  edges: Map<string, { id: string; data: NetworkLinkData; source: string; target: string }>;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  zoomLevel: ZoomLevel;
  showInterfaces: boolean;
  showLabels: boolean;
  showPackets: boolean;
  trafficLevel: TrafficLevel;
  simulationRunning: boolean;
}

export type TopologyAction =
  | { type: 'ADD_NODE'; payload: { id: string; data: DeviceNodeData; position: { x: number; y: number } } }
  | { type: 'REMOVE_NODE'; payload: { id: string } }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: Partial<DeviceNodeData> } }
  | { type: 'ADD_EDGE'; payload: { id: string; data: NetworkLinkData; source: string; target: string } }
  | { type: 'REMOVE_EDGE'; payload: { id: string } }
  | { type: 'UPDATE_EDGE'; payload: { id: string; data: Partial<NetworkLinkData> } }
  | { type: 'UPDATE_INTERFACE'; payload: { nodeId: string; interfaceId: string; updates: Partial<NetworkInterface> } }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SET_SELECTED_EDGE'; payload: string | null }
  | { type: 'SET_ZOOM_LEVEL'; payload: ZoomLevel }
  | { type: 'SET_SHOW_INTERFACES'; payload: boolean }
  | { type: 'SET_SHOW_LABELS'; payload: boolean }
  | { type: 'SET_SHOW_PACKETS'; payload: boolean }
  | { type: 'SET_TRAFFIC_LEVEL'; payload: TrafficLevel }
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' };

// ── Connection Medium ────────────────────────────────────────────────────────

export interface ConnectionMedium {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ConnectionMediumGroup {
  category: string;
  items: ConnectionMedium[];
}
