import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';
import type { SimulationType } from './types';
import type { SqlTable } from './types';

export type SimulationContent = { type: SimulationType; content: React.ReactNode };

// ── Terminal Simulation Content ──────────────────────────────────────────────
// Wraps SimulatedTerminal in inline mode. Watches parent data-active attribute
// to open/close the terminal when tabs change. Terminal state persists across
// tab switches (component stays mounted, just hidden).
function TerminalSimulationContent({ context }: { context: TerminalContext }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current?.parentElement;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const isActive = el.getAttribute('data-active') === 'true';
      setOpen(isActive);
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-active'] });

    if (el.getAttribute('data-active') === 'true') {
      setOpen(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  return (
    <div ref={wrapperRef} className="h-full">
      <SimulatedTerminal
        open={open}
        onOpenChange={handleOpenChange}
        context={context}
        mode="inline"
      />
    </div>
  );
}

// ── Terminal Simulation Factory ──────────────────────────────────────────────
export function createTerminalSimulation(context: TerminalContext): SimulationContent {
  return {
    type: 'terminal',
    content: <TerminalSimulationContent context={context} />,
  };
}

// ── SQL Injection Lab ────────────────────────────────────────────────────────
export function createSqlInjectionSimulations(
  _tables: SqlTable[],
  _targetUrl: string,
): SimulationContent[] {
  return [
    createTerminalSimulation({ type: 'lab', labId: 'sql-injection' }),
  ];
}

// ── Password Cracking Lab ────────────────────────────────────────────────────
export function createPasswordSimulations(
  _hashContent: string,
  _hashType: string,
  _wordlist: string[],
): SimulationContent[] {
  return [
    createTerminalSimulation({ type: 'lab', labId: 'passwords' }),
  ];
}

// ── OSINT Lab ────────────────────────────────────────────────────────────────
export function createOsintSimulations(
  _targetName: string,
  _skills: string[],
): SimulationContent[] {
  return [
    createTerminalSimulation({ type: 'lab', labId: 'osint' }),
  ];
}

// ── Kill Chain Lab ───────────────────────────────────────────────────────────
export function createKillChainSimulations(
  _phases: Array<{ name: string; commands: Array<{ command: string; output: string }> }>,
): SimulationContent[] {
  return [
    createTerminalSimulation({ type: 'lab', labId: 'kill-chain' }),
  ];
}

// ── Privesc Lab ──────────────────────────────────────────────────────────────
export function createPrivescSimulations(
  _filesystem: Record<string, string>,
): SimulationContent[] {
  return [
    createTerminalSimulation({ type: 'lab', labId: 'privesc' }),
  ];
}
