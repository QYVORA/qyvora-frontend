/**
 * DIAGRAM EDGES — EXPORTS
 * =======================
 * 
 * Central export point for all diagram edge components.
 */

// Base edge
export { BaseEdge } from './BaseEdge';
export type { BaseEdgeData, BaseEdgeProps } from './BaseEdge';

// Custom edges
export {
  StraightEdge,
  StepEdge,
  WirelessEdge,
  EncryptedEdge,
  AttackPathEdge,
  DataFlowEdge,
  BlockedEdge,
  DependencyEdge,
} from './CustomEdges';

// Registry
export { edgeTypeRegistry, getEdgeComponent, isEdgeTypeRegistered } from './edgeRegistry';
export type { default as EdgeTypes } from './edgeRegistry';
