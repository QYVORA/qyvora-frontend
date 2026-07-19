import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LabCard from '../LabsPage/LabCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] || key,
    i18n: { language: 'en' },
  }),
}));

const translations: Record<string, string> = {
  'student.labs.labCard.start': 'Start',
};

const defaultProps = {
  id: 'privesc',
  title: 'Privilege Escalation',
  description: 'Escalate from user to root on a Linux system.',
  difficulty: 'advanced',
  cpReward: '150',
  route: '/dashboard/labs/privesc',
  accentColor: '#06B66F',
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <LabCard {...defaultProps} {...props} />
    </MemoryRouter>,
  );

describe('LabCard', () => {
  it('renders title', () => {
    renderCard();
    expect(screen.getByText('Privilege Escalation')).toBeTruthy();
  });

  it('renders description', () => {
    renderCard();
    expect(screen.getByText(/Escalate from user to root/)).toBeTruthy();
  });

  it('renders CP reward', () => {
    renderCard();
    expect(screen.getByText('150 CP')).toBeTruthy();
  });

  it('renders Start button', () => {
    renderCard();
    expect(screen.getByText('Start')).toBeTruthy();
  });

  it('links to the correct route', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/dashboard/labs/privesc');
  });

  it('does not render any illustrations or numbered backgrounds', () => {
    renderCard();
    const link = screen.getByRole('link');
    // No images
    expect(link.querySelector('img')).toBeNull();
    // No SVG icons
    expect(link.querySelector('svg')).toBeNull();
    // No numbered badges ("01", "02", etc.)
    expect(screen.queryByText('01')).toBeNull();
    // No radial-gradient backgrounds
    expect(link.querySelector('[style*="radial-gradient"]')).toBeNull();
    // No dot-map or grid backgrounds
    expect(link.querySelector('[style*="DotMap"]')).toBeNull();
  });
});
