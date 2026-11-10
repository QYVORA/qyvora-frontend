import { FolderTree } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { AD_ENUM_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const adEnumDiagram: DiagramDefinition = {
  id: 'ad-enum-topology',
  type: 'network-topology',
  renderer: 'react-flow',
  title: 'Active Directory Topology',
  description: 'AD environment with attacker enumeration path',
  nodes: [
    { id: 'attacker', type: 'attacker', label: 'Attacker Workstation', position: { x: 0, y: 120 }, state: 'active' },
    { id: 'dc', type: 'directory-service', label: 'Domain Controller', position: { x: 260, y: 120 }, state: 'highlighted' },
    { id: 'fileserver', type: 'server', label: 'File Server', position: { x: 520, y: 0 }, state: 'normal' },
    { id: 'exchange', type: 'mail-server', label: 'Exchange Server', position: { x: 520, y: 120 }, state: 'normal' },
    { id: 'ws1', type: 'workstation', label: 'Workstation 1', position: { x: 520, y: 220 }, state: 'normal' },
    { id: 'ws2', type: 'workstation', label: 'Workstation 2', position: { x: 520, y: 320 }, state: 'normal' },
  ],
  edges: [
    { id: 'e1', source: 'attacker', target: 'dc', type: 'attack-path', label: 'LDAP Enum' },
    { id: 'e2', source: 'dc', target: 'fileserver', type: 'logical-link', label: '' },
    { id: 'e3', source: 'dc', target: 'exchange', type: 'logical-link', label: '' },
    { id: 'e4', source: 'dc', target: 'ws1', type: 'logical-link', label: '' },
    { id: 'e5', source: 'dc', target: 'ws2', type: 'logical-link', label: '' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const AdEnumLab = () => (
  <WebLabPage
    labId="ad-enum"
    title="AD Enumeration"
    accentWord="Lab"
    description="Map a Windows domain over LDAP and chart attack paths with BloodHound. QOSE-M09 — Active Directory, Part 1."
    icon={<FolderTree className="w-6 h-6" />}
    scenarios={AD_ENUM_SCENARIOS}
    relatedLabId="ad-enum"
    diagram={<Diagram definition={adEnumDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default AdEnumLab;
