import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CertificatesPage from '../index';
import {
  claimCredentials,
  getUserCredentials,
} from '@/core/services/credentials';
import type { LearnerCredential } from '@/core/services/credentials';

const auth = vi.hoisted(() => ({
  user: { uid: 'user-1', username: 'operator', bootcampStatus: 'completed' } as {
    uid: string;
    username: string;
    bootcampStatus: string;
  } | null,
}));

const toast = vi.hoisted(() => ({ addToast: vi.fn() }));

vi.mock('@/core/contexts/AuthContext', () => ({ useAuth: () => ({ user: auth.user }) }));
vi.mock('@/core/contexts/ToastContext', () => ({ useToast: () => ({ addToast: toast.addToast }) }));
vi.mock('@/shared/hooks/useProfile', () => ({
  useProfile: () => ({ profile: { displayName: 'Alex Chen' }, loading: false }),
}));
vi.mock('@/shared/components/SEO', () => ({ default: () => null }));
vi.mock('@/shared/components/certificates/CertificateFrame', () => ({
  default: ({ data }: { data: { credentialId: string } }) => (
    <div data-testid="cert-frame">{data.credentialId}</div>
  ),
  CERTIFICATE_PRINT_EVENT: 'qy:certificate-print',
}));
vi.mock('@/core/services/credentials', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/services/credentials')>();
  return { ...actual, getUserCredentials: vi.fn(), claimCredentials: vi.fn() };
});

const getUserCredentialsMock = vi.mocked(getUserCredentials);
const claimCredentialsMock = vi.mocked(claimCredentials);

const hpbCredential: LearnerCredential = {
  credentialId: 'b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01',
  programName: 'Hacker Protocol Bootcamp',
  completionDate: '2026-10-01T00:00:00Z',
  result: 'PASS',
  status: 'ACTIVE',
  verifyUrl: '',
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <CertificatesPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  auth.user = { uid: 'user-1', username: 'operator', bootcampStatus: 'completed' };
  getUserCredentialsMock.mockReset();
  claimCredentialsMock.mockReset();
  toast.addToast.mockReset();
});

describe('CertificatesPage', () => {
  it('lists the learner credentials with a verification link', async () => {
    getUserCredentialsMock.mockResolvedValue([hpbCredential]);

    renderPage();

    expect(await screen.findByText(/hacker protocol bootcamp/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /verify/i })).toHaveAttribute(
      'href',
      `/verify/${hpbCredential.credentialId}`,
    );
  });

  it('offers a claim action to a completed learner without an HPB credential', async () => {
    getUserCredentialsMock.mockResolvedValue([]);

    renderPage();

    expect(await screen.findByRole('button', { name: /claim certificate/i })).toBeInTheDocument();
  });

  it('claims the HPB credential and reveals it in the certificate dialog', async () => {
    const user = userEvent.setup();
    getUserCredentialsMock.mockResolvedValueOnce([]).mockResolvedValueOnce([hpbCredential]);
    claimCredentialsMock.mockResolvedValue([hpbCredential]);

    renderPage();

    await user.click(await screen.findByRole('button', { name: /claim certificate/i }));

    expect(claimCredentialsMock).toHaveBeenCalledWith('HPB');
    await waitFor(() => expect(getUserCredentialsMock).toHaveBeenCalledTimes(2));
    expect(await screen.findByTestId('cert-frame')).toHaveTextContent(hpbCredential.credentialId);
  });

  it('surfaces a claim failure without pretending it succeeded', async () => {
    const user = userEvent.setup();
    getUserCredentialsMock.mockResolvedValue([]);
    claimCredentialsMock.mockRejectedValue(new Error('Forbidden'));

    renderPage();

    await user.click(await screen.findByRole('button', { name: /claim certificate/i }));

    await waitFor(() =>
      expect(toast.addToast).toHaveBeenCalledWith(
        expect.stringMatching(/could not claim/i),
        'error',
      ),
    );
  });

  it('shows an error state when credentials cannot be loaded', async () => {
    getUserCredentialsMock.mockRejectedValue(new Error('Network Error'));

    renderPage();

    expect(await screen.findByText(/could not load certificates/i)).toBeInTheDocument();
  });
});
