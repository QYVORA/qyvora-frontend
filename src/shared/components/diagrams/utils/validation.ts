/**
 * DIAGRAM VALIDATION UTILITIES
 * =============================
 * 
 * Runtime validation for diagram definitions to catch errors early
 * and provide helpful developer feedback.
 */

import type {
  DiagramDefinition,
  DiagramNode,
  DiagramEdge,
  ValidationResult,
  ValidationError,
  NodeType,
  EdgeType,
  DiagramType,
  DiagramRenderer,
} from '../types';

const VALID_NODE_TYPES: NodeType[] = [
  'router', 'switch', 'hub', 'bridge', 'firewall', 'access-point', 'load-balancer',
  'vpn-gateway', 'proxy', 'server', 'client', 'workstation', 'laptop', 'mobile',
  'iot-device', 'web-server', 'app-server', 'database', 'cache', 'queue',
  'api-gateway', 'cdn', 'reverse-proxy', 'microservice', 'container', 'browser',
  'cloud-service', 'vm', 'kubernetes-cluster', 'kubernetes-pod', 'storage-bucket',
  'region', 'availability-zone', 'vpc', 'subnet', 'dns-server', 'dhcp-server',
  'smtp-server', 'mail-server', 'auth-server', 'directory-service', 'monitoring',
  'logging', 'attacker', 'defender', 'target', 'ids', 'ips', 'edr', 'siem',
  'honeypot', 'vulnerability', 'exploit', 'security-control', 'plaintext',
  'ciphertext', 'encryption-process', 'decryption-process', 'key', 'certificate',
  'certificate-authority', 'hash-function', 'signature', 'data-store',
  'file-system', 'backup', 'replica', 'data-pipeline', 'user', 'admin',
  'identity', 'credentials', 'process', 'service', 'component',
  'external-service', 'note', 'group-label',
];

const VALID_EDGE_TYPES: EdgeType[] = [
  'physical-link', 'wireless-link', 'logical-link', 'data-flow',
  'request-response', 'encrypted-channel', 'attack-path', 'blocked-connection',
  'dependency', 'relationship', 'transform', 'control-flow',
];

const VALID_DIAGRAM_TYPES: DiagramType[] = [
  'network-topology', 'web-architecture', 'process-flow', 'sequence',
  'attack-path', 'crypto-process', 'state-machine', 'data-flow',
  'cloud-infrastructure', 'system-architecture',
];

const VALID_RENDERERS: DiagramRenderer[] = ['react-flow', 'svg', 'mermaid'];

/**
 * Validate a complete diagram definition
 */
export function validateDiagramDefinition(
  diagram: unknown,
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!diagram || typeof diagram !== 'object') {
    errors.push({
      field: 'diagram',
      message: 'Diagram definition must be an object',
      severity: 'error',
    });
    return { valid: false, errors };
  }

  const d = diagram as Partial<DiagramDefinition>;

  // Required fields
  if (!d.id || typeof d.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'Diagram must have a unique string ID',
      severity: 'error',
    });
  }

  if (!d.type || !VALID_DIAGRAM_TYPES.includes(d.type as DiagramType)) {
    errors.push({
      field: 'type',
      message: `Invalid diagram type. Must be one of: ${VALID_DIAGRAM_TYPES.join(', ')}`,
      severity: 'error',
    });
  }

  if (!d.title || typeof d.title !== 'string') {
    errors.push({
      field: 'title',
      message: 'Diagram must have a title',
      severity: 'error',
    });
  }

  if (!d.renderer || !VALID_RENDERERS.includes(d.renderer as DiagramRenderer)) {
    errors.push({
      field: 'renderer',
      message: `Invalid renderer. Must be one of: ${VALID_RENDERERS.join(', ')}`,
      severity: 'error',
    });
  }

  // Nodes
  if (!Array.isArray(d.nodes)) {
    errors.push({
      field: 'nodes',
      message: 'Nodes must be an array',
      severity: 'error',
    });
  } else {
    const nodeIds = new Set<string>();
    d.nodes.forEach((node, index) => {
      const nodeErrors = validateNode(node, index);
      errors.push(...nodeErrors);

      if (node.id) {
        if (nodeIds.has(node.id)) {
          errors.push({
            field: `nodes[${index}].id`,
            message: `Duplicate node ID: ${node.id}`,
            severity: 'error',
          });
        }
        nodeIds.add(node.id);
      }
    });
  }

  // Edges
  if (!Array.isArray(d.edges)) {
    errors.push({
      field: 'edges',
      message: 'Edges must be an array',
      severity: 'error',
    });
  } else {
    const nodeIds = new Set((d.nodes || []).map((n) => n.id));
    const edgeIds = new Set<string>();

    d.edges.forEach((edge, index) => {
      const edgeErrors = validateEdge(edge, index, nodeIds);
      errors.push(...edgeErrors);

      if (edge.id) {
        if (edgeIds.has(edge.id)) {
          errors.push({
            field: `edges[${index}].id`,
            message: `Duplicate edge ID: ${edge.id}`,
            severity: 'error',
          });
        }
        edgeIds.add(edge.id);
      }
    });
  }

  // Accessibility
  if (!d.accessibility?.ariaLabel) {
    errors.push({
      field: 'accessibility.ariaLabel',
      message: 'Diagram should have an aria-label for accessibility',
      severity: 'warning',
    });
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
  };
}

/**
 * Validate a single node
 */
export function validateNode(
  node: unknown,
  index?: number,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = index !== undefined ? `nodes[${index}]` : 'node';

  if (!node || typeof node !== 'object') {
    errors.push({
      field: prefix,
      message: 'Node must be an object',
      severity: 'error',
    });
    return errors;
  }

  const n = node as Partial<DiagramNode>;

  if (!n.id || typeof n.id !== 'string') {
    errors.push({
      field: `${prefix}.id`,
      message: 'Node must have a unique string ID',
      severity: 'error',
    });
  }

  if (!n.type || !VALID_NODE_TYPES.includes(n.type as NodeType)) {
    errors.push({
      field: `${prefix}.type`,
      message: `Invalid node type: ${n.type}. Must be one of the supported types.`,
      severity: 'error',
    });
  }

  if (!n.label || typeof n.label !== 'string') {
    errors.push({
      field: `${prefix}.label`,
      message: 'Node must have a label',
      severity: 'error',
    });
  }

  if (n.position) {
    if (typeof n.position.x !== 'number' || typeof n.position.y !== 'number') {
      errors.push({
        field: `${prefix}.position`,
        message: 'Node position must have numeric x and y coordinates',
        severity: 'error',
      });
    }
  }

  return errors;
}

/**
 * Validate a single edge
 */
export function validateEdge(
  edge: unknown,
  index?: number,
  validNodeIds?: Set<string>,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const prefix = index !== undefined ? `edges[${index}]` : 'edge';

  if (!edge || typeof edge !== 'object') {
    errors.push({
      field: prefix,
      message: 'Edge must be an object',
      severity: 'error',
    });
    return errors;
  }

  const e = edge as Partial<DiagramEdge>;

  if (!e.id || typeof e.id !== 'string') {
    errors.push({
      field: `${prefix}.id`,
      message: 'Edge must have a unique string ID',
      severity: 'error',
    });
  }

  if (!e.source || typeof e.source !== 'string') {
    errors.push({
      field: `${prefix}.source`,
      message: 'Edge must have a source node ID',
      severity: 'error',
    });
  } else if (validNodeIds && !validNodeIds.has(e.source)) {
    errors.push({
      field: `${prefix}.source`,
      message: `Edge source references non-existent node: ${e.source}`,
      severity: 'error',
    });
  }

  if (!e.target || typeof e.target !== 'string') {
    errors.push({
      field: `${prefix}.target`,
      message: 'Edge must have a target node ID',
      severity: 'error',
    });
  } else if (validNodeIds && !validNodeIds.has(e.target)) {
    errors.push({
      field: `${prefix}.target`,
      message: `Edge target references non-existent node: ${e.target}`,
      severity: 'error',
    });
  }

  if (!e.type || !VALID_EDGE_TYPES.includes(e.type as EdgeType)) {
    errors.push({
      field: `${prefix}.type`,
      message: `Invalid edge type: ${e.type}. Must be one of the supported types.`,
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Throw an error if validation fails (use in development)
 */
export function assertValidDiagram(diagram: unknown): asserts diagram is DiagramDefinition {
  const result = validateDiagramDefinition(diagram);
  if (!result.valid) {
    const errorMessages = result.errors
      .filter((e) => e.severity === 'error')
      .map((e) => `${e.field}: ${e.message}`)
      .join('\n');
    throw new Error(`Invalid diagram definition:\n${errorMessages}`);
  }
}

/**
 * Log validation warnings to console (use in development)
 */
export function logValidationWarnings(diagram: unknown): void {
  const result = validateDiagramDefinition(diagram);
  const warnings = result.errors.filter((e) => e.severity === 'warning');
  if (warnings.length > 0) {
    console.warn('Diagram validation warnings:');
    warnings.forEach((w) => {
      console.warn(`- ${w.field}: ${w.message}`);
    });
  }
}
