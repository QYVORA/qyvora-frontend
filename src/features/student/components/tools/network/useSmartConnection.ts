import { useState, useCallback, useMemo } from 'react';
import type { Node } from '@xyflow/react';
import type { DeviceNodeData, InterfaceHitbox, InterfaceType } from './types';
import { getDeviceDef, MEDIUM_INTERFACE_COMPAT } from './devices';

interface SmartConnectionState {
  dragging: boolean;
  sourceNodeId: string | null;
  sourceInterfaceId: string | null;
  sourceInterfaceType: InterfaceType | null;
  compatibleNodes: Set<string>;
}

export function useSmartConnection() {
  const [state, setState] = useState<SmartConnectionState>({
    dragging: false,
    sourceNodeId: null,
    sourceInterfaceId: null,
    sourceInterfaceType: null,
    compatibleNodes: new Set(),
  });

  const startDrag = useCallback((nodeId: string, interfaceId: string, interfaceType: InterfaceType) => {
    // Find all medium types compatible with this interface
    const compatibleMedia = Object.entries(MEDIUM_INTERFACE_COMPAT)
      .filter(([, types]) => types.includes(interfaceType))
      .map(([mediumId]) => mediumId);

    setState({
      dragging: true,
      sourceNodeId: nodeId,
      sourceInterfaceId: interfaceId,
      sourceInterfaceType: interfaceType,
      compatibleNodes: new Set(), // Will be populated when nodes are evaluated
    });

    return compatibleMedia;
  }, []);

  const updateCompatibleNodes = useCallback((nodes: Node[], allEdges: { source: string; target: string }[]) => {
    if (!state.dragging || !state.sourceInterfaceType) return;

    // Find which medium types the source interface supports
    const compatibleMedia = Object.entries(MEDIUM_INTERFACE_COMPAT)
      .filter(([, types]) => types.includes(state.sourceInterfaceType!))
      .map(([mediumId]) => mediumId);

    // For each other node, check if any of its interfaces are compatible via any of the compatible media
    const compatible = new Set<string>();
    for (const node of nodes) {
      if (node.id === state.sourceNodeId) continue;
      const data = node.data as DeviceNodeData;
      if (!data?.interfaces) continue;

      // Check if already connected to source
      const alreadyConnected = allEdges.some(
        e => (e.source === state.sourceNodeId && e.target === node.id) ||
             (e.target === state.sourceNodeId && e.source === node.id),
      );
      if (alreadyConnected) continue;

      // Check if any interface on this node is compatible
      for (const iface of data.interfaces) {
        if (iface.operationalState === 'not-present' || iface.adminState === 'down') continue;
        for (const mediumId of compatibleMedia) {
          const allowedTypes = MEDIUM_INTERFACE_COMPAT[mediumId];
          if (allowedTypes?.includes(iface.type)) {
            compatible.add(node.id);
            break;
          }
        }
        if (compatible.has(node.id)) break;
      }
    }

    setState(prev => ({ ...prev, compatibleNodes: compatible }));
  }, [state.dragging, state.sourceNodeId, state.sourceInterfaceType]);

  const endDrag = useCallback(() => {
    setState({
      dragging: false,
      sourceNodeId: null,
      sourceInterfaceId: null,
      sourceInterfaceType: null,
      compatibleNodes: new Set(),
    });
  }, []);

  const getCompatibleInterfaces = useCallback((targetNodeId: string, targetIfaces: { id: string; type: InterfaceType; operationalState: string; adminState: string }[]): { id: string; type: InterfaceType; compatible: boolean }[] => {
    if (!state.sourceInterfaceType) return [];

    const compatibleMedia = Object.entries(MEDIUM_INTERFACE_COMPAT)
      .filter(([, types]) => types.includes(state.sourceInterfaceType!))
      .map(([mediumId]) => mediumId);

    return targetIfaces.map(iface => {
      if (iface.operationalState === 'not-present' || iface.adminState === 'down') {
        return { id: iface.id, type: iface.type, compatible: false };
      }
      const isCompatible = compatibleMedia.some(mediumId => {
        const allowed = MEDIUM_INTERFACE_COMPAT[mediumId];
        return allowed?.includes(iface.type);
      });
      return { id: iface.id, type: iface.type, compatible: isCompatible };
    });
  }, [state.sourceInterfaceType]);

  const findBestMedium = useCallback((sourceIfaceType: InterfaceType, targetIfaceType: InterfaceType): string | null => {
    for (const [mediumId, types] of Object.entries(MEDIUM_INTERFACE_COMPAT)) {
      if (types.includes(sourceIfaceType) && types.includes(targetIfaceType)) {
        return mediumId;
      }
    }
    return null;
  }, []);

  return {
    ...state,
    startDrag,
    updateCompatibleNodes,
    endDrag,
    getCompatibleInterfaces,
    findBestMedium,
  };
}
