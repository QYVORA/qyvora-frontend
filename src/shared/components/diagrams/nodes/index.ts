/**
 * DIAGRAM NODES — EXPORTS
 * =======================
 * 
 * Central export point for all diagram node components.
 */

// Base node
export { BaseNode } from './BaseNode';
export type { BaseNodeData, BaseNodeProps } from './BaseNode';

// Network nodes
export {
  RouterNode,
  SwitchNode,
  HubNode,
  FirewallNode,
  AccessPointNode,
  ServerNode,
  ClientNode,
  LaptopNode,
  MobileNode,
  DeviceNode,
} from './NetworkNodes';

// Web & software nodes
export {
  WebServerNode,
  AppServerNode,
  DatabaseNode,
  CacheNode,
  QueueNode,
  ApiGatewayNode,
  MicroserviceNode,
  ContainerNode,
  CloudServiceNode,
  StorageNode,
  BrowserNode,
} from './WebNodes';

// Security nodes
export {
  AttackerNode,
  DefenderNode,
  TargetNode,
  VulnerabilityNode,
  ExploitNode,
  IdsNode,
  IpsNode,
  SiemNode,
  SecurityControlNode,
  CompromisedNode,
} from './SecurityNodes';

// Cryptography nodes
export {
  PlaintextNode,
  CiphertextNode,
  EncryptionNode,
  DecryptionNode,
  KeyNode,
  CertificateNode,
  CertificateAuthorityNode,
  HashNode,
  SignatureNode,
} from './CryptoNodes';

// Generic nodes
export {
  UserNode,
  AdminNode,
  ProcessNode,
  ComponentNode,
  ExternalServiceNode,
  NoteNode,
  DataStoreNode,
  CircleNode,
  SquareNode,
} from './GenericNodes';

// Registry
export { nodeTypeRegistry, getNodeComponent, isNodeTypeRegistered } from './nodeRegistry';
export type { default as NodeTypes } from './nodeRegistry';
