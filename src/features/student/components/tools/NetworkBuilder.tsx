import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  Panel,
} from '@xyflow/react';
import { X, Maximize2, Minimize2, Trash2, Wifi, ChevronDown, ChevronRight } from 'lucide-react';
import DeviceNode, { type DeviceNodeData } from './network/DeviceNode';
import ConnectionMediumModal from './network/ConnectionMediumModal';
import ContextMenu, {
  buildCanvasContextMenu,
  buildNodeContextMenu,
  buildEdgeContextMenu,
  type ContextMenuState,
} from './network/ContextMenu';
import {
  DEVICE_CATEGORIES,
  getDeviceDef,
  type DeviceType,
} from './network/devices';

interface NetworkBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standalone?: boolean;
}

let nodeIdCounter = 0;
let edgeIdCounter = 0;

const nodeTypes: NodeTypes = { device: DeviceNode };

const minimapStyle = {
  height: 120,
  width: 180,
  backgroundColor: '#050505',
  border: '1px solid rgba(171,181,192,0.12)',
  borderRadius: 12,
};

const NetworkBuilder: React.FC<NetworkBuilderProps> = ({ open, onOpenChange, standalone }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    infrastructure: true,
    security: false,
    wireless: false,
    endpoint: true,
    server: false,
  });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [mediumModalOpen, setMediumModalOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    open: false, x: 0, y: 0, items: [],
  });
  const [labelInput, setLabelInput] = useState<{ id: string; field: 'label' | 'ip'; value: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Handle connection creation — open medium picker
  const onConnect: OnConnect = useCallback((connection) => {
    setPendingConnection(connection);
    setMediumModalOpen(true);
  }, []);

  // After medium is selected, create the edge
  const handleMediumSelect = useCallback((_mediumId: string, mediumLabel: string) => {
    if (!pendingConnection) return;
    const id = `edge-${++edgeIdCounter}`;
    const newEdge: Edge = {
      ...pendingConnection,
      id,
      type: 'default',
      label: mediumLabel,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      style: { stroke: '#334155', strokeWidth: 1.5 },
      selected: false,
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setPendingConnection(null);
  }, [pendingConnection, setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Add a device node to canvas
  const addNode = useCallback((type: DeviceType, x?: number, y?: number) => {
    const def = getDeviceDef(type);
    const id = `node-${++nodeIdCounter}`;
    const newNode: Node<DeviceNodeData> = {
      id,
      type: 'device',
      position: {
        x: x ?? 300 + Math.random() * 200 - 100,
        y: y ?? 200 + Math.random() * 200 - 100,
      },
      data: {
        deviceType: type,
        label: def.label,
        ip: `10.0.0.${nodeIdCounter}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Delete selected node or edge
  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges]);

  // Duplicate selected node
  const duplicateNode = useCallback(() => {
    if (!selectedNode) return;
    const data = selectedNode.data as DeviceNodeData;
    addNode(data.deviceType, selectedNode.position.x + 40, selectedNode.position.y + 40);
  }, [selectedNode, addNode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [deleteSelected]);

  // Update node data when label/ip inputs change
  useEffect(() => {
    if (!labelInput) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== labelInput.id) return n;
        return { ...n, data: { ...n.data, [labelInput.field]: labelInput.value } };
      })
    );
  }, [labelInput, setNodes]);

  // Context menu handlers
  const handleCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const items = buildCanvasContextMenu((type) => addNode(type, e.clientX - 200, e.clientY - 100));
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  }, [addNode]);

  const handleNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNode(node);
    setSelectedEdge(null);
    const items = buildNodeContextMenu(
      () => { setSelectedNode(node); duplicateNode(); },
      () => { setSelectedNode(node); deleteSelected(); },
      () => { /* edit — handled by sidebar */ },
    );
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  }, [duplicateNode, deleteSelected]);

  const handleEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEdge(edge);
    setSelectedNode(null);
    const items = buildEdgeContextMenu(
      () => { /* change medium */ },
      () => { setEdges((eds) => eds.filter((ed) => ed.id !== edge.id)); setSelectedEdge(null); },
    );
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  }, [setEdges]);

  // Selected node/edge for sidebar
  const selectedDeviceNode = selectedNode && selectedNode.type === 'device' ? selectedNode : null;

  const shell = (
    <div className="flex flex-col h-full bg-bg">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-elevated border-b border-border/20 shrink-0">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Network Visualizer</span>
          <span className="text-[9px] font-mono text-text-muted/40">
            {nodes.length} devices · {edges.length} links
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFullscreen((p) => !p)}
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
        <div className="w-52 shrink-0 bg-bg-elevated border-r border-border/20 overflow-y-auto">
          <div className="p-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-3">Add Device</p>
            {DEVICE_CATEGORIES.map((cat) => {
              const expanded = expandedCategories[cat.id] ?? false;
              return (
                <div key={cat.id} className="mb-1">
                  <button
                    onClick={() => setExpandedCategories((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left hover:bg-white/5 transition-colors"
                  >
                    {expanded ? <ChevronDown size={10} className="text-text-muted" /> : <ChevronRight size={10} className="text-text-muted" />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{cat.label}</span>
                    <span className="text-[8px] text-text-muted/40 ml-auto">{cat.types.length}</span>
                  </button>
                  {expanded && (
                    <div className="flex flex-col gap-0.5 pl-2 mt-0.5">
                      {cat.types.map((type) => {
                        const def = getDeviceDef(type);
                        const Icon = def.icon;
                        return (
                          <button
                            key={type}
                            onClick={() => addNode(type)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-accent-dim/50 transition-all group border border-transparent hover:border-accent/20"
                          >
                            <Icon size={12} style={{ color: def.color }} />
                            <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary transition-colors">{def.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="px-3 pt-3 border-t border-border/20">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Actions</p>
            <button
              onClick={deleteSelected}
              disabled={!selectedNode && !selectedEdge}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all border border-border/20 text-text-muted hover:bg-red-400/10 hover:border-red-400/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 size={14} />
              <span className="text-[10px] font-bold">Delete Selected</span>
            </button>
          </div>

          {/* Selection info */}
          {selectedDeviceNode && (
            <div className="px-3 pt-3 mt-3 border-t border-border/20">
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Selected</p>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Label</label>
                  <input
                    value={(selectedDeviceNode.data as DeviceNodeData).label}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLabelInput({ id: selectedDeviceNode.id, field: 'label', value: val });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">IP Address</label>
                  <input
                    value={(selectedDeviceNode.data as DeviceNodeData).ip}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLabelInput({ id: selectedDeviceNode.id, field: 'ip', value: val });
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Type</label>
                  <div className="text-[10px] font-mono text-text-primary">
                    {getDeviceDef((selectedDeviceNode.data as DeviceNodeData).deviceType).label}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedEdge && !selectedDeviceNode && (
            <div className="px-3 pt-3 mt-3 border-t border-border/20">
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Link</p>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Label</label>
                  <input
                    value={selectedEdge.label as string || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEdges((eds) =>
                        eds.map((ed) => ed.id === selectedEdge.id ? { ...ed, label: val } : ed)
                      );
                    }}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 min-h-0 bg-[#0a0a0a]"
          onContextMenu={handleCanvasContextMenu}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange as OnNodesChange}
            onEdgesChange={onEdgesChange as OnEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeContextMenu={handleNodeContextMenu as any}
            onEdgeContextMenu={handleEdgeContextMenu as any}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            deleteKeyCode={['Delete', 'Backspace']}
            selectionOnDrag
            panOnDrag
            zoomOnDoubleClick={false}
            defaultEdgeOptions={{
              type: 'default',
              markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
              style: { stroke: '#334155', strokeWidth: 1.5 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Cross} gap={15} size={1} color="rgba(255,255,255,0.06)" />
            <MiniMap style={minimapStyle} nodeColor={(n) => {
              const data = n.data as DeviceNodeData;
              return data?.deviceType ? getDeviceDef(data.deviceType).color : '#666';
            }} />
            <Controls
              position="bottom-left"
              showInteractive={false}
              className="!bg-bg-card !border-border/30 !rounded-xl !shadow-xl !shadow-black/40 [&>button]:!bg-bg-card [&>button]:!border-border/20 [&>button]:!text-text-muted hover:[&>button]:!text-accent"
            />

            {/* Empty state */}
            {nodes.length === 0 && (
              <Panel position="top-center" className="pointer-events-none mt-20">
                <div className="text-center">
                  <div className="text-text-muted/20 text-sm font-mono">Add devices from the palette to start building your network</div>
                  <div className="text-text-muted/10 text-[10px] font-mono mt-1">Drag between nodes to connect them</div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Context menu */}
      <ContextMenu state={contextMenu} onClose={() => setContextMenu((p) => ({ ...p, open: false }))} />

      {/* Connection medium modal */}
      <ConnectionMediumModal
        open={mediumModalOpen}
        onOpenChange={setMediumModalOpen}
        onSelect={handleMediumSelect}
      />
    </div>
  );

  if (!open) return null;
  if (standalone) return <div className="h-dvh w-screen overflow-hidden">{shell}</div>;
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
