/**
 * REFERENCE DIAGRAM EXAMPLES
 * ==========================
 * 
 * 7 reference diagrams demonstrating the system's capabilities
 * across different technical subjects.
 */

import type { DiagramDefinition } from '../types';
import { createPacketFlowAnimation, createRequestResponseAnimation } from '../animations/animationHelpers';

/**
 * 1. NETWORK TOPOLOGY
 * Basic network with clients, switches, router, firewall, and servers
 */
export const networkTopologyExample: DiagramDefinition = {
  id: 'network-topology-example',
  type: 'network-topology',
  title: 'Small Office Network Topology',
  description: 'A typical small office network configuration with multiple clients, switches, and servers.',
  renderer: 'react-flow',
  
  nodes: [
    // Clients
    { id: 'client1', type: 'laptop', label: 'Client 1', position: { x: 50, y: 50 } },
    { id: 'client2', type: 'laptop', label: 'Client 2', position: { x: 250, y: 50 } },
    { id: 'client3', type: 'workstation', label: 'Client 3', position: { x: 450, y: 50 } },
    
    // Switches
    { id: 'switch1', type: 'switch', label: 'Switch 1', position: { x: 150, y: 200 } },
    { id: 'switch2', type: 'switch', label: 'Switch 2', position: { x: 350, y: 200 } },
    
    // Router and Firewall
    { id: 'router', type: 'router', label: 'Gateway Router', sublabel: '192.168.1.1', position: { x: 250, y: 350 } },
    { id: 'firewall', type: 'firewall', label: 'Firewall', position: { x: 250, y: 500 } },
    
    // Servers
    { id: 'web-server', type: 'web-server', label: 'Web Server', sublabel: '10.0.0.10', position: { x: 150, y: 650 } },
    { id: 'db-server', type: 'database', label: 'Database', sublabel: '10.0.0.20', position: { x: 350, y: 650 } },
  ],
  
  edges: [
    // Clients to switches
    { id: 'e1', source: 'client1', target: 'switch1', type: 'physical-link' },
    { id: 'e2', source: 'client2', target: 'switch1', type: 'physical-link' },
    { id: 'e3', source: 'client3', target: 'switch2', type: 'physical-link' },
    
    // Switches to router
    { id: 'e4', source: 'switch1', target: 'router', type: 'physical-link' },
    { id: 'e5', source: 'switch2', target: 'router', type: 'physical-link' },
    
    // Router to firewall
    { id: 'e6', source: 'router', target: 'firewall', type: 'physical-link' },
    
    // Firewall to servers
    { id: 'e7', source: 'firewall', target: 'web-server', type: 'physical-link' },
    { id: 'e8', source: 'firewall', target: 'db-server', type: 'physical-link' },
  ],
  
  interaction: {
    selectable: true,
    hoverable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    showMiniMap: true,
    fullscreenable: true,
  },
  
  legend: {
    title: 'Network Devices',
    position: 'bottom-right',
    items: [
      { type: 'node', label: 'Client Device', visual: { color: '#ec4899', shape: 'rect' } },
      { type: 'node', label: 'Switch', visual: { color: '#3b82f6', shape: 'rect' } },
      { type: 'node', label: 'Router', visual: { color: '#3b82f6', shape: 'rect' } },
      { type: 'node', label: 'Firewall', visual: { color: '#ef4444', shape: 'rect' } },
      { type: 'node', label: 'Server', visual: { color: '#a855f7', shape: 'rect' } },
      { type: 'edge', label: 'Physical Link', visual: { color: '#3b82f6', style: 'solid' } },
    ],
  },
  
  accessibility: {
    ariaLabel: 'Small office network topology diagram',
    ariaDescription: 'Shows 3 client devices connected through switches and a router with firewall to web and database servers',
  },
};

/**
 * 2. WEB APPLICATION ARCHITECTURE
 * Three-tier web architecture with frontend, backend, and database
 */
export const webArchitectureExample: DiagramDefinition = {
  id: 'web-architecture-example',
  type: 'web-architecture',
  title: 'Modern Web Application Architecture',
  description: 'Three-tier architecture with load balancing, API gateway, and microservices.',
  renderer: 'react-flow',
  
  nodes: [
    // Frontend tier
    { id: 'user', type: 'user', label: 'Users', position: { x: 250, y: 50 } },
    { id: 'cdn', type: 'cdn', label: 'CDN', sublabel: 'CloudFront', position: { x: 250, y: 150 } },
    { id: 'frontend', type: 'browser', label: 'React App', position: { x: 250, y: 250 } },
    
    // Backend tier
    { id: 'load-balancer', type: 'load-balancer', label: 'Load Balancer', position: { x: 250, y: 380 } },
    { id: 'api-gateway', type: 'api-gateway', label: 'API Gateway', position: { x: 250, y: 480 } },
    { id: 'auth-service', type: 'microservice', label: 'Auth Service', position: { x: 50, y: 600 } },
    { id: 'user-service', type: 'microservice', label: 'User Service', position: { x: 200, y: 600 } },
    { id: 'order-service', type: 'microservice', label: 'Order Service', position: { x: 350, y: 600 } },
    
    // Data tier
    { id: 'cache', type: 'cache', label: 'Redis Cache', position: { x: 100, y: 750 } },
    { id: 'database', type: 'database', label: 'PostgreSQL', position: { x: 300, y: 750 } },
    { id: 'queue', type: 'queue', label: 'Message Queue', position: { x: 500, y: 600 } },
  ],
  
  edges: [
    // User to frontend
    { id: 'e1', source: 'user', target: 'cdn', type: 'request-response', label: 'HTTPS' },
    { id: 'e2', source: 'cdn', target: 'frontend', type: 'data-flow' },
    { id: 'e3', source: 'frontend', target: 'load-balancer', type: 'request-response', label: 'API Calls' },
    
    // Load balancer to API gateway
    { id: 'e4', source: 'load-balancer', target: 'api-gateway', type: 'request-response' },
    
    // API gateway to services
    { id: 'e5', source: 'api-gateway', target: 'auth-service', type: 'request-response' },
    { id: 'e6', source: 'api-gateway', target: 'user-service', type: 'request-response' },
    { id: 'e7', source: 'api-gateway', target: 'order-service', type: 'request-response' },
    
    // Services to data layer
    { id: 'e8', source: 'auth-service', target: 'cache', type: 'data-flow' },
    { id: 'e9', source: 'user-service', target: 'database', type: 'data-flow' },
    { id: 'e10', source: 'order-service', target: 'database', type: 'data-flow' },
    { id: 'e11', source: 'order-service', target: 'queue', type: 'data-flow' },
  ],
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'Web application architecture diagram',
    ariaDescription: 'Three-tier architecture showing users, CDN, frontend, load balancer, API gateway, microservices, and data stores',
  },
};

/**
 * 3. SMTP MESSAGE FLOW
 * Email transmission process with animated flow
 */
export const smtpFlowExample: DiagramDefinition = {
  id: 'smtp-flow-example',
  type: 'process-flow',
  title: 'SMTP Email Transmission',
  description: 'How an email travels from sender to recipient through SMTP servers.',
  renderer: 'react-flow',
  
  nodes: [
    { id: 'sender', type: 'user', label: 'Sender', sublabel: 'alice@example.com', position: { x: 50, y: 200 } },
    { id: 'client', type: 'laptop', label: 'Email Client', position: { x: 200, y: 200 } },
    { id: 'smtp-sender', type: 'smtp-server', label: 'Sender SMTP', sublabel: 'mail.example.com', position: { x: 400, y: 200 } },
    { id: 'smtp-receiver', type: 'smtp-server', label: 'Receiver SMTP', sublabel: 'mail.recipient.com', position: { x: 600, y: 200 } },
    { id: 'mailbox', type: 'database', label: 'Mailbox', position: { x: 800, y: 200 } },
    { id: 'recipient', type: 'user', label: 'Recipient', sublabel: 'bob@recipient.com', position: { x: 950, y: 200 } },
  ],
  
  edges: [
    { id: 'e1', source: 'sender', target: 'client', type: 'data-flow', label: 'Compose' },
    { id: 'e2', source: 'client', target: 'smtp-sender', type: 'data-flow', label: 'SMTP' },
    { id: 'e3', source: 'smtp-sender', target: 'smtp-receiver', type: 'data-flow', label: 'SMTP', animated: true },
    { id: 'e4', source: 'smtp-receiver', target: 'mailbox', type: 'data-flow', label: 'Store' },
    { id: 'e5', source: 'mailbox', target: 'recipient', type: 'data-flow', label: 'Retrieve' },
  ],
  
  animation: createPacketFlowAnimation(
    {
      nodeIds: ['sender', 'client', 'smtp-sender', 'smtp-receiver', 'mailbox', 'recipient'],
      edgeIds: ['e1', 'e2', 'e3', 'e4', 'e5'],
    },
    { duration: 3000, stageDelay: 300 }
  ),
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'SMTP email transmission process diagram',
    ariaDescription: 'Shows email flow from sender through SMTP servers to recipient mailbox',
  },
};

/**
 * 4. TCP HANDSHAKE
 * Three-way handshake with animated sequence
 */
export const tcpHandshakeExample: DiagramDefinition = {
  id: 'tcp-handshake-example',
  type: 'sequence',
  title: 'TCP Three-Way Handshake',
  description: 'Connection establishment between client and server.',
  renderer: 'react-flow',
  
  nodes: [
    { id: 'client', type: 'laptop', label: 'Client', sublabel: '192.168.1.100', position: { x: 100, y: 200 } },
    { id: 'server', type: 'server', label: 'Server', sublabel: '10.0.0.50:80', position: { x: 500, y: 200 } },
  ],
  
  edges: [
    { id: 'syn', source: 'client', target: 'server', type: 'data-flow', label: 'SYN' },
    { id: 'syn-ack', source: 'server', target: 'client', type: 'data-flow', label: 'SYN-ACK' },
    { id: 'ack', source: 'client', target: 'server', type: 'data-flow', label: 'ACK' },
  ],
  
  animation: {
    type: 'packet-flow',
    stages: [
      {
        id: 'syn',
        duration: 800,
        description: 'Client sends SYN (Synchronize)',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'active' },
          { type: 'edge-animate', edgeId: 'syn', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'syn-ack',
        duration: 800,
        description: 'Server responds with SYN-ACK',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'normal' },
          { type: 'node-state-change', nodeId: 'server', state: 'active' },
          { type: 'edge-animate', edgeId: 'syn-ack', animation: 'flow', direction: 'backward' },
        ],
      },
      {
        id: 'ack',
        duration: 800,
        description: 'Client sends ACK (Acknowledge)',
        actions: [
          { type: 'node-state-change', nodeId: 'server', state: 'normal' },
          { type: 'node-state-change', nodeId: 'client', state: 'active' },
          { type: 'edge-animate', edgeId: 'ack', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'established',
        duration: 1000,
        description: 'Connection established',
        actions: [
          { type: 'node-state-change', nodeId: 'client', state: 'success' },
          { type: 'node-state-change', nodeId: 'server', state: 'success' },
        ],
      },
    ],
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  },
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'TCP three-way handshake diagram',
    ariaDescription: 'Shows the SYN, SYN-ACK, ACK sequence between client and server',
  },
};

/**
 * 5. ENCRYPTION PROCESS
 * Plaintext to ciphertext transformation
 */
export const encryptionExample: DiagramDefinition = {
  id: 'encryption-example',
  type: 'crypto-process',
  title: 'Symmetric Encryption Process',
  description: 'How plaintext is transformed into ciphertext using a secret key.',
  renderer: 'react-flow',
  
  nodes: [
    { id: 'plaintext', type: 'plaintext', label: 'Plaintext', sublabel: '"Hello World"', position: { x: 50, y: 200 } },
    { id: 'key', type: 'key', label: 'Secret Key', sublabel: '256-bit AES', position: { x: 300, y: 100 } },
    { id: 'encryption', type: 'encryption-process', label: 'Encryption', sublabel: 'AES-256-GCM', position: { x: 300, y: 200 } },
    { id: 'ciphertext', type: 'ciphertext', label: 'Ciphertext', sublabel: '0x4f8a2c...', position: { x: 550, y: 200 } },
  ],
  
  edges: [
    { id: 'e1', source: 'plaintext', target: 'encryption', type: 'data-flow' },
    { id: 'e2', source: 'key', target: 'encryption', type: 'logical-link', label: 'Uses', dashed: true },
    { id: 'e3', source: 'encryption', target: 'ciphertext', type: 'transform' },
  ],
  
  animation: {
    type: 'encryption-flow',
    stages: [
      {
        id: 'input',
        duration: 500,
        description: 'Original plaintext message',
        actions: [{ type: 'node-highlight', nodeId: 'plaintext', highlight: true }],
      },
      {
        id: 'key-load',
        duration: 500,
        description: 'Loading encryption key',
        actions: [{ type: 'node-highlight', nodeId: 'key', highlight: true }],
      },
      {
        id: 'encrypting',
        duration: 1500,
        description: 'Encrypting with AES-256',
        actions: [
          { type: 'node-state-change', nodeId: 'encryption', state: 'active' },
          { type: 'edge-animate', edgeId: 'e1', animation: 'flow', direction: 'forward' },
        ],
      },
      {
        id: 'output',
        duration: 500,
        description: 'Encrypted ciphertext',
        actions: [
          { type: 'node-state-change', nodeId: 'encryption', state: 'success' },
          { type: 'edge-animate', edgeId: 'e3', animation: 'flow', direction: 'forward' },
          { type: 'node-highlight', nodeId: 'ciphertext', highlight: true },
        ],
      },
    ],
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  },
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'Symmetric encryption process diagram',
    ariaDescription: 'Shows plaintext being encrypted with a secret key to produce ciphertext',
  },
};

/**
 * 6. SECURITY ATTACK PATH
 * Lateral movement through compromised systems
 */
export const attackPathExample: DiagramDefinition = {
  id: 'attack-path-example',
  type: 'attack-path',
  title: 'Network Attack Path',
  description: 'Attacker gaining access and moving laterally through the network.',
  renderer: 'react-flow',
  
  nodes: [
    { id: 'attacker', type: 'attacker', label: 'Attacker', position: { x: 50, y: 200 } },
    { id: 'vulnerable-web', type: 'web-server', label: 'Web Server', sublabel: 'Vulnerable', position: { x: 250, y: 200 }, state: 'warning' },
    { id: 'compromised-app', type: 'app-server', label: 'App Server', position: { x: 450, y: 200 } },
    { id: 'target-db', type: 'database', label: 'Database', sublabel: 'Target', position: { x: 650, y: 200 }, state: 'normal' },
    { id: 'ids', type: 'ids', label: 'IDS', sublabel: 'Monitoring', position: { x: 450, y: 50 } },
  ],
  
  edges: [
    { id: 'exploit', source: 'attacker', target: 'vulnerable-web', type: 'attack-path', label: 'SQL Injection' },
    { id: 'lateral1', source: 'vulnerable-web', target: 'compromised-app', type: 'attack-path', label: 'Pivot' },
    { id: 'lateral2', source: 'compromised-app', target: 'target-db', type: 'attack-path', label: 'Access DB' },
    { id: 'detection', source: 'ids', target: 'compromised-app', type: 'logical-link', label: 'Alerts', dashed: true },
  ],
  
  animation: {
    type: 'attack-sequence',
    stages: [
      {
        id: 'initial',
        duration: 1000,
        description: 'Attacker identified external target',
        actions: [
          { type: 'node-state-change', nodeId: 'attacker', state: 'active' },
          { type: 'node-highlight', nodeId: 'vulnerable-web', highlight: true },
        ],
      },
      {
        id: 'exploit',
        duration: 1500,
        description: 'Exploiting SQL injection vulnerability',
        actions: [
          { type: 'edge-animate', edgeId: 'exploit', animation: 'flow', direction: 'forward' },
          { type: 'node-state-change', nodeId: 'vulnerable-web', state: 'compromised' },
        ],
      },
      {
        id: 'pivot',
        duration: 1500,
        description: 'Pivoting to internal application server',
        actions: [
          { type: 'edge-animate', edgeId: 'lateral1', animation: 'flow', direction: 'forward' },
          { type: 'node-state-change', nodeId: 'compromised-app', state: 'compromised' },
        ],
      },
      {
        id: 'detection',
        duration: 1000,
        description: 'IDS detects suspicious activity',
        actions: [
          { type: 'node-state-change', nodeId: 'ids', state: 'warning' },
          { type: 'edge-animate', edgeId: 'detection', animation: 'pulse' },
        ],
      },
      {
        id: 'target',
        duration: 1500,
        description: 'Accessing target database',
        actions: [
          { type: 'edge-animate', edgeId: 'lateral2', animation: 'flow', direction: 'forward' },
          { type: 'node-state-change', nodeId: 'target-db', state: 'compromised' },
        ],
      },
    ],
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  },
  
  legend: {
    title: 'Attack States',
    position: 'top-right',
    items: [
      { type: 'state', label: 'Vulnerable', visual: { color: '#f59e0b' } },
      { type: 'state', label: 'Compromised', visual: { color: '#ef4444' } },
      { type: 'state', label: 'Detection', visual: { color: '#06B66F' } },
    ],
  },
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'Security attack path diagram',
    ariaDescription: 'Shows attacker exploiting web server, pivoting through app server to access database while IDS monitors',
  },
};

/**
 * 7. PROCESS FLOWCHART
 * General technical process with decision points
 */
export const processFlowExample: DiagramDefinition = {
  id: 'process-flow-example',
  type: 'process-flow',
  title: 'HTTP Request Processing Flow',
  description: 'Server-side request handling with authentication and authorization checks.',
  renderer: 'react-flow',
  
  nodes: [
    { id: 'start', type: 'process', label: 'Receive Request', position: { x: 300, y: 50 } },
    { id: 'auth-check', type: 'process', label: 'Check Auth Token', position: { x: 300, y: 150 } },
    { id: 'auth-fail', type: 'process', label: 'Return 401', position: { x: 100, y: 250 }, state: 'error' },
    { id: 'authz-check', type: 'process', label: 'Check Permissions', position: { x: 300, y: 250 } },
    { id: 'authz-fail', type: 'process', label: 'Return 403', position: { x: 500, y: 350 }, state: 'error' },
    { id: 'process-request', type: 'process', label: 'Process Request', position: { x: 300, y: 350 } },
    { id: 'db-query', type: 'database', label: 'Query Database', position: { x: 300, y: 450 } },
    { id: 'return-response', type: 'process', label: 'Return 200 OK', position: { x: 300, y: 550 }, state: 'success' },
  ],
  
  edges: [
    { id: 'e1', source: 'start', target: 'auth-check', type: 'control-flow' },
    { id: 'e2', source: 'auth-check', target: 'auth-fail', type: 'control-flow', label: 'Invalid' },
    { id: 'e3', source: 'auth-check', target: 'authz-check', type: 'control-flow', label: 'Valid' },
    { id: 'e4', source: 'authz-check', target: 'authz-fail', type: 'control-flow', label: 'Denied' },
    { id: 'e5', source: 'authz-check', target: 'process-request', type: 'control-flow', label: 'Allowed' },
    { id: 'e6', source: 'process-request', target: 'db-query', type: 'data-flow' },
    { id: 'e7', source: 'db-query', target: 'return-response', type: 'data-flow' },
  ],
  
  interaction: {
    selectable: true,
    zoomable: true,
    pannable: true,
    showControls: true,
    fullscreenable: true,
  },
  
  accessibility: {
    ariaLabel: 'HTTP request processing flowchart',
    ariaDescription: 'Shows request flow through authentication, authorization, processing, and database query steps',
  },
};

// Export all examples
export const referenceDiagrams = {
  networkTopology: networkTopologyExample,
  webArchitecture: webArchitectureExample,
  smtpFlow: smtpFlowExample,
  tcpHandshake: tcpHandshakeExample,
  encryption: encryptionExample,
  attackPath: attackPathExample,
  processFlow: processFlowExample,
};

export default referenceDiagrams;
