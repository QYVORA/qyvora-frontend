import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BookOpen, ShieldCheck } from 'lucide-react';
import SiteTopbar from '../SiteTopbar';

const items = [
  { key: 'home', label: 'Home', to: '/', icon: BookOpen },
  {
    key: 'practice',
    label: 'Practice',
    to: '/practice',
    icon: ShieldCheck,
    children: [
      { label: 'Labs', to: '/labs' },
      { label: 'Rooms', to: '/rooms' },
    ],
  },
];

const renderTopbar = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <SiteTopbar items={items} activeMatcher={(item, pathname) => item.to === pathname} />
    </MemoryRouter>,
  );

describe('SiteTopbar', () => {
  it('renders plain items and dropdown items', () => {
    renderTopbar();

    const nav = within(screen.getByRole('navigation', { name: 'Primary' }));
    expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(nav.getByRole('button', { name: /Practice/i })).toBeInTheDocument();
  });

  it('opens and closes a dropdown', async () => {
    const user = userEvent.setup();
    renderTopbar();

    const trigger = screen.getByRole('button', { name: /Practice/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Labs' })).toHaveAttribute('href', '/labs');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menuitem', { name: 'Labs' })).not.toBeInTheDocument();
  });

  it('calls the mobile menu trigger', async () => {
    const onMobileMenuOpen = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SiteTopbar
          items={items}
          activeMatcher={() => false}
          onMobileMenuOpen={onMobileMenuOpen}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Open menu/i }));
    expect(onMobileMenuOpen).toHaveBeenCalledTimes(1);
  });
});
