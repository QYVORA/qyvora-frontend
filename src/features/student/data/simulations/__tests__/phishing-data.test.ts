import { describe, it, expect } from 'vitest';
import { PHISHING_CHALLENGES } from '../phishing-data';
import type { PhishingChallenge } from '../phishing-data';

describe('phishing-data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(PHISHING_CHALLENGES)).toBe(true);
    expect(PHISHING_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('each challenge has required fields', () => {
    PHISHING_CHALLENGES.forEach((c: PhishingChallenge) => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(c.difficulty);
      expect(Array.isArray(c.emails)).toBe(true);
      expect(c.emails.length).toBeGreaterThan(0);
      expect(Array.isArray(c.questions)).toBe(true);
      expect(c.questions.length).toBeGreaterThan(0);
      expect(typeof c.cpReward).toBe('number');
    });
  });

  it('each challenge has a unique id', () => {
    const ids = PHISHING_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each email has required fields', () => {
    PHISHING_CHALLENGES.forEach((c) => {
      c.emails.forEach((email) => {
        expect(email.id).toBeTruthy();
        expect(email.from).toBeTruthy();
        expect(email.subject).toBeTruthy();
        expect(typeof email.body).toBe('string');
        expect(email.body.length).toBeGreaterThan(0);
        expect(typeof email.isPhishing).toBe('boolean');
        expect(Array.isArray(email.indicators)).toBe(true);
        expect(email.receivedAt).toBeTruthy();
        expect(Array.isArray(email.headers)).toBe(true);
        expect(email.headers.length).toBeGreaterThan(0);
      });
    });
  });

  it('each question has correct structure', () => {
    PHISHING_CHALLENGES.forEach((c) => {
      c.questions.forEach((q) => {
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(typeof q.correctIndex).toBe('number');
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      });
    });
  });

  it('indicators have valid severity', () => {
    PHISHING_CHALLENGES.forEach((c) => {
      c.emails.forEach((email) => {
        email.indicators.forEach((ind) => {
          expect(ind.type).toBeTruthy();
          expect(ind.description).toBeTruthy();
          expect(['low', 'medium', 'high']).toContain(ind.severity);
        });
      });
    });
  });
});
