import { describe, it, expect } from 'vitest';
import { TRAFFIC_CHALLENGES } from '../traffic-data';
import type { TrafficChallenge } from '../traffic-data';

describe('traffic-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(TRAFFIC_CHALLENGES)).toBe(true);
    expect(TRAFFIC_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('each challenge has required fields', () => {
    TRAFFIC_CHALLENGES.forEach((c: TrafficChallenge) => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(c.difficulty);
      expect(Array.isArray(c.packets)).toBe(true);
      expect(c.packets.length).toBeGreaterThan(0);
      expect(Array.isArray(c.analysisTasks)).toBe(true);
      expect(c.analysisTasks.length).toBeGreaterThan(0);
      expect(Array.isArray(c.filterCommands)).toBe(true);
      expect(typeof c.cpReward).toBe('number');
    });
  });

  it('each challenge has a unique id', () => {
    const ids = TRAFFIC_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each packet has required fields', () => {
    TRAFFIC_CHALLENGES.forEach((c) => {
      c.packets.forEach((p) => {
        expect(typeof p.number).toBe('number');
        expect(p.time).toBeTruthy();
        expect(p.source).toBeTruthy();
        expect(p.destination).toBeTruthy();
        expect(p.protocol).toBeTruthy();
        expect(typeof p.length).toBe('number');
        expect(p.info).toBeTruthy();
      });
    });
  });

  it('find challenge by id', () => {
    const first = TRAFFIC_CHALLENGES[0];
    const found = TRAFFIC_CHALLENGES.find((c) => c.id === first.id);
    expect(found).toBe(first);
  });
});
