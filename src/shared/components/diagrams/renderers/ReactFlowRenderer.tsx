/**
 * REACT FLOW RENDERER
 * ===================
 * 
 * Main renderer using React Flow for interactive node-based diagrams.
 * Handles network topologies, architecture diagrams, and interactive graphs.
 */

import React, { memo, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls as ReactFlowControls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import type { DiagramDefinition } from '../types';
import { nodeTypeRegistry } from '../nodes/nodeRegistry';
import { edgeTypeRegistry } from '../edges/edgeRegistry';
import { diagramEdgesToReactFlowEdges } from '../utils/edgeUtils';
import { getNodeColor } from '../theme/tokens';
import type { BaseNodeData } from '../nodes/BaseNode';
import type { BaseEdgeData } from '../edges/BaseEdge';

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
  diagram: DiagramDefinition
): Node<BaseNodeData>[] {
  return diagram.nodes.map((node, index) => ({
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
  // Convert diagram definition to React Flow format
  const initialNodes = useMemo(
    () => diagramNodesToReactFlowNodes(diagram),
    [diagram]
  );
  
  const initialEdges = useMemo(
    () => diagramEdgesToReactFlowEdges(diagram.edges),
    [diagram.edges]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
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
  
  return (
    <div className={`diagram-canvas ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypeRegistry}
        edgeTypes={edgeTypeRegistry}
        onNodesChange={diagram.interaction?.draggable ? onNodesChange : undefined}
        onEdgesChange={diagram.interaction?.draggable ? onEdgesChange : undefined}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodesDraggable={diagram.interaction?.draggable ?? false}
        nodesConnectable={diagram.interaction?.draggable ?? false}
        elementsSelectable={diagram.interaction?.selectable ?? true}
        zoomOnScroll={diagram.interaction?.zoomable ?? true}
        panOnScroll={diagram.interaction?.pannable ?? true}
        panOnDrag={diagram.interaction?.pannable ?? true}
        minZoom={0.25}
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
