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
  useReactFlow,
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
import {
  X, Maximize2, Minimize2, Trash2, Wifi, ChevronDown, ChevronRight,
  Play, Pause, Tag, Radio,
} from 'lucide-react';
import { TopologyProvider, useTopology } from './network/topologyStore';
import DeviceNodeComponent from './network/DeviceNode';
import NetworkEdgeComponent from './network/NetworkEdge';
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
} from './network/devices';
import {
  createDefaultInterfaces,
} from './network/interfaces';
import { useTrafficSimulation } from './network/useTrafficSimulation';
import type { DeviceNodeData, NetworkLinkData, DeviceType, TrafficLevel, LinkState } from './network/types';

interface NetworkBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  standalone?: boolean;
}

let nodeIdCounter = 0;
let edgeIdCounter = 0;

const nodeTypes: NodeTypes = { device: DeviceNodeComponent };
const edgeTypes: EdgeTypes = { network: NetworkEdgeComponent };

const minimapStyle = {
  height: 120,
  width: 180,
  backgroundColor: '#050505',
  border: '1px solid rgba(171,181,192,0.12)',
  borderRadius: 12,
};

// ── Inner Builder (must be inside TopologyProvider) ──────────────────────────

const NetworkBuilderInner: React.FC<NetworkBuilderProps> = ({ open, onOpenChange, standalone }) => {
  const { state: topo, addNode: topoAddNode, removeNode: topoRemoveNode, addEdge: topoAddEdge, removeEdge: topoRemoveEdge, updateNode, selectNode, selectEdge, dispatch } = useTopology();
  const { level: trafficLevel, running: trafficRunning, setLevel: setTrafficLevel, start: startTraffic, stop: stopTraffic, setEdgeProvider } = useTrafficSimulation();

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
  const [pendingCompatibleMedia, setPendingCompatibleMedia] = useState<string[] | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    open: false, x: 0, y: 0, items: [],
  });
  const [labelInput, setLabelInput] = useState<{ id: string; field: 'label' | 'ip'; value: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [showInterfaces, setShowInterfaces] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  // Provide edge data to traffic engine
  useEffect(() => {
    setEdgeProvider(() =>
      edges.map(e => ({
        id: e.id,
        data: (e.data ?? {}) as unknown as NetworkLinkData,
      })),
    );
  }, [edges, setEdgeProvider]);

  // ── Connection handling ──────────────────────────────────────────────────

  const onConnect: OnConnect = useCallback((connection) => {
    if (!connection.source || !connection.target) return;
    setPendingConnection(connection);
    setPendingCompatibleMedia(undefined); // show all media
    setMediumModalOpen(true);
  }, []);

  const handleMediumSelect = useCallback((_mediumId: string, mediumLabel: string) => {
    if (!pendingConnection) return;
    const id = `edge-${++edgeIdCounter}`;
    const linkData: NetworkLinkData = {
      mediumId: _mediumId,
      mediumLabel,
      state: 'connected',
      bandwidth: 1000,
      latency: 1,
      sourceInterface: pendingConnection.sourceHandle as string ?? '',
      targetInterface: pendingConnection.targetHandle as string ?? '',
      trafficLevel: 'idle',
    };
    const newEdge: Edge = {
      ...pendingConnection,
      id,
      type: 'network',
      data: linkData as unknown as Record<string, unknown>,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      selected: false,
    };
    setEdges((eds) => addEdge(newEdge, eds));
    topoAddEdge(id, linkData, pendingConnection.source, pendingConnection.target);
    setPendingConnection(null);
    setPendingCompatibleMedia(undefined);
  }, [pendingConnection, setEdges, topoAddEdge]);

  // ── Node/Edge selection ──────────────────────────────────────────────────

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    selectNode(node.id);
  }, [selectNode]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    selectEdge(edge.id);
  }, [selectEdge]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  // ── Add Node ─────────────────────────────────────────────────────────────

  const addNode = useCallback((type: DeviceType, x?: number, y?: number) => {
    const def = getDeviceDef(type);
    const id = `node-${++nodeIdCounter}`;
    const interfaces = createDefaultInterfaces(type);
    const data: DeviceNodeData = {
      deviceType: type,
      label: def.label,
      ip: `10.0.0.${nodeIdCounter}`,
      interfaces,
      shape: def.shape,
      status: 'online',
      traffic: 'idle',
    };
    const position = {
      x: x ?? 300 + Math.random() * 200 - 100,
      y: y ?? 200 + Math.random() * 200 - 100,
    };
    const newNode: Node = { id, type: 'device', position, data: data as unknown as Record<string, unknown> };
    setNodes((nds) => [...nds, newNode]);
    topoAddNode(id, data, position);
  }, [setNodes, topoAddNode]);

  // ── Delete ───────────────────────────────────────────────────────────────

  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      topoRemoveNode(selectedNode.id);
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      topoRemoveEdge(selectedEdge.id);
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges, topoRemoveNode, topoRemoveEdge]);

  const duplicateNode = useCallback(() => {
    if (!selectedNode) return;
    const data = selectedNode.data as DeviceNodeData;
    addNode(data.deviceType as DeviceType, selectedNode.position.x + 40, selectedNode.position.y + 40);
  }, [selectedNode, addNode]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────

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

  // ── Label/IP sync ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!labelInput) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== labelInput.id) return n;
        return { ...n, data: { ...n.data, [labelInput.field]: labelInput.value } };
      }),
    );
  }, [labelInput, setNodes]);

  // ── Context menus ────────────────────────────────────────────────────────

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
      () => { /* edit */ },
      () => { /* toggle interfaces */ },
      () => { /* refresh interfaces */ },
    );
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  }, [duplicateNode, deleteSelected]);

  const handleEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEdge(edge);
    setSelectedNode(null);
    const items = buildEdgeContextMenu(
      () => { setPendingConnection({ source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle } as Connection); setPendingCompatibleMedia(undefined); setMediumModalOpen(true); },
      () => { setEdges((eds) => eds.filter((ed) => ed.id !== edge.id)); topoRemoveEdge(edge.id); setSelectedEdge(null); },
      () => {
        // Toggle link state
        const linkData = edge.data as unknown as NetworkLinkData | undefined;
        const currentState = linkData?.state ?? 'connected';
        const nextState: LinkState = currentState === 'connected' ? 'disconnected' : 'connected';
        setEdges((eds) => eds.map(ed => ed.id === edge.id ? { ...ed, data: { ...ed.data, state: nextState } } : ed));
      },
    );
    setContextMenu({ open: true, x: e.clientX, y: e.clientY, items });
  }, [setEdges, topoRemoveEdge]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const selectedDeviceNode = selectedNode && selectedNode.type === 'device' ? selectedNode : null;
  const selectedDeviceData = selectedDeviceNode ? (selectedDeviceNode.data as DeviceNodeData) : null;

  // ── Zoom adaptive detail ─────────────────────────────────────────────────

  const zoomDisplay = useMemo(() => {
    const zoom = 1; // placeholder — actual zoom from ReactFlow viewport
    return zoom < 0.3 ? 'low' : zoom < 0.6 ? 'medium' : zoom < 0.9 ? 'high' : 'very-high';
  }, []);

  // ── Shell ────────────────────────────────────────────────────────────────

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
          {/* Traffic controls */}
          <div className="flex items-center gap-0.5 mr-2 border border-border/20 rounded-lg px-1 py-0.5">
            <button
              onClick={trafficRunning ? stopTraffic : startTraffic}
              className="flex items-center justify-center h-5 w-5 rounded hover:bg-white/5 transition-colors"
              title={trafficRunning ? 'Stop simulation' : 'Start simulation'}
            >
              {trafficRunning
                ? <Pause size={10} className="text-accent" />
                : <Play size={10} className="text-text-muted" />
              }
            </button>
            <select
              value={trafficLevel}
              onChange={(e) => setTrafficLevel(e.target.value as TrafficLevel)}
              className="text-[8px] font-mono bg-transparent text-text-muted border-none outline-none cursor-pointer"
            >
              <option value="idle">Idle</option>
              <option value="low">Low</option>
              <option value="medium">Med</option>
              <option value="high">High</option>
              <option value="saturated">Max</option>
            </select>
          </div>

          {/* View toggles */}
          <button
            onClick={() => setShowInterfaces(p => !p)}
            className={`flex items-center justify-center h-5 w-5 rounded hover:bg-white/5 transition-colors ${showInterfaces ? 'text-accent' : 'text-text-muted/40'}`}
            title="Toggle interfaces"
          >
            <Radio size={10} />
          </button>
          <button
            onClick={() => setShowLabels(p => !p)}
            className={`flex items-center justify-center h-5 w-5 rounded hover:bg-white/5 transition-colors ${showLabels ? 'text-accent' : 'text-text-muted/40'}`}
            title="Toggle labels"
          >
            <Tag size={10} />
          </button>

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
          <div className="px-3 pt-3">
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

          {/* Selected device info */}
          {selectedDeviceNode && selectedDeviceData && (
            <div className="px-3 pt-3 mt-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Device</p>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Label</label>
                  <input
                    value={selectedDeviceData.label}
                    onChange={(e) => setLabelInput({ id: selectedDeviceNode.id, field: 'label', value: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">IP Address</label>
                  <input
                    value={selectedDeviceData.ip}
                    onChange={(e) => setLabelInput({ id: selectedDeviceNode.id, field: 'ip', value: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-bg border border-border/30 text-xs text-text-primary font-mono outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Type</label>
                  <div className="text-[10px] font-mono text-text-primary">
                    {getDeviceDef(selectedDeviceData.deviceType).label}
                  </div>
                </div>
                {/* Interface list */}
                {selectedDeviceData.interfaces && selectedDeviceData.interfaces.length > 0 && (
                  <div>
                    <label className="text-[9px] text-text-muted block mb-1">
                      Interfaces ({selectedDeviceData.interfaces.filter(i => i.operationalState === 'up').length}/{selectedDeviceData.interfaces.length} up)
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-0.5">
                      {selectedDeviceData.interfaces.map(iface => (
                        <div
                          key={iface.id}
                          className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-bg/50 text-[8px] font-mono"
                        >
                          <svg width="4" height="4">
                            <circle cx="2" cy="2" r="2" fill={iface.operationalState === 'up' ? '#22c55e' : '#333'} />
                          </svg>
                          <span className="text-text-muted truncate flex-1">{iface.name}</span>
                          <span className="text-text-muted/40">{iface.speed > 0 ? `${iface.speed}M` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected edge info */}
          {selectedEdge && !selectedDeviceNode && (
            <div className="px-3 pt-3 mt-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Link</p>
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">Medium</label>
                  <div className="text-[10px] font-mono text-text-primary">
                    {(selectedEdge.data as unknown as NetworkLinkData)?.mediumLabel ?? 'Ethernet'}
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-text-muted block mb-1">State</label>
                  <div className="flex gap-1">
                    {(['connected', 'disconnected', 'negotiating', 'blocked', 'error'] as LinkState[]).map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          setEdges(eds => eds.map(e => e.id === selectedEdge.id ? { ...e, data: { ...e.data, state: s } } : e));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[7px] font-mono border transition-colors ${
                          (selectedEdge.data as unknown as NetworkLinkData)?.state === s
                            ? 'border-accent text-accent'
                            : 'border-border/20 text-text-muted hover:border-border/40'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
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
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            deleteKeyCode={['Delete', 'Backspace']}
            selectionOnDrag
            panOnDrag
            zoomOnDoubleClick={false}
            defaultEdgeOptions={{
              type: 'network',
              markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
            }}
            proOptions={{ hideAttribution: true }}
            onlyRenderVisibleElements
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

            {nodes.length === 0 && (
              <Panel position="top-center" className="pointer-events-none mt-20">
                <div className="text-center">
                  <div className="text-text-muted/20 text-sm font-mono">Add devices from the palette to start building your network</div>
                  <div className="text-text-muted/10 text-[10px] font-mono mt-1">Drag from device interfaces to connect them</div>
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
        compatibleMedia={pendingCompatibleMedia}
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

// ── Outer wrapper (provides TopologyProvider) ────────────────────────────────

const NetworkBuilder: React.FC<NetworkBuilderProps> = (props) => {
  return (
    <TopologyProvider>
      <NetworkBuilderInner {...props} />
    </TopologyProvider>
  );
};

export default NetworkBuilder;
