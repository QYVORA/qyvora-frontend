import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const wifi4WayHandshakeDiagram: DiagramDefinition = {
  id: 'wifi-4way-handshake',
  type: 'sequence',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'WPA 4-Way Handshake',
  description: 'The exchange that turns a Wi-Fi password into session keys.',
  nodes: [
    {
      id: 'client',
      type: 'laptop',
      label: 'Client',
      position: { x: 0, y: 0 },
      metadata: { explanation: 'The device that knows the Wi-Fi passphrase.' },
    },
    {
      id: 'ap',
      type: 'access-point',
      label: 'Access Point',
      position: { x: 340, y: 0 },
      metadata: {
        explanation: 'The AP and client each prove they know the passphrase without sending it.',
      },
    },
  ],
  edges: [
    { id: 'm1', source: 'ap', target: 'client', type: 'wireless-link', label: 'ANonce' },
    { id: 'm2', source: 'client', target: 'ap', type: 'wireless-link', label: 'SNonce + MIC' },
    { id: 'm3', source: 'ap', target: 'client', type: 'wireless-link', label: 'GTK + MIC' },
    { id: 'm4', source: 'client', target: 'ap', type: 'wireless-link', label: 'ACK' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'm1',
        duration: 1100,
        description: '1 · AP sends a random number (ANonce).',
        actions: [
          { type: 'node-state-change', nodeId: 'ap', state: 'active' },
          { type: 'edge-animate', edgeId: 'm1', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'm2',
        duration: 1100,
        description: '2 · Client replies with its own nonce and a MIC.',
        actions: [
          { type: 'edge-animate', edgeId: 'm2', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'm3',
        duration: 1100,
        description: '3 · AP sends the group key and a MIC.',
        actions: [
          { type: 'edge-animate', edgeId: 'm3', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'm4',
        duration: 1000,
        description: '4 · Client confirms — encryption is now active.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'success' },
          { type: 'node-state-change', nodeId: 'ap', state: 'success' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'The WPA 4-way handshake between a client and an access point',
    ariaDescription:
      'The access point sends an ANonce, the client replies with an SNonce and MIC, the AP sends the group key and MIC, and the client acknowledges to activate encryption.',
  },
};
