import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CertificatesModule from '../CertificatesModule';
import type { LearnerCredential } from '@/core/services/credentials';

const credential: LearnerCredential = {
  credentialId: '550e8400-e29b-41d4-a716-446655440000',
  programName: 'QYVORA Offensive Security Engineer',
  completionDate: '2027-01-31T12:00:00Z',
  result: 'PASS',
  status: 'ACTIVE',
  verifyUrl: 'https://qyvora.org/verify/550e8400-e29b-41d4-a716-446655440000',
};

const renderModule = (props: Partial<React.ComponentProps<typeof CertificatesModule>> = {}) =>
  render(
    <MemoryRouter>
      <CertificatesModule credentials={[]} {...props} />
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
});

describe('CertificatesModule', () => {
  it('renders each credential with a link to its verification page', () => {
    renderModule({ credentials: [credential] });

    expect(screen.getByText(/offensive security engineer/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /verify/i })).toHaveAttribute(
      'href',
      `/verify/${credential.credentialId}`,
    );
  });

  it('shares a credential by copying its verification URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderModule({ credentials: [credential] });
    screen.getByRole('button', { name: /copy verification link/i }).click();

    expect(writeText).toHaveBeenCalledWith(credential.verifyUrl);
  });

  it('shows an empty state when no credentials have been issued', () => {
    renderModule({ credentials: [] });
    expect(screen.getByText(/no certificates yet/i)).toBeInTheDocument();
  });

  it('shows an error state instead of implying the learner has none', () => {
    renderModule({ credentials: [], error: true });
    expect(screen.getByText(/could not load your certificates/i)).toBeInTheDocument();
  });

  it('shows a loading state while the request is in flight', () => {
    renderModule({ credentials: [], loading: true });
    expect(screen.getByText(/loading certificates/i)).toBeInTheDocument();
  });
});
