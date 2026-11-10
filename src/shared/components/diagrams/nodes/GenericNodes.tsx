/**
 * GENERIC & UTILITY NODES
 * =======================
 * 
 * General-purpose nodes for processes, users, data, and annotations.
 */

import type { BaseNodeType } from "./BaseNode";
import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import {
  User,
  Users,
  Circle,
  Square,
  FileText,
  Cpu,
  Package,
  ExternalLink,
  StickyNote,
} from 'lucide-react';
import { BaseNode, type BaseNodeData } from './BaseNode';

/**
 * User Node
 */
export const UserNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<User size={28} strokeWidth={2.5} />} />;
});
UserNode.displayName = 'UserNode';

/**
 * Admin/Administrator Node
 */
export const AdminNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Users size={28} strokeWidth={2.5} />} />;
});
AdminNode.displayName = 'AdminNode';

/**
 * Process Node
 */
export const ProcessNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Cpu size={28} strokeWidth={2.5} />} />;
});
ProcessNode.displayName = 'ProcessNode';

/**
 * Component Node
 */
export const ComponentNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Package size={28} strokeWidth={2.5} />} />;
});
ComponentNode.displayName = 'ComponentNode';

/**
 * External Service Node
 */
export const ExternalServiceNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<ExternalLink size={28} strokeWidth={2.5} />} />;
});
ExternalServiceNode.displayName = 'ExternalServiceNode';

/**
 * Note/Annotation Node
 */
export const NoteNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<StickyNote size={28} strokeWidth={2.5} />} />;
});
NoteNode.displayName = 'NoteNode';

/**
 * Data Store Node
 */
export const DataStoreNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<FileText size={28} strokeWidth={2.5} />} />;
});
DataStoreNode.displayName = 'DataStoreNode';

/**
 * Simple Circle Node (for flowcharts)
 */
export const CircleNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Circle size={28} strokeWidth={2.5} />} />;
});
CircleNode.displayName = 'CircleNode';

/**
 * Simple Square Node (for flowcharts)
 */
export const SquareNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Square size={28} strokeWidth={2.5} />} />;
});
SquareNode.displayName = 'SquareNode';
