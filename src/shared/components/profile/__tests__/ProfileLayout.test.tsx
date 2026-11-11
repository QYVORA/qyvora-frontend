import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileBanner from '../ProfileBanner';
import ProfileIdentityBlock from '../ProfileIdentityBlock';
import ProfileMetricsStrip from '../ProfileMetricsStrip';

describe('profile composition (Phase J)', () => {
  it('renders the banner with a half-overlapping avatar and reserves room for it', () => {
    const { container } = render(<ProfileBanner handle="neo" />);
    const banner = screen.getByTestId('profile-banner');
    expect(banner).toHaveClass('profile-banner');
    const avatar = container.querySelector('[role="img"]');
    expect(avatar).toBeInTheDocument();
    expect(avatar?.parentElement).toHaveClass('translate-y-1/2');
    expect(avatar).toHaveClass('rounded-full');
  });

  it('keeps the identity block borderless and avatar-free', () => {
    const { container } = render(
      <MemoryRouter>
        <ProfileIdentityBlock id="1" handle="neo" name="Neo" bio="Operator" showShare />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Neo' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).not.toMatch(/border|bg-surface|rounded/);
  });

  it('renders the five-cell metric strip without a section heading', () => {
    render(
      <ProfileMetricsStrip
        metrics={[
          { value: '1', label: 'CP' },
          { value: '2', label: 'Rank' },
          { value: '3', label: 'Labs' },
          { value: '4', label: 'Level' },
          { value: '5', label: 'Since' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Profile statistics')).toBeInTheDocument();
    expect(screen.getAllByRole('term')).toHaveLength(5);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
