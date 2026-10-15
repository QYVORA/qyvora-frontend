import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '@/core/services/api';
import { claimCredentials, credentialProgram, getUserCredentials } from '@/core/services/credentials';

const apiGet = vi.mocked(api.get);
const apiPost = vi.mocked(api.post);

const apiCredential = {
  credentialId: '550e8400-e29b-41d4-a716-446655440000',
  programName: 'QYVORA Offensive Security Engineer',
  completionDate: '2027-01-31T12:00:00Z',
  result: 'PASS',
  status: 'ACTIVE',
  verifyUrl: 'https://qyvora.org/verify/550e8400-e29b-41d4-a716-446655440000',
};

beforeEach(() => {
  apiGet.mockReset();
  apiPost.mockReset();
});

describe('credentialProgram', () => {
  it('maps Hacker Protocol programmes to HPB', () => {
    expect(credentialProgram('Hacker Protocol Bootcamp')).toBe('HPB');
    expect(credentialProgram('HPB')).toBe('HPB');
  });

  it('defaults everything else to QOSE', () => {
    expect(credentialProgram('QYVORA Offensive Security Engineer')).toBe('QOSE');
    expect(credentialProgram('')).toBe('QOSE');
  });
});

describe('getUserCredentials', () => {
  it('maps the API response to learner credentials', async () => {
    apiGet.mockResolvedValue({ data: { success: true, credentials: [apiCredential] } });

    const result = await getUserCredentials('user-1');

    expect(apiGet).toHaveBeenCalledWith('/credentials/user/user-1');
    expect(result).toHaveLength(1);
    expect(result[0].credentialId).toBe(apiCredential.credentialId);
    expect(result[0].status).toBe('ACTIVE');
    expect(result[0].result).toBe('PASS');
  });

  it('encodes the user id in the request path', async () => {
    apiGet.mockResolvedValue({ data: { success: true, credentials: [] } });

    await getUserCredentials('a/b c');

    expect(apiGet).toHaveBeenCalledWith('/credentials/user/a%2Fb%20c');
  });

  it('returns an empty list when the learner has no credentials', async () => {
    apiGet.mockResolvedValue({ data: { success: true, credentials: [] } });
    await expect(getUserCredentials('user-1')).resolves.toEqual([]);
  });

  it('drops malformed entries instead of surfacing them', async () => {
    apiGet.mockResolvedValue({
      data: { success: true, credentials: [apiCredential, { programName: 'no id' }, null] },
    });

    const result = await getUserCredentials('user-1');

    expect(result).toHaveLength(1);
  });

  it('throws when the service is unreachable so callers can show an error', async () => {
    apiGet.mockRejectedValue(new Error('Network Error'));
    await expect(getUserCredentials('user-1')).rejects.toThrow('Network Error');
  });
});

describe('claimCredentials', () => {
  it('calls the claim endpoint and returns the issued credentials', async () => {
    const claimed = {
      ...apiCredential,
      recipientName: 'Alex Chen',
      cohortIdentifier: 'Cohort 1 - Nov 2026',
    };
    apiPost.mockResolvedValue({ data: { success: true, credentials: [claimed] } });

    const result = await claimCredentials('HPB');

    expect(apiPost).toHaveBeenCalledWith('/credentials/claim', { program: 'HPB' });
    expect(result).toHaveLength(1);
    expect(result[0].recipientName).toBe('Alex Chen');
    expect(result[0].cohortIdentifier).toBe('Cohort 1 - Nov 2026');
  });

  it('omits the programme when none is provided (backend decides)', async () => {
    apiPost.mockResolvedValue({ data: { success: true, credentials: [] } });

    await claimCredentials();

    expect(apiPost).toHaveBeenCalledWith('/credentials/claim', {});
  });

  it('accepts a single credential in the response payload', async () => {
    apiPost.mockResolvedValue({ data: { success: true, credential: apiCredential } });

    const result = await claimCredentials('QOSE');

    expect(result).toHaveLength(1);
  });

  it('returns an empty array when the response contains no credentials', async () => {
    apiPost.mockResolvedValue({ data: { success: true } });

    await expect(claimCredentials('HPB')).resolves.toEqual([]);
  });

  it('drops malformed claimed entries and still resolves', async () => {
    apiPost.mockResolvedValue({
      data: {
        success: true,
        credentials: [{ programName: 'broken' }, apiCredential],
      },
    });

    const result = await claimCredentials('HPB');

    expect(result).toHaveLength(1);
  });

  it('propagates errors from the claim endpoint so the caller can surface them', async () => {
    apiPost.mockRejectedValue(new Error('Forbidden'));
    await expect(claimCredentials('HPB')).rejects.toThrow('Forbidden');
  });
});
