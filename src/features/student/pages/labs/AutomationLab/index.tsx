import { Terminal } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { AUTOMATION_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const automationDiagram: DiagramDefinition = {
  id: 'automation-pipeline',
  type: 'process-flow',
  renderer: 'react-flow',
  title: 'Security Automation Pipeline',
  description: 'Script-driven scan and report automation workflow',
  nodes: [
    { id: 'script', type: 'process', label: 'Script', position: { x: 0, y: 0 }, state: 'active' },
    { id: 'network', type: 'subnet', label: 'Target Network', position: { x: 220, y: 0 }, state: 'normal' },
    { id: 'results', type: 'data-store', label: 'Scan Results', position: { x: 440, y: 0 }, state: 'highlighted' },
    { id: 'report', type: 'data-pipeline', label: 'Report', position: { x: 660, y: 0 }, state: 'success' },
  ],
  edges: [
    { id: 'e1', source: 'script', target: 'network', type: 'data-flow', label: 'Execute' },
    { id: 'e2', source: 'network', target: 'results', type: 'data-flow', label: 'Collect' },
    { id: 'e3', source: 'results', target: 'report', type: 'data-flow', label: 'Generate' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const AutomationLab = () => (
  <WebLabPage
    labId="automation"
    title="Security Automation"
    accentWord="Lab"
    description="Build a Python port scanner and a Bash HTTP enumerator, then run them. QOSE-M11 — Offensive Security Automation."
    icon={<Terminal className="w-6 h-6" />}
    scenarios={AUTOMATION_SCENARIOS}
    relatedLabId="automation"
    diagram={<Diagram definition={automationDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default AutomationLab;
