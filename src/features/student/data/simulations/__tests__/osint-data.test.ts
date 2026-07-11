import { describe, it, expect } from 'vitest';
import { OSINT_CHALLENGES } from '../osint-data';
import type { OsintChallenge } from '../osint-data';

describe('osint-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(OSINT_CHALLENGES)).toBe(true);
    expect(OSINT_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('each challenge has required fields', () => {
    OSINT_CHALLENGES.forEach((c: OsintChallenge) => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(c.difficulty);
      expect(c.targetName).toBeTruthy();
      expect(Array.isArray(c.steps)).toBe(true);
      expect(c.steps.length).toBeGreaterThan(0);
      expect(Array.isArray(c.skills)).toBe(true);
      expect(c.skills.length).toBeGreaterThan(0);
      expect(c.flag).toMatch(/^FLAG\{.+\}$/);
      expect(typeof c.cpReward).toBe('number');
    });
  });

  it('each challenge has a unique id', () => {
    const ids = OSINT_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each step has tool, command, and output', () => {
    OSINT_CHALLENGES.forEach((c) => {
      c.steps.forEach((step) => {
        expect(step.tool).toBeTruthy();
        expect(step.command).toBeTruthy();
        expect(step.output).toBeTruthy();
        expect(step.explanation).toBeTruthy();
      });
    });
  });

  it('find challenge by id', () => {
    const first = OSINT_CHALLENGES[0];
    const found = OSINT_CHALLENGES.find((c) => c.id === first.id);
    expect(found).toBe(first);
  });
});
