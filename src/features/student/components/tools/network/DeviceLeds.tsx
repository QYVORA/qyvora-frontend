import React from 'react';
import type { DeviceStatus, TrafficLevel } from './types';

interface DeviceLedsProps {
  status: DeviceStatus;
  traffic?: TrafficLevel;
  compact?: boolean;
}

const DeviceLeds: React.FC<DeviceLedsProps> = ({ status, traffic = 'idle', compact = false }) => {
  const size = compact ? 3 : 4;
  const gap = compact ? 1.5 : 2;

  const powerColor = status === 'offline' ? '#333' : '#22c55e';
  const statusColor = status === 'online' ? '#22c55e' : status === 'warning' ? '#f59e0b' : status === 'degraded' ? '#f97316' : status === 'offline' ? '#333' : '#ef4444';
  const activityColor = traffic !== 'idle' ? '#22c55e' : '#333';

  return (
    <div className="flex items-center" style={{ gap }}>
      {/* Power */}
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.5} fill={powerColor} opacity={status !== 'offline' ? 0.8 : 0.2}>
          {status !== 'offline' && (
            <animate attributeName="opacity" values="0.8;0.5;0.8" dur="3s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
      {/* Status */}
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.5} fill={statusColor} opacity={0.8}>
          {status === 'degraded' && (
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
          )}
          {status === 'warning' && (
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
      {/* Activity */}
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.5} fill={activityColor} opacity={traffic !== 'idle' ? 0.8 : 0.15}>
          {traffic === 'high' && (
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.4s" repeatCount="indefinite" />
          )}
          {traffic === 'medium' && (
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.8s" repeatCount="indefinite" />
          )}
          {traffic === 'low' && (
            <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
          )}
          {traffic === 'saturated' && (
            <animate attributeName="opacity" values="1;0.2;1" dur="0.2s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
    </div>
  );
};

DeviceLeds.displayName = 'DeviceLeds';

export default React.memo(DeviceLeds);
