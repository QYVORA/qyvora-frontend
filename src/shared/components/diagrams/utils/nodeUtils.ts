/**
 * NODE UTILITY FUNCTIONS
 * ======================
 * 
 * Helper functions for working with diagram nodes.
 */

import type { DiagramNode, NodeState } from '../types';
import { getNodeColor } from '../theme/tokens';

/**
 * Update node state
 */
export function updateNodeState(
  nodeId: string,
  nodes: DiagramNode[],
  newState: NodeState
): DiagramNode[] {
  return nodes.map((node) =>
    node.id === nodeId ? { ...node, state: newState } : node
  );
}

/**
 * Update multiple nodes' state
 */
export function updateMultipleNodesState(
  nodeIds: string[],
  nodes: DiagramNode[],
  newState: NodeState
): DiagramNode[] {
  const nodeIdSet = new Set(nodeIds);
  return nodes.map((node) =>
    nodeIdSet.has(node.id) ? { ...node, state: newState } : node
  );
}

/**
 * Find node by ID
 */
export function findNodeById(
  nodeId: string,
  nodes: DiagramNode[]
): DiagramNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

/**
 * Get nodes by type
 */
export function getNodesByType(
  type: DiagramNode['type'],
  nodes: DiagramNode[]
): DiagramNode[] {
  return nodes.filter((node) => node.type === type);
}

/**
 * Get nodes by state
 */
export function getNodesByState(
  state: NodeState,
  nodes: DiagramNode[]
): DiagramNode[] {
  return nodes.filter((node) => node.state === state);
}

/**
 * Calculate node statistics
 */
export function getNodeStats(nodes: DiagramNode[]) {
  const typeCount: Record<string, number> = {};
  const stateCount: Record<string, number> = {};
  
  for (const node of nodes) {
    typeCount[node.type] = (typeCount[node.type] || 0) + 1;
    if (node.state) {
      stateCount[node.state] = (stateCount[node.state] || 0) + 1;
    }
  }
  
  return {
    total: nodes.length,
    byType: typeCount,
    byState: stateCount,
  };
}

/**
 * Get bounding box of all nodes
 */
export function getNodesBoundingBox(nodes: DiagramNode[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} | null {
  if (nodes.length === 0) return null;
  
  const nodesWithPosition = nodes.filter((n) => n.position);
  if (nodesWithPosition.length === 0) return null;
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const node of nodesWithPosition) {
    const { x, y } = node.position!;
    const width = node.style?.width || 120;
    const height = node.style?.height || 80;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Auto-layout nodes in a grid
 */
export function layoutNodesGrid(
  nodes: DiagramNode[],
  options?: {
    columns?: number;
    rowSpacing?: number;
    columnSpacing?: number;
    startX?: number;
    startY?: number;
  }
): DiagramNode[] {
  const {
    columns = Math.ceil(Math.sqrt(nodes.length)),
    rowSpacing = 150,
    columnSpacing = 200,
    startX = 50,
    startY = 50,
  } = options || {};
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    
    return {
      ...node,
      position: {
        x: startX + col * columnSpacing,
        y: startY + row * rowSpacing,
      },
    };
  });
}

/**
 * Auto-layout nodes in a circle
 */
export function layoutNodesCircle(
  nodes: DiagramNode[],
  options?: {
    radius?: number;
    centerX?: number;
    centerY?: number;
  }
): DiagramNode[] {
  const {
    radius = 300,
    centerX = 400,
    centerY = 300,
  } = options || {};
  
  const angleStep = (2 * Math.PI) / nodes.length;
  
  return nodes.map((node, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start at top
    
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
}

/**
 * Auto-layout nodes in a hierarchy (tree)
 */
export function layoutNodesHierarchy(
  nodes: DiagramNode[],
  edges: Array<{ source: string; target: string }>,
  options?: {
    direction?: 'TB' | 'LR';
    levelSpacing?: number;
    nodeSpacing?: number;
    startX?: number;
    startY?: number;
  }
): DiagramNode[] {
  const {
    direction = 'TB',
    levelSpacing = 150,
    nodeSpacing = 100,
    startX = 50,
    startY = 50,
  } = options || {};
  
  // Find root nodes (nodes with no incoming edges)
  const targetIds = new Set(edges.map((e) => e.target));
  const roots = nodes.filter((n) => !targetIds.has(n.id));
  
  if (roots.length === 0) {
    // No clear hierarchy, fall back to grid
    return layoutNodesGrid(nodes);
  }
  
  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  }
  
  // Assign levels using BFS
  const levels = new Map<string, number>();
  const queue: Array<{ id: string; level: number }> = roots.map((r) => ({
    id: r.id,
    level: 0,
  }));
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    
    if (levels.has(id)) continue;
    levels.set(id, level);
    
    const children = adjacency.get(id) || [];
    for (const childId of children) {
      queue.push({ id: childId, level: level + 1 });
    }
  }
  
  // Group nodes by level
  const nodesByLevel = new Map<number, string[]>();
  for (const [nodeId, level] of levels) {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(nodeId);
  }
  
  // Position nodes
  const positioned = new Map<string, { x: number; y: number }>();
  
  for (const [level, nodeIds] of nodesByLevel) {
    const nodesInLevel = nodeIds.length;
    
    nodeIds.forEach((nodeId, index) => {
      if (direction === 'TB') {
        positioned.set(nodeId, {
          x: startX + index * nodeSpacing - ((nodesInLevel - 1) * nodeSpacing) / 2,
          y: startY + level * levelSpacing,
        });
      } else {
        positioned.set(nodeId, {
          x: startX + level * levelSpacing,
          y: startY + index * nodeSpacing - ((nodesInLevel - 1) * nodeSpacing) / 2,
        });
      }
    });
  }
  
  return nodes.map((node) => ({
    ...node,
    position: positioned.get(node.id) || node.position || { x: 0, y: 0 },
  }));
}

/**
 * Clone a node
 */
export function cloneNode(node: DiagramNode, newId: string): DiagramNode {
  return {
    ...node,
    id: newId,
  };
}

/**
 * Merge node updates
 */
export function mergeNodeUpdates(
  node: DiagramNode,
  updates: Partial<DiagramNode>
): DiagramNode {
  return {
    ...node,
    ...updates,
    style: {
      ...node.style,
      ...updates.style,
    },
    metadata: {
      ...node.metadata,
      ...updates.metadata,
    },
  };
}
