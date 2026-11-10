/**
 * WEB & SOFTWARE ARCHITECTURE NODES
 * =================================
 * 
 * Nodes for web applications, APIs, microservices, databases, etc.
 */

import type { BaseNodeType } from "./BaseNode";
import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import {
  Globe,
  Database,
  Layers,
  Boxes,
  Cloud,
  Container,
  FileJson,
  Repeat,
  Zap,
  HardDrive,
  Code,
} from 'lucide-react';
import { BaseNode, type BaseNodeData } from './BaseNode';

/**
 * Web Server Node
 */
export const WebServerNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Globe size={28} strokeWidth={2.5} />} />;
});
WebServerNode.displayName = 'WebServerNode';

/**
 * Application Server Node
 */
export const AppServerNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Layers size={28} strokeWidth={2.5} />} />;
});
AppServerNode.displayName = 'AppServerNode';

/**
 * Database Node
 */
export const DatabaseNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Database size={28} strokeWidth={2.5} />} />;
});
DatabaseNode.displayName = 'DatabaseNode';

/**
 * Cache Node
 */
export const CacheNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Zap size={28} strokeWidth={2.5} />} />;
});
CacheNode.displayName = 'CacheNode';

/**
 * Queue Node
 */
export const QueueNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Repeat size={28} strokeWidth={2.5} />} />;
});
QueueNode.displayName = 'QueueNode';

/**
 * API Gateway Node
 */
export const ApiGatewayNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileJson size={28} strokeWidth={2.5} />} />;
});
ApiGatewayNode.displayName = 'ApiGatewayNode';

/**
 * Microservice Node
 */
export const MicroserviceNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Boxes size={28} strokeWidth={2.5} />} />;
});
MicroserviceNode.displayName = 'MicroserviceNode';

/**
 * Container Node
 */
export const ContainerNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Container size={28} strokeWidth={2.5} />} />;
});
ContainerNode.displayName = 'ContainerNode';

/**
 * Cloud Service Node
 */
export const CloudServiceNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Cloud size={28} strokeWidth={2.5} />} />;
});
CloudServiceNode.displayName = 'CloudServiceNode';

/**
 * Storage Node
 */
export const StorageNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<HardDrive size={28} strokeWidth={2.5} />} />;
});
StorageNode.displayName = 'StorageNode';

/**
 * Browser Node
 */
export const BrowserNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Code size={28} strokeWidth={2.5} />} />;
});
BrowserNode.displayName = 'BrowserNode';
