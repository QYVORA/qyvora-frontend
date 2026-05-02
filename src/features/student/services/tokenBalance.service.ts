import { extractCpBalance } from '../../../shared/utils/cpBalance';

const DEFAULT_CHAIN_BASE = '';

export async function getTokenBalanceForUser(userId: string): Promise<number | null> {
  const id = String(userId || '').trim();
  if (!id) return null;

  const base = String(import.meta.env.VITE_CHAIN_API_BASE_URL || DEFAULT_CHAIN_BASE).trim().replace(/\/+$/, '');
  if (!base) return null;
  try {
    // 5-second timeout so a slow/unreachable chain API never blocks the dashboard
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${base}/token/balance/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const payload = await res.json().catch(() => null);
    return extractCpBalance(payload);
  } catch {
    return null;
  }
}
