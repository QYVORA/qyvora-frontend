import type { DiagramDefinition } from '@/shared/components/diagrams/types';
import { createRequestResponseAnimation } from '@/shared/components/diagrams/animations/animationHelpers';

export const httpRequestResponseDiagram: DiagramDefinition = {
  id: 'http-request-response',
  type: 'process-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'HTTP Request / Response',
  description: 'What actually happens when a browser asks a web server for a page.',
  nodes: [
    {
      id: 'browser',
      type: 'browser',
      label: 'Browser',
      position: { x: 0, y: 0 },
      tooltip: 'Your browser builds an HTTP request and waits for a reply.',
      metadata: {
        explanation:
          'The browser sends a request line, headers and an optional body, then waits for the server’s response.',
      },
    },
    {
      id: 'server',
      type: 'web-server',
      label: 'Web Server',
      position: { x: 340, y: 0 },
      tooltip: 'Receives the request, runs the app, and builds a response.',
      metadata: {
        explanation:
          'The web server parses the request, runs application code, and returns a status code, headers and a body.',
      },
    },
    {
      id: 'database',
      type: 'database',
      label: 'Database',
      position: { x: 340, y: 180 },
      tooltip: 'Stores the data the server needs to answer the request.',
      metadata: {
        explanation:
          'The server often queries a database to fetch or store data before it can build the response.',
      },
    },
  ],
  edges: [
    { id: 'req', source: 'browser', target: 'server', type: 'request-response', label: 'GET /' },
    { id: 'resp', source: 'server', target: 'browser', type: 'request-response', label: '200 OK' },
    { id: 'query', source: 'server', target: 'database', type: 'data-flow', label: 'query' },
    { id: 'data', source: 'database', target: 'server', type: 'data-flow', label: 'rows' },
  ],
  animation: createRequestResponseAnimation('browser', 'server', {
    request: 'req',
    response: 'resp',
  }),
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'An HTTP request and response between a browser and a web server',
    ariaDescription:
      'A browser sends an HTTP request to a web server. The server may query a database, then returns a response to the browser.',
  },
};
