import { KeyRound } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { WEB_ACCESS_CONTROL_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const accessControlDiagram: DiagramDefinition = {
  id: 'idor-bola-flow',
  type: 'attack-path',
  renderer: 'react-flow',
  title: 'IDOR / BOLA Attack Flow',
  description: 'Attacker accesses another user\'s data by manipulating object references',
  nodes: [
    { id: 'attacker', type: 'attacker', label: 'Attacker (User A)', position: { x: 0, y: 80 }, state: 'active' },
    { id: 'api', type: 'api-gateway', label: 'API Server', position: { x: 280, y: 80 }, state: 'warning' },
    { id: 'db', type: 'database', label: 'Database', position: { x: 560, y: 80 }, state: 'normal' },
    { id: 'victimdata', type: 'data-store', label: "Victim Data (User B)", position: { x: 560, y: 220 }, state: 'compromised' },
  ],
  edges: [
    { id: 'e1', source: 'attacker', target: 'api', type: 'attack-path', label: 'Request with victim ID' },
    { id: 'e2', source: 'api', target: 'db', type: 'data-flow', label: 'No auth check' },
    { id: 'e3', source: 'db', target: 'victimdata', type: 'data-flow', label: '' },
    { id: 'e4', source: 'victimdata', target: 'attacker', type: 'data-flow', label: 'Victim data returned' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const AccessControlLab = () => (
  <WebLabPage
    labId="web-access-control"
    title="Broken Access Control"
    accentWord="Lab"
    description="Exploit IDOR and BOLA access-control flaws to read data that belongs to another user. QOSE-M03 — Web Application Security I."
    icon={<KeyRound className="w-6 h-6" />}
    scenarios={WEB_ACCESS_CONTROL_SCENARIOS}
    relatedLabId="web-access-control"
    diagram={<Diagram definition={accessControlDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default AccessControlLab;
