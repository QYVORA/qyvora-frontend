/**
 * ANIMATION HELPER FUNCTIONS
 * ==========================
 * 
 * Utility functions for creating common animation sequences.
 */

import type {
  AnimationConfig,
  AnimationStage,
  DiagramNode,
  DiagramEdge,
} from '../types';

/**
 * Create a packet flow animation along a path
 */
export function createPacketFlowAnimation(
  path: { nodeIds: string[]; edgeIds: string[] },
  options?: {
    duration?: number;
    packetColor?: string;
    stageDelay?: number;
  }
): AnimationConfig {
  const { duration = 2000, stageDelay = 500 } = options || {};
  const stages: AnimationStage[] = [];
  
  // Highlight each edge in sequence
  for (let i = 0; i < path.edgeIds.length; i++) {
    const edgeId = path.edgeIds[i];
    const sourceNodeId = path.nodeIds[i];
    const targetNodeId = path.nodeIds[i + 1];
    
    stages.push({
      id: `packet-${i}`,
      duration: duration / path.edgeIds.length,
      description: `Packet traveling from ${sourceNodeId} to ${targetNodeId}`,
      actions: [
        {
          type: 'node-highlight',
          nodeId: sourceNodeId,
          highlight: true,
        },
        {
          type: 'edge-animate',
          edgeId,
          animation: 'flow',
          direction: 'forward',
        },
        {
          type: 'node-highlight',
          nodeId: targetNodeId,
          highlight: true,
        },
      ],
    });
    
    // Add a brief pause between stages if specified
    if (stageDelay > 0 && i < path.edgeIds.length - 1) {
      stages.push({
        id: `pause-${i}`,
        duration: stageDelay,
        description: 'Processing',
        actions: [
          {
            type: 'pause',
            duration: stageDelay,
          },
        ],
      });
    }
  }
  
  return {
    type: 'packet-flow',
    stages,
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}

/**
 * Create an attack path animation
 */
export function createAttackPathAnimation(
  attackerNodeId: string,
  targetNodeId: string,
  path: { nodeIds: string[]; edgeIds: string[] },
  options?: {
    compromiseDelay?: number;
  }
): AnimationConfig {
  const { compromiseDelay = 1000 } = options || {};
  const stages: AnimationStage[] = [];
  
  // Stage 1: Highlight attacker
  stages.push({
    id: 'identify-attacker',
    duration: 500,
    description: 'Attacker identified',
    actions: [
      {
        type: 'node-state-change',
        nodeId: attackerNodeId,
        state: 'active',
      },
    ],
  });
  
  // Stage 2-N: Compromise each node in path
  for (let i = 0; i < path.nodeIds.length - 1; i++) {
    const currentNodeId = path.nodeIds[i];
    const nextNodeId = path.nodeIds[i + 1];
    const edgeId = path.edgeIds[i];
    
    stages.push({
      id: `attack-${i}`,
      duration: compromiseDelay,
      description: `Attacking ${nextNodeId}`,
      actions: [
        {
          type: 'edge-animate',
          edgeId,
          animation: 'flow',
          direction: 'forward',
        },
        {
          type: 'node-state-change',
          nodeId: nextNodeId,
          state: 'compromised',
        },
      ],
    });
  }
  
  // Final stage: Show complete attack path
  stages.push({
    id: 'complete-path',
    duration: 1000,
    description: 'Attack path complete',
    actions: [
      {
        type: 'path-highlight',
        nodeIds: path.nodeIds,
        edgeIds: path.edgeIds,
        highlight: true,
      },
    ],
  });
  
  return {
    type: 'attack-sequence',
    stages,
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}

/**
 * Create a state machine transition animation
 */
export function createStateTransitionAnimation(
  transitions: Array<{ fromNodeId: string; toNodeId: string; edgeId: string; label: string }>,
  options?: {
    transitionDuration?: number;
  }
): AnimationConfig {
  const { transitionDuration = 1000 } = options || {};
  const stages: AnimationStage[] = [];
  
  for (let i = 0; i < transitions.length; i++) {
    const { fromNodeId, toNodeId, edgeId, label } = transitions[i];
    
    stages.push({
      id: `transition-${i}`,
      duration: transitionDuration,
      description: label,
      actions: [
        // Deactivate previous state
        ...(i > 0
          ? [{
              type: 'node-state-change' as const,
              nodeId: transitions[i - 1].toNodeId,
              state: 'normal' as const,
            }]
          : []),
        // Activate current transition
        {
          type: 'node-state-change' as const,
          nodeId: fromNodeId,
          state: 'active' as const,
        },
        {
          type: 'edge-animate' as const,
          edgeId,
          animation: 'flow' as const,
          direction: 'forward' as const,
        },
        {
          type: 'node-state-change' as const,
          nodeId: toNodeId,
          state: 'active' as const,
        },
      ],
    });
  }
  
  return {
    type: 'state-transition',
    stages,
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}

/**
 * Create an encryption flow animation
 */
export function createEncryptionAnimation(
  plaintextNodeId: string,
  encryptionNodeId: string,
  ciphertextNodeId: string,
  edgeIds: { toEncryption: string; fromEncryption: string },
  options?: {
    processingTime?: number;
  }
): AnimationConfig {
  const { processingTime = 1500 } = options || {};
  
  return {
    type: 'encryption-flow',
    stages: [
      {
        id: 'plaintext',
        duration: 500,
        description: 'Plaintext data',
        actions: [
          {
            type: 'node-highlight',
            nodeId: plaintextNodeId,
            highlight: true,
          },
        ],
      },
      {
        id: 'to-encryption',
        duration: 800,
        description: 'Sending to encryption',
        actions: [
          {
            type: 'edge-animate',
            edgeId: edgeIds.toEncryption,
            animation: 'flow',
            direction: 'forward',
          },
        ],
      },
      {
        id: 'encrypting',
        duration: processingTime,
        description: 'Encrypting...',
        actions: [
          {
            type: 'node-state-change',
            nodeId: encryptionNodeId,
            state: 'active',
          },
        ],
      },
      {
        id: 'to-ciphertext',
        duration: 800,
        description: 'Encrypted data',
        actions: [
          {
            type: 'node-state-change',
            nodeId: encryptionNodeId,
            state: 'success',
          },
          {
            type: 'edge-animate',
            edgeId: edgeIds.fromEncryption,
            animation: 'flow',
            direction: 'forward',
          },
        ],
      },
      {
        id: 'ciphertext',
        duration: 500,
        description: 'Ciphertext output',
        actions: [
          {
            type: 'node-highlight',
            nodeId: ciphertextNodeId,
            highlight: true,
          },
        ],
      },
    ],
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}

/**
 * Create a request-response animation
 */
export function createRequestResponseAnimation(
  clientNodeId: string,
  serverNodeId: string,
  edgeIds: { request: string; response: string },
  options?: {
    requestDuration?: number;
    processingDuration?: number;
    responseDuration?: number;
  }
): AnimationConfig {
  const {
    requestDuration = 800,
    processingDuration = 1000,
    responseDuration = 800,
  } = options || {};
  
  return {
    type: 'packet-flow',
    stages: [
      {
        id: 'request',
        duration: requestDuration,
        description: 'Client sends request',
        actions: [
          {
            type: 'node-state-change',
            nodeId: clientNodeId,
            state: 'active',
          },
          {
            type: 'edge-animate',
            edgeId: edgeIds.request,
            animation: 'flow',
            direction: 'forward',
          },
        ],
      },
      {
        id: 'processing',
        duration: processingDuration,
        description: 'Server processing',
        actions: [
          {
            type: 'node-state-change',
            nodeId: clientNodeId,
            state: 'normal',
          },
          {
            type: 'node-state-change',
            nodeId: serverNodeId,
            state: 'active',
          },
        ],
      },
      {
        id: 'response',
        duration: responseDuration,
        description: 'Server sends response',
        actions: [
          {
            type: 'edge-animate',
            edgeId: edgeIds.response,
            animation: 'flow',
            direction: 'backward',
          },
        ],
      },
      {
        id: 'complete',
        duration: 500,
        description: 'Request complete',
        actions: [
          {
            type: 'node-state-change',
            nodeId: serverNodeId,
            state: 'normal',
          },
          {
            type: 'node-state-change',
            nodeId: clientNodeId,
            state: 'success',
          },
        ],
      },
    ],
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}

/**
 * Find path between two nodes using breadth-first search
 */
export function findPath(
  startNodeId: string,
  endNodeId: string,
  nodes: DiagramNode[],
  edges: DiagramEdge[]
): { nodeIds: string[]; edgeIds: string[] } | null {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();
  const queue: Array<{ nodeId: string; path: string[]; edges: string[] }> = [
    { nodeId: startNodeId, path: [startNodeId], edges: [] },
  ];
  
  while (queue.length > 0) {
    const { nodeId, path, edges: edgePath } = queue.shift()!;
    
    if (nodeId === endNodeId) {
      return { nodeIds: path, edgeIds: edgePath };
    }
    
    if (visited.has(nodeId)) {
      continue;
    }
    
    visited.add(nodeId);
    
    // Find all edges from this node
    const outgoingEdges = edges.filter((e) => e.source === nodeId);
    
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        queue.push({
          nodeId: edge.target,
          path: [...path, edge.target],
          edges: [...edgePath, edge.id],
        });
      }
    }
  }
  
  return null; // No path found
}
