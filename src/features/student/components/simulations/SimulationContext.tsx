import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { SimulationType, NetworkProfile, BrowserState } from './types';

// ── Discovery ───────────────────────────────────────────────────────────────
interface DiscoveryState {
  discoveredIps: string[];
  discoveredHostnames: string[];
  addDiscovery: (ip: string, hostname?: string) => void;
}

const DiscoveryContext = createContext<DiscoveryState | null>(null);

export function useDiscovery() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error('useDiscovery must be used within SimulationProvider');
  return ctx;
}

// ── Panel ───────────────────────────────────────────────────────────────────
interface SimulationPanelState {
  activeSimulations: SimulationType[];
  openSimulation: SimulationType | null;
  setActiveSimulations: (types: SimulationType[]) => void;
  setOpenSimulation: (type: SimulationType | null) => void;
  toggleSimulation: (type: SimulationType) => void;
}

const SimulationPanelContext = createContext<SimulationPanelState | null>(null);

export function useSimulationPanel() {
  const ctx = useContext(SimulationPanelContext);
  if (!ctx) throw new Error('useSimulationPanel must be used within SimulationProvider');
  return ctx;
}

// ── Network ─────────────────────────────────────────────────────────────────
interface NetworkProfileState {
  activeProfile: NetworkProfile | null;
  setActiveProfile: (profile: NetworkProfile | null) => void;
}

const NetworkProfileContext = createContext<NetworkProfileState | null>(null);

export function useNetworkProfile() {
  const ctx = useContext(NetworkProfileContext);
  if (!ctx) throw new Error('useNetworkProfile must be used within SimulationProvider');
  return ctx;
}

// ── Browser ─────────────────────────────────────────────────────────────────
interface BrowserSimState {
  browser: BrowserState;
  setBrowserUrl: (url: string) => void;
  addBrowserPage: (page: BrowserState['pages'][0]) => void;
  resetBrowser: () => void;
}

const BrowserSimContext = createContext<BrowserSimState | null>(null);

export function useBrowserSim() {
  const ctx = useContext(BrowserSimContext);
  if (!ctx) throw new Error('useBrowserSim must be used within SimulationProvider');
  return ctx;
}

// ── Combined hook (backward compat) ─────────────────────────────────────────
export function useSimulation() {
  return {
    discovery: useDiscovery(),
    panel: useSimulationPanel(),
    network: useNetworkProfile(),
    browser: useBrowserSim(),
  };
}

// ── Provider ────────────────────────────────────────────────────────────────
export function SimulationProvider({ children }: { children: ReactNode }) {
  // Discovery state
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

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ ips: string[]; hostnames?: Record<string, string> }>;
      const { ips, hostnames } = custom.detail;
      ips.forEach(ip => {
        const hostname = hostnames?.[ip];
        addDiscovery(ip, hostname);
      });
    };
    window.addEventListener('qyvora:ip-discovered', handler);
    return () => window.removeEventListener('qyvora:ip-discovered', handler);
  }, [addDiscovery]);

  // Panel state
  const [activeSimulations, setActiveSimulations] = useState<SimulationType[]>([]);
  const [openSimulation, setOpenSimulation] = useState<SimulationType | null>(null);

  const toggleSimulation = useCallback((type: SimulationType) => {
    setActiveSimulations(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Network state
  const [activeProfile, setActiveProfile] = useState<NetworkProfile | null>(null);

  // Browser state
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

  const resetBrowser = useCallback(() => {
    setBrowser({
      url: 'about:blank',
      pages: [],
      history: ['about:blank'],
      historyIndex: 0,
    });
  }, []);

  // Memoize each context value independently
  const discoveryValue = useMemo(() => ({ discoveredIps, discoveredHostnames, addDiscovery }), [discoveredIps, discoveredHostnames, addDiscovery]);
  const panelValue = useMemo(() => ({ activeSimulations, openSimulation, setActiveSimulations, setOpenSimulation, toggleSimulation }), [activeSimulations, openSimulation, toggleSimulation]);
  const networkValue = useMemo(() => ({ activeProfile, setActiveProfile }), [activeProfile]);
  const browserValue = useMemo(() => ({ browser, setBrowserUrl, addBrowserPage, resetBrowser }), [browser, setBrowserUrl, addBrowserPage, resetBrowser]);

  return (
    <DiscoveryContext.Provider value={discoveryValue}>
      <SimulationPanelContext.Provider value={panelValue}>
        <NetworkProfileContext.Provider value={networkValue}>
          <BrowserSimContext.Provider value={browserValue}>
            {children}
          </BrowserSimContext.Provider>
        </NetworkProfileContext.Provider>
      </SimulationPanelContext.Provider>
    </DiscoveryContext.Provider>
  );
}
