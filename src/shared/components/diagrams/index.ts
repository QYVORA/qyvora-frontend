/**
 * QYVORA DIAGRAM SYSTEM — MAIN EXPORTS
 * ====================================
 * 
 * Interactive diagram system for technical education.
 */

// Main diagram component
export { Diagram } from './Diagram';
export type { DiagramProps } from './Diagram';

// Types
export type {
  DiagramDefinition,
  DiagramType,
  DiagramRenderer,
  DiagramNode,
  DiagramEdge,
  DiagramGroup,
  NodeType,
  NodeState,
  EdgeType,
  EdgeState,
  LayoutConfig,
  LayoutAlgorithm,
  AnimationConfig,
  AnimationStage,
  AnimationAction,
  AnimationType,
  InteractionConfig,
  DiagramLegend,
  LegendItem,
  AccessibilityConfig,
  ValidationResult,
  ValidationError,
} from './types';

// Validation
export {
  validateDiagramDefinition,
  validateNode,
  validateEdge,
  assertValidDiagram,
  logValidationWarnings,
} from './utils/validation';

// Node utilities
export {
  updateNodeState,
  updateMultipleNodesState,
  findNodeById,
  getNodesByType,
  getNodesByState,
  getNodeStats,
  getNodesBoundingBox,
  layoutNodesGrid,
  layoutNodesCircle,
  layoutNodesHierarchy,
  cloneNode,
  mergeNodeUpdates,
} from './utils/nodeUtils';

// Edge utilities
export {
  diagramEdgeToReactFlowEdge,
  diagramEdgesToReactFlowEdges,
  getConnectedEdges,
  getEdgesBetweenNodes,
  areNodesConnected,
  getNodesInPath,
  updateEdgeState,
  updateMultipleEdgesState,
  getEdgesByType,
  getEdgeStats,
} from './utils/edgeUtils';

// Animation engine
export { useAnimationEngine } from './animations/useAnimationEngine';
export type {
  AnimationState,
  AnimationControls,
  UseAnimationEngineResult,
} from './animations/useAnimationEngine';

// Animation helpers
export {
  createPacketFlowAnimation,
  createAttackPathAnimation,
  createStateTransitionAnimation,
  createEncryptionAnimation,
  createRequestResponseAnimation,
  findPath,
} from './animations/animationHelpers';

// Animation components
export {
  PacketMarker,
  SignalRing,
  PulseEffect,
  FlowLine,
  ProgressIndicator,
  HighlightOverlay,
} from './animations/AnimationComponents';

// Theme tokens
export {
  DiagramColors,
  NodeTypeColors,
  EdgeTypeStyles,
  NodeStateColors,
  EdgeStateColors,
  DiagramSizing,
  DiagramAnimations,
  getNodeColor,
  getNodeBorderColor,
  getNodeBackgroundColor,
  getEdgeStyle,
  getGlowStyle,
  withOpacity,
} from './theme/tokens';

// Node registry
export { nodeTypeRegistry, getNodeComponent, isNodeTypeRegistered } from './nodes/nodeRegistry';

// Edge registry
export { edgeTypeRegistry, getEdgeComponent, isEdgeTypeRegistered } from './edges/edgeRegistry';
