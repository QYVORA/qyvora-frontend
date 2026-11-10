/**
 * NODE REGISTRY
 * =============
 * 
 * Central registry mapping node types to their React components.
 * Ensures consistent node rendering across all diagrams.
 */

import type { NodeTypes } from '@xyflow/react';
import type { NodeType } from '../types';
import { BaseNode } from './BaseNode';

// Network nodes
import {
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
import {
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
import {
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
import {
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
import {
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

/**
 * Complete node type registry for React Flow
 */
export const nodeTypeRegistry: NodeTypes = {
  // Network
  'router': RouterNode,
  'switch': SwitchNode,
  'hub': HubNode,
  'bridge': SwitchNode,  // Use switch visual for bridge
  'firewall': FirewallNode,
  'access-point': AccessPointNode,
  'load-balancer': ServerNode,  // Similar to server
  'vpn-gateway': RouterNode,  // Similar to router
  'proxy': ServerNode,  // Similar to server
  
  // Computers & Devices
  'server': ServerNode,
  'client': ClientNode,
  'workstation': ClientNode,
  'laptop': LaptopNode,
  'mobile': MobileNode,
  'iot-device': DeviceNode,
  
  // Web & Software
  'web-server': WebServerNode,
  'app-server': AppServerNode,
  'database': DatabaseNode,
  'cache': CacheNode,
  'queue': QueueNode,
  'api-gateway': ApiGatewayNode,
  'cdn': CloudServiceNode,
  'reverse-proxy': ServerNode,
  'microservice': MicroserviceNode,
  'container': ContainerNode,
  'browser': BrowserNode,
  
  // Cloud & Virtualization
  'cloud-service': CloudServiceNode,
  'vm': ServerNode,
  'kubernetes-cluster': ContainerNode,
  'kubernetes-pod': ContainerNode,
  'storage-bucket': StorageNode,
  'region': NoteNode,  // Use note for zones
  'availability-zone': NoteNode,
  'vpc': NoteNode,
  'subnet': NoteNode,
  
  // Services
  'dns-server': ServerNode,
  'dhcp-server': ServerNode,
  'smtp-server': ServerNode,
  'mail-server': ServerNode,
  'auth-server': ServerNode,
  'directory-service': ServerNode,
  'monitoring': ServerNode,
  'logging': ServerNode,
  
  // Security
  'attacker': AttackerNode,
  'defender': DefenderNode,
  'target': TargetNode,
  'ids': IdsNode,
  'ips': IpsNode,
  'edr': SecurityControlNode,
  'siem': SiemNode,
  'honeypot': TargetNode,
  'vulnerability': VulnerabilityNode,
  'exploit': ExploitNode,
  'security-control': SecurityControlNode,
  
  // Cryptography
  'plaintext': PlaintextNode,
  'ciphertext': CiphertextNode,
  'encryption-process': EncryptionNode,
  'decryption-process': DecryptionNode,
  'key': KeyNode,
  'certificate': CertificateNode,
  'certificate-authority': CertificateAuthorityNode,
  'hash-function': HashNode,
  'signature': SignatureNode,
  
  // Data & Storage
  'data-store': DataStoreNode,
  'file-system': StorageNode,
  'backup': StorageNode,
  'replica': DatabaseNode,
  'data-pipeline': ProcessNode,
  
  // Users & Identity
  'user': UserNode,
  'admin': AdminNode,
  'identity': UserNode,
  'credentials': KeyNode,
  
  // Generic
  'process': ProcessNode,
  'service': ComponentNode,
  'component': ComponentNode,
  'external-service': ExternalServiceNode,
  'note': NoteNode,
  'group-label': NoteNode,
  
  // Fallback
  'default': BaseNode,
};

/**
 * Get the component for a node type
 */
export function getNodeComponent(type: NodeType) {
  return nodeTypeRegistry[type] || BaseNode;
}

/**
 * Check if a node type is registered
 */
export function isNodeTypeRegistered(type: string): type is NodeType {
  return type in nodeTypeRegistry;
}

export default nodeTypeRegistry;
