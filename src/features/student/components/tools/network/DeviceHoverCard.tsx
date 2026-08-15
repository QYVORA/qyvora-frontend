import React from 'react';
import type { DeviceNodeData } from './types';
import { getDeviceDef } from './devices';

interface DeviceHoverCardProps {
  data: DeviceNodeData;
}

const DeviceHoverCard: React.FC<DeviceHoverCardProps> = ({ data }) => {
  const def = getDeviceDef(data.deviceType);
  const upIfaces = data.interfaces.filter(i => i.operationalState === 'up').length;
  const totalIfaces = data.interfaces.length;

  const statusColor = data.status === 'online' ? '#22c55e' : data.status === 'warning' ? '#f59e0b' : data.status === 'degraded' ? '#f97316' : '#ef4444';

  return (
    <div
      className="absolute z-10 pointer-events-none bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[180px]"
      style={{ animation: 'fade-in 0.15s ease-out' }}
    >
      <div className="bg-bg-card border border-border/30 rounded-xl px-3 py-2.5 shadow-xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${def.color}20` }}
          >
            <def.icon size={12} style={{ color: def.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-text-primary truncate">{data.label}</div>
            <div className="text-[8px] font-mono text-text-muted">{data.ip}</div>
          </div>
          <div className="flex items-center gap-1">
            <svg width="6" height="6"><circle cx="3" cy="3" r="3" fill={statusColor} opacity="0.8" /></svg>
            <span className="text-[8px] font-mono capitalize" style={{ color: statusColor }}>{data.status}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {data.cpu !== undefined && (
            <div>
              <div className="text-[7px] text-text-muted uppercase tracking-wider">CPU</div>
              <div className="text-[9px] font-mono text-text-primary">{data.cpu}%</div>
            </div>
          )}
          {data.memory !== undefined && (
            <div>
              <div className="text-[7px] text-text-muted uppercase tracking-wider">RAM</div>
              <div className="text-[9px] font-mono text-text-primary">{data.memory}%</div>
            </div>
          )}
          <div>
            <div className="text-[7px] text-text-muted uppercase tracking-wider">Ports</div>
            <div className="text-[9px] font-mono text-text-primary">{upIfaces}/{totalIfaces} up</div>
          </div>
        </div>

        {/* Uptime */}
        {data.uptime && (
          <div className="mt-1.5 text-[8px] font-mono text-text-muted">
            Up {data.uptime}
          </div>
        )}
      </div>
      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-2 h-2 bg-bg-card border-r border-b border-border/30 rotate-45 -mt-1" />
      </div>
    </div>
  );
};

DeviceHoverCard.displayName = 'DeviceHoverCard';

export default React.memo(DeviceHoverCard);
