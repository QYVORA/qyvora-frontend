import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CertificateRenderer from '../CertificateRenderer';

const data = {
  recipientName: 'Jane Doe',
  programName: 'Hacker Protocol Bootcamp',
  cohortIdentifier: 'Cohort 1 - Nov 2026',
  completionDate: '2026-01-31T12:00:00.000Z',
  credentialId: 'cred-123',
};

describe('CertificateRenderer — legibility', () => {
  // The certificate is a light "paper" artifact. Its theme text tokens must be
  // redirected to fixed dark ink, otherwise the dark theme's near-white text
  // renders invisibly on the light surface (white on white).
  it('overrides the text tokens with fixed dark ink on the certificate root', () => {
    const { container } = render(<CertificateRenderer data={data} config={{ program: 'HPB' }} />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.getPropertyValue('--color-text-primary')).toBe('#161C15');
    expect(root.style.getPropertyValue('--color-text-secondary')).toBe('rgba(22, 28, 21, 0.82)');
    expect(root.style.getPropertyValue('--color-text-muted')).toBe('rgba(22, 28, 21, 0.62)');
  });

  it('renders the recipient name and programme', () => {
    render(<CertificateRenderer data={data} config={{ program: 'HPB' }} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getAllByText(/Hacker Protocol Bootcamp/i).length).toBeGreaterThan(0);
  });
});
