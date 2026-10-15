/**
 * credentials.ts
 *
 * The learner's own credential records, read from the backend credential
 * service.
 *
 *   GET  /api/credentials/user/:userId   (authenticated: self or admin)
 *   → { success, credentials: [{ credentialId, programName, completionDate,
 *        result, status, verifyUrl, recipientName?, cohortIdentifier? }] }
 *
 *   POST /api/credentials/claim          (authenticated: self)
 *   body: { program?: 'HPB' | 'QOSE' }
 *   → { success, credentials: [ ...same shape... ] }
 *
 * The claim endpoint backfills credentials for learners who completed a
 * programme before the credential service issued them (legacy completers).
 * It is IDEMPOTENT: a learner who already holds the credential receives the
 * existing record rather than a duplicate. The backend is the sole issuer —
 * the frontend can request a credential, never fabricate one.
 *
 * Public verification of a single credential lives in `credentialVerification.ts`
 * (the `/verify` route). This service is only for listing and claiming the
 * signed-in learner's own credentials — on failure it throws so the caller shows
 * an error state rather than an invented list.
 */

import api from '@/core/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CredentialStatus = 'ACTIVE' | 'REVOKED' | 'SUSPENDED';

/** Programmes that can issue a claimable credential. */
export type CredentialProgram = 'HPB' | 'QOSE';

export interface LearnerCredential {
  credentialId: string;
  programName: string;
  /** ISO-8601 completion date. */
  completionDate: string;
  result: 'PASS' | 'FAIL';
  status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED';
  /** Absolute verification URL (`https://qyvora.org/verify/<id>`). */
  verifyUrl: string;
  /**
   * Name printed on the certificate. Optional: older credential records may
   * omit it, in which case the caller falls back to the learner's profile name.
   */
  recipientName?: string;
  /** Cohort / programme identifier printed on the certificate, when known. */
  cohortIdentifier?: string;
}

interface ApiCredential {
  credentialId?: string;
  programName?: string;
  completionDate?: string;
  result?: string;
  status?: string;
  verifyUrl?: string;
  recipientName?: string;
  cohortIdentifier?: string;
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
    recipientName: typeof c.recipientName === 'string' ? c.recipientName : undefined,
    cohortIdentifier: typeof c.cohortIdentifier === 'string' ? c.cohortIdentifier : undefined,
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

/**
 * Claims the credential(s) the signed-in learner is entitled to but has not yet
 * been issued — the backfill path for legacy bootcamp completers. Pass a
 * programme to claim only that one, or omit it to let the backend issue every
 * outstanding credential.
 *
 * Idempotent: safe to call repeatedly; already-issued credentials come back as
 * their existing record. Returns the affected credential(s), or an empty array
 * when the backend reports nothing to issue. Throws on failure so the caller can
 * surface an error instead of pretending the claim succeeded.
 */
export async function claimCredentials(
  program?: CredentialProgram,
): Promise<LearnerCredential[]> {
  const { data } = await api.post('/credentials/claim', program ? { program } : {});
  const payload = data as { credentials?: unknown; credential?: unknown };

  const rawList = Array.isArray(payload?.credentials)
    ? payload.credentials
    : payload?.credential
      ? [payload.credential]
      : [];

  return rawList
    .map(toLearnerCredential)
    .filter((c): c is LearnerCredential => c !== null);
}

export default { getUserCredentials, claimCredentials, credentialProgram };
