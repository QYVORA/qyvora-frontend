import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearningTaskAccordion } from '../LearningTaskAccordion';
import type { LearningTask } from '../LearningTaskAccordion';

const tasks: LearningTask[] = [
  { id: 'task-1', title: 'Reconnaissance', content: <p>Recon content</p> },
  { id: 'task-2', title: 'Exploitation', completed: true, content: <p>Exploit content</p> },
  {
    id: 'task-3',
    title: 'Reporting',
    locked: true,
    lockedMessage: 'Finish exploitation first.',
    content: <p>Report content</p>,
  },
];

function renderAccordion(activeId?: string) {
  return render(<LearningTaskAccordion tasks={tasks} activeId={activeId} />);
}

describe('LearningTaskAccordion', () => {
  beforeEach(() => {
    window.location.hash = '';
    Element.prototype.scrollIntoView = () => {};
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  });

  it('opens the first task by default', () => {
    renderAccordion();
    expect(screen.getByText('Recon content')).toBeInTheDocument();
    expect(screen.queryByText('Exploit content')).not.toBeInTheDocument();
  });

  it('opens one task at a time when a header is clicked', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByRole('button', { name: /Exploitation/i }));

    await waitFor(() => expect(screen.getByText('Exploit content')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Recon content')).not.toBeInTheDocument());
  });

  it('does not open locked tasks and explains why', async () => {
    const user = userEvent.setup();
    renderAccordion();

    const locked = screen.getByRole('button', { name: /Reporting/i });
    expect(locked).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Finish exploitation first.')).toBeInTheDocument();

    await user.click(locked);
    expect(screen.queryByText('Report content')).not.toBeInTheDocument();
  });

  it('opens the task referenced by the URL hash', async () => {
    window.location.hash = '#task-2';
    renderAccordion();

    await waitFor(() => expect(screen.getByText('Exploit content')).toBeInTheDocument());
  });
});
