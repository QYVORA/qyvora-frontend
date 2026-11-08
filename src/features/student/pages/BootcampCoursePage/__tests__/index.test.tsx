import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BootcampCoursePage from '../index';

const api = vi.hoisted(() => ({
  get: vi.fn(),
}));

const overviewState = vi.hoisted(() => ({
  value: {} as Record<string, unknown>,
}));

vi.mock('@/core/services/api', () => ({ default: api }));

vi.mock('@/features/student/hooks/useStudentOverview', () => ({
  default: () => ({ data: overviewState.value, loading: false }),
}));

vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

vi.mock('@/shared/components/SEO', () => ({
  default: () => null,
}));

const course = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  modules: [
    {
      moduleId: 1,
      title: 'Hacker Mindset',
      description: '',
      codename: 'PHASE 1',
      roleTitle: '',
      badge: '',
      locked: false,
      rooms: [
        {
          roomId: 1,
          title: 'Introduction to Offensive Security',
          overview: 'Learn how offensive security works.',
          locked: false,
          completed: false,
        },
        {
          roomId: 2,
          title: 'The Hacker Mindset',
          overview: 'Adopt the mindset of an operator.',
          locked: false,
          completed: false,
        },
      ],
    },
    {
      moduleId: 2,
      title: 'Linux Foundations',
      description: '',
      codename: 'PHASE 2',
      roleTitle: '',
      badge: '',
      locked: false,
      rooms: [
        {
          roomId: 3,
          title: 'Linux Basics & Navigation',
          overview: 'Move around a Linux system.',
          locked: true,
          completed: false,
        },
      ],
    },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard/bootcamps/hpb']}>
      <Routes>
        <Route path="/dashboard/bootcamps/:bootcampId" element={<BootcampCoursePage />} />
      </Routes>
    </MemoryRouter>,
  );

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
  localStorage.clear();
  api.get.mockReset().mockResolvedValue({ data: course });
  overviewState.value = {
    bootcampStatus: 'enrolled',
    bootcampId: 'hpb',
    modules: [
      { moduleId: 1, progress: 0, roomsCompleted: 0 },
      { moduleId: 2, progress: 0, roomsCompleted: 0 },
    ],
  };
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('BootcampCoursePage', () => {
  it('renders every room as a task grouped by phase', async () => {
    renderPage();

    expect(await screen.findByText('Introduction to Offensive Security')).toBeInTheDocument();
    expect(screen.getByText('The Hacker Mindset')).toBeInTheDocument();
    expect(screen.getByText('Linux Basics & Navigation')).toBeInTheDocument();
    expect(screen.getAllByText(/PHASE 1 · Hacker Mindset/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PHASE 2 · Linux Foundations/).length).toBeGreaterThan(0);
  });

  it('continues to the first incomplete protected room', async () => {
    renderPage();

    expect(await screen.findByRole('link', { name: /Continue training/i })).toHaveAttribute(
      'href',
      '/dashboard/bootcamps/hpb/phases/phase1/rooms/room1',
    );
  });

  it('shows the enrolment gate instead of the task list when not enrolled', async () => {
    overviewState.value = { bootcampStatus: 'not_enrolled', modules: [] };
    renderPage();

    expect(await screen.findByText('Bootcamp access required')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View enrolment/i })).toHaveAttribute('href', '/qose');
    expect(screen.queryByText('Introduction to Offensive Security')).not.toBeInTheDocument();
  });
});
