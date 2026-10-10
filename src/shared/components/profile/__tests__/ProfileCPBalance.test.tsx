import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileCPBalance from '../ProfileCPBalance';

describe('ProfileCPBalance', () => {
  it('renders numeric CP value formatted with comma grouping', () => {
    render(<ProfileCPBalance cp={12500} />);
    expect(screen.getByText('12,500')).toBeInTheDocument();
    expect(screen.getByText('CP')).toBeInTheDocument();
  });

  it('renders 0 when cp is 0 or undefined', () => {
    render(<ProfileCPBalance cp={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
