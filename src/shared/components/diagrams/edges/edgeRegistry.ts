/**
 * EDGE REGISTRY
 * =============
 * 
 * Central registry mapping edge types to their React components.
 * Ensures consistent edge rendering across all diagrams.
 */

import type { EdgeTypes } from '@xyflow/react';
import type { EdgeType } from '../types';
import { BaseEdge } from './BaseEdge';
import {
  StraightEdge,
  StepEdge,
  WirelessEdge,
  EncryptedEdge,
  AttackPathEdge,
  DataFlowEdge,
  BlockedEdge,
  DependencyEdge,
} from './CustomEdges';

/**
 * Complete edge type registry for React Flow
 */
export const edgeTypeRegistry: EdgeTypes = {
  // Physical connections
  'physical-link': BaseEdge,
  'wireless-link': WirelessEdge,
  'logical-link': DependencyEdge,
  
  // Data movement
  'data-flow': DataFlowEdge,
  'request-response': DataFlowEdge,
  'transform': DataFlowEdge,
  
  // Security
  'encrypted-channel': EncryptedEdge,
  'attack-path': AttackPathEdge,
  'blocked-connection': BlockedEdge,
  
  // Structural
  'dependency': DependencyEdge,
  'relationship': BaseEdge,
  'control-flow': StepEdge,
  
  // Utility
  'straight': StraightEdge,
  'step': StepEdge,
  
  // Fallback
  'default': BaseEdge,
};

/**
 * Get the component for an edge type
 */
export function getEdgeComponent(type: EdgeType) {
  return edgeTypeRegistry[type] || BaseEdge;
}

/**
 * Check if an edge type is registered
 */
export function isEdgeTypeRegistered(type: string): type is EdgeType {
  return type in edgeTypeRegistry;
}

export default edgeTypeRegistry;
