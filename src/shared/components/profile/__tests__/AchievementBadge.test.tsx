import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementBadge from '../AchievementBadge';
import { COURSE_ACHIEVEMENTS } from '@/shared/constants/achievements';

describe('AchievementBadge', () => {
  const sample = COURSE_ACHIEVEMENTS[0];

  it('renders transparent badge button with accessible name', () => {
    render(<AchievementBadge achievement={sample} />);
    const btn = screen.getByRole('button', { name: new RegExp(sample.title, 'i') });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens details dialog on click/activation and closes on Escape', () => {
    render(<AchievementBadge achievement={sample} completionDate="2026-05-10" />);
    const btn = screen.getByRole('button', { name: new RegExp(sample.title, 'i') });

    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Earned Insignia')).toBeInTheDocument();

    // Close with Escape key
    fireEvent.keyDown(btn, { key: 'Escape', code: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
