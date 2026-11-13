import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const tcpThreeWayHandshakeDiagram: DiagramDefinition = {
  id: 'tcp-three-way-handshake',
  type: 'sequence',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'TCP Three-Way Handshake',
  description: 'How two machines agree to talk before any data is sent.',
  nodes: [
    {
      id: 'client',
      type: 'client',
      label: 'Client',
      position: { x: 0, y: 0 },
      tooltip: 'The machine that starts the connection — your browser or a tool like netcat.',
      metadata: {
        explanation:
          'The client initiates the connection. It picks a random starting sequence number so both sides can track the bytes they send.',
      },
    },
    {
      id: 'server',
      type: 'server',
      label: 'Server',
      position: { x: 340, y: 0 },
      tooltip: 'The machine listening on a port, waiting for a connection.',
      metadata: {
        explanation:
          'The server listens on a port. It acknowledges the client and picks its own random sequence number.',
      },
    },
  ],
  edges: [
    { id: 'syn', source: 'client', target: 'server', type: 'data-flow', label: 'SYN' },
    { id: 'synack', source: 'server', target: 'client', type: 'data-flow', label: 'SYN-ACK' },
    { id: 'ack', source: 'client', target: 'server', type: 'data-flow', label: 'ACK' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'syn',
        duration: 1200,
        description: '1 · Client → Server: SYN — “Can we talk?”',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'active' },
          { type: 'edge-animate', edgeId: 'syn', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'synack',
        duration: 1200,
        description: '2 · Server → Client: SYN-ACK — “Yes, and I am ready.”',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'normal' },
          { type: 'node-state-change', nodeId: 'server', state: 'active' },
          { type: 'edge-animate', edgeId: 'synack', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'ack',
        duration: 1200,
        description: '3 · Client → Server: ACK — “Great, let us begin.”',
        actions: [
          { type: 'node-state-change', nodeId: 'server', state: 'normal' },
          { type: 'edge-animate', edgeId: 'ack', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'established',
        duration: 900,
        description: 'Connection established — data can now flow.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'success' },
          { type: 'node-state-change', nodeId: 'server', state: 'success' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'TCP three-way handshake between a client and a server',
    ariaDescription:
      'A client sends SYN to a server, the server replies with SYN-ACK, and the client confirms with ACK to establish the connection.',
  },
};
