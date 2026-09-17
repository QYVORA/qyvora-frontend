import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../Dialog';

const onConfirm = vi.fn();
const onOpenChange = vi.fn();

beforeEach(() => {
  onConfirm.mockReset();
  onOpenChange.mockReset();
});

describe('ConfirmDialog — destructive confirmation', () => {
  it('confirms by calling onConfirm and closing the dialog', async () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Delete user"
        description="This permanently removes the selected user."
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        onConfirm={onConfirm}
      />,
    );
    const user = userEvent.setup();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('cancels without confirming when the cancel button is chosen', async () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Delete user"
        description="This permanently removes the selected user."
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        onConfirm={onConfirm}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Keep' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('dismisses on Escape without triggering the destructive action', async () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Delete user"
        description="This permanently removes the selected user."
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        onConfirm={onConfirm}
      />,
    );
    const user = userEvent.setup();
    await user.keyboard('{Escape}');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});