import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const dnsResolutionDiagram: DiagramDefinition = {
  id: 'dns-resolution',
  type: 'process-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'DNS Resolution',
  description: 'Turning a name like example.com into an IP address.',
  nodes: [
    {
      id: 'client',
      type: 'workstation',
      label: 'Client',
      position: { x: 0, y: 0 },
      tooltip: 'The machine that needs to resolve a domain name.',
      metadata: {
        explanation:
          'The client only knows the name (example.com). It asks a resolver to translate it into an IP address.',
      },
    },
    {
      id: 'resolver',
      type: 'dns-server',
      label: 'Resolver',
      position: { x: 340, y: 0 },
      tooltip: 'Usually your ISP’s resolver — it does the legwork and caches answers.',
      metadata: {
        explanation:
          'The resolver checks its cache first. On a miss it queries other name servers on the client’s behalf.',
      },
    },
    {
      id: 'authoritative',
      type: 'dns-server',
      label: 'Authoritative',
      position: { x: 340, y: 190 },
      tooltip: 'The name server that holds the real records for the domain.',
      metadata: {
        explanation:
          'The authoritative name server owns the zone and returns the definitive record, such as the A record with the IP.',
      },
    },
    {
      id: 'webserver',
      type: 'web-server',
      label: 'Web Server',
      position: { x: 680, y: 0 },
      tooltip: 'The server the client can now reach by IP address.',
      metadata: {
        explanation:
          'Once the client has the IP it can open a TCP connection and send its HTTP request.',
      },
    },
  ],
  edges: [
    { id: 'query', source: 'client', target: 'resolver', type: 'request-response', label: 'query' },
    { id: 'lookup', source: 'resolver', target: 'authoritative', type: 'data-flow', label: 'lookup' },
    { id: 'answer', source: 'authoritative', target: 'resolver', type: 'data-flow', label: 'A record' },
    { id: 'response', source: 'resolver', target: 'client', type: 'request-response', label: 'IP' },
    { id: 'connect', source: 'client', target: 'webserver', type: 'data-flow', label: 'connect' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'query',
        duration: 1200,
        description: '1 · Client → Resolver: “What is example.com?”',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'active' },
          { type: 'edge-animate', edgeId: 'query', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'lookup',
        duration: 1200,
        description: '2 · Resolver asks the authoritative name server.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'normal' },
          { type: 'node-state-change', nodeId: 'resolver', state: 'active' },
          { type: 'edge-animate', edgeId: 'lookup', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'answer',
        duration: 1200,
        description: '3 · Authoritative server returns the A record (IP).',
        actions: [
          { type: 'edge-animate', edgeId: 'answer', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'response',
        duration: 1200,
        description: '4 · Resolver caches the answer and returns the IP.',
        actions: [
          { type: 'node-state-change', nodeId: 'resolver', state: 'success' },
          { type: 'edge-animate', edgeId: 'response', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'connect',
        duration: 1000,
        description: '5 · Client connects to the web server using the IP.',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'success' },
          { type: 'edge-animate', edgeId: 'connect', animation: 'flow', direction: 'forward' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'DNS resolution from a client through a resolver to an authoritative server',
    ariaDescription:
      'A client asks a resolver for the IP of a domain. The resolver queries the authoritative name server, caches the answer, returns it to the client, which then connects to the web server.',
  },
};
