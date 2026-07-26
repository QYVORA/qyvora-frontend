import type { PacketState } from './types';

type Listener = () => void;

class PacketEngine {
  private packets: Map<string, PacketState[]> = new Map();
  private snapshots: Map<string, PacketState[]> = new Map();
  private allPacketsSnapshot: Map<string, PacketState[]> = new Map();
  private listeners: Set<Listener> = new Set();
  private rafId: number | null = null;
  private lastTime = 0;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  addPacket(edgeId: string, packet: PacketState): void {
    const list = this.packets.get(edgeId);
    if (list) {
      if (this.getTotalCount() >= 200) {
        this.removeOldest();
      }
      list.push(packet);
    } else {
      this.packets.set(edgeId, [packet]);
    }
    this.invalidateSnapshots();
    this.notify();
  }

  removePacket(edgeId: string, packetId: string): void {
    const list = this.packets.get(edgeId);
    if (!list) return;
    const idx = list.findIndex(p => p.id === packetId);
    if (idx !== -1) list.splice(idx, 1);
    this.invalidateSnapshots();
    this.notify();
  }

  getPacketsForEdge(edgeId: string): PacketState[] {
    return this.snapshots.get(edgeId) ?? [];
  }

  getAllPackets(): Map<string, PacketState[]> {
    return this.allPacketsSnapshot;
  }

  getTotalCount(): number {
    let count = 0;
    for (const list of this.packets.values()) {
      count += list.length;
    }
    return count;
  }

  private removeOldest(): void {
    for (const [edgeId, list] of this.packets) {
      if (list.length > 0) {
        list.shift();
        return;
      }
    }
  }

  private invalidateSnapshots(): void {
    this.snapshots.clear();
    this.allPacketsSnapshot = new Map();
    for (const [edgeId, list] of this.packets) {
      const copy = [...list];
      this.snapshots.set(edgeId, copy);
      this.allPacketsSnapshot.set(edgeId, copy);
    }
  }

  clearAll(): void {
    this.packets.clear();
    this.invalidateSnapshots();
    this.notify();
  }

  start(): void {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();
    this.tick();
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (): void => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    let changed = false;

    for (const [edgeId, list] of this.packets) {
      for (let i = list.length - 1; i >= 0; i--) {
        const pkt = list[i];
        pkt.progress += pkt.speed * dt;
        if (pkt.progress >= 1) {
          list.splice(i, 1);
          changed = true;
        }
      }
      if (list.length === 0) {
        this.packets.delete(edgeId);
        changed = true;
      }
    }

    if (changed) {
      this.invalidateSnapshots();
      this.notify();
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  getSnapshot = (): Map<string, PacketState[]> => {
    return this.allPacketsSnapshot;
  };
}

export const packetEngine = new PacketEngine();
