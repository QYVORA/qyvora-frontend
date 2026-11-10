/**
 * NETWORK NODE COMPONENTS
 * =======================
 * 
 * Recognizable network infrastructure nodes:
 * routers, switches, firewalls, access points, etc.
 */

import type { BaseNodeType } from "./BaseNode";
import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import {
  Network,
  Router,
  Shield,
  Wifi,
  Server,
  Monitor,
  Laptop,
  Smartphone,
  Box,
} from 'lucide-react';
import { BaseNode, type BaseNodeData } from './BaseNode';

/**
 * Router Node
 */
export const RouterNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Router size={28} strokeWidth={2.5} />} />;
});
RouterNode.displayName = 'RouterNode';

/**
 * Switch Node
 */
export const SwitchNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Network size={28} strokeWidth={2.5} />} />;
});
SwitchNode.displayName = 'SwitchNode';

/**
 * Hub Node (simpler than switch)
 */
export const HubNode = memo<NodeProps<BaseNodeType>>((props) => {
  return (
    <BaseNode
      {...props}
      icon={
        <div className="relative">
          <Network size={28} strokeWidth={2} opacity={0.7} />
        </div>
      }
    />
  );
});
HubNode.displayName = 'HubNode';

/**
 * Firewall Node
 */
export const FirewallNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Shield size={28} strokeWidth={2.5} />} />;
});
FirewallNode.displayName = 'FirewallNode';

/**
 * Access Point Node
 */
export const AccessPointNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Wifi size={28} strokeWidth={2.5} />} />;
});
AccessPointNode.displayName = 'AccessPointNode';

/**
 * Server Node
 */
export const ServerNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Server size={28} strokeWidth={2.5} />} />;
});
ServerNode.displayName = 'ServerNode';

/**
 * Client/Workstation Node
 */
export const ClientNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Monitor size={28} strokeWidth={2.5} />} />;
});
ClientNode.displayName = 'ClientNode';

/**
 * Laptop Node
 */
export const LaptopNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Laptop size={28} strokeWidth={2.5} />} />;
});
LaptopNode.displayName = 'LaptopNode';

/**
 * Mobile Device Node
 */
export const MobileNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Smartphone size={28} strokeWidth={2.5} />} />;
});
MobileNode.displayName = 'MobileNode';

/**
 * Generic Device Node
 */
export const DeviceNode = memo<NodeProps<BaseNodeType>>((props) => {
  return <BaseNode {...props} icon={<Box size={28} strokeWidth={2.5} />} />;
});
DeviceNode.displayName = 'DeviceNode';
