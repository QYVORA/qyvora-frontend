import { useSyncExternalStore } from 'react';
import { packetEngine } from './packetEngine';
import type { PacketState } from './types';

export function usePacketEngine(edgeId: string): PacketState[] {
  return useSyncExternalStore(
    (cb) => packetEngine.subscribe(cb),
    () => packetEngine.getPacketsForEdge(edgeId),
    () => packetEngine.getPacketsForEdge(edgeId),
  );
}

export function usePacketEngineAll(): Map<string, PacketState[]> {
  return useSyncExternalStore(
    (cb) => packetEngine.subscribe(cb),
    () => packetEngine.getAllPackets(),
    () => packetEngine.getAllPackets(),
  );
}
