import { Wifi } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { WIRELESS_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const wlanDiagram: DiagramDefinition = {
  id: 'wlan-topology',
  type: 'network-topology',
  renderer: 'react-flow',
  title: 'Wireless Network Topology',
  description: 'Attacker intercepts wireless traffic between client and access point',
  nodes: [
    { id: 'attacker', type: 'attacker', label: 'Attacker Laptop', position: { x: 0, y: 80 }, state: 'active' },
    { id: 'client', type: 'client', label: 'Legitimate Client', position: { x: 0, y: 220 }, state: 'normal' },
    { id: 'ap', type: 'access-point', label: 'Access Point', position: { x: 280, y: 150 }, state: 'highlighted' },
    { id: 'router', type: 'router', label: 'Router', position: { x: 520, y: 150 }, state: 'normal' },
    { id: 'internet', type: 'cloud-service', label: 'Internet', position: { x: 760, y: 150 }, state: 'normal' },
  ],
  edges: [
    { id: 'e1', source: 'attacker', target: 'ap', type: 'wireless-link', label: 'Monitor mode' },
    { id: 'e2', source: 'client', target: 'ap', type: 'wireless-link', label: '' },
    { id: 'e3', source: 'ap', target: 'router', type: 'physical-link', label: '' },
    { id: 'e4', source: 'router', target: 'internet', type: 'logical-link', label: '' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const WlanSecurityLab = () => (
  <WebLabPage
    labId="wlan-security"
    title="Wireless Security"
    accentWord="Lab"
    description="Discover access points, assess WLAN configuration, and capture handshakes inside the controlled lab. QOSE-M08 — Wireless Security."
    icon={<Wifi className="w-6 h-6" />}
    scenarios={WIRELESS_SCENARIOS}
    relatedLabId="wlan-security"
    diagram={<Diagram definition={wlanDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default WlanSecurityLab;
