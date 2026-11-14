import { describe, expect, it } from 'vitest';
import { shortDescription } from './shortDescription';

describe('shortDescription', () => {
  it('returns an empty string for missing text', () => {
    expect(shortDescription(undefined)).toBe('');
    expect(shortDescription('   ')).toBe('');
  });

  it('keeps text that already fits', () => {
    expect(shortDescription('Extract data through SQL injection attacks')).toBe(
      'Extract data through SQL injection attacks',
    );
  });

  it('prefers the first sentence when it fits', () => {
    const text = 'The terminal is the cockpit. It teaches navigation, files, and processes.';
    expect(shortDescription(text, 60)).toBe('The terminal is the cockpit.');
  });

  it('trims on a word boundary with an ellipsis', () => {
    const text =
      'Burp Suite is the Swiss Army knife of web security testing and teaches interception.';
    const result = shortDescription(text, 48);

    expect(result.length).toBeLessThanOrEqual(48);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toMatch(/\s…$/);
  });
});
