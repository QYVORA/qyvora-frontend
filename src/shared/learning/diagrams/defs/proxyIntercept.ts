import type { DiagramDefinition } from '@/shared/components/diagrams/types';

export const proxyInterceptDiagram: DiagramDefinition = {
  id: 'proxy-intercept',
  type: 'process-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'Intercepting Proxy',
  description: 'How a proxy sits in the middle and lets you read and edit traffic.',
  nodes: [
    {
      id: 'browser',
      type: 'browser',
      label: 'Browser',
      position: { x: 0, y: 0 },
      metadata: {
        explanation: 'The browser is configured to send all traffic to the proxy instead of the server.',
      },
    },
    {
      id: 'proxy',
      type: 'proxy',
      label: 'Intercepting Proxy',
      position: { x: 340, y: 0 },
      metadata: {
        explanation:
          'The proxy pauses each request so you can read or modify it before forwarding it.',
      },
    },
    {
      id: 'server',
      type: 'web-server',
      label: 'Server',
      position: { x: 680, y: 0 },
      metadata: {
        explanation: 'The server sees the request the proxy forwarded — which may be modified.',
      },
    },
  ],
  edges: [
    { id: 'to-proxy', source: 'browser', target: 'proxy', type: 'data-flow', label: 'request' },
    { id: 'to-server', source: 'proxy', target: 'server', type: 'data-flow', label: 'forward' },
    { id: 'to-proxy-resp', source: 'server', target: 'proxy', type: 'data-flow', label: 'response' },
    { id: 'to-browser', source: 'proxy', target: 'browser', type: 'data-flow', label: 'response' },
  ],
  animation: {
    type: 'state-transition',
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
    stages: [
      {
        id: 'request',
        duration: 1100,
        description: '1 · Browser → Proxy: the request is captured.',
        actions: [
          { type: 'node-state-change', nodeId: 'browser', state: 'active' },
          { type: 'edge-animate', edgeId: 'to-proxy', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'inspect',
        duration: 1100,
        description: '2 · You inspect and edit the request in the proxy.',
        actions: [
          { type: 'node-state-change', nodeId: 'proxy', state: 'highlighted' },
        ],
      },
      {
        id: 'forward',
        duration: 1100,
        description: '3 · Proxy → Server: the (possibly modified) request is forwarded.',
        actions: [
          { type: 'edge-animate', edgeId: 'to-server', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'response',
        duration: 1100,
        description: '4 · Server → Proxy → Browser: the response comes back through the proxy.',
        actions: [
          { type: 'node-state-change', nodeId: 'server', state: 'success' },
          { type: 'edge-animate', edgeId: 'to-proxy-resp', animation: 'flow', direction: 'forward' },
          { type: 'edge-animate', edgeId: 'to-browser', animation: 'flow', direction: 'forward' },
        ],
      },
    ],
  },
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'An intercepting proxy between a browser and a server',
    ariaDescription:
      'The browser sends a request to the proxy, which lets you inspect and edit it before forwarding it to the server and returning the response.',
  },
};
