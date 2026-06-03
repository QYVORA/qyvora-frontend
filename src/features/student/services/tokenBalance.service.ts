/**
 * tokenService.ts
 *
 * Direct client for the HSOCIETY CHAIN token balance endpoint.
 *
 * Unlike chainService.ts (which reads history through the backend proxy),
 * this service calls the chain API directly from the browser when a base
 * URL is configured. This is intentional — token balance is a lightweight,
 * public-ish read that does not require backend mediation.
 *
 * If VITE_CHAIN_API_BASE_URL is not set, all calls return null immediately
 * without making any network request. This allows the platform to run in
 * environments where the chain node is not deployed (e.g. development, CI)
 * without any code changes.
 */
import { extractCpBalance } from '../../../shared/utils/cpBalance';

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * Fallback base URL for the chain API.
 * An empty string intentionally disables all direct chain calls when the
 * environment variable is not configured — see the guard in getTokenBalanceForUser.
 */
const DEFAULT_CHAIN_BASE = '';

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetches the on-chain CP token balance for a given platform user ID.
 *
 * Returns the balance as a number on success, or null on any failure.
 * Null is the universal "we don't know" signal — callers should fall back
 * to the database CP value (from /auth/me) when this returns null.
 *
 * @param userId - The platform user ID to query. Must be a non-empty string.
 *
 * Guards applied before making a network request:
 *   1. userId coercion and trim — prevents passing an empty or whitespace-only
 *      ID to the chain, which would produce a meaningless or erroneous result.
 *   2. base URL check — if VITE_CHAIN_API_BASE_URL is not set, we return null
 *      immediately rather than making a request to a relative URL or crashing.
 *
 * Timeout:
 *   A 60-second AbortController timeout is applied. The chain node is an
 *   external service that may be slow or unreachable (especially during Render
 *   cold starts). Without a timeout, a hung request could block the dashboard
 *   from rendering indefinitely. The timer is cleared on success.
 *
 * encodeURIComponent(id):
 *   The user ID is URL-encoded before being interpolated into the path.
 *   This prevents path traversal or malformed URLs if the ID ever contains
 *   characters like '/', '?', or '#'. Treat any external input as untrusted.
 *
 * Error handling:
 *   All errors (network failure, timeout abort, non-2xx response, JSON parse
 *   failure) are caught and return null. The `.catch(() => null)` on
 *   `res.json()` specifically handles malformed JSON responses without
 *   throwing, since a bad JSON body is a recoverable failure here.
 */
export async function getTokenBalanceForUser(userId: string): Promise<number | null> {
  // Guard 1: Sanitise the userId — reject empty or whitespace-only values early.
  const id = String(userId || '').trim();
  if (!id) return null;

  // Guard 2: Resolve and validate the chain API base URL.
  // Trailing slashes are stripped to prevent double-slash URLs when the
  // endpoint path is appended (e.g. "https://chain.example.com//token/...").
  const base = String(import.meta.env.VITE_CHAIN_API_BASE_URL || DEFAULT_CHAIN_BASE)
    .trim()
    .replace(/\/+$/, '');

  // If no base URL is configured, skip all network activity entirely.
  if (!base) return null;

  try {
    // Set up a 60-second hard timeout via AbortController.
    // AbortController is the standard Web API for cancelling fetch requests.
    // 60s is used to accommodate potential Render cold starts.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(`${base}/token/balance/${encodeURIComponent(id)}`, {
      signal: controller.signal, // Connects the timeout to this specific request
    });

    // Cancel the timeout — the request completed before the 60s window.
    clearTimeout(timer);

    // Treat any non-2xx HTTP status as a soft failure — return null rather
    // than throwing, keeping the caller's error handling simple.
    if (!res.ok) return null;

    // Attempt to parse the response body as JSON.
    // `.catch(() => null)` handles malformed JSON without propagating an error —
    // extractCpBalance handles a null payload gracefully.
    const payload = await res.json().catch(() => null);

    // Delegate the actual balance extraction to the shared utility, which
    // handles variations in field names and nested response shapes from the
    // chain API (e.g. { balance: 450 } vs { data: { cpPoints: 450 } }).
    return extractCpBalance(payload);
  } catch {
    // Catches: AbortError (timeout), TypeError (network failure), and any
    // other unexpected error. All are treated as "balance unknown" — return null
    // so the dashboard falls back to the database value without crashing.
    return null;
  }
}
