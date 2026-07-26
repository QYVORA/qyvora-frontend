import React, { createContext, useContext, useReducer, useCallback, useRef, type ReactNode } from 'react';
import type { DeviceNodeData, NetworkLinkData, TopologyAction, TopologyState, ZoomLevel, TrafficLevel } from './types';

// ── Initial State ────────────────────────────────────────────────────────────

const initialState: TopologyState = {
  nodes: new Map(),
  edges: new Map(),
  selectedNodeId: null,
  selectedEdgeId: null,
  zoomLevel: 'medium',
  showInterfaces: false,
  showLabels: true,
  showPackets: true,
  trafficLevel: 'idle',
  simulationRunning: false,
};

// ── Reducer ──────────────────────────────────────────────────────────────────

function topologyReducer(state: TopologyState, action: TopologyAction): TopologyState {
  switch (action.type) {
    case 'ADD_NODE': {
      const nodes = new Map(state.nodes);
      nodes.set(action.payload.id, action.payload);
      return { ...state, nodes };
    }
    case 'REMOVE_NODE': {
      const nodes = new Map(state.nodes);
      nodes.delete(action.payload.id);
      // Remove edges connected to this node
      const edges = new Map(state.edges);
      for (const [eid, edge] of edges) {
        if (edge.source === action.payload.id || edge.target === action.payload.id) {
          edges.delete(eid);
        }
      }
      return {
        ...state,
        nodes,
        edges,
        selectedNodeId: state.selectedNodeId === action.payload.id ? null : state.selectedNodeId,
      };
    }
    case 'UPDATE_NODE': {
      const nodes = new Map(state.nodes);
      const existing = nodes.get(action.payload.id);
      if (!existing) return state;
      nodes.set(action.payload.id, {
        ...existing,
        data: { ...existing.data, ...action.payload.data },
      });
      return { ...state, nodes };
    }
    case 'ADD_EDGE': {
      const edges = new Map(state.edges);
      edges.set(action.payload.id, action.payload);
      return { ...state, edges };
    }
    case 'REMOVE_EDGE': {
      const edges = new Map(state.edges);
      edges.delete(action.payload.id);
      return {
        ...state,
        edges,
        selectedEdgeId: state.selectedEdgeId === action.payload.id ? null : state.selectedEdgeId,
      };
    }
    case 'UPDATE_EDGE': {
      const edges = new Map(state.edges);
      const existing = edges.get(action.payload.id);
      if (!existing) return state;
      edges.set(action.payload.id, {
        ...existing,
        data: { ...existing.data, ...action.payload.data },
      });
      return { ...state, edges };
    }
    case 'UPDATE_INTERFACE': {
      const nodes = new Map(state.nodes);
      const node = nodes.get(action.payload.nodeId);
      if (!node) return state;
      const updatedIfaces = node.data.interfaces.map(iface =>
        iface.id === action.payload.interfaceId ? { ...iface, ...action.payload.updates } : iface,
      );
      nodes.set(action.payload.nodeId, {
        ...node,
        data: { ...node.data, interfaces: updatedIfaces },
      });
      return { ...state, nodes };
    }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload, selectedEdgeId: null };
    case 'SET_SELECTED_EDGE':
      return { ...state, selectedEdgeId: action.payload, selectedNodeId: null };
    case 'SET_ZOOM_LEVEL':
      return { ...state, zoomLevel: action.payload };
    case 'SET_SHOW_INTERFACES':
      return { ...state, showInterfaces: action.payload };
    case 'SET_SHOW_LABELS':
      return { ...state, showLabels: action.payload };
    case 'SET_SHOW_PACKETS':
      return { ...state, showPackets: action.payload };
    case 'SET_TRAFFIC_LEVEL':
      return { ...state, trafficLevel: action.payload };
    case 'START_SIMULATION':
      return { ...state, simulationRunning: true };
    case 'STOP_SIMULATION':
      return { ...state, simulationRunning: false };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface TopologyContextValue {
  state: TopologyState;
  dispatch: React.Dispatch<TopologyAction>;
  addNode: (id: string, data: DeviceNodeData, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<DeviceNodeData>) => void;
  addEdge: (id: string, data: NetworkLinkData, source: string, target: string) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, data: Partial<NetworkLinkData>) => void;
  updateInterface: (nodeId: string, interfaceId: string, updates: Partial<import('./types').NetworkInterface>) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
}

const TopologyContext = createContext<TopologyContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function TopologyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(topologyReducer, initialState);

  const addNode = useCallback((id: string, data: DeviceNodeData, position: { x: number; y: number }) => {
    dispatch({ type: 'ADD_NODE', payload: { id, data, position } });
  }, []);

  const removeNode = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NODE', payload: { id } });
  }, []);

  const updateNode = useCallback((id: string, data: Partial<DeviceNodeData>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, data } });
  }, []);

  const addEdge = useCallback((id: string, data: NetworkLinkData, source: string, target: string) => {
    dispatch({ type: 'ADD_EDGE', payload: { id, data, source, target } });
  }, []);

  const removeEdge = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EDGE', payload: { id } });
  }, []);

  const updateEdge = useCallback((id: string, data: Partial<NetworkLinkData>) => {
    dispatch({ type: 'UPDATE_EDGE', payload: { id, data } });
  }, []);

  const updateInterface = useCallback((nodeId: string, interfaceId: string, updates: Partial<import('./types').NetworkInterface>) => {
    dispatch({ type: 'UPDATE_INTERFACE', payload: { nodeId, interfaceId, updates } });
  }, []);

  const selectNode = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: id });
  }, []);

  const selectEdge = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_EDGE', payload: id });
  }, []);

  const value: TopologyContextValue = {
    state,
    dispatch,
    addNode,
    removeNode,
    updateNode,
    addEdge,
    removeEdge,
    updateEdge,
    updateInterface,
    selectNode,
    selectEdge,
  };

  return (
    <TopologyContext.Provider value={value}>
      {children}
    </TopologyContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTopology(): TopologyContextValue {
  const ctx = useContext(TopologyContext);
  if (!ctx) throw new Error('useTopology must be used within a TopologyProvider');
  return ctx;
}
