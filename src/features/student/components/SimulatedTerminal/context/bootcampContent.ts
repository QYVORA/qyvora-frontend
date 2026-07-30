import type { TerminalState } from '../types';

export function injectBootcampContent(
  state: TerminalState,
  _bootcampId: string,
  _phaseId?: string,
  _roomId?: string,
): TerminalState {
  return state;
}