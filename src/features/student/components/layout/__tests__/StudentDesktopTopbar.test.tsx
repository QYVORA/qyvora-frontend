import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StudentDesktopTopbar from '../StudentDesktopTopbar';

const auth = vi.hoisted(() => ({
  user: { username: 'operator', email: 'operator@example.com' },
}));

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => auth,
}));

const api = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('@/core/services/api', () => ({ default: api }));

vi.mock('@/shared/hooks/useFullscreen', () => ({
  useFullscreen: () => ({ isFullscreen: false, toggleFullscreen: vi.fn() }),
}));

const renderTopbar = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <StudentDesktopTopbar />
    </MemoryRouter>,
  );

beforeEach(() => {
  api.get.mockReset().mockResolvedValue({ data: [] });
});

describe('StudentDesktopTopbar', () => {
  it('renders the five compact primary destinations without a dashboard logo', () => {
    renderTopbar();

    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /Learn/i })).toHaveAttribute('href', '/dashboard/courses');
    expect(screen.getByRole('button', { name: /Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Complete/i })).toHaveAttribute('href', '/dashboard/certificates');
    expect(screen.getByRole('button', { name: /Develop/i })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /QYVORA/i })).not.toBeInTheDocument();
  });

  it('keeps only fullscreen, notifications and profile in the utility cluster', () => {
    renderTopbar();

    expect(screen.getByRole('button', { name: /Enter fullscreen/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Profile/i })).toHaveAttribute('href', '/dashboard/profile');
    expect(screen.queryByRole('button', { name: /Search/i })).not.toBeInTheDocument();
  });

  it('opens and closes the Develop menu for Network and Terminal', async () => {
    const user = userEvent.setup();
    renderTopbar();

    const develop = screen.getByRole('button', { name: /Develop/i });
    expect(develop).toHaveAttribute('aria-expanded', 'false');

    await user.click(develop);
    expect(develop).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Network/i })).toHaveAttribute('href', '/dashboard/networks');
    expect(screen.getByRole('link', { name: /Terminal/i })).toHaveAttribute('href', '/dashboard/tools/terminal');

    await user.click(develop);
    expect(develop).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: /Terminal/i })).not.toBeInTheDocument();
  });
});
