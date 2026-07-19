import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getDeviceDef, type DeviceType } from './devices';

export interface DeviceNodeData {
  deviceType: DeviceType;
  label: string;
  ip: string;
  [key: string]: unknown;
}

const DeviceNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { deviceType, label, ip } = data as DeviceNodeData;
  const def = getDeviceDef(deviceType);
  const Icon = def.icon;

  return (
    <div className="relative group">
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-bg-elevated !border-2 !border-border hover:!border-accent !-top-1.5 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-bg-elevated !border-2 !border-border hover:!border-accent !-bottom-1.5 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-bg-elevated !border-2 !border-border hover:!border-accent !-left-1.5 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-bg-elevated !border-2 !border-border hover:!border-accent !-right-1.5 transition-colors"
      />

      {/* Node body */}
      <div
        className={`flex flex-col items-center gap-1.5 transition-all duration-150 ${
          selected ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-150 border-2 ${
            selected
              ? 'border-accent shadow-[0_0_16px_rgba(6,182,111,0.3)]'
              : 'border-transparent hover:border-white/10'
          }`}
          style={{ backgroundColor: `${def.color}15` }}
        >
          <Icon
            size={24}
            style={{ color: def.color }}
            strokeWidth={2}
          />
        </div>
        <div className="text-center">
          <div className="text-[10px] font-bold text-text-primary leading-tight whitespace-nowrap">
            {label}
          </div>
          <div className="text-[8px] font-mono text-text-muted leading-tight">
            {ip}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DeviceNode);
