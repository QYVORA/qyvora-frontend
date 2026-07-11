import { describe, it, expect } from 'vitest';
import { PRIVESC_SCENARIOS } from '../privesc-scenarios';
import type { PrivescScenario } from '../types';

describe('privesc-scenarios', () => {
  it('exports a non-empty array of scenarios', () => {
    expect(Array.isArray(PRIVESC_SCENARIOS)).toBe(true);
    expect(PRIVESC_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('each scenario has required fields', () => {
    PRIVESC_SCENARIOS.forEach((s: PrivescScenario) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.technique).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(s.difficulty);
      expect(Array.isArray(s.hints)).toBe(true);
      expect(s.hints.length).toBeGreaterThan(0);
      expect(typeof s.filesystem).toBe('object');
      expect(Object.keys(s.filesystem).length).toBeGreaterThan(0);
      expect(Array.isArray(s.solutionCommands)).toBe(true);
      expect(s.solutionCommands.length).toBeGreaterThan(0);
    });
  });

  it('each scenario has a unique id', () => {
    const ids = PRIVESC_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('filesystem keys start with /', () => {
    PRIVESC_SCENARIOS.forEach((s) => {
      Object.keys(s.filesystem).forEach((k) => {
        expect(k.startsWith('/')).toBe(true);
      });
    });
  });

  it('find scenario by id', () => {
    const first = PRIVESC_SCENARIOS[0];
    const found = PRIVESC_SCENARIOS.find((s) => s.id === first.id);
    expect(found).toBe(first);
  });
});
