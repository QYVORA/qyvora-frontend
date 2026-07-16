import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScenarioCard from '../ScenarioCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const defaultProps = {
  title: 'Buffer Overflow',
  difficulty: 'advanced',
  description: 'Exploit a vulnerable server with stack-based overflow.',
  cpReward: 100,
  subtitle: 'Stack exploitation',
  onStart: vi.fn(),
};

const renderCard = (props = {}) =>
  render(<ScenarioCard {...defaultProps} {...props} />);

describe('ScenarioCard', () => {
  it('renders title', () => {
    renderCard();
    expect(screen.getByText('Buffer Overflow')).toBeTruthy();
  });

  it('renders description', () => {
    renderCard();
    expect(screen.getByText(/Exploit a vulnerable server/)).toBeTruthy();
  });

  it('renders difficulty badge', () => {
    renderCard();
    expect(screen.getByText('advanced')).toBeTruthy();
  });

  it('renders cpReward', () => {
    renderCard();
    expect(screen.getByText('100 CP')).toBeTruthy();
  });

  it('renders optional subtitle', () => {
    renderCard();
    expect(screen.getByText('Stack exploitation')).toBeTruthy();
  });

  it('does not render subtitle when not provided', () => {
    renderCard({ subtitle: undefined });
    expect(screen.queryByText('Stack exploitation')).toBeNull();
  });

  it('renders Start button', () => {
    renderCard();
    expect(screen.getByText('Start')).toBeTruthy();
  });

  it('calls onStart when clicked', () => {
    const onStart = vi.fn();
    renderCard({ onStart });
    fireEvent.click(screen.getByText('Start'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('does not accept index prop (removed)', () => {
    const { container } = render(
      <ScenarioCard
        {...defaultProps}
        // @ts-expect-error — index was removed
        index={3}
        accentColor="#FF0000"
      />,
    );
    // Should render without error, index/accentColor are simply ignored
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('does not render numbered background (illustration removed)', () => {
    renderCard();
    // No large "01", "02" etc. text should appear
    expect(screen.queryByText('01')).toBeNull();
    expect(screen.queryByText('02')).toBeNull();
    // No radial-gradient background (the old colored header)
    const btn = screen.getByRole('button');
    expect(btn.querySelector('[style*="radial-gradient"]')).toBeNull();
  });

  it('renders beginner difficulty with default style', () => {
    renderCard({ difficulty: 'beginner' });
    const badge = screen.getByText('beginner');
    expect(badge.className).toContain('green');
  });

  it('renders intermediate difficulty with yellow style', () => {
    renderCard({ difficulty: 'intermediate' });
    const badge = screen.getByText('intermediate');
    expect(badge.className).toContain('yellow');
  });

  it('renders advanced difficulty with red style', () => {
    renderCard({ difficulty: 'advanced' });
    const badge = screen.getByText('advanced');
    expect(badge.className).toContain('red');
  });

  it('falls back to beginner style for unknown difficulty', () => {
    renderCard({ difficulty: 'unknown' });
    const badge = screen.getByText('unknown');
    expect(badge.className).toContain('green');
  });

  it('renders string cpReward', () => {
    renderCard({ cpReward: '50' });
    expect(screen.getByText('50 CP')).toBeTruthy();
  });
});
