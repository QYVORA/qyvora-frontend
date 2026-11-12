import { describe, expect, it } from 'vitest';
import { getQoseRegistrationState } from './bootcampData';

const opens = Date.UTC(2026, 10, 10, 0, 0, 0);
const closes = Date.UTC(2026, 10, 15, 0, 0, 0);

describe('getQoseRegistrationState', () => {
  it('shows pre-registration before the window opens', () => {
    const state = getQoseRegistrationState(opens - 1);
    expect(state.status).toBe('pre-registration');
    expect(state.ctaLabel).toBe('Registration opens 10 Nov');
  });

  it('shows open from 10 November until the cutoff', () => {
    expect(getQoseRegistrationState(opens).status).toBe('open');
    expect(getQoseRegistrationState(closes - 1).status).toBe('open');
    expect(getQoseRegistrationState(opens).ctaLabel).toBe('Register & pay');
  });

  it('shows closed at the published cutoff', () => {
    const state = getQoseRegistrationState(closes);
    expect(state.status).toBe('closed');
    expect(state.ctaLabel).toBe('Registration closed');
  });
});
