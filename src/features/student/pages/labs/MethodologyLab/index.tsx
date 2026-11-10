import { Scale } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { METHODOLOGY_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const methodologyDiagram: DiagramDefinition = {
  id: 'methodology-phases',
  type: 'process-flow',
  renderer: 'react-flow',
  title: 'Penetration Testing Methodology',
  description: 'Standard phases of a penetration test engagement',
  nodes: [
    { id: 'recon', type: 'process', label: 'Reconnaissance', position: { x: 0, y: 0 }, state: 'normal' },
    { id: 'scan', type: 'process', label: 'Scanning', position: { x: 180, y: 0 }, state: 'normal' },
    { id: 'enum', type: 'process', label: 'Enumeration', position: { x: 360, y: 0 }, state: 'normal' },
    { id: 'exploit', type: 'process', label: 'Exploitation', position: { x: 540, y: 0 }, state: 'normal' },
    { id: 'postexploit', type: 'process', label: 'Post-Exploitation', position: { x: 720, y: 0 }, state: 'normal' },
    { id: 'report', type: 'process', label: 'Reporting', position: { x: 900, y: 0 }, state: 'normal' },
  ],
  edges: [
    { id: 'e1', source: 'recon', target: 'scan', type: 'data-flow', label: '' },
    { id: 'e2', source: 'scan', target: 'enum', type: 'data-flow', label: '' },
    { id: 'e3', source: 'enum', target: 'exploit', type: 'data-flow', label: '' },
    { id: 'e4', source: 'exploit', target: 'postexploit', type: 'data-flow', label: '' },
    { id: 'e5', source: 'postexploit', target: 'report', type: 'data-flow', label: '' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const MethodologyLab = () => (
  <WebLabPage
    labId="methodology"
    title="Engagement Methodology"
    accentWord="Lab"
    description="Verify scope authorization and build an attack-surface map the way a real assessment demands. QOSE-M01 — Offensive Security Methodology."
    icon={<Scale className="w-6 h-6" />}
    scenarios={METHODOLOGY_SCENARIOS}
    relatedLabId="methodology"
    diagram={<Diagram definition={methodologyDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default MethodologyLab;
