import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CoursePage from '../CoursePage';
import { COURSES } from '@/features/student/data/courses';

vi.mock('@/shared/components/SEO', () => ({
  default: () => null,
}));

vi.mock('@/shared/components/ScrollReveal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

const renderCoursePage = (courseId: string) =>
  render(
    <MemoryRouter initialEntries={[`/courses/${courseId}`]}>
      <Routes>
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('CoursePage', () => {
  it('renders a known course with its hero details', () => {
    renderCoursePage('linux-terminal-101');
    expect(screen.getByRole('heading', { name: 'Linux Terminal 101' })).toBeTruthy();
    expect(screen.getByText('70 min')).toBeTruthy();
    expect(screen.getByText('75 CP')).toBeTruthy();
    expect(screen.getByText('Beginner')).toBeTruthy();
  });

  it('links public course navigation to /register and /learn', () => {
    renderCoursePage('linux-terminal-101');
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/register');
    expect(hrefs).toContain('/learn');
  });

  it('renders the syllabus as lesson titles only', () => {
    renderCoursePage('networking-101');
    expect(screen.getByText('What is a Network?')).toBeTruthy();
    expect(screen.getByText('The OSI Model')).toBeTruthy();
    expect(screen.getAllByText(/What the course covers/i)).toBeTruthy();
  });

  it('resolves prerequisites to their course pages', () => {
    renderCoursePage('networking-101');
    const link = screen.getByRole('link', { name: /linux terminal 101/i });
    expect(link.getAttribute('href')).toBe('/courses/linux-terminal-101');
  });

  it('never leaks lesson bodies or quiz content', () => {
    renderCoursePage('networking-101');
    expect(screen.queryByText(/correctIndex/i)).toBeNull();
    expect(screen.queryByText(/Which port does SSH typically listen on\?/i)).toBeNull();
    expect(screen.queryByText(/Public IPs are faster/i)).toBeNull();
  });

  it('shows a real not-found state for unknown course ids', () => {
    renderCoursePage('not-a-real-course');
    expect(screen.getByRole('heading', { name: 'No such transmission' })).toBeTruthy();
    expect(screen.queryByText('Linux Terminal 101')).toBeNull();
  });

  it('serves every one of the 12 courses publicly without authentication', () => {
    expect(COURSES).toHaveLength(12);
    for (const course of COURSES) {
      renderCoursePage(course.id);
      expect(screen.getByRole('heading', { name: course.title })).toBeTruthy();
    }
  });
});