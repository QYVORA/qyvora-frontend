import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn() },
}));

import api from '@/core/services/api';
import { credentialProgram, getUserCredentials } from '@/core/services/credentials';

const apiGet = vi.mocked(api.get);

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
