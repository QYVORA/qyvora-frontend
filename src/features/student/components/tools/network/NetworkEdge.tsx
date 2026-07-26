import React, { useMemo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import LinkStateIndicator from './LinkStateIndicator';
import type { NetworkLinkData, LinkState } from './types';

const STATE_STYLES: Record<LinkState, React.CSSProperties> = {
  connected:    { stroke: '#334155', strokeWidth: 1.5, opacity: 0.6 },
  disconnected: { stroke: '#334155', strokeWidth: 1, opacity: 0.25, strokeDasharray: '6 4' },
  negotiating:  { stroke: '#f59e0b', strokeWidth: 1.5, opacity: 0.5, strokeDasharray: '4 4' },
  blocked:      { stroke: '#f97316', strokeWidth: 1.5, opacity: 0.5 },
  disabled:     { stroke: '#334155', strokeWidth: 1, opacity: 0.15 },
  error:        { stroke: '#ef4444', strokeWidth: 1.5, opacity: 0.7 },
  'loop-detected': { stroke: '#f59e0b', strokeWidth: 2, opacity: 0.7 },
};

const MEDIUM_GLOWS: Record<string, string> = {
  'ethernet':        '#3b82f6',
  'rj45':            '#3b82f6',
  'straight-through': '#3b82f6',
  'crossover':       '#6366f1',
  'single-mode':     '#f59e0b',
  'multi-mode':      '#f59e0b',
  'serial':          '#64748b',
  'mpls':            '#8b5cf6',
  'leased-line':     '#8b5cf6',
  'wifi':            '#06b6d6',
  'bluetooth':       '#3b82f6',
};

function getMediumStyle(mediumId: string): React.CSSProperties {
  if (mediumId === 'wifi' || mediumId === 'bluetooth') {
    return { strokeDasharray: '8 4', strokeWidth: 1.5 };
  }
  if (mediumId === 'serial') {
    return { strokeWidth: 1, strokeDasharray: '2 2' };
  }
  if (mediumId === 'single-mode' || mediumId === 'multi-mode') {
    return { strokeWidth: 1.5, filter: `drop-shadow(0 0 3px ${MEDIUM_GLOWS[mediumId] ?? '#f59e0b'}55)` };
  }
  return {};
}

function isLoopDetected(state: LinkState): boolean {
  return state === 'loop-detected';
}

const NetworkEdge: React.FC<EdgeProps> = ({
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
  const linkData = data as unknown as NetworkLinkData | undefined;
  const mediumId = linkData?.mediumId ?? 'ethernet';
  const mediumLabel = linkData?.mediumLabel ?? 'Ethernet';
  const state = linkData?.state ?? 'connected';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const baseStyle = STATE_STYLES[state] || STATE_STYLES.connected;
  const mediumStyle = getMediumStyle(mediumId);
  const glowColor = MEDIUM_GLOWS[mediumId] ?? '#334155';

  const finalStyle: React.CSSProperties = useMemo(() => ({
    ...baseStyle,
    ...mediumStyle,
    filter: selected ? `drop-shadow(0 0 4px ${glowColor}55)` : mediumStyle.filter as string | undefined,
  }), [baseStyle, mediumStyle, selected, glowColor]);

  return (
    <>
      {/* Glow layer (always behind) */}
      {state === 'connected' && (
        <path
          d={edgePath}
          fill="none"
          stroke={glowColor}
          strokeWidth={6}
          opacity={0.06}
          className="pointer-events-none"
        />
      )}

      {/* Loop detection flash */}
      {isLoopDetected(state) && (
        <path
          d={edgePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={4}
          opacity={0.15}
          className="pointer-events-none"
        >
          <animate attributeName="opacity" values="0.15;0.4;0.15" dur="0.6s" repeatCount="indefinite" />
        </path>
      )}

      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={finalStyle}
      />

      {/* Link state indicator at midpoint */}
      <LinkStateIndicator x={labelX} y={labelY} state={state} />

      {/* Medium label */}
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <span className="text-[7px] font-mono text-text-muted/50 bg-bg/70 px-1.5 py-0.5 rounded border border-border/10">
            {mediumLabel}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

NetworkEdge.displayName = 'NetworkEdge';

export default React.memo(NetworkEdge);
