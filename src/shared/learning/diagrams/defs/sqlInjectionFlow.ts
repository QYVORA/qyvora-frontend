import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const sqlInjectionFlowDiagram: DiagramDefinition = {
  id: 'sql-injection-flow',
  type: 'attack-path',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'SQL Injection Flow',
  description: 'How user input becomes an attacker-controlled query.',
  nodes: [
    {
      id: 'attacker',
      type: 'attacker',
      label: 'Attacker',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'The attacker submits input like:  \' OR 1=1 --  into a form field.',
      },
    },
    {
      id: 'webapp',
      type: 'web-server',
      label: 'Web App',
      position: { x: 320, y: 0 },
      metadata: {
        explanation:
          'If the app concatenates input straight into SQL, the input becomes part of the query.',
      },
    },
    {
      id: 'database',
      type: 'database',
      label: 'Database',
      position: { x: 640, y: 0 },
      metadata: {
        explanation: 'The database runs the crafted query and returns far more than intended.',
      },
    },
  ],
  edges: [
    { id: 'input', source: 'attacker', target: 'webapp', type: 'attack-path', label: "input ' OR 1=1 --" },
    { id: 'query', source: 'webapp', target: 'database', type: 'data-flow', label: 'unsafe query' },
    { id: 'data', source: 'database', target: 'webapp', type: 'data-flow', label: 'all rows' },
    { id: 'leak', source: 'webapp', target: 'attacker', type: 'attack-path', label: 'leaked data' },
  ],
  animation: {
    type: 'attack-sequence',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'input',
        duration: 1100,
        description: '1 · Attacker submits input containing SQL syntax.',
        actions: [
          { type: 'node-state-change', nodeId: 'attacker', state: 'active' },
          { type: 'edge-animate', edgeId: 'input', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'query',
        duration: 1100,
        description: '2 · The app builds an unsafe query by concatenating input.',
        actions: [
          { type: 'node-state-change', nodeId: 'webapp', state: 'compromised' },
          { type: 'edge-animate', edgeId: 'query', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'data',
        duration: 1100,
        description: '3 · The database returns rows the attacker should never see.',
        actions: [
          { type: 'node-state-change', nodeId: 'database', state: 'compromised' },
          { type: 'edge-animate', edgeId: 'data', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'leak',
        duration: 1000,
        description: '4 · Data is sent back to the attacker.',
        actions: [
          { type: 'edge-animate', edgeId: 'leak', animation: 'flow', direction: 'forward' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'SQL injection from attacker input to database leak',
    ariaDescription:
      'An attacker submits SQL syntax through a web app. The app concatenates it into an unsafe query, the database returns extra rows, and the data leaks back to the attacker.',
  },
};
