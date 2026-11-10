/**
 * DIAGRAM DESIGN TOKENS
 * =====================
 * 
 * Centralized visual language for all QYVORA diagrams.
 * Semantic colors that communicate technical meaning across all subjects.
 * 
 * Aligned with QYVORA design system (--color-accent: #06B66F)
 */

import type { NodeType, EdgeType, NodeState, EdgeState } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const DiagramColors = {
  // Core QYVORA accent
  accent: '#06B66F',
  accentDim: 'rgba(6, 182, 111, 0.1)',
  accentGlow: 'rgba(6, 182, 111, 0.2)',
  
  // Semantic domain colors
  network: '#3b82f6',        // blue-500: network infrastructure
  networkDim: 'rgba(59, 130, 246, 0.1)',
  
  server: '#a855f7',         // purple-500: servers, applications, services
  serverDim: 'rgba(168, 85, 247, 0.1)',
  
  threat: '#ef4444',         // red-500: threats, attacks, security incidents
  threatDim: 'rgba(239, 68, 68, 0.1)',
  
  data: '#06b6d4',           // cyan-500: data, storage, information flow
  dataDim: 'rgba(6, 182, 212, 0.1)',
  
  success: '#06B66F',        // accent: successful operations, permitted activity
  successDim: 'rgba(6, 182, 111, 0.1)',
  
  warning: '#f59e0b',        // amber-500: warnings, suspicious events, attention
  warningDim: 'rgba(245, 158, 11, 0.1)',
  
  user: '#ec4899',           // pink-500: users, identities, endpoints
  userDim: 'rgba(236, 72, 153, 0.1)',
  
  // State colors
  active: '#06B66F',
  highlighted: '#fbbf24',    // amber-400
  compromised: '#ef4444',    // red-500
  blocked: '#94a3b8',        // slate-400
  disabled: '#64748b',       // slate-500
  
  // Neutral colors
  neutral: '#71717a',        // zinc-500
  neutralDim: 'rgba(113, 113, 122, 0.1)',
  border: 'rgba(171, 181, 192, 0.18)',
  borderStrong: 'rgba(6, 182, 111, 0.26)',
  
  // Background
  canvas: '#000000',
  surface: '#050505',
  surfaceElevated: '#0b0b0b',
  
  // Text
  textPrimary: '#EEF0EE',
  textSecondary: 'rgba(238, 240, 238, 0.70)',
  textMuted: 'rgba(238, 240, 238, 0.40)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// NODE TYPE COLORS — Semantic mapping
// ─────────────────────────────────────────────────────────────────────────────

export const NodeTypeColors: Record<NodeType, string> = {
  // Networking — Blue
  'router': DiagramColors.network,
  'switch': DiagramColors.network,
  'hub': DiagramColors.network,
  'bridge': DiagramColors.network,
  'firewall': DiagramColors.threat,        // Security device = threat color
  'access-point': DiagramColors.network,
  'load-balancer': DiagramColors.network,
  'vpn-gateway': DiagramColors.network,
  'proxy': DiagramColors.network,
  
  // Computers & Devices — Network blue
  'server': DiagramColors.server,
  'client': DiagramColors.user,
  'workstation': DiagramColors.user,
  'laptop': DiagramColors.user,
  'mobile': DiagramColors.user,
  'iot-device': DiagramColors.user,
  
  // Web & Software — Purple (applications/services)
  'web-server': DiagramColors.server,
  'app-server': DiagramColors.server,
  'database': DiagramColors.data,
  'cache': DiagramColors.data,
  'queue': DiagramColors.server,
  'api-gateway': DiagramColors.server,
  'cdn': DiagramColors.server,
  'reverse-proxy': DiagramColors.server,
  'microservice': DiagramColors.server,
  'container': DiagramColors.server,
  'browser': DiagramColors.user,
  
  // Cloud & Virtualization — Purple
  'cloud-service': DiagramColors.server,
  'vm': DiagramColors.server,
  'kubernetes-cluster': DiagramColors.server,
  'kubernetes-pod': DiagramColors.server,
  'storage-bucket': DiagramColors.data,
  'region': DiagramColors.neutral,
  'availability-zone': DiagramColors.neutral,
  'vpc': DiagramColors.network,
  'subnet': DiagramColors.network,
  
  // Services — Purple
  'dns-server': DiagramColors.server,
  'dhcp-server': DiagramColors.server,
  'smtp-server': DiagramColors.server,
  'mail-server': DiagramColors.server,
  'auth-server': DiagramColors.server,
  'directory-service': DiagramColors.server,
  'monitoring': DiagramColors.server,
  'logging': DiagramColors.server,
  
  // Security — Red for threats, Accent for security controls
  'attacker': DiagramColors.threat,
  'defender': DiagramColors.success,
  'target': DiagramColors.warning,
  'ids': DiagramColors.success,
  'ips': DiagramColors.success,
  'edr': DiagramColors.success,
  'siem': DiagramColors.success,
  'honeypot': DiagramColors.warning,
  'vulnerability': DiagramColors.threat,
  'exploit': DiagramColors.threat,
  'security-control': DiagramColors.success,
  
  // Cryptography — Data cyan + special
  'plaintext': DiagramColors.neutral,
  'ciphertext': DiagramColors.data,
  'encryption-process': DiagramColors.success,
  'decryption-process': DiagramColors.success,
  'key': DiagramColors.warning,
  'certificate': DiagramColors.success,
  'certificate-authority': DiagramColors.success,
  'hash-function': DiagramColors.data,
  'signature': DiagramColors.data,
  
  // Data & Storage — Cyan
  'data-store': DiagramColors.data,
  'file-system': DiagramColors.data,
  'backup': DiagramColors.data,
  'replica': DiagramColors.data,
  'data-pipeline': DiagramColors.data,
  
  // Users & Identity — Pink
  'user': DiagramColors.user,
  'admin': DiagramColors.user,
  'identity': DiagramColors.user,
  'credentials': DiagramColors.warning,
  
  // Generic — Neutral
  'process': DiagramColors.neutral,
  'service': DiagramColors.server,
  'component': DiagramColors.neutral,
  'external-service': DiagramColors.neutral,
  'note': DiagramColors.neutral,
  'group-label': DiagramColors.neutral,
};

// ─────────────────────────────────────────────────────────────────────────────
// EDGE TYPE STYLES
// ─────────────────────────────────────────────────────────────────────────────

export interface EdgeStyleConfig {
  color: string;
  width: number;
  dashed?: boolean;
  animated?: boolean;
}

export const EdgeTypeStyles: Record<EdgeType, EdgeStyleConfig> = {
  'physical-link': {
    color: DiagramColors.network,
    width: 2,
    dashed: false,
  },
  'wireless-link': {
    color: DiagramColors.network,
    width: 2,
    dashed: true,
  },
  'logical-link': {
    color: DiagramColors.neutral,
    width: 1.5,
    dashed: true,
  },
  'data-flow': {
    color: DiagramColors.data,
    width: 2,
    animated: true,
  },
  'request-response': {
    color: DiagramColors.server,
    width: 2,
    animated: true,
  },
  'encrypted-channel': {
    color: DiagramColors.success,
    width: 2.5,
    dashed: false,
  },
  'attack-path': {
    color: DiagramColors.threat,
    width: 2.5,
    animated: true,
  },
  'blocked-connection': {
    color: DiagramColors.blocked,
    width: 2,
    dashed: true,
  },
  'dependency': {
    color: DiagramColors.neutral,
    width: 1.5,
    dashed: true,
  },
  'relationship': {
    color: DiagramColors.neutral,
    width: 1,
    dashed: false,
  },
  'transform': {
    color: DiagramColors.data,
    width: 2,
    animated: true,
  },
  'control-flow': {
    color: DiagramColors.neutral,
    width: 1.5,
    dashed: false,
  },
  'straight': { color: DiagramColors.neutral, width: 2, dashed: false },
  'step': { color: DiagramColors.neutral, width: 2, dashed: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// NODE STATE COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const NodeStateColors: Record<NodeState, string> = {
  'normal': DiagramColors.neutral,
  'active': DiagramColors.active,
  'highlighted': DiagramColors.highlighted,
  'compromised': DiagramColors.compromised,
  'blocked': DiagramColors.blocked,
  'warning': DiagramColors.warning,
  'success': DiagramColors.success,
  'error': DiagramColors.threat,
  'disabled': DiagramColors.disabled,
  'transmitting': DiagramColors.data,
};

// ─────────────────────────────────────────────────────────────────────────────
// EDGE STATE COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const EdgeStateColors: Record<EdgeState, string> = {
  'normal': DiagramColors.neutral,
  'active': DiagramColors.active,
  'transmitting': DiagramColors.data,
  'blocked': DiagramColors.blocked,
  'highlighted': DiagramColors.highlighted,
  'warning': DiagramColors.warning,
  'error': DiagramColors.threat,
  'encrypted': DiagramColors.success,
  'attacked': DiagramColors.threat,
};

// ─────────────────────────────────────────────────────────────────────────────
// SIZING & SPACING
// ─────────────────────────────────────────────────────────────────────────────

export const DiagramSizing = {
  // Node dimensions
  node: {
    width: 120,
    height: 80,
    minWidth: 80,
    minHeight: 60,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    iconSize: 32,
  },
  
  // Edge dimensions
  edge: {
    defaultWidth: 2,
    highlightWidth: 3,
    minWidth: 1,
    maxWidth: 4,
    markerSize: 8,
  },
  
  // Spacing
  spacing: {
    nodeGap: 100,
    rankGap: 150,
    groupPadding: 24,
    canvasPadding: 40,
  },
  
  // Labels
  label: {
    fontSize: 13,
    lineHeight: 1.4,
    maxWidth: 140,
    padding: 8,
  },
  
  // Controls
  controls: {
    buttonSize: 40,
    buttonSpacing: 8,
    panelPadding: 16,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TIMINGS
// ─────────────────────────────────────────────────────────────────────────────

export const DiagramAnimations = {
  // Durations (ms)
  duration: {
    instant: 120,
    fast: 250,
    normal: 500,
    slow: 1000,
    packet: 2000,
    signal: 1500,
  },
  
  // Easing functions
  easing: {
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',      // Standard QYVORA easing
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',       // Bouncy
    linear: 'linear',
  },
  
  // Animation configs
  packet: {
    duration: 2000,
    size: 8,
    trailLength: 20,
  },
  
  signal: {
    duration: 1500,
    maxRadius: 40,
    opacity: 0.6,
  },
  
  pulse: {
    duration: 1000,
    scale: 1.2,
    opacity: 0.4,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the semantic color for a node type
 */
export function getNodeColor(type: NodeType, state?: NodeState): string {
  if (state && state !== 'normal') {
    return NodeStateColors[state];
  }
  return NodeTypeColors[type] || DiagramColors.neutral;
}

/**
 * Get the border color for a node (slightly brighter than fill)
 */
export function getNodeBorderColor(type: NodeType, state?: NodeState): string {
  const baseColor = getNodeColor(type, state);
  // Simple brightness increase by adding opacity to white
  return baseColor;
}

/**
 * Get background color for a node (dimmed version of main color)
 */
export function getNodeBackgroundColor(type: NodeType): string {
  const color = NodeTypeColors[type] || DiagramColors.neutral;
  // Return dimmed version
  if (color === DiagramColors.network) return DiagramColors.networkDim;
  if (color === DiagramColors.server) return DiagramColors.serverDim;
  if (color === DiagramColors.threat) return DiagramColors.threatDim;
  if (color === DiagramColors.data) return DiagramColors.dataDim;
  if (color === DiagramColors.success) return DiagramColors.successDim;
  if (color === DiagramColors.warning) return DiagramColors.warningDim;
  if (color === DiagramColors.user) return DiagramColors.userDim;
  return DiagramColors.neutralDim;
}

/**
 * Get edge style configuration
 */
export function getEdgeStyle(type: EdgeType, state?: EdgeState): EdgeStyleConfig {
  const baseStyle = EdgeTypeStyles[type] || EdgeTypeStyles.relationship;
  
  if (state && state !== 'normal') {
    return {
      ...baseStyle,
      color: EdgeStateColors[state],
    };
  }
  
  return baseStyle;
}

/**
 * Get glow effect for active/highlighted states
 */
export function getGlowStyle(color: string, intensity: 'low' | 'medium' | 'high' = 'medium'): string {
  const blur = intensity === 'low' ? 8 : intensity === 'high' ? 20 : 12;
  const opacity = intensity === 'low' ? 0.3 : intensity === 'high' ? 0.6 : 0.4;
  return `0 0 ${blur}px ${color}${Math.floor(opacity * 255).toString(16)}`;
}

/**
 * Create a semi-transparent version of a color
 */
export function withOpacity(color: string, opacity: number): string {
  // If already rgba, replace opacity
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  
  // If hex, convert to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // If rgb, convert to rgba
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  return color;
}
