import type { DiagramDefinition } from '@/shared/components/diagrams/types';
import { createNodeSequenceAnimation } from '../animationSequence';

export const webReconFlowDiagram: DiagramDefinition = {
  id: 'web-recon-flow',
  type: 'process-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'Web Recon Flow',
  description: 'From passive clues to a map of the target.',
  nodes: [
    {
      id: 'passive',
      type: 'user',
      label: 'Passive Recon',
      sublabel: 'WHOIS · DNS',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'Passive recon uses public records (WHOIS, DNS) without touching the target.',
      },
    },
    {
      id: 'subdomains',
      type: 'cloud-service',
      label: 'Subdomains',
      sublabel: 'enumeration',
      position: { x: 300, y: 0 },
      metadata: {
        explanation: 'Enumerate subdomains to find forgotten or dev systems that are easier targets.',
      },
    },
    {
      id: 'directories',
      type: 'file-system',
      label: 'Directories',
      sublabel: 'brute-force',
      position: { x: 600, y: 0 },
      metadata: {
        explanation: 'Brute-force paths to discover admin panels, backups, and hidden files.',
      },
    },
    {
      id: 'tech',
      type: 'monitoring',
      label: 'Technology',
      sublabel: 'fingerprint',
      position: { x: 900, y: 0 },
      metadata: {
        explanation: 'Fingerprint servers and frameworks from headers to pick the right attacks.',
      },
    },
    {
      id: 'report',
      type: 'data-store',
      label: 'Findings',
      position: { x: 1200, y: 0 },
      metadata: { explanation: 'Collect everything into a report that guides the next phase.' },
    },
  ],
  edges: [
    { id: 'r0', source: 'passive', target: 'subdomains', type: 'dependency' },
    { id: 'r1', source: 'subdomains', target: 'directories', type: 'dependency' },
    { id: 'r2', source: 'directories', target: 'tech', type: 'dependency' },
    { id: 'r3', source: 'tech', target: 'report', type: 'dependency' },
  ],
  animation: createNodeSequenceAnimation(
    [
      { nodeId: 'passive', description: '1 · Passive recon: WHOIS and DNS give free clues.' },
      { nodeId: 'subdomains', description: '2 · Enumerate subdomains to widen the attack surface.' },
      { nodeId: 'directories', description: '3 · Brute-force directories for hidden endpoints.' },
      { nodeId: 'tech', description: '4 · Fingerprint the technology stack.' },
      { nodeId: 'report', description: '5 · Record findings to guide exploitation.', state: 'success' },
    ],
    { stepDuration: 1200 }
  ),
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'A web reconnaissance flow',
    ariaDescription:
      'Recon moves from passive WHOIS and DNS, to subdomain enumeration, directory brute-forcing, technology fingerprinting, and finally a findings report.',
  },
};
