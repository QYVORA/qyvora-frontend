import { describe, it, expect } from 'vitest';
import { SIMULATED_WEB_APP } from '../web-app-data';

describe('web-app-data', () => {
  it('exports a valid web app object', () => {
    expect(SIMULATED_WEB_APP).toBeTruthy();
    expect(SIMULATED_WEB_APP.id).toBeTruthy();
    expect(SIMULATED_WEB_APP.name).toBeTruthy();
    expect(SIMULATED_WEB_APP.description).toBeTruthy();
    expect(SIMULATED_WEB_APP.baseUrl).toBeTruthy();
  });

  it('has pages array', () => {
    expect(Array.isArray(SIMULATED_WEB_APP.pages)).toBe(true);
    expect(SIMULATED_WEB_APP.pages.length).toBeGreaterThan(0);
  });

  it('each page has required fields', () => {
    SIMULATED_WEB_APP.pages.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.url).toBeTruthy();
      expect(typeof p.htmlContent).toBe('string');
      expect(p.htmlContent.length).toBeGreaterThan(0);
      expect(typeof p.responseHeaders).toBe('object');
      expect(Array.isArray(p.hiddenElements)).toBe(true);
      expect(Array.isArray(p.vulnerabilities)).toBe(true);
    });
  });

  it('each page has a unique id', () => {
    const ids = SIMULATED_WEB_APP.pages.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has vulnerabilities array', () => {
    expect(Array.isArray(SIMULATED_WEB_APP.vulnerabilities)).toBe(true);
    expect(SIMULATED_WEB_APP.vulnerabilities.length).toBeGreaterThan(0);
  });

  it('each vulnerability has required fields', () => {
    SIMULATED_WEB_APP.vulnerabilities.forEach((v) => {
      expect(v.id).toBeTruthy();
      expect(v.name).toBeTruthy();
      expect(v.type).toBeTruthy();
      expect(v.description).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(v.difficulty);
      expect(Array.isArray(v.steps)).toBe(true);
      expect(v.steps.length).toBeGreaterThan(0);
      expect(v.flag).toMatch(/^FLAG\{.+\}$/);
      expect(typeof v.cpReward).toBe('number');
    });
  });

  it('each vulnerability has a unique id', () => {
    const ids = SIMULATED_WEB_APP.vulnerabilities.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
