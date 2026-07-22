import type { SimulationType } from './types';

export const LAB_SIMULATIONS: Record<string, SimulationType[]> = {
  'sql-injection':    ['terminal'],
  'privesc':          ['terminal'],
  'password':         ['terminal'],
  'osint':            ['terminal'],
  'kill-chain':       ['terminal'],
};

export function getSimulationsForLab(labId: string): SimulationType[] {
  return LAB_SIMULATIONS[labId] || [];
}
