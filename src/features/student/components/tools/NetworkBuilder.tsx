import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, Maximize2, Minimize2, Trash2, Plus, Monitor, Server, Wifi, Shield, Router, Printer, Cpu } from 'lucide-react';

interface NetworkBuilderNode {
  id: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'workstation' | 'printer' | 'iot';
  label: string;
  ip: string;
  x: number;
  y: number;
}

interface NetworkBuilderLink {
  id: string;
  from: string;
  to: string;
  label: string;
}

interface NetworkBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standalone?: boolean;
}

const NODE_ICONS: Record<string, typeof Server> = {
  router: Router, switch: Wifi, server: Server, firewall: Shield,
  workstation: Monitor, printer: Printer, iot: Cpu,
};

const NODE_COLORS: Record<string, string> = {
  router: '#f59e0b', switch: '#3b82f6', server: '#06b66f',
  firewall: '#ef4444', workstation: '#a855f7', printer: '#f97316', iot: '#06b6d6',
};

const NODE_TYPES: { type: NetworkBuilderNode['type']; label: string }[] = [
  { type: 'router', label: 'Router' },
  { type: 'switch', label: 'Switch' },
  { type: 'server', label: 'Server' },
  { type: 'firewall', label: 'Firewall' },
  { type: 'workstation', label: 'Workstation' },
  { type: 'printer', label: 'Printer' },
  { type: 'iot', label: 'IoT' },
];

let nodeIdCounter = 0;
let linkIdCounter = 0;

const NetworkBuilder: React.FC<NetworkBuilderProps> = ({ open, onOpenChange, standalone }) => {
  const [nodes, setNodes] = useState<NetworkBuilderNode[]>([]);
  const [links, setLinks] = useState<NetworkBuilderLink[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [linking, setLinking] = useState<{ from: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const addNode = (type: NetworkBuilderNode['type']) => {
    const id = `node-${++nodeIdCounter}`;
    const label = `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter}`;
    const ip = `10.0.0.${nodeIdCounter}`;
    setNodes(prev => [...prev, { id, type, label, ip, x: 200 + Math.random() * 200, y: 150 + Math.random() * 100 }]);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    if (nodes.find(n => n.id === selectedId)) {
      setNodes(prev => prev.filter(n => n.id !== selectedId));
      setLinks(prev => prev.filter(l => l.from !== selectedId && l.to !== selectedId));
    } else {
      setLinks(prev => prev.filter(l => l.id !== selectedId));
    }
    setSelectedId(null);
  };

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 600,
      y: ((clientY - rect.top) / rect.height) * 400,
    };
  }, []);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (linking) {
      if (linking.from !== nodeId) {
        const id = `link-${++linkIdCounter}`;
        setLinks(prev => [...prev, { id, from: linking.from, to: nodeId, label: '' }]);
      }
      setLinking(null);
      return;
    }
    setSelectedId(nodeId);
    const pt = getSvgPoint(e.clientX, e.clientY);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDragOffset({ x: pt.x - node.x, y: pt.y - node.y });
      setDragging(nodeId);
    }
  }, [linking, nodes, getSvgPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const pt = getSvgPoint(e.clientX, e.clientY);
    setNodes(prev => prev.map(n =>
      n.id === dragging ? { ...n, x: pt.x - dragOffset.x, y: pt.y - dragOffset.y } : n
    ));
  }, [dragging, dragOffset, getSvgPoint]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName === 'svg') {
      setSelectedId(null);
      setLinking(null);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId]);

  const selectedNode = nodes.find(n => n.id === selectedId);
  const selectedLink = links.find(l => l.id === selectedId);

  const shell = (
    <div className="flex flex-col h-full bg-bg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-elevated border-b border-border/20 shrink-0">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Network Visualizer</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-white/5 transition-all text-text-muted hover:text-text-primary"
            aria-label={isFullscreen ? 'Minimize' : 'Maximize'}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center h-7 w-7 rounded-lg hover:bg-white/5 transition-all text-text-muted hover:text-red-400"
            aria-label="Close Network Visualizer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left palette */}
        <div className="w-48 shrink-0 bg-bg-elevated border-r border-border/20 p-3 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-3">Add Device</p>
          <div className="flex flex-col gap-1.5">
            {NODE_TYPES.map((nt) => {
              const Icon = NODE_ICONS[nt.type];
              return (
                <button
                  key={nt.type}
                  onClick={() => addNode(nt.type)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-accent-dim/50 transition-all group border border-transparent hover:border-accent/20"
                >
                  <Icon size={14} style={{ color: NODE_COLORS[nt.type] }} />
                  <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary transition-colors">{nt.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border/20">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-3">Actions</p>
            <button
              onClick={() => setLinking(linking ? null : { from: '' })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all border ${
                linking ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border/20 text-text-muted hover:bg-accent-dim/50 hover:border-accent/20'
              }`}
            >
              <Plus size={14} />
              <span className="text-[10px] font-bold">{linking ? 'Click two nodes...' : 'Link Nodes'}</span>
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all border border-border/20 text-text-muted hover:bg-red-400/10 hover:border-red-400/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed mt-1.5"
            >
              <Trash2 size={14} />
              <span className="text-[10px] font-bold">Delete Selected</span>
            </button>
          </div>

          {/* Selection info */}
          {(selectedNode || selectedLink) && (
            <div className="mt-4 pt-4 border-t border-border/20">
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Selected</p>
              {selectedNode && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] text-text-muted block mb-1">Label</label>
                    <input
                      value={selectedNode.label}
                      onChange={(e) => setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, label: e.target.value } : n))}
                      className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-text-muted block mb-1">IP Address</label>
                    <input
                      value={selectedNode.ip}
                      onChange={(e) => setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, ip: e.target.value } : n))}
                      className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                    />
                  </div>
                </div>
              )}
              {selectedLink && (
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Label</label>
                  <input
                    value={selectedLink.label}
                    onChange={(e) => setLinks(prev => prev.map(l => l.id === selectedLink.id ? { ...l, label: e.target.value } : l))}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0 bg-[#0a0a0a] overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 600 400"
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleSvgClick}
            style={{ cursor: dragging ? 'grabbing' : linking ? 'crosshair' : 'default' }}
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#grid)" />

            {/* Links */}
            {links.map((link) => {
              const from = nodes.find(n => n.id === link.from);
              const to = nodes.find(n => n.id === link.to);
              if (!from || !to) return null;
              const isSelected = link.id === selectedId;
              return (
                <g key={link.id} onClick={(e) => { e.stopPropagation(); setSelectedId(link.id); }}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isSelected ? '#06b66f' : '#334155'}
                    strokeWidth={isSelected ? 2 : 1.5}
                    strokeDasharray={isSelected ? '6 3' : 'none'}
                  />
                  {link.label && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 8}
                      textAnchor="middle"
                      className="fill-text-muted text-[8px] font-mono"
                    >
                      {link.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = NODE_ICONS[node.type];
              const color = NODE_COLORS[node.type];
              const isSelected = node.id === selectedId;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  style={{ cursor: dragging === node.id ? 'grabbing' : linking ? 'crosshair' : 'grab' }}
                >
                  <circle
                    r={isSelected ? 26 : 24}
                    fill="#1a1a1a"
                    stroke={isSelected ? '#06b66f' : color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <foreignObject x={-10} y={-10} width={20} height={20}>
                    <div className="flex items-center justify-center w-full h-full">
                      <Icon size={16} style={{ color }} />
                    </div>
                  </foreignObject>
                  <text y={34} textAnchor="middle" className="fill-text-primary text-[8px] font-bold font-mono">
                    {node.label}
                  </text>
                  <text y={44} textAnchor="middle" className="fill-text-muted text-[7px] font-mono">
                    {node.ip}
                  </text>
                </g>
              );
            })}

            {nodes.length === 0 && (
              <text x="300" y="200" textAnchor="middle" className="fill-text-muted/20 text-xs font-mono">
                Add devices from the palette to start building your network
              </text>
            )}
          </svg>
        </div>
      </div>
    </div>
  );

  if (!open) return null;
  if (standalone) return <div className="h-screen w-screen overflow-hidden">{shell}</div>;
  if (isFullscreen) {
    return <div className="fixed inset-0 z-[201]">{shell}</div>;
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          aria-label="Network Visualizer"
          onKeyDown={(e) => { if (e.key === 'Tab') e.stopPropagation(); }}
          className="fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-6xl h-[85vh] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
        >
          <RadixDialog.Title className="sr-only">Network Visualizer</RadixDialog.Title>
          {shell}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default NetworkBuilder;
