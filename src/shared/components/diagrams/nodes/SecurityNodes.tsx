/**
 * SECURITY & THREAT NODES
 * =======================
 * 
 * Nodes for cybersecurity diagrams: attackers, defenders, 
 * security tools, vulnerabilities, exploits.
 */

import type { BaseNodeType } from "./BaseNode";
import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import {
  UserX,
  ShieldCheck,
  Target,
  AlertTriangle,
  Bug,
  Eye,
  ShieldAlert,
  Activity,
  Lock,
  Unlock,
} from 'lucide-react';
import { BaseNode, type BaseNodeData } from './BaseNode';

/**
 * Attacker Node
 */
export const AttackerNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<UserX size={28} strokeWidth={2.5} />} />;
});
AttackerNode.displayName = 'AttackerNode';

/**
 * Defender Node
 */
export const DefenderNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<ShieldCheck size={28} strokeWidth={2.5} />} />;
});
DefenderNode.displayName = 'DefenderNode';

/**
 * Target Node
 */
export const TargetNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Target size={28} strokeWidth={2.5} />} />;
});
TargetNode.displayName = 'TargetNode';

/**
 * Vulnerability Node
 */
export const VulnerabilityNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<AlertTriangle size={28} strokeWidth={2.5} />} />;
});
VulnerabilityNode.displayName = 'VulnerabilityNode';

/**
 * Exploit Node
 */
export const ExploitNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Bug size={28} strokeWidth={2.5} />} />;
});
ExploitNode.displayName = 'ExploitNode';

/**
 * IDS (Intrusion Detection System) Node
 */
export const IdsNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Eye size={28} strokeWidth={2.5} />} />;
});
IdsNode.displayName = 'IdsNode';

/**
 * IPS (Intrusion Prevention System) Node
 */
export const IpsNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<ShieldAlert size={28} strokeWidth={2.5} />} />;
});
IpsNode.displayName = 'IpsNode';

/**
 * SIEM (Security Information and Event Management) Node
 */
export const SiemNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Activity size={28} strokeWidth={2.5} />} />;
});
SiemNode.displayName = 'SiemNode';

/**
 * Security Control Node
 */
export const SecurityControlNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Lock size={28} strokeWidth={2.5} />} />;
});
SecurityControlNode.displayName = 'SecurityControlNode';

/**
 * Compromised/Vulnerable State Node
 */
export const CompromisedNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Unlock size={28} strokeWidth={2.5} />} />;
});
CompromisedNode.displayName = 'CompromisedNode';
