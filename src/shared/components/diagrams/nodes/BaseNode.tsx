/**
 * BASE DIAGRAM NODE COMPONENT
 * ===========================
 * 
 * Foundation component for all diagram nodes.
 * Handles common styling, states, and interactions.
 */

import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { DiagramNode, NodeState } from '../types';
import { getNodeColor, getNodeBackgroundColor, DiagramSizing } from '../theme/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type BaseNodeData = Omit<DiagramNode, 'position'>;
export type BaseNodeType = Node<BaseNodeData>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type BaseNodeProps = NodeProps<BaseNodeType> & {
  icon?: React.ReactNode;
  showHandles?: boolean;
  handlePositions?: Position[];
};

/**
 * BaseNode — Reusable foundation for all diagram node types
 */
export const BaseNode = memo<BaseNodeProps>(({
  data,
  selected,
  icon,
  showHandles = true,
  handlePositions = [Position.Top, Position.Right, Position.Bottom, Position.Left],
}) => {
  const { type, label, sublabel, state = 'normal', style } = data;
  
  const nodeColor = style?.color || getNodeColor(type, state);
  const bgColor = style?.backgroundColor || getNodeBackgroundColor(type);
  
  // Build class names based on state
  const stateClasses: string[] = ['diagram-node'];
  if (selected) stateClasses.push('diagram-node-selected');
  if (state === 'active') stateClasses.push('diagram-node-active');
  if (state === 'highlighted') stateClasses.push('diagram-node-highlighted');
  if (state === 'compromised') stateClasses.push('diagram-node-compromised');
  if (state === 'disabled') stateClasses.push('diagram-node-disabled');
  
  return (
    <div
      className={stateClasses.join(' ')}
      style={{
        '--node-color': nodeColor,
        backgroundColor: bgColor,
        width: style?.width || DiagramSizing.node.width,
        minHeight: style?.height || DiagramSizing.node.height,
        borderColor: style?.borderColor || nodeColor,
        opacity: style?.opacity,
      } as React.CSSProperties}
    >
      {/* Connection handles */}
      {showHandles && handlePositions.map((position) => (
        <Handle
          key={position}
          type="source"
          position={position}
          id={`${position}-source`}
          style={{
            width: 12,
            height: 12,
            backgroundColor: nodeColor,
            border: '2px solid var(--color-bg-card)',
          }}
        />
      ))}
      {showHandles && handlePositions.map((position) => (
        <Handle
          key={position}
          type="target"
          position={position}
          id={`${position}-target`}
          style={{
            width: 12,
            height: 12,
            backgroundColor: nodeColor,
            border: '2px solid var(--color-bg-card)',
          }}
        />
      ))}
      
      {/* Node content */}
      <div className="flex flex-col items-center justify-center h-full gap-1">
        {icon && (
          <div className="diagram-node-icon" style={{ color: nodeColor }}>
            {icon}
          </div>
        )}
        
        <div className="diagram-node-label">
          {label}
        </div>
        
        {sublabel && (
          <div className="diagram-node-sublabel">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode;
