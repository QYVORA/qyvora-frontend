import { describe, it, expect } from 'vitest';
import { KILL_CHAIN_SCENARIOS } from '../kill-chain-data';
import type { KillChainScenario } from '../kill-chain-data';

describe('kill-chain-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(KILL_CHAIN_SCENARIOS)).toBe(true);
    expect(KILL_CHAIN_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('each scenario has required fields', () => {
    KILL_CHAIN_SCENARIOS.forEach((s: KillChainScenario) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(s.difficulty);
      expect(s.targetDescription).toBeTruthy();
      expect(Array.isArray(s.phases)).toBe(true);
      expect(s.phases.length).toBeGreaterThan(0);
      expect(typeof s.cpReward).toBe('number');
    });
  });

  it('each scenario has a unique id', () => {
    const ids = KILL_CHAIN_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each phase has commands with required fields', () => {
    KILL_CHAIN_SCENARIOS.forEach((s) => {
      s.phases.forEach((phase) => {
        expect(phase.id).toBeTruthy();
        expect(phase.name).toBeTruthy();
        expect(phase.description).toBeTruthy();
        expect(Array.isArray(phase.commands)).toBe(true);
        phase.commands.forEach((cmd) => {
          expect(cmd.command).toBeTruthy();
          expect(cmd.output).toBeTruthy();
          expect(cmd.explanation).toBeTruthy();
          expect(typeof cmd.isRequired).toBe('boolean');
        });
      });
    });
  });

  it('find scenario by id', () => {
    const first = KILL_CHAIN_SCENARIOS[0];
    const found = KILL_CHAIN_SCENARIOS.find((s) => s.id === first.id);
    expect(found).toBe(first);
  });
});
