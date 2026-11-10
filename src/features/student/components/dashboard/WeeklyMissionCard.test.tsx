import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WeeklyMissionCard from './WeeklyMissionCard';

describe('WeeklyMissionCard request states', () => {
  it('shows a retryable error instead of presenting a failed request as an empty mission', () => {
    const onRetry = vi.fn();
    render(
      <MemoryRouter>
        <WeeklyMissionCard
          engagement={null}
          error={new Error('Request failed')}
          onRetry={onRetry}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('The mission could not be loaded');
    expect(screen.queryByText('No mission is available right now')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows the empty state only when the request completed without data or an error', () => {
    render(
      <MemoryRouter>
        <WeeklyMissionCard engagement={null} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/^No mission is available right now\./)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
