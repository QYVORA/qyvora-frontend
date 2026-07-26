import { useSyncExternalStore, useCallback } from 'react';
import { trafficEngine } from './trafficEngine';
import { packetEngine } from './packetEngine';
import type { TrafficLevel, NetworkLinkData } from './types';

export function useTrafficSimulation() {
  const snapshot = useSyncExternalStore(
    (cb) => trafficEngine.subscribe(cb),
    () => trafficEngine.getSnapshot(),
    () => trafficEngine.getSnapshot(),
  );

  const setLevel = useCallback((level: TrafficLevel) => {
    trafficEngine.setLevel(level);
  }, []);

  const start = useCallback(() => {
    trafficEngine.start();
    packetEngine.start();
  }, []);

  const stop = useCallback(() => {
    trafficEngine.stop();
    packetEngine.stop();
  }, []);

  const setEdgeProvider = useCallback((fn: () => { id: string; data: NetworkLinkData }[]) => {
    trafficEngine.setEdgeProvider(fn);
  }, []);

  const clearPackets = useCallback(() => {
    packetEngine.clearAll();
  }, []);

  return {
    level: snapshot.level,
    running: snapshot.running,
    setLevel,
    start,
    stop,
    setEdgeProvider,
    clearPackets,
  };
}
