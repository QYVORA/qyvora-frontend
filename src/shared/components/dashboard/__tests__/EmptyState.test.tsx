import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '../EmptyState';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('EmptyState', () => {
  it('renders title', () => {
    render(
      <EmptyState icon={<span />} title="No items" />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState icon={<span data-testid="icon">star</span>} title="Empty" />,
      { wrapper: Wrapper },
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action button with onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <EmptyState
        icon={<span />}
        title="Nothing here"
        action={{ label: 'Create', onClick }}
      />,
      { wrapper: Wrapper },
    );

    await user.click(screen.getByText('Create'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders action as a link when to is provided', () => {
    render(
      <EmptyState
        icon={<span />}
        title="Empty"
        action={{ label: 'Go', to: '/dashboard' }}
      />,
      { wrapper: Wrapper },
    );

    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
