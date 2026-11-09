import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import LabsPage from './index';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  addToast: vi.fn(),
}));

vi.mock('@/core/services/api', () => ({ default: { get: mocks.get } }));
vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast: mocks.addToast }),
}));
vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'student-1' } }),
}));
vi.mock('@/features/student/constants/bootcampConfig', () => ({
  BOOTCAMP_CONFIG: {
    id: 'hpb',
    title: 'Hacker Protocol Bootcamp',
    phases: [
      {
        id: 'phase1',
        title: 'Hacker Mindset',
        codename: 'PHASE 1',
        rooms: [
          {
            id: 'room1',
            title: 'Introduction to Offensive Security',
            overview: 'Learn the fundamentals.',
            estimatedMinutes: 20,
            steps: [{ title: 'Start', instruction: 'Begin here.', image: null }],
          },
        ],
      },
    ],
  },
}));

const LocationPath = () => {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
};

const renderCatalogue = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard/labs']}>
      <Routes>
        <Route path="/dashboard/labs" element={<LabsPage />} />
        <Route path="*" element={<LocationPath />} />
      </Routes>
    </MemoryRouter>,
  );

describe('LabsPage direct learning cards', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.get.mockReset().mockResolvedValue({
      data: {
        modules: [
          {
            moduleId: 1,
            locked: false,
            rooms: [
              {
                title: 'Introduction to Offensive Security',
                locked: false,
                completed: false,
                cpReward: 250,
              },
            ],
          },
        ],
      },
    });
    mocks.addToast.mockReset();
  });

  it.each([
    ['a former course', 'Linux Terminal 101', '/dashboard/courses/linux-terminal-101'],
    ['a practical Lab', 'Privilege Escalation', '/dashboard/labs/privesc'],
    [
      'a bootcamp room',
      'Introduction to Offensive Security',
      '/dashboard/bootcamps/bc_1775270338500/phases/phase1/rooms/room1',
    ],
  ])('opens %s from its catalogue card', async (_kind, title, expectedPath) => {
    const user = userEvent.setup();
    renderCatalogue();

    await user.click(await screen.findByRole('heading', { name: title }));

    expect(await screen.findByTestId('current-path')).toHaveTextContent(expectedPath);
  });
});
