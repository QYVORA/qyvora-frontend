import { Braces } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { API_SECURITY_SCENARIOS } from '@/features/student/data/simulations';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

const apiSecurityDiagram: DiagramDefinition = {
  id: 'jwt-ssrf-attack-chain',
  type: 'attack-path',
  renderer: 'react-flow',
  title: 'JWT Forgery + SSRF Attack Chain',
  description: 'Attacker forges JWT token then pivots through SSRF to reach internal services',
  nodes: [
    { id: 'attacker', type: 'attacker', label: 'Attacker', position: { x: 0, y: 80 }, state: 'active' },
    { id: 'forgedjwt', type: 'vulnerability', label: 'Forged JWT', position: { x: 200, y: 80 }, state: 'compromised' },
    { id: 'apigateway', type: 'api-gateway', label: 'API Gateway', position: { x: 400, y: 80 }, state: 'warning' },
    { id: 'backend', type: 'microservice', label: 'Backend Service', position: { x: 600, y: 80 }, state: 'highlighted' },
    { id: 'internal', type: 'cloud-service', label: 'Internal Network / Cloud Metadata', position: { x: 800, y: 80 }, state: 'compromised' },
  ],
  edges: [
    { id: 'e1', source: 'attacker', target: 'forgedjwt', type: 'attack-path', label: 'Craft' },
    { id: 'e2', source: 'forgedjwt', target: 'apigateway', type: 'attack-path', label: 'Bypass auth' },
    { id: 'e3', source: 'apigateway', target: 'backend', type: 'attack-path', label: 'SSRF pivot' },
    { id: 'e4', source: 'backend', target: 'internal', type: 'attack-path', label: 'Internal access' },
  ],
  interaction: { zoomable: true, pannable: true },
};

const ApiSecurityLab = () => (
  <WebLabPage
    labId="api-security"
    title="API Security"
    accentWord="Lab"
    description="Forge JWTs and pivot through SSRF to break API authorisation. QOSE-M05 — Advanced Web & API Security."
    icon={<Braces className="w-6 h-6" />}
    scenarios={API_SECURITY_SCENARIOS}
    relatedLabId="api-security"
    diagram={<Diagram definition={apiSecurityDiagram} showControls={false} showLegend={false} className="mb-6" />}
  />
);

export default ApiSecurityLab;
