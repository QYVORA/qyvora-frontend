import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CoursePage from '../CoursePage';

vi.mock('@/shared/components/SEO', () => ({
  default: () => null,
}));

const renderCoursePage = (courseId: string) =>
  render(
    <MemoryRouter initialEntries={[`/courses/${courseId}`]}>
      <Routes>
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/dashboard/courses/:courseId" element={<div>Lab learning page</div>} />
        <Route path="/learn" element={<div>Learn labs</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('CoursePage legacy redirect', () => {
  it('forwards a known former course to its Lab learning route', () => {
    renderCoursePage('linux-terminal-101');
    expect(screen.getByText('Lab learning page')).toBeTruthy();
  });

  it('forwards an unknown id to the Labs tab', () => {
    renderCoursePage('not-a-real-course');
    expect(screen.getByText('Learn labs')).toBeTruthy();
  });
});
