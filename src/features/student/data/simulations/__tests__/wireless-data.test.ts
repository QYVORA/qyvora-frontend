import { describe, it, expect } from 'vitest';
import { WIRELESS_CHALLENGES } from '../wireless-data';
import type { WirelessChallenge } from '../wireless-data';

describe('wireless-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(WIRELESS_CHALLENGES)).toBe(true);
    expect(WIRELESS_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('each challenge has required fields', () => {
    WIRELESS_CHALLENGES.forEach((s: WirelessChallenge) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(s.difficulty);
      expect(Array.isArray(s.accessPoints)).toBe(true);
      expect(s.accessPoints.length).toBeGreaterThan(0);
      expect(s.targetBssid).toBeTruthy();
      expect(Array.isArray(s.steps)).toBe(true);
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.flag).toMatch(/^FLAG\{.+\}$/);
      expect(typeof s.cpReward).toBe('number');
    });
  });

  it('each challenge has a unique id', () => {
    const ids = WIRELESS_CHALLENGES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each AP has valid BSSID format', () => {
    WIRELESS_CHALLENGES.forEach((s) => {
      s.accessPoints.forEach((ap) => {
        expect(ap.bssid).toMatch(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/);
        expect(ap.channel).toBeGreaterThan(0);
        expect(ap.signal).toBeLessThanOrEqual(0);
        expect(ap.ssid).toBeTruthy();
        expect(ap.encryption).toBeTruthy();
      });
    });
  });

  it('each step has command, output, and explanation', () => {
    WIRELESS_CHALLENGES.forEach((s) => {
      s.steps.forEach((step) => {
        expect(step.command).toBeTruthy();
        expect(step.output).toBeTruthy();
        expect(step.explanation).toBeTruthy();
      });
    });
  });

  it('find challenge by id', () => {
    const first = WIRELESS_CHALLENGES[0];
    const found = WIRELESS_CHALLENGES.find((s) => s.id === first.id);
    expect(found).toBe(first);
  });
});
