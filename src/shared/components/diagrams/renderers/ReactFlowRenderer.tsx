/**
 * REACT FLOW RENDERER
 * ===================
 * 
 * Main renderer using React Flow for interactive node-based diagrams.
 * Handles network topologies, architecture diagrams, and interactive graphs.
 */

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls as ReactFlowControls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnConnect,
  type ReactFlowInstance,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import type { DiagramDefinition, DiagramNode } from '../types';
import { nodeTypeRegistry } from '../nodes/nodeRegistry';
import { edgeTypeRegistry } from '../edges/edgeRegistry';
import { diagramEdgesToReactFlowEdges } from '../utils/edgeUtils';
import { responsiveLayout } from '../utils/responsiveLayout';
import { getNodeColor } from '../theme/tokens';
import type { BaseNodeData } from '../nodes/BaseNode';

export interface ReactFlowRendererProps {
  diagram: DiagramDefinition;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  className?: string;
}

/**
 * Convert DiagramNode to React Flow Node
 */
function diagramNodesToReactFlowNodes(
  nodes: DiagramNode[]
): Node<BaseNodeData>[] {
  return nodes.map((node, index) => ({
    id: node.id,
    type: node.type,
    position: node.position || { x: index * 200, y: 100 },
    data: {
      ...node,
    },
    style: {
      width: node.style?.width,
      height: node.style?.height,
    },
  }));
}

/**
 * ReactFlowRenderer — Interactive diagram using React Flow
 */
export const ReactFlowRenderer = memo<ReactFlowRendererProps>(({
  diagram,
  onNodeClick,
  onEdgeClick,
  className = '',
}) => {
  // Measure the container so we can restack wide diagrams on narrow viewports.
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Responsive auto-layout: restack on narrow containers unless the author
  // opted into manual positioning.
  const layout = useMemo(
    () =>
      responsiveLayout(
        diagram.nodes,
        containerWidth || 1024,
        diagram.layout === 'manual' ? 'manual' : 'auto'
      ),
    [diagram.nodes, diagram.layout, containerWidth]
  );

  // Convert diagram definition to React Flow format
  const initialNodes = useMemo(
    () => diagramNodesToReactFlowNodes(layout.nodes),
    [layout.nodes]
  );
  
  const initialEdges = useMemo(
    () => diagramEdgesToReactFlowEdges(diagram.edges),
    [diagram.edges]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Re-fit the viewport whenever the layout mode changes.
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance;
  }, []);

  useEffect(() => {
    const instance = rfInstance.current;
    if (!instance) return;
    const frame = requestAnimationFrame(() => {
      instance.fitView({ padding: 0.2, maxZoom: 1, duration: 200 });
    });
    return () => cancelAnimationFrame(frame);
  }, [layout.stacked, containerWidth]);
  
  // Handle new connections (if interaction allows)
  const onConnect = useCallback<OnConnect>(
    (connection) => {
      if (diagram.interaction?.draggable) {
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [diagram.interaction, setEdges]
  );
  
  // Handle node clicks
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (diagram.interaction?.selectable && onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [diagram.interaction, onNodeClick]
  );
  
  // Handle edge clicks
  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      if (diagram.interaction?.selectable && onEdgeClick) {
        onEdgeClick(edge.id);
      }
    },
    [diagram.interaction, onEdgeClick]
  );
  
  // MiniMap node color function
  const miniMapNodeColor = useCallback((node: Node<BaseNodeData>) => {
    return getNodeColor(node.data.type, node.data.state);
  }, []);

  const isFullscreen = className.includes('diagram-canvas-fullscreen');

  return (
    <div
      ref={containerRef}
      className={`diagram-canvas ${className}`}
      style={
        isFullscreen
          ? undefined
          : { height: `clamp(260px, ${Math.round(layout.canvasHeight)}px, 70dvh)` }
      }
    >
      <ReactFlow
        key={`${diagram.id}-${layout.stacked ? 'v' : 'h'}`}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypeRegistry}
        edgeTypes={edgeTypeRegistry}
        onInit={handleInit}
        onNodesChange={diagram.interaction?.draggable ? onNodesChange : undefined}
        onEdgesChange={diagram.interaction?.draggable ? onEdgesChange : undefined}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodesDraggable={diagram.interaction?.draggable ?? false}
        nodesConnectable={diagram.interaction?.draggable ?? false}
        elementsSelectable={diagram.interaction?.selectable ?? true}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={layout.fits ? false : (diagram.interaction?.pannable ?? true)}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1,
        }}
      >
        {/* Background grid */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(6, 182, 111, 0.1)"
        />
        
        {/* Controls */}
        {diagram.interaction?.showControls && (
          <ReactFlowControls
            showZoom={diagram.interaction?.zoomable ?? true}
            showFitView
            showInteractive={false}
            position="top-right"
          />
        )}
        
        {/* MiniMap */}
        {diagram.interaction?.showMiniMap && (
          <MiniMap
            nodeColor={miniMapNodeColor}
            nodeStrokeWidth={3}
            nodeBorderRadius={8}
            maskColor="rgba(0, 0, 0, 0.6)"
            position="bottom-right"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
            }}
          />
        )}
      </ReactFlow>
    </div>
  );
});

ReactFlowRenderer.displayName = 'ReactFlowRenderer';

export default ReactFlowRenderer;
