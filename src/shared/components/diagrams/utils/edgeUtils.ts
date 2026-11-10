/**
 * EDGE UTILITY FUNCTIONS
 * ======================
 * 
 * Helper functions for working with diagram edges.
 */

import type { Edge, MarkerType } from '@xyflow/react';
import type { DiagramEdge } from '../types';
import { getEdgeStyle } from '../theme/tokens';
import type { BaseEdgeData } from '../edges/BaseEdge';

/**
 * Convert a DiagramEdge to a React Flow Edge
 */
export function diagramEdgeToReactFlowEdge(edge: DiagramEdge): Edge<BaseEdgeData> {
  const edgeStyle = getEdgeStyle(edge.type, edge.state);
  
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    data: {
      id: edge.id,
      type: edge.type,
      label: edge.label,
      state: edge.state,
      animated: edge.animated !== undefined ? edge.animated : edgeStyle.animated,
      bidirectional: edge.bidirectional,
      dashed: edge.dashed !== undefined ? edge.dashed : edgeStyle.dashed,
      metadata: edge.metadata,
      style: edge.style,
    },
    animated: edge.animated !== undefined ? edge.animated : edgeStyle.animated,
    style: {
      stroke: edge.style?.color || edgeStyle.color,
      strokeWidth: edge.style?.width || edgeStyle.width,
    },
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      width: 20,
      height: 20,
      color: edge.style?.color || edgeStyle.color,
    },
    // Add bidirectional marker if needed
    ...(edge.bidirectional && {
      markerStart: {
        type: 'arrowclosed' as MarkerType,
        width: 20,
        height: 20,
        color: edge.style?.color || edgeStyle.color,
      },
    }),
  };
}

/**
 * Convert multiple DiagramEdges to React Flow Edges
 */
export function diagramEdgesToReactFlowEdges(edges: DiagramEdge[]): Edge<BaseEdgeData>[] {
  return edges.map(diagramEdgeToReactFlowEdge);
}

/**
 * Find edges connected to a specific node
 */
export function getConnectedEdges(nodeId: string, edges: DiagramEdge[]): DiagramEdge[] {
  return edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );
}

/**
 * Get all edges between two nodes
 */
export function getEdgesBetweenNodes(
  sourceId: string,
  targetId: string,
  edges: DiagramEdge[]
): DiagramEdge[] {
  return edges.filter(
    (edge) =>
      (edge.source === sourceId && edge.target === targetId) ||
      (edge.bidirectional && edge.source === targetId && edge.target === sourceId)
  );
}

/**
 * Check if two nodes are directly connected
 */
export function areNodesConnected(
  nodeId1: string,
  nodeId2: string,
  edges: DiagramEdge[]
): boolean {
  return edges.some(
    (edge) =>
      (edge.source === nodeId1 && edge.target === nodeId2) ||
      (edge.source === nodeId2 && edge.target === nodeId1) ||
      (edge.bidirectional &&
        ((edge.source === nodeId1 && edge.target === nodeId2) ||
          (edge.source === nodeId2 && edge.target === nodeId1)))
  );
}

/**
 * Get all nodes in a path (following edges)
 */
export function getNodesInPath(
  startNodeId: string,
  edges: DiagramEdge[]
): string[] {
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const path: string[] = [];
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    if (visited.has(currentNodeId)) {
      continue;
    }
    
    visited.add(currentNodeId);
    path.push(currentNodeId);
    
    // Find all edges from this node
    const connectedEdges = edges.filter((edge) => edge.source === currentNodeId);
    
    for (const edge of connectedEdges) {
      if (!visited.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }
  
  return path;
}

/**
 * Update edge state
 */
export function updateEdgeState(
  edgeId: string,
  edges: DiagramEdge[],
  newState: DiagramEdge['state']
): DiagramEdge[] {
  return edges.map((edge) =>
    edge.id === edgeId ? { ...edge, state: newState } : edge
  );
}

/**
 * Update multiple edges' state
 */
export function updateMultipleEdgesState(
  edgeIds: string[],
  edges: DiagramEdge[],
  newState: DiagramEdge['state']
): DiagramEdge[] {
  const edgeIdSet = new Set(edgeIds);
  return edges.map((edge) =>
    edgeIdSet.has(edge.id) ? { ...edge, state: newState } : edge
  );
}

/**
 * Get edges of a specific type
 */
export function getEdgesByType(
  type: DiagramEdge['type'],
  edges: DiagramEdge[]
): DiagramEdge[] {
  return edges.filter((edge) => edge.type === type);
}

/**
 * Calculate edge statistics
 */
export function getEdgeStats(edges: DiagramEdge[]) {
  const typeCount: Record<string, number> = {};
  const stateCount: Record<string, number> = {};
  
  for (const edge of edges) {
    typeCount[edge.type] = (typeCount[edge.type] || 0) + 1;
    if (edge.state) {
      stateCount[edge.state] = (stateCount[edge.state] || 0) + 1;
    }
  }
  
  return {
    total: edges.length,
    byType: typeCount,
    byState: stateCount,
    animated: edges.filter((e) => e.animated).length,
    bidirectional: edges.filter((e) => e.bidirectional).length,
  };
}
