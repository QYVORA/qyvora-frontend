import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CertificateClaimBanner from '../CertificateClaimBanner';
import { getUserCredentials } from '@/core/services/credentials';
import type { LearnerCredential } from '@/core/services/credentials';

const auth = vi.hoisted(() => ({
  user: { uid: 'user-1', bootcampStatus: 'completed' } as {
    uid: string;
    bootcampStatus: string;
  } | null,
}));

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => ({ user: auth.user }),
}));

vi.mock('@/core/services/credentials', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/services/credentials')>();
  return { ...actual, getUserCredentials: vi.fn() };
});

const getUserCredentialsMock = vi.mocked(getUserCredentials);

const hpbCredential: LearnerCredential = {
  credentialId: 'b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01',
  programName: 'Hacker Protocol Bootcamp',
  completionDate: '2026-10-01T00:00:00Z',
  result: 'PASS',
  status: 'ACTIVE',
  verifyUrl: '',
};

const renderBanner = () =>
  render(
    <MemoryRouter>
      <CertificateClaimBanner />
    </MemoryRouter>,
  );

beforeEach(() => {
  auth.user = { uid: 'user-1', bootcampStatus: 'completed' };
  getUserCredentialsMock.mockReset();
});

describe('CertificateClaimBanner', () => {
  it('shows the claim prompt for a completed learner without an HPB credential', async () => {
    getUserCredentialsMock.mockResolvedValue([]);

    renderBanner();

    expect(
      await screen.findByRole('link', { name: /claim certificate/i }),
    ).toHaveAttribute('href', '/dashboard/certificates');
  });

  it('renders nothing once the learner already holds an HPB credential', async () => {
    getUserCredentialsMock.mockResolvedValue([hpbCredential]);

    renderBanner();

    await waitFor(() => expect(getUserCredentialsMock).toHaveBeenCalledWith('user-1'));
    expect(screen.queryByRole('link', { name: /claim certificate/i })).not.toBeInTheDocument();
  });

  it('does not prompt a learner who has not completed the bootcamp', () => {
    auth.user = { uid: 'user-1', bootcampStatus: 'in_progress' };

    renderBanner();

    expect(getUserCredentialsMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: /claim certificate/i })).not.toBeInTheDocument();
  });

  it('stays hidden when the credential service fails', async () => {
    getUserCredentialsMock.mockRejectedValue(new Error('Network Error'));

    renderBanner();

    await waitFor(() => expect(getUserCredentialsMock).toHaveBeenCalled());
    expect(screen.queryByRole('link', { name: /claim certificate/i })).not.toBeInTheDocument();
  });
});
