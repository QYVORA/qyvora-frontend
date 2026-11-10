/**
 * BASE DIAGRAM EDGE COMPONENT
 * ===========================
 * 
 * Foundation component for all diagram edges/connections.
 * Handles styling, states, animations, and labels.
 */

import React, { memo } from 'react';
import {
  BaseEdge as ReactFlowBaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { Edge } from '@xyflow/react';
import type { DiagramEdge, EdgeState } from '../types';
import { getEdgeStyle } from '../theme/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type BaseEdgeData = Omit<DiagramEdge, 'source' | 'target'>;
export type BaseEdgeType = Edge<BaseEdgeData>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type BaseEdgeProps = EdgeProps<BaseEdgeType>;

/**
 * BaseEdge — Reusable foundation for all diagram edge types
 */
export const BaseEdge = memo<BaseEdgeProps>(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edgeData = data as any;
  const { type, label, state = 'normal', animated, dashed, style } = edgeData || {};
  
  // Get edge styling from theme
  const edgeStyleConfig = type ? getEdgeStyle(type, state) : {
    color: '#71717a',
    width: 2,
    dashed: false,
    animated: false,
  };
  
  const edgeColor = style?.color || edgeStyleConfig.color;
  const edgeWidth = style?.width || edgeStyleConfig.width;
  const isDashed = dashed !== undefined ? dashed : edgeStyleConfig.dashed;
  const isAnimated = animated !== undefined ? animated : edgeStyleConfig.animated;
  
  // Calculate path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Build edge classes based on state
  const edgeClasses: string[] = [];
  if (selected) edgeClasses.push('edge-selected');
  if (isAnimated) edgeClasses.push('edge-animated');
  if (state === 'transmitting') edgeClasses.push('edge-transmitting');
  if (state === 'highlighted') edgeClasses.push('edge-highlighted');
  if (state === 'blocked') edgeClasses.push('edge-blocked');
  
  return (
    <>
      <ReactFlowBaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          '--edge-color': edgeColor,
          '--edge-width': `${edgeWidth}px`,
          stroke: edgeColor,
          strokeWidth: edgeWidth,
          strokeDasharray: isDashed ? '8, 8' : 'none',
          opacity: style?.opacity !== undefined ? style.opacity : 1,
        } as React.CSSProperties}
        className={edgeClasses.join(' ')}
      />
      
      {/* Edge label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="edge-label nodrag nopan"
          >
            <div className="px-2 py-1 bg-bg-card border border-border rounded text-xs font-mono text-text-secondary">
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

BaseEdge.displayName = 'BaseEdge';

export default BaseEdge;
