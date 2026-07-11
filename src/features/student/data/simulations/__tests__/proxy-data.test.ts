import { describe, it, expect } from 'vitest';
import { PROXY_SCENARIOS } from '../proxy-data';
import type { ProxyScenario } from '../proxy-data';

describe('proxy-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(PROXY_SCENARIOS)).toBe(true);
    expect(PROXY_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('each scenario has required fields', () => {
    PROXY_SCENARIOS.forEach((s: ProxyScenario) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(s.difficulty);
      expect(Array.isArray(s.requests)).toBe(true);
      expect(s.requests.length).toBeGreaterThan(0);
      expect(Array.isArray(s.tasks)).toBe(true);
      expect(s.tasks.length).toBeGreaterThan(0);
      expect(typeof s.cpReward).toBe('number');
    });
  });

  it('each scenario has a unique id', () => {
    const ids = PROXY_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each request has response with status code', () => {
    PROXY_SCENARIOS.forEach((s) => {
      s.requests.forEach((r) => {
        expect(r.method).toBeTruthy();
        expect(r.url).toBeTruthy();
        expect(typeof r.response.statusCode).toBe('number');
        expect(r.response.statusCode).toBeGreaterThanOrEqual(100);
        expect(r.response.statusCode).toBeLessThan(600);
      });
    });
  });

  it('find scenario by id', () => {
    const first = PROXY_SCENARIOS[0];
    const found = PROXY_SCENARIOS.find((s) => s.id === first.id);
    expect(found).toBe(first);
  });
});
