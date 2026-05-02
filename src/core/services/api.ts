import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const CSRF_TOKEN_KEY = 'hsociety_csrf_token';
const AUTH_SESSION_HINT_KEY = 'hsociety_auth_session_hint';

const DEFAULT_API_BASE = '/api';
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).trim();

// Access token lives in memory only — never persisted to localStorage
// This prevents XSS token theft. The backend uses httpOnly cookies for
// refresh tokens; the short-lived access token is kept in-memory only.
let accessToken: string = '';
let csrfToken: string = localStorage.getItem(CSRF_TOKEN_KEY) || '';
let refreshPromise: Promise<string | null> | null = null;
let authSessionHint = localStorage.getItem(AUTH_SESSION_HINT_KEY) === '1';

const persistAccessToken = (token: string) => {
  accessToken = token || '';
  if (accessToken) {
    authSessionHint = true;
    localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
  }
  // intentionally NOT persisted to localStorage — memory only
};

const persistCsrfToken = (token: string) => {
  csrfToken = token || '';
  if (csrfToken) localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
  else localStorage.removeItem(CSRF_TOKEN_KEY);
};

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string) => persistAccessToken(token);
export const setAuthSessionHint = (value: boolean) => {
  authSessionHint = value;
  if (value) localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
  else localStorage.removeItem(AUTH_SESSION_HINT_KEY);
};
export const clearAuthStorage = () => {
  persistAccessToken('');
  persistCsrfToken('');
  setAuthSessionHint(false);
};

const maybeUpdateAuthArtifacts = (payload: unknown, headers?: Record<string, unknown>) => {
  const tokenFromBody =
    typeof payload === 'object' && payload !== null
      ? String((payload as { token?: unknown }).token || '')
      : '';
  if (tokenFromBody) persistAccessToken(tokenFromBody);

  const csrfFromBody =
    typeof payload === 'object' && payload !== null
      ? String((payload as { csrfToken?: unknown }).csrfToken || '')
      : '';
  const csrfFromHeader = String(headers?.['x-csrf-token'] || headers?.['X-CSRF-Token'] || '');
  const resolvedCsrf = csrfFromBody || csrfFromHeader;
  if (resolvedCsrf) persistCsrfToken(resolvedCsrf);
};

const ensureHeaders = (config: InternalAxiosRequestConfig): AxiosHeaders => {
  if (!config.headers) config.headers = new AxiosHeaders();
  return config.headers as AxiosHeaders;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const attachHeaders = (config: InternalAxiosRequestConfig) => {
  const headers = ensureHeaders(config);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  return config;
};

api.interceptors.request.use(attachHeaders);
authApi.interceptors.request.use((config) => {
  const headers = ensureHeaders(config);
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  return config;
});

const tryRefreshToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post('/auth/refresh', {})
      .then((res) => {
        maybeUpdateAuthArtifacts(res.data, res.headers as Record<string, unknown>);
        return getAccessToken() || null;
      })
      .catch(() => {
        clearAuthStorage();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => {
    maybeUpdateAuthArtifacts(response.data, response.headers as Record<string, unknown>);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (!original || original._retry || status !== 401) {
      return Promise.reject(error);
    }

    // Skip refresh attempts for visitors with no known session.
    if (!authSessionHint) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refreshedToken = await tryRefreshToken();
    if (!refreshedToken) {
      return Promise.reject(error);
    }

    const headers = ensureHeaders(original);
    headers.set('Authorization', `Bearer ${refreshedToken}`);
    if (csrfToken) headers.set('X-CSRF-Token', csrfToken);

    return api(original);
  }
);

export default api;
