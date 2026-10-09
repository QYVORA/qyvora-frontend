import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CertificateCredentialRibbon from '../CertificateCredentialRibbon';

describe('CertificateCredentialRibbon', () => {
  it('renders a single vertical sash with a credential seal at its foot', () => {
    const { container } = render(<CertificateCredentialRibbon logo="/qose.png" label="QOSE" />);

    // Exactly one sash strip — the design forbids double ribbons, tails and folds.
    const sashes = screen.getAllByTestId('certificate-sash');
    expect(sashes).toHaveLength(1);
    expect(sashes[0].classList.contains('absolute')).toBe(true);
    expect(sashes[0].classList.contains('inset-0')).toBe(true);

    // One circular seal, holding the supplied badge artwork, overlapping the sash foot.
    const seal = screen.getByTestId('certificate-seal');
    expect(seal.classList.contains('rounded-full')).toBe(true);
    expect(seal.querySelector('img')?.getAttribute('src')).toBe('/qose.png');

    // Decorative credential element — hidden from assistive tech.
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders the optional vertical credential label', () => {
    render(<CertificateCredentialRibbon logo="/qose.png" label="QOSE" />);
    expect(screen.getByText('QOSE')).toBeInTheDocument();
  });

  it('omits the label when not provided', () => {
    render(<CertificateCredentialRibbon logo="/qose.png" />);
    expect(screen.queryByText('QOSE')).not.toBeInTheDocument();
  });
});