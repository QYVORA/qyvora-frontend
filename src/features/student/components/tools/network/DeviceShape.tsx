import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { DeviceShape as ShapeType, DeviceStatus, TrafficLevel } from './types';

interface DeviceShapeProps {
  shape: ShapeType;
  color: string;
  icon: LucideIcon;
  selected: boolean;
  hovered: boolean;
  status: DeviceStatus;
  traffic?: TrafficLevel;
}

function stroke(selected: boolean, hovered: boolean, color: string): string {
  if (selected) return color;
  if (hovered) return `${color}99`;
  return `${color}33`;
}

function fill(color: string): string {
  return `${color}18`;
}

// ── Router Appliance ─────────────────────────────────────────────────────────

function RouterSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="56" height="36" viewBox="0 0 56 36" fill="none">
      <rect x="2" y="2" width="52" height="32" rx="6" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="10" cy="8" r="2.5" fill={`${color}66`} />
      <circle cx="18" cy="8" r="2.5" fill={`${color}66`} />
      <circle cx="26" cy="8" r="2.5" fill={`${color}66`} />
      <circle cx="46" cy="8" r="2.5" fill="#22c55e" />
      <rect x="8" y="16" width="40" height="1.5" rx="0.75" fill={`${color}22`} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <rect key={i} x={10 + i * 5} y="22" width="3.5" height="5" rx="0.75" fill={`${color}44`} />
      ))}
    </svg>
  );
}

// ── Rack Switch ──────────────────────────────────────────────────────────────

function SwitchSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="64" height="24" viewBox="0 0 64 24" fill="none">
      <rect x="1" y="1" width="62" height="22" rx="4" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={5 + i * 4.5} y="5" width="3" height="6" rx="0.5" fill={`${color}55`} />
      ))}
      <circle cx="58" cy="8" r="2" fill="#22c55e" />
      <text x="5" y="19" fill={`${color}55`} fontSize="4" fontFamily="monospace">SW</text>
    </svg>
  );
}

// ── Tower Server ─────────────────────────────────────────────────────────────

function TowerSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="32" height="52" viewBox="0 0 32 52" fill="none">
      <rect x="2" y="2" width="28" height="48" rx="4" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="16" cy="8" r="2.5" fill="#22c55e" />
      <rect x="6" y="14" width="20" height="1.5" rx="0.75" fill={`${color}22`} />
      <rect x="6" y="20" width="20" height="8" rx="2" fill={`${color}22`} />
      <rect x="6" y="32" width="20" height="8" rx="2" fill={`${color}22`} />
      <rect x="12" y="44" width="8" height="2" rx="1" fill={`${color}33`} />
    </svg>
  );
}

// ── Rack Server ──────────────────────────────────────────────────────────────

function RackSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
      <rect x="1" y="1" width="54" height="26" rx="4" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="8" cy="8" r="2" fill="#22c55e" />
      <rect x="12" y="6" width="12" height="4" rx="1" fill={`${color}22`} />
      <rect x="6" y="16" width="44" height="1.5" rx="0.75" fill={`${color}22`} />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={14 + i * 10} y="19" width="6" height="4" rx="1" fill={`${color}33`} />
      ))}
      <text x="38" y="9" fill={`${color}44`} fontSize="4" fontFamily="monospace">1U</text>
    </svg>
  );
}

// ── Firewall Appliance ───────────────────────────────────────────────────────

function FirewallSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
      <path d="M24 2 L46 12 L46 28 L24 38 L2 28 L2 12 Z" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="24" cy="10" r="2.5" fill="#22c55e" />
      <path d="M16 18 L24 14 L32 18 L32 26 L24 30 L16 26 Z" fill={`${color}22`} stroke={`${color}33`} strokeWidth="0.75" />
      {[0, 1, 2].map(i => (
        <circle key={i} cx={18 + i * 6} cy="22" r="1.5" fill={`${color}55`} />
      ))}
    </svg>
  );
}

// ── Laptop ───────────────────────────────────────────────────────────────────

function LaptopSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
      <rect x="4" y="2" width="36" height="24" rx="3" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <rect x="7" y="5" width="30" height="18" rx="1.5" fill="#00000066" />
      <circle cx="22" cy="14" r="2" fill={`${color}44`} />
      <path d="M0 30 Q0 28 4 28 L40 28 Q44 28 44 30 L44 34 Q44 36 42 36 L2 36 Q0 36 0 34 Z" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 1.5 : 0.75} />
      <rect x="16" y="31" width="12" height="1.5" rx="0.75" fill={`${color}33`} />
    </svg>
  );
}

// ── Desktop Tower ────────────────────────────────────────────────────────────

function DesktopSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
      <rect x="2" y="2" width="32" height="38" rx="4" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="18" cy="8" r="2.5" fill="#22c55e" />
      <rect x="6" y="14" width="24" height="1.5" rx="0.75" fill={`${color}22`} />
      <rect x="6" y="20" width="24" height="10" rx="2" fill={`${color}22`} />
      <rect x="6" y="34" width="12" height="3" rx="1" fill={`${color}33`} />
      <rect x="20" y="34" width="10" height="3" rx="1" fill={`${color}33`} />
    </svg>
  );
}

// ── Phone ────────────────────────────────────────────────────────────────────

function PhoneSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="24" height="44" viewBox="0 0 24 44" fill="none">
      <rect x="2" y="2" width="20" height="40" rx="4" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <rect x="4" y="6" width="16" height="28" rx="1" fill="#00000066" />
      <circle cx="12" cy="38" r="2" fill={`${color}33`} />
      <rect x="8" y="3" width="8" height="1.5" rx="0.75" fill={`${color}22`} />
    </svg>
  );
}

// ── Camera ───────────────────────────────────────────────────────────────────

function CameraSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="16" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="18" cy="18" r="10" fill="#00000044" stroke={`${color}44`} strokeWidth="1" />
      <circle cx="18" cy="18" r="5" fill={`${color}33`} />
      <circle cx="18" cy="18" r="2" fill={color} opacity="0.6" />
      <circle cx="26" cy="10" r="2" fill="#22c55e" />
    </svg>
  );
}

// ── Embedded / IoT ───────────────────────────────────────────────────────────

function EmbeddedSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="28" height="28" rx="6" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="16" cy="10" r="2" fill="#22c55e" />
      <rect x="8" y="16" width="16" height="1.5" rx="0.75" fill={`${color}22`} />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={8 + i * 4.5} y="20" width="3" height="5" rx="0.5" fill={`${color}44`} />
      ))}
    </svg>
  );
}

// ── Cloud Appliance ──────────────────────────────────────────────────────────

function CloudSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="52" height="36" viewBox="0 0 52 36" fill="none">
      <path d="M14 28 C4 28 2 22 2 18 C2 12 8 8 14 8 C14 4 18 2 24 2 C30 2 36 4 38 8 C44 8 50 12 50 18 C50 22 48 28 38 28 Z" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="20" cy="16" r="2" fill="#22c55e" />
      <circle cx="32" cy="16" r="2" fill="#22c55e" />
      <rect x="14" y="20" width="24" height="1.5" rx="0.75" fill={`${color}22`} />
    </svg>
  );
}

// ── Access Point Round ───────────────────────────────────────────────────────

function AccessPointSvg({ color, selected, hovered }: { color: string; selected: boolean; hovered: boolean }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill={fill(color)} stroke={stroke(selected, hovered, color)} strokeWidth={selected ? 2 : 1} />
      <circle cx="20" cy="20" r="12" fill="none" stroke={`${color}22`} strokeWidth="1" />
      <circle cx="20" cy="20" r="6" fill="none" stroke={`${color}22`} strokeWidth="1" />
      <circle cx="20" cy="20" r="2.5" fill={color} opacity="0.6" />
      <circle cx="20" cy="8" r="2" fill="#22c55e" />
      <path d="M14 14 Q20 8 26 14" fill="none" stroke={`${color}44`} strokeWidth="1" />
      <path d="M11 11 Q20 3 29 11" fill="none" stroke={`${color}33`} strokeWidth="1" />
    </svg>
  );
}

// ── Shape Resolver ───────────────────────────────────────────────────────────

const SHAPE_MAP: Record<ShapeType, React.FC<{ color: string; selected: boolean; hovered: boolean }>> = {
  'router-appliance':   RouterSvg,
  'rack-switch':        SwitchSvg,
  'tower-server':       TowerSvg,
  'rack-server':        RackSvg,
  'firewall-appliance': FirewallSvg,
  'laptop-silhouette':  LaptopSvg,
  'desktop-tower':      DesktopSvg,
  'phone-device':       PhoneSvg,
  'camera-device':      CameraSvg,
  'embedded-device':    EmbeddedSvg,
  'cloud-appliance':    CloudSvg,
  'access-point-round': AccessPointSvg,
};

// ── Main Component ───────────────────────────────────────────────────────────

const DeviceShape: React.FC<DeviceShapeProps> = ({ shape, color, icon, selected, hovered }) => {
  const ShapeComponent = SHAPE_MAP[shape] || EmbeddedSvg;

  return (
    <div
      className="flex items-center justify-center transition-transform duration-150"
      style={{
        filter: selected ? `drop-shadow(0 0 8px ${color}55)` : undefined,
        transform: selected ? 'scale(1.05)' : hovered ? 'scale(1.02)' : undefined,
      }}
    >
      <ShapeComponent color={color} selected={selected} hovered={hovered} />
    </div>
  );
};

DeviceShape.displayName = 'DeviceShape';

export default React.memo(DeviceShape);
