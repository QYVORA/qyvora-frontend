import { extractCpBalance } from '../../../shared/utils/cpBalance';

const DEFAULT_CHAIN_BASE = '';

export async function getTokenBalanceForUser(userId: string): Promise<number | null> {
  const id = String(userId || '').trim();
  if (!id) return null;

  const base = String(import.meta.env.VITE_CHAIN_API_BASE_URL || DEFAULT_CHAIN_BASE).trim().replace(/\/+$/, '');
  if (!base) return null;
  try {
    const res = await fetch(`${base}/token/balance/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const payload = await res.json().catch(() => null);
    return extractCpBalance(payload);
  } catch {
    return null;
  }
}
