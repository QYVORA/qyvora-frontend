import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StudentDesktopTopbar from '../StudentDesktopTopbar';

const auth = vi.hoisted(() => ({
  user: { username: 'operator', email: 'operator@example.com', cp: 420, rank: 'Operator' },
  logout: vi.fn(),
}));

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => auth,
}));

vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn(), clearToasts: vi.fn() }),
}));

vi.mock('@/core/contexts/ThemeContext', () => ({
  LIGHT_THEME_ENABLED: false,
  useThemeContext: () => ({ mode: 'dark', toggleTheme: vi.fn() }),
}));

const api = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('@/core/services/api', () => ({ default: api }));

vi.mock('@/shared/hooks/useFullscreen', () => ({
  useFullscreen: () => ({ isFullscreen: false, toggleFullscreen: vi.fn() }),
}));

vi.mock('@/features/student/hooks/useStudentOverview', () => ({
  default: () => ({ data: { xpSummary: { streakDays: 12, progression: { rank: 'Operator' } } } }),
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
  it('renders the logo, breadcrumb and five primary destinations', () => {
    renderTopbar();

    expect(screen.getByRole('link', { name: /QYVORA dashboard/i })).toHaveAttribute('href', '/dashboard');
    const nav = within(screen.getByRole('navigation', { name: 'Primary' }));
    expect(nav.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(nav.getByRole('link', { name: 'Labs' })).toHaveAttribute('href', '/dashboard/labs');
    expect(screen.getByRole('button', { name: /Practice/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Certificates/i })).toHaveAttribute('href', '/dashboard/certificates');
    expect(screen.getByRole('button', { name: /Develop/i })).toBeInTheDocument();
  });

  it('keeps the streak, fullscreen, notifications and profile inside the account menu', async () => {
    const user = userEvent.setup();
    renderTopbar();

    expect(screen.getByRole('button', { name: /Search Labs/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Current streak/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Account menu/i }));

    expect(screen.getByText('Day streak')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Enter fullscreen/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Profile/i })).toHaveAttribute('href', '/dashboard/profile');
    expect(screen.getByRole('menuitem', { name: /Log out/i })).toBeInTheDocument();
  });

  it('opens inline lab search from the topbar button', async () => {
    const user = userEvent.setup();
    renderTopbar();

    await user.click(screen.getByRole('button', { name: /Search Labs/i }));

    expect(await screen.findByRole('combobox', { name: /Search Labs/i })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: /Labs/i })).toBeInTheDocument();
  });

  it('opens and closes the Develop menu for Network and Terminal', async () => {
    const user = userEvent.setup();
    renderTopbar();

    const develop = screen.getByRole('button', { name: /Develop/i });
    expect(develop).toHaveAttribute('aria-expanded', 'false');

    await user.click(develop);
    expect(develop).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: /Network/i })).toHaveAttribute('href', '/dashboard/networks');
    expect(screen.getByRole('menuitem', { name: /Terminal/i })).toHaveAttribute('href', '/dashboard/tools/terminal');

    await user.click(develop);
    expect(develop).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menuitem', { name: /Terminal/i })).not.toBeInTheDocument();
  });
});
