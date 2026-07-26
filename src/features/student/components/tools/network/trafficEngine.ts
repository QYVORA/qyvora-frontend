import { packetEngine } from './packetEngine';
import type { TrafficLevel, PacketState, NetworkLinkData } from './types';

const PROTOCOL_COLORS: { protocol: string; color: string }[] = [
  { protocol: 'ARP',   color: '#f97316' },
  { protocol: 'DNS',   color: '#a855f7' },
  { protocol: 'DHCP',  color: '#22d3ee' },
  { protocol: 'HTTP',  color: '#eab308' },
  { protocol: 'HTTPS', color: '#06B66F' },
  { protocol: 'SSH',   color: '#3b82f6' },
  { protocol: 'ICMP',  color: '#64748b' },
  { protocol: 'SMTP',  color: '#ec4899' },
  { protocol: 'FTP',   color: '#f59e0b' },
  { protocol: 'NTP',   color: '#14b8a6' },
  { protocol: 'RDP',   color: '#8b5cf6' },
  { protocol: 'TLS',   color: '#06B66F' },
];

type Listener = () => void;

interface TrafficSnapshot {
  level: TrafficLevel;
  running: boolean;
}

class TrafficEngine {
  private running = false;
  private level: TrafficLevel = 'idle';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private getEdges: (() => { id: string; data: NetworkLinkData }[]) | null = null;
  private listeners: Set<Listener> = new Set();
  private cachedSnapshot: TrafficSnapshot = { level: 'idle', running: false };

  setEdgeProvider(fn: () => { id: string; data: NetworkLinkData }[]): void {
    this.getEdges = fn;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setLevel(level: TrafficLevel): void {
    this.level = level;
    this.updateSnapshot();
    if (this.running) {
      this.restart();
    }
    this.notify();
  }

  getLevel(): TrafficLevel {
    return this.level;
  }

  isRunning(): boolean {
    return this.running;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.updateSnapshot();
    this.restart();
    this.notify();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.updateSnapshot();
    this.clearInterval();
    this.notify();
  }

  private updateSnapshot(): void {
    this.cachedSnapshot = { level: this.level, running: this.running };
  }

  private restart(): void {
    this.clearInterval();
    if (this.level === 'idle') return;
    const ms = this.getIntervalMs();
    if (ms === Infinity) return;
    this.intervalId = setInterval(() => this.emitPacket(), ms);
  }

  private getIntervalMs(): number {
    switch (this.level) {
      case 'idle':      return Infinity;
      case 'low':       return 3000;
      case 'medium':    return 1000;
      case 'high':      return 300;
      case 'saturated': return 50;
      default:          return Infinity;
    }
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private emitPacket(): void {
    if (!this.getEdges) return;
    const edges = this.getEdges().filter(e => e.data.state === 'connected');
    if (edges.length === 0) return;

    const count = this.level === 'saturated' ? Math.min(3, edges.length) : 1;
    for (let i = 0; i < count; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const proto = PROTOCOL_COLORS[Math.floor(Math.random() * PROTOCOL_COLORS.length)];

      const packet: PacketState = {
        id: `pkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        edgeId: edge.id,
        protocol: proto.protocol,
        color: proto.color,
        sourceIp: '10.0.0.' + (Math.floor(Math.random() * 254) + 1),
        destIp: '10.0.0.' + (Math.floor(Math.random() * 254) + 1),
        size: 64 + Math.floor(Math.random() * 1400),
        progress: 0,
        speed: 0.4 + Math.random() * 0.6,
      };

      packetEngine.addPacket(edge.id, packet);
    }
  }

  private notify(): void {
    for (const l of this.listeners) l();
  }

  getSnapshot = (): TrafficSnapshot => {
    return this.cachedSnapshot;
  };
}

export const trafficEngine = new TrafficEngine();
