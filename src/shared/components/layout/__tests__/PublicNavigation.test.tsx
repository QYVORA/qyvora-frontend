import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PublicNavigation from '../PublicNavigation';

const auth = vi.hoisted(() => ({
  user: null as null | { username: string; email: string; cp: number; rank: string },
  logout: vi.fn(),
}));

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => auth,
}));

vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn(), clearToasts: vi.fn() }),
}));

const renderNav = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PublicNavigation />
    </MemoryRouter>,
  );

beforeEach(() => {
  auth.user = null;
});

describe('PublicNavigation', () => {
  it('shows log in and get started for logged-out visitors, never a dashboard button', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/register');
    expect(screen.queryByRole('button', { name: /Dashboard/i })).not.toBeInTheDocument();
  });

  it('shows the avatar menu for logged-in visitors', async () => {
    auth.user = { username: 'operator', email: 'operator@example.com', cp: 420, rank: 'Operator' };
    const user = userEvent.setup();
    renderNav('/');

    await user.click(screen.getByRole('button', { name: /Account menu/i }));

    expect(screen.getByRole('menuitem', { name: /View profile/i })).toHaveAttribute('href', '/dashboard/profile');
    expect(screen.getByRole('menuitem', { name: /Dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('menuitem', { name: /Log out/i })).toBeInTheDocument();
  });

  it('shows the logo and signed-in identity in the full-screen public menu', async () => {
    auth.user = { username: 'operator', email: 'operator@example.com', cp: 420, rank: 'Operator' };
    const user = userEvent.setup();
    renderNav('/');

    await user.click(screen.getByRole('button', { name: /Open menu/i }));

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(within(dialog).getByRole('link', { name: /QYVORA home/i })).toHaveAttribute('href', '/');
    expect(within(dialog).getByRole('button', { name: /Learn/i })).toHaveClass('min-h-[64px]');
    expect(within(dialog).getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs');

    await user.click(within(dialog).getByRole('button', { name: /operator/i }));
    expect(within(dialog).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(within(dialog).getByRole('link', { name: 'View profile' })).toHaveAttribute('href', '/dashboard/profile');
    expect(within(dialog).getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('shows only the logo in the full-screen menu for logged-out visitors', async () => {
    const user = userEvent.setup();
    renderNav('/');

    await user.click(screen.getByRole('button', { name: /Open menu/i }));

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(within(dialog).getByRole('link', { name: /QYVORA home/i })).toHaveAttribute('href', '/');
    expect(within(dialog).queryByRole('button', { name: /operator/i })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument();
  });

  it('omits the dashboard item when already inside the dashboard', async () => {
    auth.user = { username: 'operator', email: 'operator@example.com', cp: 420, rank: 'Operator' };
    const user = userEvent.setup();
    renderNav('/dashboard');

    await user.click(screen.getByRole('button', { name: /Account menu/i }));

    expect(screen.getByRole('menuitem', { name: /View profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /^Dashboard$/i })).not.toBeInTheDocument();
  });
});
