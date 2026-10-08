/**
 * credentialVerification.ts
 *
 * Public credential verification logic for the `/verify` route.
 *
 * Contract follows the approved credential specification in
 * `knowledge/qyvora-docs/09-technical/credential-system/CREDENTIAL-DATA-MODEL.md`:
 *
 *   GET /api/credentials/verify/:credentialId   (public, no auth)
 *   → { success, valid, credential: { recipientName, programName,
 *      cohortIdentifier, completionDate, result, issuedAt, chainVerified,
 *      blockIndex } }
 *
 * While the backend endpoint is not yet live, the service falls back to a
 * small local registry of demo credentials so the verification flow is fully
 * exercisable. Fallback results are always flagged with `source: 'local'`
 * and the UI labels them as local demo records — they are never presented as
 * chain-verified backend results.
 */

import axios, { AxiosError } from 'axios';
import api from '@/core/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VerificationState =
  /** Credential exists, status ACTIVE. */
  | 'valid'
  /** Credential exists but status is REVOKED/SUSPENDED. */
  | 'revoked'
  /** Well-formed ID, no record anywhere. */
  | 'not-found'
  /** Input could not be parsed as a credential ID. */
  | 'invalid'
  /** Verification service error (network/server). */
  | 'error';

export interface VerifiedCredential {
  credentialId: string;
  recipientName: string;
  programName: string;
  cohortIdentifier: string;
  completionDate: string;
  result: 'PASS' | 'FAIL';
  issuedAt: string;
  status: 'ACTIVE' | 'REVOKED' | 'SUSPENDED';
  /** "QOSE" | "HPB" — used to pick the certificate artwork. */
  bootcampId?: string;
  /** Whether the credential hash is anchored on qyvora-chain. */
  chainVerified?: boolean;
  blockIndex?: number;
}

export interface VerificationResult {
  state: VerificationState;
  credentialId: string;
  credential?: VerifiedCredential;
  /** `api` = backend credential service, `local` = bundled demo registry. */
  source?: 'api' | 'local';
  message?: string;
}

// ─── Demo credential IDs ──────────────────────────────────────────────────────
// Single source of truth for the sample IDs used by the admin certificate
// preview and the local verification registry.

export const DEMO_CREDENTIAL_IDS = {
  /** QOSE Cohort 1 sample — valid. */
  QOSE: '550e8400-e29b-41d4-a716-446655440000',
  /** HPB sample — valid. */
  HPB: 'b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01',
  /** Revoked sample — demonstrates the revoked state. */
  REVOKED: 'd4c1a9e7-3b52-4f80-9a11-6e2f7c3d5a10',
} as const;

// ─── Local fallback registry (temporary — removed once the API is live) ───────

const LOCAL_REGISTRY: Record<string, VerifiedCredential> = {
  [DEMO_CREDENTIAL_IDS.QOSE]: {
    credentialId: DEMO_CREDENTIAL_IDS.QOSE,
    recipientName: 'Alexandra Maria Constantine-Rodriguez',
    programName: 'QYVORA Offensive Security Engineer Bootcamp',
    cohortIdentifier: 'Cohort 1 - Nov 2026',
    completionDate: '2026-11-30T12:00:00Z',
    result: 'PASS',
    issuedAt: '2026-11-30T14:30:00Z',
    status: 'ACTIVE',
    bootcampId: 'QOSE',
    chainVerified: true,
    blockIndex: 1234,
  },
  [DEMO_CREDENTIAL_IDS.HPB]: {
    credentialId: DEMO_CREDENTIAL_IDS.HPB,
    recipientName: 'Alex Johnson',
    programName: 'Hacker Protocol Bootcamp',
    cohortIdentifier: 'Cohort 1 - Nov 2026',
    completionDate: '2026-10-30T12:00:00Z',
    result: 'PASS',
    issuedAt: '2026-10-30T14:30:00Z',
    status: 'ACTIVE',
    bootcampId: 'HPB',
    chainVerified: true,
    blockIndex: 1189,
  },
  [DEMO_CREDENTIAL_IDS.REVOKED]: {
    credentialId: DEMO_CREDENTIAL_IDS.REVOKED,
    recipientName: 'Sample Revoked Learner',
    programName: 'Hacker Protocol Bootcamp',
    cohortIdentifier: 'Cohort 0 - Pilot',
    completionDate: '2026-08-30T12:00:00Z',
    result: 'PASS',
    issuedAt: '2026-08-30T14:30:00Z',
    status: 'REVOKED',
    bootcampId: 'HPB',
    chainVerified: true,
    blockIndex: 940,
  },
};

// ─── Normalisation & validation ───────────────────────────────────────────────

const CREDENTIAL_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

/**
 * Normalises free-form user input into a credential ID.
 *
 * Accepts a bare ID, an ID pasted with surrounding whitespace/newlines, or a
 * full verification URL (`https://qyvora.org/verify/<id>`). Returns `null`
 * when the input cannot be a credential ID.
 */
export function normalizeCredentialId(raw: string): string | null {
  if (!raw) return null;
  let value = raw.trim();
  const urlMatch = value.match(/\/verify\/([^/?#\s]+)/i);
  if (urlMatch) value = urlMatch[1];
  value = value.replace(/\s+/g, '');
  if (!CREDENTIAL_ID_PATTERN.test(value)) return null;
  return value;
}

// ─── API response mapping ─────────────────────────────────────────────────────

interface ApiCredentialPayload {
  recipientName?: string;
  programName?: string;
  cohortIdentifier?: string;
  completionDate?: string;
  result?: string;
  issuedAt?: string;
  status?: string;
  bootcampId?: string;
  chainVerified?: boolean;
  blockIndex?: number;
}

interface ApiResponsePayload {
  success?: boolean;
  valid?: boolean;
  credential?: ApiCredentialPayload;
}

function toVerifiedCredential(
  credentialId: string,
  payload: ApiCredentialPayload,
): VerifiedCredential {
  const status = payload.status === 'REVOKED' || payload.status === 'SUSPENDED'
    ? payload.status
    : 'ACTIVE';
  return {
    credentialId,
    recipientName: payload.recipientName || 'Unknown recipient',
    programName: payload.programName || 'QYVORA Bootcamp',
    cohortIdentifier: payload.cohortIdentifier || '',
    completionDate: payload.completionDate || '',
    result: payload.result === 'FAIL' ? 'FAIL' : 'PASS',
    issuedAt: payload.issuedAt || '',
    status,
    bootcampId: payload.bootcampId,
    chainVerified: payload.chainVerified,
    blockIndex: payload.blockIndex,
  };
}

function mapApiResponse(
  credentialId: string,
  data: unknown,
): { state: 'valid' | 'revoked'; credential: VerifiedCredential } | null {
  if (!data || typeof data !== 'object') return null;
  const payload = data as ApiResponsePayload;
  if (!payload.credential || typeof payload.credential !== 'object') return null;
  const credential = toVerifiedCredential(credentialId, payload.credential);
  return { state: credential.status === 'ACTIVE' ? 'valid' : 'revoked', credential };
}

// ─── Error classification ─────────────────────────────────────────────────────

function isEndpointUnavailable(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const axiosError = error as AxiosError;
  if (!axiosError.response) return true; // network / proxy down
  const status = axiosError.response.status;
  // Backend has no credential endpoint yet (route missing / not implemented).
  return status === 404 || status === 405 || status === 501 || status === 502 || status === 503;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Verifies a credential ID against the backend credential service, falling
 * back to the local demo registry when the service is unavailable or has no
 * record for the ID.
 */
export async function verifyCredential(raw: string): Promise<VerificationResult> {
  const credentialId = normalizeCredentialId(raw);

  if (!credentialId) {
    return {
      state: 'invalid',
      credentialId: raw.trim(),
      message: 'That does not look like a credential ID. Paste the full ID shown on the certificate.',
    };
  }

  try {
    const { data } = await api.get(`/credentials/verify/${encodeURIComponent(credentialId)}`);
    const mapped = mapApiResponse(credentialId, data);
    if (mapped) return { ...mapped, credentialId, source: 'api' };
    // Endpoint answered but with no usable credential — treat as not found.
    const local = LOCAL_REGISTRY[credentialId.toLowerCase()];
    if (local) {
      return {
        state: local.status === 'ACTIVE' ? 'valid' : 'revoked',
        credentialId,
        credential: local,
        source: 'local',
      };
    }
    return { state: 'not-found', credentialId, source: 'api' };
  } catch (error) {
    const local = LOCAL_REGISTRY[credentialId.toLowerCase()];
    if (local) {
      return {
        state: local.status === 'ACTIVE' ? 'valid' : 'revoked',
        credentialId,
        credential: local,
        source: 'local',
      };
    }
    if (isEndpointUnavailable(error)) {
      return {
        state: 'not-found',
        credentialId,
        source: 'local',
        message: 'No credential matches this ID. The credential service is also unreachable right now.',
      };
    }
    return {
      state: 'error',
      credentialId,
      message: 'Verification failed while contacting the credential service. Please try again.',
    };
  }
}
