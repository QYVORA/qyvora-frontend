import React, { useEffect, useRef } from 'react';
import { Trash2, Copy, Clipboard, Edit3, Settings, Plus } from 'lucide-react';
import { DEVICE_CATEGORIES, type DeviceType } from './devices';

export interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
}

interface ContextMenuProps {
  state: ContextMenuState;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ state, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [state.open, onClose]);

  if (!state.open) return null;

  return (
    <div
      ref={ref}
      className="fixed z-[220] min-w-[180px] rounded-xl border border-border/30 bg-bg-card shadow-2xl shadow-black/50 py-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: state.x, top: state.y }}
    >
      {state.items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => {
            item.action();
            onClose();
          }}
          disabled={item.disabled}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[10px] font-bold transition-colors ${
            item.danger
              ? 'text-red-400 hover:bg-red-400/10'
              : 'text-text-muted hover:bg-accent-dim/50 hover:text-text-primary'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <span className="w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export function buildCanvasContextMenu(
  onAddDevice: (type: DeviceType) => void,
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  // Add device submenu items
  DEVICE_CATEGORIES.forEach((cat) => {
    cat.types.slice(0, 3).forEach((type) => {
      items.push({
        label: `Add ${type.replace(/-/g, ' ')}`,
        icon: <Plus size={12} />,
        action: () => onAddDevice(type),
      });
    });
  });

  return items;
}

export function buildNodeContextMenu(
  onDuplicate: () => void,
  onDelete: () => void,
  onEdit: () => void,
): ContextMenuItem[] {
  return [
    { label: 'Edit', icon: <Edit3 size={12} />, action: onEdit },
    { label: 'Duplicate', icon: <Copy size={12} />, action: onDuplicate },
    { label: 'Delete', icon: <Trash2 size={12} />, action: onDelete, danger: true },
  ];
}

export function buildEdgeContextMenu(
  onChangeMedium: () => void,
  onDelete: () => void,
): ContextMenuItem[] {
  return [
    { label: 'Change Medium', icon: <Settings size={12} />, action: onChangeMedium },
    { label: 'Delete', icon: <Trash2 size={12} />, action: onDelete, danger: true },
  ];
}

export default ContextMenu;
