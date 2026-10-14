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
 * Verification is API-only. The service never fabricates credentials: if the
 * backend cannot be reached, the result is an explicit `error` state rather
 * than a locally-invented record. A 404 from the endpoint means "no such
 * credential" (`not-found`).
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
  /** `api` = result from the backend credential service. */
  source?: 'api';
  message?: string;
}

// ─── Demo credential IDs ──────────────────────────────────────────────────────
// Sample IDs used by the admin certificate template preview. These are NOT used
// by the public verification flow, which only ever reads the live API.

export const DEMO_CREDENTIAL_IDS = {
  /** QOSE Cohort 1 sample — valid. */
  QOSE: '550e8400-e29b-41d4-a716-446655440000',
  /** HPB sample — valid. */
  HPB: 'b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01',
  /** Revoked sample — demonstrates the revoked state. */
  REVOKED: 'd4c1a9e7-3b52-4f80-9a11-6e2f7c3d5a10',
} as const;

// ─── Normalisation & validation ───────────────────────────────────────────────

const CREDENTIAL_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

/**
 * Normalises free-form user input into a credential ID.
 *
 * Accepts a bare ID, an ID pasted with surrounding whitespace/newlines, or a
 * full verification URL (`https://qyvora.org/verify/<id>`). IDs are matched
 * case-insensitively, so the result is lowercased. Returns `null` when the
 * input cannot be a credential ID.
 */
export function normalizeCredentialId(raw: string): string | null {
  if (!raw) return null;
  let value = raw.trim();
  const urlMatch = value.match(/\/verify\/([^/?#\s]+)/i);
  if (urlMatch) value = urlMatch[1];
  value = value.replace(/\s+/g, '').toLowerCase();
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

function isNotFound(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  return (error as AxiosError).response?.status === 404;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Verifies a credential ID against the backend credential service. The result
 * is always derived from the live API: an unreachable service yields an
 * explicit `error` state, never a locally-fabricated credential.
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
    // Endpoint answered but with no usable credential — treat as not found.
    if (!mapped) return { state: 'not-found', credentialId, source: 'api' };
    return { ...mapped, credentialId, source: 'api' };
  } catch (error) {
    if (isNotFound(error)) {
      return { state: 'not-found', credentialId, source: 'api' };
    }
    return {
      state: 'error',
      credentialId,
      message: 'Verification failed while contacting the credential service. Please try again.',
    };
  }
}
