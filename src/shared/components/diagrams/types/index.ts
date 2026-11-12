/**
 * QYVORA DIAGRAM SYSTEM — TYPE DEFINITIONS
 * =========================================
 * Complete TypeScript types for the interactive diagram system.
 */

// Diagram types
export type DiagramType =
  | 'network-topology'
  | 'web-architecture'
  | 'process-flow'
  | 'sequence'
  | 'attack-path'
  | 'crypto-process'
  | 'state-machine'
  | 'data-flow'
  | 'cloud-infrastructure'
  | 'system-architecture';

export type DiagramRenderer = 'react-flow' | 'svg' | 'mermaid';

export type NodeType =
  | 'router' | 'switch' | 'hub' | 'bridge' | 'firewall' | 'access-point'
  | 'load-balancer' | 'vpn-gateway' | 'proxy' | 'server' | 'client' | 'workstation'
  | 'laptop' | 'mobile' | 'iot-device' | 'web-server' | 'app-server' | 'database'
  | 'cache' | 'queue' | 'api-gateway' | 'cdn' | 'reverse-proxy' | 'microservice'
  | 'container' | 'browser' | 'cloud-service' | 'vm' | 'kubernetes-cluster'
  | 'kubernetes-pod' | 'storage-bucket' | 'region' | 'availability-zone' | 'vpc'
  | 'subnet' | 'dns-server' | 'dhcp-server' | 'smtp-server' | 'mail-server'
  | 'auth-server' | 'directory-service' | 'monitoring' | 'logging' | 'attacker'
  | 'defender' | 'target' | 'ids' | 'ips' | 'edr' | 'siem' | 'honeypot'
  | 'vulnerability' | 'exploit' | 'security-control' | 'plaintext' | 'ciphertext'
  | 'encryption-process' | 'decryption-process' | 'key' | 'certificate'
  | 'certificate-authority' | 'hash-function' | 'signature' | 'data-store'
  | 'file-system' | 'backup' | 'replica' | 'data-pipeline' | 'user' | 'admin'
  | 'identity' | 'credentials' | 'process' | 'service' | 'component'
  | 'external-service' | 'note' | 'group-label';

export type NodeState =
  | 'normal' | 'active' | 'highlighted' | 'compromised' | 'blocked'
  | 'disabled' | 'success' | 'warning' | 'error' | 'transmitting';

export type EdgeType =
  | 'physical-link' | 'wireless-link' | 'logical-link' | 'data-flow'
  | 'request-response' | 'encrypted-channel' | 'attack-path' | 'blocked-connection'
  | 'dependency' | 'relationship' | 'transform' | 'control-flow' | 'straight' | 'step';

export type EdgeState =
  | 'normal' | 'active' | 'highlighted' | 'blocked' | 'encrypted' | 'attacked'
  | 'transmitting' | 'warning' | 'error';

export type LayoutAlgorithm = 'manual' | 'grid' | 'circle' | 'hierarchy' | 'force';

export type AnimationType =
  | 'packet-flow' | 'attack-path' | 'state-transition' | 'encryption' | 'request-response' | 'attack-sequence' | 'encryption-flow';

export interface NodeStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  width?: number;
  height?: number;
  opacity?: number;
}

export interface EdgeStyle {
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
}

export interface DiagramNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  position?: { x: number; y: number };
  state?: NodeState;
  style?: NodeStyle;
  data?: Record<string, unknown>;
  tooltip?: string;
  group?: string;
  metadata?: Record<string, unknown>;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  type?: EdgeType;
  label?: string;
  state?: EdgeState;
  animated?: boolean;
  dashed?: boolean;
  style?: EdgeStyle;
  data?: Record<string, unknown>;
  bidirectional?: boolean;
  metadata?: Record<string, unknown>;
}

export interface DiagramGroup {
  id: string;
  label: string;
  nodeIds: string[];
  color?: string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

export interface LayoutConfig {
  algorithm: LayoutAlgorithm;
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  spacing?: { x: number; y: number };
  padding?: number;
}

export interface AnimationAction {
  type: 'node-highlight' | 'edge-animate' | 'node-state' | 'edge-state' | 'pause' | 'label-update' | 'node-state-change' | 'path-highlight';
  nodeId?: string;
  edgeId?: string;
  nodeIds?: string[];
  edgeIds?: string[];
  highlight?: boolean;
  state?: NodeState | EdgeState;
  animation?: string;
  direction?: 'forward' | 'reverse' | 'backward';
  duration?: number;
  label?: string;
}

export interface AnimationStage {
  id: string;
  duration: number;
  description?: string;
  actions: AnimationAction[];
}

export interface AnimationConfig {
  type?: AnimationType;
  stages: AnimationStage[];
  loop?: boolean;
  speed?: number;
  autoPlay?: boolean;
  respectReducedMotion?: boolean;
}

export interface InteractionConfig {
  draggable?: boolean;
  selectable?: boolean;
  zoomable?: boolean;
  pannable?: boolean;
  fullscreenable?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  hoverable?: boolean;
}

export interface LegendItemVisual {
  color?: string;
  icon?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  shape?: string;
}

export interface LegendItem {
  type: 'node' | 'edge' | 'state';
  label: string;
  description?: string;
  visual: LegendItemVisual;
}

export interface DiagramLegend {
  title?: string;
  items: LegendItem[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface AccessibilityConfig {
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardNav?: boolean;
  keyboardNavigation?: boolean;
  focusIndicators?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface DiagramDefinition {
  id: string;
  type?: DiagramType;
  renderer?: DiagramRenderer;
  title?: string;
  description?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  /**
   * Node layout mode. `'auto'` (default) restacks wide diagrams into a
   * vertical column on narrow viewports; `'manual'` preserves authored
   * positions exactly.
   */
  layout?: 'auto' | 'manual';
  animation?: AnimationConfig;
  interaction?: InteractionConfig;
  legend?: DiagramLegend;
  accessibility?: AccessibilityConfig;
}
