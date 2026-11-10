/**
 * DIAGRAM HELPER FUNCTIONS
 * ========================
 * 
 * Convenience functions for creating common diagram patterns.
 */

import type {
  DiagramDefinition,
  DiagramNode,
  DiagramEdge,
  DiagramType,
} from '../types';
import { layoutNodesGrid, layoutNodesCircle, layoutNodesHierarchy } from './nodeUtils';

/**
 * Create a basic diagram definition with sensible defaults
 */
export function createDiagram(
  id: string,
  type: DiagramType,
  title: string,
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  options?: {
    description?: string;
    autoLayout?: 'grid' | 'circle' | 'hierarchy' | false;
    showControls?: boolean;
    zoomable?: boolean;
    pannable?: boolean;
  }
): DiagramDefinition {
  const {
    description,
    autoLayout = 'grid',
    showControls = false,
    zoomable = true,
    pannable = true,
  } = options || {};
  
  // Apply automatic layout if requested and nodes don't have positions
  let layoutedNodes = nodes;
  if (autoLayout && nodes.some((n) => !n.position)) {
    switch (autoLayout) {
      case 'grid':
        layoutedNodes = layoutNodesGrid(nodes);
        break;
      case 'circle':
        layoutedNodes = layoutNodesCircle(nodes);
        break;
      case 'hierarchy':
        layoutedNodes = layoutNodesHierarchy(nodes, edges);
        break;
    }
  }
  
  return {
    id,
    type,
    title,
    description,
    renderer: 'react-flow',
    nodes: layoutedNodes,
    edges,
    interaction: {
      selectable: true,
      hoverable: true,
      zoomable,
      pannable,
      draggable: false,
      fullscreenable: true,
      showControls,
      showMiniMap: false,
    },
    accessibility: {
      ariaLabel: title,
      ariaDescription: description,
      keyboardNav: true,
    },
  };
}

/**
 * Create a simple network topology diagram
 */
export function createNetworkTopology(
  id: string,
  title: string,
  nodes: DiagramNode[],
  connections: Array<{ from: string; to: string; label?: string }>
): DiagramDefinition {
  const edges: DiagramEdge[] = connections.map((conn, index) => ({
    id: `edge-${index}`,
    source: conn.from,
    target: conn.to,
    type: 'physical-link',
    label: conn.label,
  }));
  
  return createDiagram(id, 'network-topology', title, nodes, edges, {
    description: 'Network topology diagram',
    autoLayout: 'hierarchy',
  });
}

/**
 * Create a web architecture diagram
 */
export function createWebArchitecture(
  id: string,
  title: string,
  layers: {
    frontend: DiagramNode[];
    backend: DiagramNode[];
    data: DiagramNode[];
  }
): DiagramDefinition {
  // Position nodes in layers
  const allNodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Frontend layer (top)
  layers.frontend.forEach((node, index) => {
    allNodes.push({
      ...node,
      position: { x: 50 + index * 200, y: 50 },
    });
  });
  
  // Backend layer (middle)
  layers.backend.forEach((node, index) => {
    allNodes.push({
      ...node,
      position: { x: 50 + index * 200, y: 250 },
    });
  });
  
  // Data layer (bottom)
  layers.data.forEach((node, index) => {
    allNodes.push({
      ...node,
      position: { x: 50 + index * 200, y: 450 },
    });
  });
  
  // Create connections between layers
  layers.frontend.forEach((frontendNode) => {
    layers.backend.forEach((backendNode) => {
      edges.push({
        id: `${frontendNode.id}-${backendNode.id}`,
        source: frontendNode.id,
        target: backendNode.id,
        type: 'request-response',
      });
    });
  });
  
  layers.backend.forEach((backendNode) => {
    layers.data.forEach((dataNode) => {
      edges.push({
        id: `${backendNode.id}-${dataNode.id}`,
        source: backendNode.id,
        target: dataNode.id,
        type: 'data-flow',
      });
    });
  });
  
  return {
    ...createDiagram(id, 'web-architecture', title, allNodes, edges, {
      description: 'Web application architecture',
      autoLayout: false,
    }),
  };
}

/**
 * Create a process flow diagram
 */
export function createProcessFlow(
  id: string,
  title: string,
  steps: Array<{ id: string; label: string; description?: string }>
): DiagramDefinition {
  const nodes: DiagramNode[] = steps.map((step) => ({
    id: step.id,
    type: 'process',
    label: step.label,
    description: step.description,
  }));
  
  const edges: DiagramEdge[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    edges.push({
      id: `flow-${i}`,
      source: steps[i].id,
      target: steps[i + 1].id,
      type: 'control-flow',
    });
  }
  
  return createDiagram(id, 'process-flow', title, nodes, edges, {
    description: 'Process flow diagram',
    autoLayout: 'hierarchy',
  });
}

/**
 * Create an attack path diagram
 */
export function createAttackPath(
  id: string,
  title: string,
  attacker: DiagramNode,
  target: DiagramNode,
  intermediateNodes: DiagramNode[],
  path: string[]
): DiagramDefinition {
  const allNodes = [attacker, ...intermediateNodes, target];
  
  const edges: DiagramEdge[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    edges.push({
      id: `attack-${i}`,
      source: path[i],
      target: path[i + 1],
      type: 'attack-path',
      animated: true,
    });
  }
  
  return createDiagram(id, 'attack-path', title, allNodes, edges, {
    description: 'Security attack path visualization',
    autoLayout: 'hierarchy',
    showControls: true,
  });
}

/**
 * Create a simple comparison diagram (before/after)
 */
export function createComparison(
  id: string,
  title: string,
  before: { node: DiagramNode; label: string },
  after: { node: DiagramNode; label: string },
  connection?: { type: DiagramEdge['type']; label?: string }
): DiagramDefinition {
  const nodes: DiagramNode[] = [
    { ...before.node, position: { x: 50, y: 150 }, sublabel: before.label },
    { ...after.node, position: { x: 350, y: 150 }, sublabel: after.label },
  ];
  
  const edges: DiagramEdge[] = connection
    ? [
        {
          id: 'transformation',
          source: before.node.id,
          target: after.node.id,
          type: connection.type,
          label: connection.label,
        },
      ]
    : [];
  
  return createDiagram(id, 'process-flow', title, nodes, edges, {
    description: 'Before and after comparison',
    autoLayout: false,
  });
}
