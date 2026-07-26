import React from 'react';
import type { LinkState } from './types';

interface LinkStateIndicatorProps {
  x: number;
  y: number;
  state: LinkState;
}

const STATE_COLORS: Record<LinkState, string> = {
  connected:    '#22c55e',
  disconnected: '#64748b',
  negotiating:  '#f59e0b',
  blocked:      '#f97316',
  disabled:     '#334155',
  error:        '#ef4444',
  'loop-detected': '#f59e0b',
};

const LinkStateIndicator: React.FC<LinkStateIndicatorProps> = ({ x, y, state }) => {
  if (state === 'connected') return null;

  const color = STATE_COLORS[state];
  const r = 4;

  return (
    <g>
      {state === 'loop-detected' ? (
        <>
          <circle cx={x} cy={y} r={r} fill={color} opacity={0.3}>
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={r - 1.5} fill={color} opacity={0.8}>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      ) : state === 'negotiating' ? (
        <>
          <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="1" opacity={0.5}>
            <animate attributeName="stroke-dasharray" values="0 25;12 13;25 0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={r - 2} fill={color} opacity={0.6} />
        </>
      ) : (
        <>
          <circle cx={x} cy={y} r={r} fill={`${color}33`} stroke={color} strokeWidth="1" />
          <circle cx={x} cy={y} r={r - 2} fill={color} opacity={state === 'error' ? 0.8 : 0.4} />
        </>
      )}
    </g>
  );
};

LinkStateIndicator.displayName = 'LinkStateIndicator';

export default React.memo(LinkStateIndicator);
