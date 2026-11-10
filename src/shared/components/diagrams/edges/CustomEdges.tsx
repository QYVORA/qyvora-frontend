/**
 * CUSTOM EDGE COMPONENTS
 * ======================
 * 
 * Specialized edge components with unique visual treatments
 * for different connection types.
 */

import React, { memo } from 'react';
import {
  BaseEdge as ReactFlowBaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';
import { BaseEdge, type BaseEdgeData, type BaseEdgeType } from './BaseEdge';

/**
 * Straight Edge — Direct linear connection
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StraightEdge = memo<EdgeProps<any>>((props) => {
  const { sourceX, sourceY, targetX, targetY, data, style } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edgeData = data as any;
  const edgeColor = edgeData?.style?.color || '#71717a';
  const edgeWidth = edgeData?.style?.width || 2;
  
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  
  return (
    <ReactFlowBaseEdge
      {...props}
      path={edgePath}
      style={{
        stroke: edgeColor,
        strokeWidth: edgeWidth,
        ...style,
      }}
    />
  );
});
StraightEdge.displayName = 'StraightEdge';

/**
 * Step Edge — Right-angle connections
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StepEdge = memo<EdgeProps<any>>((props) => {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edgeData = data as any;
  const edgeColor = edgeData?.style?.color || '#71717a';
  const edgeWidth = edgeData?.style?.width || 2;
  
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  return (
    <ReactFlowBaseEdge
      {...props}
      path={edgePath}
      style={{
        stroke: edgeColor,
        strokeWidth: edgeWidth,
        ...style,
      }}
    />
  );
});
StepEdge.displayName = 'StepEdge';

/**
 * Wireless Edge — Dashed line for wireless connections
 */
export const WirelessEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        dashed: true,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#3b82f6',
        },
      }}
    />
  );
});
WirelessEdge.displayName = 'WirelessEdge';

/**
 * Encrypted Edge — Secure connection with accent color
 */
export const EncryptedEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#06B66F',
          width: props.data?.style?.width || 2.5,
        },
      }}
    />
  );
});
EncryptedEdge.displayName = 'EncryptedEdge';

/**
 * Attack Path Edge — Threatening red connection
 */
export const AttackPathEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        animated: true,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#ef4444',
          width: props.data?.style?.width || 2.5,
        },
      }}
    />
  );
});
AttackPathEdge.displayName = 'AttackPathEdge';

/**
 * Data Flow Edge — Animated cyan connection
 */
export const DataFlowEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        animated: true,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#06b6d4',
        },
      }}
    />
  );
});
DataFlowEdge.displayName = 'DataFlowEdge';

/**
 * Blocked Edge — Crossed-out blocked connection
 */
export const BlockedEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        dashed: true,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#94a3b8',
          opacity: props.data?.style?.opacity !== undefined ? props.data.style.opacity : 0.6,
        },
      }}
    />
  );
});
BlockedEdge.displayName = 'BlockedEdge';

/**
 * Dependency Edge — Thin dashed line for dependencies
 */
export const DependencyEdge = memo<EdgeProps<BaseEdgeType>>((props) => {
  return (
    <BaseEdge
      {...props}
      data={{
        ...props.data,
        dashed: true,
        style: {
          ...props.data?.style,
          color: props.data?.style?.color || '#71717a',
          width: props.data?.style?.width || 1.5,
        },
      }}
    />
  );
});
DependencyEdge.displayName = 'DependencyEdge';
