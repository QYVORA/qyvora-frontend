import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

function Consumer() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast('It worked', 'success')}>Success</button>
      <button onClick={() => addToast('Oh no', 'error')}>Error</button>
      <button onClick={() => addToast('FYI', 'info')}>Info</button>
    </div>
  );
}

describe('ToastContext', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <div>Inner content</div>
      </ToastProvider>,
    );

    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });

  it('addToast adds a toast with the correct message', async () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Success'));
    });
    expect(screen.getByText('It worked')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Error'));
    });
    expect(screen.getByText('Oh no')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Info'));
    });
    expect(screen.getByText('FYI')).toBeInTheDocument();
  });

  it('removeToast removes a toast when dismiss is clicked', async () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Success'));
    });
    expect(screen.getByText('It worked')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Dismiss'));
    });

    await waitFor(() => {
      expect(screen.queryByText('It worked')).not.toBeInTheDocument();
    });
  });

  it('toasts auto-dismiss after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Success'));
    });
    expect(screen.getByText('It worked')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(screen.queryByText('It worked')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('throws when useToast is used outside ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      'useToast must be used within a ToastProvider',
    );

    spy.mockRestore();
  });
});
