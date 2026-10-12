/**
 * credentials.ts
 *
 * The learner's own credential records, read from the backend credential
 * service.
 *
 *   GET /api/credentials/user/:userId   (authenticated: self or admin)
 *   → { success, credentials: [{ credentialId, programName, completionDate,
 *        result, status, verifyUrl }] }
 *
 * Public verification of a single credential lives in `credentialVerification.ts`
 * (the `/verify` route). This service is only for listing the signed-in learner's
 * own credentials on their profile — it never fabricates records, so a failure
 * throws and the caller shows an error state rather than an invented list.
 */

import api from '@/core/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CredentialStatus = 'ACTIVE' | 'REVOKED' | 'SUSPENDED';

export interface LearnerCredential {
  credentialId: string;
  programName: string;
  /** ISO-8601 completion date. */
  completionDate: string;
  result: 'PASS' | 'FAIL';
  status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED';
  /** Absolute verification URL (`https://qyvora.org/verify/<id>`). */
  verifyUrl: string;
}

interface ApiCredential {
  credentialId?: string;
  programName?: string;
  completionDate?: string;
  result?: string;
  status?: string;
  verifyUrl?: string;
}

interface ApiResponse {
  success?: boolean;
  credentials?: ApiCredential[];
}

/** In-app (router) path to the public verification page for a credential. */
export function verifyPath(credentialId: string): string {
  return `/verify/${credentialId}`;
}

/**
 * The programme a credential belongs to, derived from its program name. Drives
 * the certificate artwork (HPB vs QOSE). Unknown programmes fall back to QOSE,
 * matching the certificate renderer's default.
 */
export function credentialProgram(programName: string): 'HPB' | 'QOSE' {
  return /hacker protocol|\bHPB\b/i.test(programName) ? 'HPB' : 'QOSE';
}

function toLearnerCredential(raw: unknown): LearnerCredential | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  const credentialId = typeof c.credentialId === 'string' ? c.credentialId : '';
  if (!credentialId) return null;
  const status = c.status === 'REVOKED' || c.status === 'SUSPENDED' ? c.status : 'ACTIVE';
  const result = c.result === 'FAIL' ? 'FAIL' : 'PASS';
  return {
    credentialId,
    programName: typeof c.programName === 'string' ? c.programName : '',
    completionDate: typeof c.completionDate === 'string' ? c.completionDate : '',
    result,
    status,
    verifyUrl: typeof c.verifyUrl === 'string' ? c.verifyUrl : '',
  };
}

/**
 * Fetches the credentials issued to a learner. Throws on any failure (network,
 * 403, 500) so the caller can distinguish "no credentials" from "could not
 * load".
 */
export async function getUserCredentials(userId: string): Promise<LearnerCredential[]> {
  const { data } = await api.get(`/credentials/user/${encodeURIComponent(userId)}`);
  const payload = data as { credentials?: unknown };
  if (!Array.isArray(payload?.credentials)) return [];
  return payload.credentials
    .map(toLearnerCredential)
    .filter((c): c is LearnerCredential => c !== null);
}

export default { getUserCredentials, credentialProgram };
