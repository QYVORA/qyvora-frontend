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
        id="top"
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-bg-elevated !border-[1.5px] !border-border hover:!border-accent !-top-[5px] transition-colors"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-bg-elevated !border-[1.5px] !border-border hover:!border-accent !-bottom-[5px] transition-colors"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-bg-elevated !border-[1.5px] !border-border hover:!border-accent !-left-[5px] transition-colors"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-bg-elevated !border-[1.5px] !border-border hover:!border-accent !-right-[5px] transition-colors"
      />

      {/* Node body */}
      <div
        className={`flex flex-col items-center transition-all duration-150 ${
          selected ? 'scale-105' : ''
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 border-[1.5px] ${
            selected
              ? 'border-accent shadow-[0_0_12px_rgba(6,182,111,0.25)]'
              : 'border-transparent hover:border-white/10'
          }`}
          style={{ backgroundColor: `${def.color}15` }}
        >
          <Icon
            size={18}
            style={{ color: def.color }}
            strokeWidth={2}
          />
        </div>
        <div className="text-center mt-1">
          <div className="text-[9px] font-bold text-text-primary leading-tight whitespace-nowrap">
            {label}
          </div>
          <div className="text-[7px] font-mono text-text-muted leading-tight">
            {ip}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DeviceNode);
