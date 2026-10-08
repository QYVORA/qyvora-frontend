import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn() },
}));

import api from '@/core/services/api';
import {
  DEMO_CREDENTIAL_IDS,
  normalizeCredentialId,
  verifyCredential,
} from '@/core/services/credentialVerification';

const apiGet = vi.mocked(api.get);

const networkError = () => new AxiosError('Network Error');
const notFoundError = () =>
  Object.assign(new AxiosError('Not Found'), { response: { status: 404, data: {}, headers: {}, config: {} } });

const apiCredential = {
  recipientName: 'Ada Lovelace',
  programName: 'QYVORA Offensive Security Engineer',
  cohortIdentifier: 'Cohort 1 - Nov 2026',
  completionDate: '2027-01-31T12:00:00Z',
  result: 'PASS',
  issuedAt: '2027-01-31T14:30:00Z',
  status: 'ACTIVE',
  bootcampId: 'QOSE',
  chainVerified: true,
  blockIndex: 42,
};

beforeEach(() => {
  apiGet.mockReset();
});

describe('normalizeCredentialId', () => {
  it('accepts a bare credential ID', () => {
    expect(normalizeCredentialId(DEMO_CREDENTIAL_IDS.QOSE)).toBe(DEMO_CREDENTIAL_IDS.QOSE);
  });

  it('strips whitespace and newlines from pasted IDs', () => {
    expect(normalizeCredentialId(`  ${DEMO_CREDENTIAL_IDS.HPB}\n`)).toBe(DEMO_CREDENTIAL_IDS.HPB);
  });

  it('extracts the ID from a pasted verification URL', () => {
    expect(normalizeCredentialId(`https://qyvora.org/verify/${DEMO_CREDENTIAL_IDS.QOSE}`)).toBe(
      DEMO_CREDENTIAL_IDS.QOSE,
    );
  });

  it('rejects inputs that cannot be a credential ID', () => {
    expect(normalizeCredentialId('')).toBeNull();
    expect(normalizeCredentialId('short')).toBeNull();
    expect(normalizeCredentialId('not a valid id!')).toBeNull();
  });
});

describe('verifyCredential', () => {
  it('maps a successful API response to a valid result', async () => {
    apiGet.mockResolvedValue({ data: { success: true, valid: true, credential: apiCredential } });

    const result = await verifyCredential(DEMO_CREDENTIAL_IDS.QOSE);

    expect(result.state).toBe('valid');
    expect(result.source).toBe('api');
    expect(result.credential?.recipientName).toBe('Ada Lovelace');
    expect(result.credential?.blockIndex).toBe(42);
    expect(apiGet).toHaveBeenCalledWith(`/credentials/verify/${DEMO_CREDENTIAL_IDS.QOSE}`);
  });

  it('maps an API credential with REVOKED status to the revoked state', async () => {
    apiGet.mockResolvedValue({
      data: { success: true, valid: false, credential: { ...apiCredential, status: 'REVOKED' } },
    });

    const result = await verifyCredential(DEMO_CREDENTIAL_IDS.QOSE);

    expect(result.state).toBe('revoked');
    expect(result.source).toBe('api');
  });

  it('falls back to the local registry when the API is unreachable', async () => {
    apiGet.mockRejectedValue(networkError());

    const result = await verifyCredential(DEMO_CREDENTIAL_IDS.QOSE);

    expect(result.state).toBe('valid');
    expect(result.source).toBe('local');
    expect(result.credential?.bootcampId).toBe('QOSE');
  });

  it('resolves the revoked demo credential from the local registry', async () => {
    apiGet.mockRejectedValue(notFoundError());

    const result = await verifyCredential(DEMO_CREDENTIAL_IDS.REVOKED);

    expect(result.state).toBe('revoked');
    expect(result.source).toBe('local');
  });

  it('returns not-found for an unknown ID when the service has no record', async () => {
    apiGet.mockRejectedValue(notFoundError());

    const result = await verifyCredential('00000000-0000-4000-8000-000000000000');

    expect(result.state).toBe('not-found');
    expect(result.credential).toBeUndefined();
  });

  it('rejects malformed input without calling the API', async () => {
    const result = await verifyCredential('nope');

    expect(result.state).toBe('invalid');
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('returns an error state on an unexpected server failure', async () => {
    apiGet.mockRejectedValue(
      Object.assign(new AxiosError('Server Error'), { response: { status: 500, data: {}, headers: {}, config: {} } }),
    );

    const result = await verifyCredential('00000000-0000-4000-8000-000000000000');

    expect(result.state).toBe('error');
  });
});
