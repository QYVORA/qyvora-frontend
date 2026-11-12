import { describe, it, expect } from 'vitest';
import { formatCompact } from '../formatCompact';

describe('formatCompact', () => {
  it('keeps values under 1,000 plain', () => {
    expect(formatCompact(0)).toBe('0');
    expect(formatCompact(365)).toBe('365');
  });

  it('uses thousands separators under 100,000', () => {
    expect(formatCompact(1_000)).toBe('1,000');
    expect(formatCompact(6_037)).toBe('6,037');
    expect(formatCompact(99_999)).toBe('99,999');
  });

  it('compacts values at 100,000 and above', () => {
    expect(formatCompact(100_000)).toBe('100k');
    expect(formatCompact(124_500)).toBe('124.5k');
    expect(formatCompact(1_234_567)).toBe('1.2M');
  });

  it('returns a dash for missing or invalid values', () => {
    expect(formatCompact(null)).toBe('-');
    expect(formatCompact(undefined)).toBe('-');
    expect(formatCompact(Number.NaN)).toBe('-');
  });
});
