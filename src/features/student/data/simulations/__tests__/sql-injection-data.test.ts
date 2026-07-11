import { describe, it, expect } from 'vitest';
import { SQL_INJECTION_TARGETS } from '../sql-injection-data';
import type { SqlInjectionTarget } from '../sql-injection-data';

describe('sql-injection-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(SQL_INJECTION_TARGETS)).toBe(true);
    expect(SQL_INJECTION_TARGETS.length).toBeGreaterThan(0);
  });

  it('each target has required fields', () => {
    SQL_INJECTION_TARGETS.forEach((t: SqlInjectionTarget) => {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.url).toBeTruthy();
      expect(t.parameter).toBeTruthy();
      expect(typeof t.injectable).toBe('boolean');
      expect(t.database).toBeTruthy();
      expect(Array.isArray(t.tables)).toBe(true);
      expect(t.tables.length).toBeGreaterThan(0);
      expect(['beginner', 'intermediate', 'advanced']).toContain(t.difficulty);
    });
  });

  it('each target has a unique id', () => {
    const ids = SQL_INJECTION_TARGETS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each table has columns and rows', () => {
    SQL_INJECTION_TARGETS.forEach((t) => {
      t.tables.forEach((table) => {
        expect(table.name).toBeTruthy();
        expect(Array.isArray(table.columns)).toBe(true);
        expect(table.columns.length).toBeGreaterThan(0);
        expect(Array.isArray(table.rows)).toBe(true);
      });
    });
  });

  it('find target by id', () => {
    const first = SQL_INJECTION_TARGETS[0];
    const found = SQL_INJECTION_TARGETS.find((t) => t.id === first.id);
    expect(found).toBe(first);
  });
});
