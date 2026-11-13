import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const networkTopologyBasicDiagram: DiagramDefinition = {
  id: 'network-topology-basic',
  type: 'network-topology',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'A Basic Network Topology',
  description: 'How traffic enters a network and reaches the devices inside it.',
  nodes: [
    {
      id: 'internet',
      type: 'cloud-service',
      label: 'Internet',
      position: { x: 0, y: 120 },
      tooltip: 'Everything outside your network.',
      metadata: { explanation: 'Traffic from the public internet arrives at your network edge.' },
    },
    {
      id: 'firewall',
      type: 'firewall',
      label: 'Firewall',
      position: { x: 220, y: 120 },
      tooltip: 'Filters traffic by rules before it reaches the LAN.',
      metadata: {
        explanation:
          'The firewall inspects packets and allows or blocks them based on port and source rules.',
      },
    },
    {
      id: 'router',
      type: 'router',
      label: 'Router',
      position: { x: 440, y: 120 },
      tooltip: 'Routes packets between networks.',
      metadata: {
        explanation:
          'The router moves packets between the outside network and your internal subnets.',
      },
    },
    {
      id: 'switch',
      type: 'switch',
      label: 'Switch',
      position: { x: 660, y: 120 },
      tooltip: 'Connects devices on the same local network.',
      metadata: {
        explanation:
          'The switch forwards frames to the correct device on the LAN using MAC addresses.',
      },
    },
    {
      id: 'server',
      type: 'web-server',
      label: 'Server',
      position: { x: 900, y: 0 },
      tooltip: 'A machine that serves data to clients.',
      metadata: { explanation: 'The server hosts a service other devices connect to.' },
    },
    {
      id: 'workstation',
      type: 'workstation',
      label: 'Workstation',
      position: { x: 900, y: 120 },
      tooltip: 'An employee’s desktop machine.',
      metadata: { explanation: 'A workstation is a normal computer used day to day.' },
    },
    {
      id: 'laptop',
      type: 'laptop',
      label: 'Laptop',
      position: { x: 900, y: 240 },
      tooltip: 'A portable device on the same network.',
      metadata: { explanation: 'A laptop connects over Wi-Fi or cable to the same LAN.' },
    },
  ],
  edges: [
    { id: 'net-0', source: 'internet', target: 'firewall', type: 'physical-link' },
    { id: 'net-1', source: 'firewall', target: 'router', type: 'physical-link' },
    { id: 'net-2', source: 'router', target: 'switch', type: 'physical-link' },
    { id: 'net-3', source: 'switch', target: 'server', type: 'physical-link' },
    { id: 'net-4', source: 'switch', target: 'workstation', type: 'physical-link' },
    { id: 'net-5', source: 'switch', target: 'laptop', type: 'physical-link' },
  ],
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'A basic network topology',
    ariaDescription:
      'The internet connects through a firewall and router to a switch, which connects a server, a workstation and a laptop.',
  },
};
