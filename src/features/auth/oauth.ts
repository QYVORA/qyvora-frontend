/**
 * GitHub OAuth URL builders.
 *
 * Both flows are browser top-level navigations: the backend answers with a
 * 302 to GitHub, then GitHub redirects back to the backend callback, which
 * establishes the session and redirects to `/auth/callback` on the frontend.
 *
 * `API_BASE_URL` is `/api` in development (proxied by Vite) and the absolute
 * backend base in production, so these URLs work in both environments.
 */
import { API_BASE_URL } from '@/core/services/api';

export const buildGithubAuthUrl = (redirect = '/dashboard'): string =>
  `${API_BASE_URL}/auth/github?redirect=${encodeURIComponent(redirect)}`;

export const buildGithubLinkUrl = (redirect = '/dashboard/profile'): string =>
  `${API_BASE_URL}/auth/github/link?redirect=${encodeURIComponent(redirect)}`;

/** Start the sign-in / registration flow (guest users). */
export const goToGithubAuth = (redirect = '/dashboard'): void => {
  window.location.assign(buildGithubAuthUrl(redirect));
};

/** Start the account-linking flow (authenticated users). */
export const goToGithubLink = (redirect = '/dashboard/profile'): void => {
  window.location.assign(buildGithubLinkUrl(redirect));
};

/**
 * Client-side mirror of the backend `sanitizeReturnTo`. Only root-relative
 * in-app paths pass; anything else (absolute URLs, `//host`, backslashes)
 * collapses to the fallback so an OAuth redirect cannot be turned into an
 * open redirect.
 */
export const sanitizeReturnPath = (value: unknown, fallback = '/dashboard'): string => {
  const raw = String(value ?? '').trim();
  if (!raw.startsWith('/')) return fallback;
  if (raw.startsWith('//') || raw.startsWith('/\\')) return fallback;
  if (raw.includes('\\')) return fallback;
  return raw;
};
