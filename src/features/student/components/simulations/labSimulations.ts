import type { SimulationType } from './types';

export const LAB_SIMULATIONS: Record<string, SimulationType[]> = {
  'sql-injection':    ['sql-console', 'browser', 'http-inspector'],
  'web-exploitation': ['browser', 'http-inspector', 'api-explorer'],
  'privesc':          ['file-explorer', 'log-viewer'],
  'password':         ['password-cracker', 'file-explorer'],
  'phishing':         ['email-client', 'browser'],
  'osint':            ['osint-dashboard', 'browser'],
  'kill-chain':       ['network-topology', 'packet-viewer', 'file-explorer', 'timeline-investigation'],
  'proxy':            ['http-inspector', 'packet-viewer'],
  'traffic':          ['packet-viewer', 'log-viewer'],
  'wireless':         ['network-topology', 'packet-viewer'],
};

export function getSimulationsForLab(labId: string): SimulationType[] {
  return LAB_SIMULATIONS[labId] || [];
}
