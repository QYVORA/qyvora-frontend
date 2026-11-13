import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const tlsHandshakeDiagram: DiagramDefinition = {
  id: 'tls-handshake',
  type: 'sequence',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'TLS Handshake',
  description: 'How HTTPS agrees on keys before any encrypted data is sent.',
  nodes: [
    {
      id: 'client',
      type: 'browser',
      label: 'Client',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'The client offers the TLS versions and ciphers it supports.',
      },
    },
    {
      id: 'server',
      type: 'web-server',
      label: 'Server',
      position: { x: 340, y: 0 },
      metadata: {
        explanation: 'The server picks a cipher and presents its certificate.',
      },
    },
  ],
  edges: [
    { id: 'hello', source: 'client', target: 'server', type: 'encrypted-channel', label: 'ClientHello' },
    { id: 'serverhello', source: 'server', target: 'client', type: 'encrypted-channel', label: 'ServerHello + cert' },
    { id: 'keys', source: 'client', target: 'server', type: 'encrypted-channel', label: 'Key exchange' },
    { id: 'ready', source: 'server', target: 'client', type: 'encrypted-channel', label: 'Finished' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'clienthello',
        duration: 1100,
        description: '1 · ClientHello — supported TLS versions and cipher suites.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'active' },
          { type: 'edge-animate', edgeId: 'hello', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'serverhello',
        duration: 1100,
        description: '2 · ServerHello + certificate — the server proves who it is.',
        actions: [
          { type: 'node-state-change', nodeId: 'server', state: 'active' },
          { type: 'edge-animate', edgeId: 'serverhello', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'keys',
        duration: 1100,
        description: '3 · Key exchange — both sides derive the same session key.',
        actions: [
          { type: 'edge-animate', edgeId: 'keys', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'finished',
        duration: 1000,
        description: '4 · Finished — the channel is encrypted; HTTP can flow safely.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'success' },
          { type: 'node-state-change', nodeId: 'server', state: 'success' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'TLS handshake between a client and a server',
    ariaDescription:
      'The client sends a ClientHello, the server replies with a ServerHello and certificate, keys are exchanged, and both finish with an encrypted channel.',
  },
};
