import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LearnPage from '../LearnPage';
import { LABS } from '@/features/student/constants/labs';
import { getLabBadgeImage } from '@/shared/learning/labBadges';

vi.mock('@/shared/components/SEO', () => ({
  default: () => null,
}));

vi.mock('@/shared/components/ScrollReveal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderLearn = (tab: string) =>
  render(
    <MemoryRouter initialEntries={[`/learn?tab=${tab}`]}>
      <LearnPage />
    </MemoryRouter>,
  );

describe('LearnPage lab cards', () => {
  it('never exposes a Courses tab or heading', () => {
    renderLearn('labs');
    expect(screen.queryByRole('tab', { name: /courses/i })).toBeNull();
    expect(screen.queryByRole('heading', { name: /courses/i })).toBeNull();
  });

  it('maps the legacy courses tab to labs', () => {
    renderLearn('courses');
    expect(screen.getByRole('tab', { name: /labs/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders every lab with its official badge artwork at the enlarged size', () => {
    renderLearn('labs');

    for (const lab of LABS) {
      const badge = screen.getByRole('img', { name: `${lab.title} badge` });
      const image = badge.querySelector('img');

      expect(image).toHaveAttribute('src', getLabBadgeImage(lab.id));
      expect(badge).toHaveClass('h-24', 'w-24');
    }
  });
});
