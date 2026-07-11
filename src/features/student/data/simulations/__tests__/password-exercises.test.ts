import { describe, it, expect } from 'vitest';
import {
  PASSWORD_EXERCISES,
  getShadowFileContent,
} from '../password-exercises';
import type { PasswordExercise } from '../password-exercises';

describe('password-exercises', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(PASSWORD_EXERCISES)).toBe(true);
    expect(PASSWORD_EXERCISES.length).toBeGreaterThan(0);
  });

  it('each exercise has required fields', () => {
    PASSWORD_EXERCISES.forEach((e: PasswordExercise) => {
      expect(e.id).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(e.difficulty);
      expect(e.hashType).toBeTruthy();
      expect(e.hashContent).toBeTruthy();
      expect(e.crackedPassword).toBeTruthy();
      expect(e.wordlist).toBeTruthy();
      expect(Array.isArray(e.steps)).toBe(true);
      expect(e.flag).toMatch(/^FLAG\{.+\}$/);
      expect(typeof e.cpReward).toBe('number');
      expect(e.cpReward).toBeGreaterThan(0);
    });
  });

  it('each exercise has a unique id', () => {
    const ids = PASSWORD_EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getShadowFileContent returns valid shadow file format', () => {
    const shadow = getShadowFileContent();
    expect(typeof shadow).toBe('string');
    const lines = shadow.split('\n').filter((l) => l.trim());
    expect(lines.length).toBeGreaterThan(0);
    lines.forEach((line) => {
      const parts = line.split(':');
      expect(parts.length).toBeGreaterThanOrEqual(2);
      expect(parts[0]).toBeTruthy();
      expect(parts[1]).toBeTruthy();
    });
  });
});
