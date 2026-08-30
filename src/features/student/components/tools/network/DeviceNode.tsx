import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getDeviceDef } from './devices';
import DeviceShape from './DeviceShape';
import DeviceLeds from './DeviceLeds';
import DeviceHoverCard from './DeviceHoverCard';
import type { DeviceNodeData } from './types';

const DeviceNode: React.FC<NodeProps> = ({ data, selected, id }) => {
  const { deviceType, label, ip, shape, interfaces: ifaces, status = 'online', traffic = 'idle' } = data as DeviceNodeData;
  const def = getDeviceDef(deviceType);
  const [hovered, setHovered] = useState(false);

  const presentInterfaces = ifaces?.filter(i => i.operationalState !== 'not-present') ?? [];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Node body — the shape box is the handle anchor. Labels live outside it
          so ReactFlow measures edge endpoints against the device silhouette,
          not the taller label stack (edges used to float off the hardware). */}
      <div
        className={`relative flex items-center justify-center transition-[transform] duration-150 ${
          selected ? 'scale-105' : ''
        }`}
      >
        {/* Invisible interface hitboxes — ReactFlow Handles for edge connections */}
        {presentInterfaces.map((iface) => {
          const ifaceIdx = presentInterfaces.indexOf(iface);
          const total = presentInterfaces.length;
          const pos = getHandlePosition(ifaceIdx, total);
          return (
            <Handle
              key={iface.id}
              id={iface.id}
              type="source"
              position={pos.position}
              className={`!w-3 !h-3 !border-transparent transition-[background-color,border-color] duration-150 ${
                hovered
                  ? '!bg-accent/20 !border-accent/50'
                  : '!bg-transparent !border-transparent'
              }`}
              style={{
                [pos.offsetDir]: pos.offset,
              }}
            />
          );
        })}

        <DeviceShape
          shape={shape}
          color={def.color}
          icon={def.icon}
          selected={selected}
          hovered={hovered}
          status={status}
          traffic={traffic}
        />
        {/* LED strip — top right */}
        <div className="absolute -top-1 -right-1">
          <DeviceLeds status={status} traffic={traffic} compact />
        </div>

        {/* Hover card */}
        {hovered && !selected && <DeviceHoverCard data={data as DeviceNodeData} />}
      </div>

      {/* Label + IP — outside the handle anchor box */}
      <div className="text-center mt-1">
        <div className="text-[9px] font-bold text-text-primary leading-tight whitespace-nowrap">
          {label}
        </div>
        <div className="text-[7px] font-mono text-text-muted leading-tight">
          {ip}
        </div>
      </div>
    </div>
  );
};

// ── Handle Position Logic ────────────────────────────────────────────────────
// Distribute handles evenly around the node perimeter

interface HandleLayout {
  position: Position;
  offsetDir: 'top' | 'bottom' | 'left' | 'right';
  offset: string;
}

function getHandlePosition(index: number, total: number): HandleLayout {
  if (total <= 4) {
    const positions: HandleLayout[] = [
      { position: Position.Top, offsetDir: 'top', offset: '-2px' },
      { position: Position.Right, offsetDir: 'right', offset: '-2px' },
      { position: Position.Bottom, offsetDir: 'bottom', offset: '-2px' },
      { position: Position.Left, offsetDir: 'left', offset: '-2px' },
    ];
    return positions[index % 4];
  }

  // For more interfaces, distribute around perimeter
  const sides: HandleLayout[] = [
    { position: Position.Top, offsetDir: 'top', offset: '-2px' },
    { position: Position.Top, offsetDir: 'top', offset: '-2px' },
    { position: Position.Right, offsetDir: 'right', offset: '-2px' },
    { position: Position.Right, offsetDir: 'right', offset: '-2px' },
    { position: Position.Bottom, offsetDir: 'bottom', offset: '-2px' },
    { position: Position.Bottom, offsetDir: 'bottom', offset: '-2px' },
    { position: Position.Left, offsetDir: 'left', offset: '-2px' },
    { position: Position.Left, offsetDir: 'left', offset: '-2px' },
  ];

  const sideIdx = Math.floor((index / total) * 8);
  return sides[sideIdx % 8];
}

export default memo(DeviceNode);
