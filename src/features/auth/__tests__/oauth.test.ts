import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildGithubAuthUrl,
  buildGithubLinkUrl,
  goToGithubAuth,
  goToGithubLink,
  sanitizeReturnPath,
} from '../oauth';

describe('github oauth url builders', () => {
  it('builds the sign-in URL with an encoded redirect', () => {
    expect(buildGithubAuthUrl('/dashboard/labs?x=1')).toBe(
      '/api/auth/github?redirect=%2Fdashboard%2Flabs%3Fx%3D1',
    );
  });

  it('builds the link URL defaulting to the profile page', () => {
    expect(buildGithubLinkUrl()).toBe('/api/auth/github/link?redirect=%2Fdashboard%2Fprofile');
  });

  it('navigates via window.location.assign', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    goToGithubAuth('/dashboard');
    expect(assign).toHaveBeenCalledWith('/api/auth/github?redirect=%2Fdashboard');
    goToGithubLink('/dashboard/profile');
    expect(assign).toHaveBeenCalledWith('/api/auth/github/link?redirect=%2Fdashboard%2Fprofile');
  });
});

describe('sanitizeReturnPath', () => {
  it('keeps root-relative paths', () => {
    expect(sanitizeReturnPath('/dashboard/profile')).toBe('/dashboard/profile');
    expect(sanitizeReturnPath('/a?b=1#c')).toBe('/a?b=1#c');
  });

  it('rejects absolute URLs and protocol-relative paths', () => {
    expect(sanitizeReturnPath('https://evil.com')).toBe('/dashboard');
    expect(sanitizeReturnPath('//evil.com')).toBe('/dashboard');
    expect(sanitizeReturnPath('/\\evil.com')).toBe('/dashboard');
    expect(sanitizeReturnPath('/foo\\bar')).toBe('/dashboard');
  });

  it('rejects empty and non-string values', () => {
    expect(sanitizeReturnPath(undefined)).toBe('/dashboard');
    expect(sanitizeReturnPath(null)).toBe('/dashboard');
    expect(sanitizeReturnPath('')).toBe('/dashboard');
  });

  it('honours a custom fallback', () => {
    expect(sanitizeReturnPath('https://evil.com', '/login')).toBe('/login');
  });
});

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});
