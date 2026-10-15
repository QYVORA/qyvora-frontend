import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationList, { type NotificationListEntry } from '../NotificationList';

const unread: NotificationListEntry = {
  id: 'n1',
  title: 'New badge unlocked',
  message: 'You earned the Recon badge.',
  read: false,
  createdAt: '2026-01-01T10:00:00Z',
  type: 'cp_earned',
};

const read: NotificationListEntry = {
  id: 'n2',
  title: 'Payment confirmed',
  message: 'Your enrollment is active.',
  read: true,
  createdAt: '2025-12-31T10:00:00Z',
  type: 'payment_confirmed',
};

describe('NotificationList', () => {
  it('renders each notification title and message', () => {
    render(<NotificationList items={[unread, read]} />);

    expect(screen.getByText('New badge unlocked')).toBeInTheDocument();
    expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
    expect(screen.getByText('You earned the Recon badge.')).toBeInTheDocument();
  });

  it('renders the type label', () => {
    render(<NotificationList items={[unread]} />);
    expect(screen.getByText(/cp earned/i)).toBeInTheDocument();
  });

  it('marks an unread notification read when activated', () => {
    const onMarkRead = vi.fn();
    render(<NotificationList items={[unread, read]} onMarkRead={onMarkRead} />);

    const row = screen.getByRole('button', { name: /new badge unlocked - unread/i });
    row.click();

    expect(onMarkRead).toHaveBeenCalledWith('n1');
  });

  it('marks an unread notification read with the keyboard', () => {
    const onMarkRead = vi.fn();
    render(<NotificationList items={[unread]} onMarkRead={onMarkRead} />);

    const row = screen.getByRole('button', { name: /new badge unlocked - unread/i });
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onMarkRead).toHaveBeenCalledWith('n1');
  });

  it('does not make read notifications interactive', () => {
    render(<NotificationList items={[read]} onMarkRead={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /payment confirmed/i })).toBeNull();
  });

  it('renders skeleton rows while loading', () => {
    render(<NotificationList items={[unread]} loading />);
    expect(screen.queryByText('New badge unlocked')).toBeNull();
  });

  it('renders the empty state when there are no notifications', () => {
    render(<NotificationList items={[]} emptyTitle="Nothing here yet." />);
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });
});
