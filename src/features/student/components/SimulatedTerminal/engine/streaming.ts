import type { CommandTiming, StreamingDescriptor } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(base: number, jitter: number): number {
  return base + Math.random() * jitter;
}

const TIMING_PROFILES = {
  nmap: { startupDelay: 800, lineDelay: [150, 350] as [number, number], mode: 'line' as const },
  ping: { lineDelay: [800, 400] as [number, number], mode: 'line' as const },
  traceroute: { startupDelay: 300, lineDelay: [600, 300] as [number, number], mode: 'line' as const },
  gobuster: { startupDelay: 500, lineDelay: [40, 80] as [number, number], mode: 'line' as const },
  hydra: { startupDelay: 600, lineDelay: [200, 400] as [number, number], mode: 'line' as const },
  sqlmap: { startupDelay: 400, lineDelay: [80, 150] as [number, number], mode: 'batched' as const, batchSize: 3, batchDelay: [120, 200] as [number, number] },
  nikto: { startupDelay: 500, lineDelay: [100, 200] as [number, number], mode: 'line' as const },
  john: { startupDelay: 400, lineDelay: [150, 300] as [number, number], mode: 'line' as const },
  hashcat: { startupDelay: 300, lineDelay: [100, 200] as [number, number], mode: 'batched' as const, batchSize: 2, batchDelay: [150, 250] as [number, number] },
  enum4linux: { startupDelay: 300, lineDelay: [80, 150] as [number, number], mode: 'line' as const },
  crackmapexec: { startupDelay: 200, lineDelay: [100, 200] as [number, number], mode: 'line' as const },
  binwalk: { startupDelay: 200, lineDelay: [80, 150] as [number, number], mode: 'line' as const },
  wget: { startupDelay: 200, lineDelay: [50, 100] as [number, number], mode: 'line' as const },
  ssh: { startupDelay: 300, lineDelay: [100, 200] as [number, number], mode: 'line' as const },
  scp: { startupDelay: 300, lineDelay: [100, 200] as [number, number], mode: 'line' as const },
  msfconsole: { startupDelay: 600, lineDelay: [30, 60] as [number, number], mode: 'line' as const },
  curl: { startupDelay: 100, lineDelay: [30, 60] as [number, number], mode: 'line' as const },
  dig: { startupDelay: 150, lineDelay: [50, 100] as [number, number], mode: 'line' as const },
  whois: { startupDelay: 100, lineDelay: [40, 80] as [number, number], mode: 'line' as const },
} satisfies Record<string, CommandTiming>;

const DEFAULT_TIMING: CommandTiming = { lineDelay: 0, mode: 'instant' };

export function getTimingProfile(command: string): CommandTiming {
  return TIMING_PROFILES[command] || DEFAULT_TIMING;
}

export function hasStreamingOutput(descriptor: StreamingDescriptor | undefined): boolean {
  if (!descriptor) return false;
  const { timing, streamLines } = descriptor;
  if (timing.mode === 'instant') return false;
  if (streamLines.length <= 1) return false;
  return true;
}

export async function* streamOutput(
  descriptor: StreamingDescriptor,
  signal: { aborted: boolean },
): AsyncGenerator<string[], void, unknown> {
  const { streamLines, timing } = descriptor;

  if (timing.startupDelay && timing.startupDelay > 0) {
    await delay(timing.startupDelay);
    if (signal.aborted) return;
  }

  if (timing.mode === 'line') {
    const lines: string[] = [];
    for (const line of streamLines) {
      if (signal.aborted) break;
      lines.push(line);
      yield [...lines];
      let d: number;
      if (Array.isArray(timing.lineDelay)) {
        const [base, jitter] = timing.lineDelay;
        d = randomDelay(base, jitter);
      } else {
        d = timing.lineDelay;
      }
      if (d > 0) await delay(d);
    }
  } else if (timing.mode === 'batched') {
    const batchSize = timing.batchSize || 3;
    let batchDelayRange: [number, number];
    if (Array.isArray(timing.batchDelay)) {
      batchDelayRange = timing.batchDelay;
    } else {
      batchDelayRange = [100, 200];
    }
    const lines: string[] = [];
    for (let i = 0; i < streamLines.length; i += batchSize) {
      if (signal.aborted) break;
      const batch = streamLines.slice(i, i + batchSize);
      lines.push(...batch);
      yield [...lines];
      if (i + batchSize < streamLines.length) {
        await delay(randomDelay(batchDelayRange[0], batchDelayRange[1]));
      }
    }
  } else {
    yield [...streamLines];
  }
}
