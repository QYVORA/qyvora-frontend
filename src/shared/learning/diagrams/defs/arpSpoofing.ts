import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const arpSpoofingDiagram: DiagramDefinition = {
  id: 'arp-spoofing',
  type: 'attack-path',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'ARP Spoofing',
  description: 'How an attacker inserts themselves between a victim and the gateway.',
  nodes: [
    {
      id: 'victim',
      type: 'workstation',
      label: 'Victim',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'The victim believes the attacker’s MAC address belongs to the gateway.',
      },
    },
    {
      id: 'attacker',
      type: 'attacker',
      label: 'Attacker',
      position: { x: 340, y: 180 },
      metadata: {
        explanation: 'The attacker sends forged ARP replies claiming to be the gateway.',
      },
    },
    {
      id: 'gateway',
      type: 'router',
      label: 'Gateway',
      position: { x: 680, y: 0 },
      metadata: {
        explanation: 'The gateway also believes the attacker’s MAC belongs to the victim.',
      },
    },
  ],
  edges: [
    { id: 'arp1', source: 'attacker', target: 'victim', type: 'attack-path', label: '“I am the gateway”' },
    { id: 'arp2', source: 'attacker', target: 'gateway', type: 'attack-path', label: '“I am the victim”' },
    { id: 'flow', source: 'victim', target: 'attacker', type: 'data-flow', label: 'traffic' },
    { id: 'flow2', source: 'attacker', target: 'gateway', type: 'data-flow', label: 'relayed' },
  ],
  animation: {
    type: 'attack-sequence',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'poison-victim',
        duration: 1200,
        description: '1 · Attacker tells the victim: “the gateway is at my MAC.”',
        actions: [
          { type: 'node-state-change', nodeId: 'attacker', state: 'active' },
          { type: 'edge-animate', edgeId: 'arp1', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'poison-gateway',
        duration: 1200,
        description: '2 · Attacker tells the gateway: “the victim is at my MAC.”',
        actions: [
          { type: 'edge-animate', edgeId: 'arp2', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'man-in-the-middle',
        duration: 1200,
        description: '3 · Traffic now flows through the attacker — a man-in-the-middle.',
        actions: [
          { type: 'node-state-change', nodeId: 'victim', state: 'compromised' },
          { type: 'node-state-change', nodeId: 'gateway', state: 'compromised' },
          { type: 'edge-animate', edgeId: 'flow', animation: 'flow', direction: 'forward' },
          { type: 'edge-animate', edgeId: 'flow2', animation: 'flow', direction: 'forward' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'ARP spoofing placing an attacker between a victim and the gateway',
    ariaDescription:
      'The attacker sends forged ARP replies to the victim and gateway so both send traffic through the attacker, creating a man-in-the-middle.',
  },
};
