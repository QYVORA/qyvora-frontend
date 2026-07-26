import type { InterfaceTemplate, InterfaceType, OperationalState, AdminState } from './types';

type IAdminState = AdminState;
type IOpState = OperationalState;

const UP: IAdminState = 'up';
const DOWN: IAdminState = 'down';
const OP_UP: IOpState = 'up';
const OP_DOWN: IOpState = 'down';
const OP_ABSENT: IOpState = 'not-present';

function eth(name: string, speed: 10 | 100 | 1000 | 10000 = 1000, op: IOpState = OP_UP): InterfaceTemplate {
  const type: InterfaceType = speed <= 10 ? 'ethernet' : speed <= 100 ? 'fast-ethernet' : speed <= 1000 ? 'gigabit-ethernet' : '10g-ethernet';
  return { name, type, speed, duplex: 'full', operationalState: op, adminState: op === OP_ABSENT ? DOWN : UP };
}

function fiber(name: string, mode: 'single' | 'multi' = 'single', speed = 10000, op: IOpState = OP_UP): InterfaceTemplate {
  return { name, type: mode === 'single' ? 'fiber-single' : 'fiber-multi', speed, duplex: 'full', operationalState: op, adminState: op === OP_ABSENT ? DOWN : UP };
}

function wifi(name: string, standard: 'wifi-2.4' | 'wifi-5' | 'wifi-6' = 'wifi-5', speed = 300, op: IOpState = OP_UP): InterfaceTemplate {
  return { name, type: standard, speed, duplex: 'full', operationalState: op, adminState: UP };
}

function serial(name: string, speed = 1544, op: IOpState = OP_UP): InterfaceTemplate {
  return { name, type: 'serial', speed, duplex: 'full', operationalState: op, adminState: UP };
}

function mgmt(name: string, speed = 100, op: IOpState = OP_UP): InterfaceTemplate {
  return { name, type: 'management', speed, duplex: 'full', operationalState: op, adminState: UP };
}

function loopback(name: string, op: IOpState = OP_UP): InterfaceTemplate {
  return { name, type: 'loopback', speed: 0, duplex: 'full', operationalState: op, adminState: UP };
}

// ── Router ───────────────────────────────────────────────────────────────────

const ROUTER_INTERFACES: InterfaceTemplate[] = [
  eth('GigabitEthernet0/0', 1000),
  eth('GigabitEthernet0/1', 1000),
  eth('GigabitEthernet0/2', 1000, OP_DOWN),
  serial('Serial0/0/0'),
  serial('Serial0/0/1', 1544, OP_DOWN),
  fiber('TenGigabitEthernet0/0', 'single', 10000, OP_DOWN),
  loopback('Loopback0'),
  mgmt('Management0'),
];

// ── L2 Switch ────────────────────────────────────────────────────────────────

const SWITCH_24_INTERFACES: InterfaceTemplate[] = Array.from({ length: 24 }, (_, i) =>
  eth(`GigabitEthernet0/${i + 1}`, 1000, i < 18 ? OP_UP : OP_DOWN),
);
SWITCH_24_INTERFACES.push(
  eth('GigabitEthernet0/25', 10000),
  eth('GigabitEthernet0/26', 10000, OP_DOWN),
  mgmt('Management0'),
);

// ── L3 Switch ────────────────────────────────────────────────────────────────

const L3_SWITCH_INTERFACES: InterfaceTemplate[] = [
  ...SWITCH_24_INTERFACES.slice(0, 24),
  eth('Vlanif10', 1000),
  eth('Vlanif20', 1000),
  eth('Vlanif100', 1000, OP_DOWN),
  mgmt('Management0'),
];

// ── Hub ──────────────────────────────────────────────────────────────────────

const HUB_INTERFACES: InterfaceTemplate[] = Array.from({ length: 8 }, (_, i) =>
  eth(`Port${i + 1}`, 100, i < 5 ? OP_UP : OP_DOWN),
);

// ── Firewall ─────────────────────────────────────────────────────────────────

const FIREWALL_INTERFACES: InterfaceTemplate[] = [
  eth('GigabitEthernet0/0', 1000),   // Outside
  eth('GigabitEthernet0/1', 1000),   // Inside
  eth('GigabitEthernet0/2', 1000),   // DMZ
  eth('GigabitEthernet0/3', 1000, OP_DOWN), // HA
  fiber('TenGigabitEthernet0/0', 'single', 10000, OP_DOWN), // Spare
  mgmt('Management0'),
  loopback('Loopback0'),
];

// ── Laptop ───────────────────────────────────────────────────────────────────

const LAPTOP_INTERFACES: InterfaceTemplate[] = [
  wifi('wlan0', 'wifi-6', 1200),
  eth('eth0', 1000, OP_DOWN),
  { name: 'bluetooth0', type: 'bluetooth', speed: 3, duplex: 'full', operationalState: OP_DOWN, adminState: DOWN },
];

// ── Desktop / Workstation ────────────────────────────────────────────────────

const DESKTOP_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  wifi('wlan0', 'wifi-5', 300, OP_DOWN),
];

// ── Server (generic) ────────────────────────────────────────────────────────

const SERVER_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
  fiber('bond0', 'single', 10000, OP_DOWN),
  mgmt('ipmi0'),
];

// ── Web Server ───────────────────────────────────────────────────────────────

const WEB_SERVER_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
  mgmt('ipmi0'),
];

// ── Database Server ──────────────────────────────────────────────────────────

const DATABASE_SERVER_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
  fiber('bond0', 'multi', 10000),
  mgmt('ipmi0'),
];

// ── File Server ──────────────────────────────────────────────────────────────

const FILE_SERVER_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
  fiber('bond0', 'single', 10000),
  mgmt('ipmi0'),
];

// ── Access Point ─────────────────────────────────────────────────────────────

const AP_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  wifi('radio0', 'wifi-5', 867),
  wifi('radio1', 'wifi-2.4', 150),
];

// ── Wireless Router ──────────────────────────────────────────────────────────

const WIRELESS_ROUTER_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),       // WAN
  eth('eth1', 1000),       // LAN1
  eth('eth2', 1000, OP_DOWN), // LAN2
  eth('eth3', 1000, OP_DOWN), // LAN3
  wifi('wlan0', 'wifi-6', 1200),
];

// ── Printer ──────────────────────────────────────────────────────────────────

const PRINTER_INTERFACES: InterfaceTemplate[] = [
  { name: 'eth0', type: 'ethernet' as InterfaceType, speed: 100, duplex: 'full', operationalState: OP_UP, adminState: UP },
  wifi('wlan0', 'wifi-5', 54, OP_DOWN),
];

// ── Camera (IoT/PoE) ────────────────────────────────────────────────────────

const CAMERA_INTERFACES: InterfaceTemplate[] = [
  { name: 'eth0', type: 'poe', speed: 100, duplex: 'full', operationalState: OP_UP, adminState: UP },
  wifi('wlan0', 'wifi-5', 150, OP_DOWN),
];

// ── Smartphone ───────────────────────────────────────────────────────────────

const SMARTPHONE_INTERFACES: InterfaceTemplate[] = [
  wifi('wlan0', 'wifi-6', 1200),
  { name: 'bluetooth0', type: 'bluetooth', speed: 3, duplex: 'full', operationalState: OP_DOWN, adminState: DOWN },
  { name: 'cellular0', type: 'wan', speed: 100, duplex: 'full', operationalState: OP_UP, adminState: UP },
];

// ── Tablet ───────────────────────────────────────────────────────────────────

const TABLET_INTERFACES: InterfaceTemplate[] = [
  wifi('wlan0', 'wifi-6', 1200),
  { name: 'bluetooth0', type: 'bluetooth', speed: 3, duplex: 'full', operationalState: OP_DOWN, adminState: DOWN },
];

// ── IoT Device ───────────────────────────────────────────────────────────────

const IOT_INTERFACES: InterfaceTemplate[] = [
  { name: 'eth0', type: 'ethernet', speed: 100, duplex: 'full', operationalState: OP_UP, adminState: UP },
  wifi('wlan0', 'wifi-2.4', 72, OP_DOWN),
];

// ── VPN Gateway ──────────────────────────────────────────────────────────────

const VPN_GW_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),       // Outside
  eth('eth1', 1000),       // Inside
  { name: 'tunnel0', type: 'tunnel', speed: 1000, duplex: 'full', operationalState: OP_DOWN, adminState: DOWN },
  mgmt('Management0'),
];

// ── Load Balancer ────────────────────────────────────────────────────────────

const LB_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),       // VIP
  eth('eth1', 1000),       // Backend
  eth('eth2', 1000, OP_DOWN),
  fiber('bond0', 'single', 10000, OP_DOWN),
  mgmt('Management0'),
];

// ── Modem ────────────────────────────────────────────────────────────────────

const MODEM_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 100),
  { name: 'coax0', type: 'wan', speed: 1000, duplex: 'full', operationalState: OP_UP, adminState: UP },
];

// ── IDS/IPS ──────────────────────────────────────────────────────────────────

const IDS_IPS_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),       // Monitoring
  eth('eth1', 1000),       // Management
  fiber('eth2', 'single', 10000, OP_DOWN),
  mgmt('Management0'),
];

// ── Reverse Proxy ────────────────────────────────────────────────────────────

const REV_PROXY_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),       // Frontend
  eth('eth1', 1000),       // Backend
  mgmt('Management0'),
];

// ── Domain Controller ────────────────────────────────────────────────────────

const DC_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
];

// ── Wireless Controller ──────────────────────────────────────────────────────

const WLC_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('eth1', 1000),
  fiber('eth2', 'single', 10000),
  mgmt('Management0'),
];

// ── Container Host ───────────────────────────────────────────────────────────

const CONTAINER_HOST_INTERFACES: InterfaceTemplate[] = [
  eth('eth0', 1000),
  eth('docker0', 1000),
  mgmt('Management0'),
];

// ── Virtualization Host ──────────────────────────────────────────────────────

const VIRT_HOST_INTERFACES: InterfaceTemplate[] = [
  eth('bond0', 1000),
  eth('eth1', 1000),
  fiber('bond1', 'single', 10000),
  mgmt('ipmi0'),
];

// ── Lookup Table ─────────────────────────────────────────────────────────────

const INTERFACE_MAP: Record<string, InterfaceTemplate[]> = {
  'router':                ROUTER_INTERFACES,
  'switch':                SWITCH_24_INTERFACES,
  'layer3-switch':         L3_SWITCH_INTERFACES,
  'hub':                   HUB_INTERFACES,
  'modem':                 MODEM_INTERFACES,
  'firewall':              FIREWALL_INTERFACES,
  'ids':                   IDS_IPS_INTERFACES,
  'ips':                   IDS_IPS_INTERFACES,
  'vpn-gateway':           VPN_GW_INTERFACES,
  'reverse-proxy':         REV_PROXY_INTERFACES,
  'load-balancer':         LB_INTERFACES,
  'wireless-router':       WIRELESS_ROUTER_INTERFACES,
  'access-point':          AP_INTERFACES,
  'wireless-controller':   WLC_INTERFACES,
  'workstation':           DESKTOP_INTERFACES,
  'laptop':                LAPTOP_INTERFACES,
  'smartphone':            SMARTPHONE_INTERFACES,
  'tablet':                TABLET_INTERFACES,
  'printer':               PRINTER_INTERFACES,
  'iot':                   IOT_INTERFACES,
  'camera':                CAMERA_INTERFACES,
  'server':                SERVER_INTERFACES,
  'web-server':            WEB_SERVER_INTERFACES,
  'dns-server':            WEB_SERVER_INTERFACES,
  'dhcp-server':           WEB_SERVER_INTERFACES,
  'smtp-server':           WEB_SERVER_INTERFACES,
  'ftp-server':            FILE_SERVER_INTERFACES,
  'database-server':       DATABASE_SERVER_INTERFACES,
  'file-server':           FILE_SERVER_INTERFACES,
  'proxy-server':          REV_PROXY_INTERFACES,
  'ldap-server':           DC_INTERFACES,
  'domain-controller':     DC_INTERFACES,
  'ca-server':             SERVER_INTERFACES,
  'ntp-server':            WEB_SERVER_INTERFACES,
  'syslog-server':         WEB_SERVER_INTERFACES,
  'siem-server':           SERVER_INTERFACES,
  'vpn-server':            VPN_GW_INTERFACES,
  'container-host':        CONTAINER_HOST_INTERFACES,
  'virtualization-host':   VIRT_HOST_INTERFACES,
};

let ifaceCounter = 0;

export function createDefaultInterfaces(deviceType: string): import('./types').NetworkInterface[] {
  const templates = INTERFACE_MAP[deviceType] || INTERFACE_MAP['server'];
  return templates.map((t) => ({
    id: `iface-${++ifaceCounter}`,
    name: t.name,
    type: t.type,
    speed: t.speed,
    duplex: t.duplex,
    operationalState: t.operationalState,
    adminState: t.adminState,
    statistics: { rxPackets: 0, txPackets: 0, rxBytes: 0, txBytes: 0, rxErrors: 0, txErrors: 0, rxDrops: 0, txDrops: 0 },
  }));
}

export function getDefaultInterfaceTemplates(deviceType: string): InterfaceTemplate[] {
  return INTERFACE_MAP[deviceType] || INTERFACE_MAP['server'];
}

export function resetInterfaceCounter(): void {
  ifaceCounter = 0;
}
