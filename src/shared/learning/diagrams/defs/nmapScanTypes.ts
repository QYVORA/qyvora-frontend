import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const nmapScanTypesDiagram: DiagramDefinition = {
  id: 'nmap-scan-types',
  type: 'process-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'Port States in a Scan',
  description: 'How a scanner tells an open, closed, and filtered port apart.',
  nodes: [
    {
      id: 'scanner',
      type: 'attacker',
      label: 'Scanner',
      position: { x: 0, y: 0 },
      metadata: { explanation: 'The scanner sends a probe (for example a SYN) to a port.' },
    },
    {
      id: 'target',
      type: 'target',
      label: 'Target',
      position: { x: 300, y: 0 },
      metadata: { explanation: 'The target host decides how to answer each probe.' },
    },
    {
      id: 'open',
      type: 'service',
      label: 'Open',
      sublabel: 'SYN-ACK',
      position: { x: 600, y: 0 },
      metadata: {
        explanation: 'An open port replies with SYN-ACK — a service is listening here.',
      },
    },
    {
      id: 'closed',
      type: 'component',
      label: 'Closed',
      sublabel: 'RST',
      position: { x: 600, y: 120 },
      metadata: {
        explanation: 'A closed port replies with RST — the host is up but nothing listens on that port.',
      },
    },
    {
      id: 'filtered',
      type: 'firewall',
      label: 'Filtered',
      sublabel: 'no reply',
      position: { x: 600, y: 240 },
      metadata: {
        explanation:
          'A filtered port gives no response at all — a firewall is silently dropping the probe.',
      },
    },
  ],
  edges: [
    { id: 'probe', source: 'scanner', target: 'target', type: 'data-flow', label: 'SYN' },
    { id: 'synack', source: 'target', target: 'open', type: 'request-response', label: 'SYN-ACK' },
    { id: 'rst', source: 'target', target: 'closed', type: 'data-flow', label: 'RST' },
    { id: 'drop', source: 'target', target: 'filtered', type: 'blocked-connection', label: '—' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'probe',
        duration: 1100,
        description: '1 · Scanner → Target: SYN to the port.',
        actions: [
          { type: 'node-state-change', nodeId: 'scanner', state: 'active' },
          { type: 'edge-animate', edgeId: 'probe', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'open',
        duration: 1100,
        description: '2 · Open — the target answers with SYN-ACK.',
        actions: [
          { type: 'node-state-change', nodeId: 'scanner', state: 'normal' },
          { type: 'node-state-change', nodeId: 'open', state: 'success' },
          { type: 'edge-animate', edgeId: 'synack', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'closed',
        duration: 1100,
        description: '3 · Closed — the target answers with RST.',
        actions: [
          { type: 'node-state-change', nodeId: 'open', state: 'normal' },
          { type: 'node-state-change', nodeId: 'closed', state: 'warning' },
          { type: 'edge-animate', edgeId: 'rst', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'filtered',
        duration: 1100,
        description: '4 · Filtered — no reply at all; a firewall is dropping the probe.',
        actions: [
          { type: 'node-state-change', nodeId: 'closed', state: 'normal' },
          { type: 'node-state-change', nodeId: 'filtered', state: 'blocked' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'Open, closed, and filtered port states during a scan',
    ariaDescription:
      'A scanner sends a SYN to a target. An open port replies SYN-ACK, a closed port replies RST, and a filtered port gives no reply because a firewall dropped it.',
  },
};
