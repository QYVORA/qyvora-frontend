import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SimulationType, NetworkProfile, BrowserState } from './types';

// ── Discovery State ─────────────────────────────────────────────────────────
interface DiscoveryState {
  discoveredIps: string[];
  discoveredHostnames: string[];
  addDiscovery: (ip: string, hostname?: string) => void;
}

// ── Simulation Panel State ──────────────────────────────────────────────────
interface SimulationPanelState {
  activeSimulations: SimulationType[];
  openSimulation: SimulationType | null;
  setActiveSimulations: (types: SimulationType[]) => void;
  setOpenSimulation: (type: SimulationType | null) => void;
  toggleSimulation: (type: SimulationType) => void;
}

// ── Network Profile State ───────────────────────────────────────────────────
interface NetworkProfileState {
  activeProfile: NetworkProfile | null;
  setActiveProfile: (profile: NetworkProfile | null) => void;
}

// ── Browser State ───────────────────────────────────────────────────────────
interface BrowserSimState {
  browser: BrowserState;
  setBrowserUrl: (url: string) => void;
  addBrowserPage: (page: BrowserState['pages'][0]) => void;
}

// ── Context ─────────────────────────────────────────────────────────────────
interface SimulationContextValue {
  discovery: DiscoveryState;
  panel: SimulationPanelState;
  network: NetworkProfileState;
  browser: BrowserSimState;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}

// ── Provider ────────────────────────────────────────────────────────────────
export function SimulationProvider({ children }: { children: ReactNode }) {
  // Discovery
  const [discoveredIps, setDiscoveredIps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qyvora_discovered_ips');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [discoveredHostnames, setDiscoveredHostnames] = useState<string[]>([]);

  const addDiscovery = useCallback((ip: string, hostname?: string) => {
    setDiscoveredIps(prev => {
      if (prev.includes(ip)) return prev;
      const next = [...prev, ip];
      localStorage.setItem('qyvora_discovered_ips', JSON.stringify(next));
      return next;
    });
    if (hostname) {
      setDiscoveredHostnames(prev => prev.includes(hostname) ? prev : [...prev, hostname]);
    }
  }, []);

  // Simulation panel
  const [activeSimulations, setActiveSimulations] = useState<SimulationType[]>([]);
  const [openSimulation, setOpenSimulation] = useState<SimulationType | null>(null);

  const toggleSimulation = useCallback((type: SimulationType) => {
    setActiveSimulations(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Network profile
  const [activeProfile, setActiveProfile] = useState<NetworkProfile | null>(null);

  // Browser
  const [browser, setBrowser] = useState<BrowserState>({
    url: 'about:blank',
    pages: [],
    history: ['about:blank'],
    historyIndex: 0,
  });

  const setBrowserUrl = useCallback((url: string) => {
    setBrowser(prev => ({
      ...prev,
      url,
      history: [...prev.history.slice(0, prev.historyIndex + 1), url],
      historyIndex: prev.historyIndex + 1,
    }));
  }, []);

  const addBrowserPage = useCallback((page: BrowserState['pages'][0]) => {
    setBrowser(prev => ({
      ...prev,
      pages: [...prev.pages.filter(p => p.url !== page.url), page],
    }));
  }, []);

  return (
    <SimulationContext.Provider value={{
      discovery: { discoveredIps, discoveredHostnames, addDiscovery },
      panel: { activeSimulations, openSimulation, setActiveSimulations, setOpenSimulation, toggleSimulation },
      network: { activeProfile, setActiveProfile },
      browser: { browser, setBrowserUrl, addBrowserPage },
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
