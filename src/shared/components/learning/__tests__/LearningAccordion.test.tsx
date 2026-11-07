import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearningAccordion } from '../LearningAccordion';
import type { LearningAccordionItem } from '../LearningAccordion';

const items: LearningAccordionItem[] = [
  { id: 'one', title: 'Recon', description: 'Recon description' },
  { id: 'two', title: 'Exploit', description: 'Exploit description' },
  { id: 'three', title: 'Report', description: 'Report description', locked: true },
];

describe('LearningAccordion', () => {
  it('opens the first item by default', () => {
    render(<LearningAccordion items={items} />);
    expect(screen.getByText('Recon description')).toBeInTheDocument();
    expect(screen.queryByText('Exploit description')).not.toBeInTheDocument();
  });

  it('opens one item at a time and closes the previous item', async () => {
    const user = userEvent.setup();
    render(<LearningAccordion items={items} />);

    await user.click(screen.getByRole('button', { name: /Exploit/i }));

    await waitFor(() => expect(screen.getByText('Exploit description')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Recon description')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Recon/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Exploit/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes an open item when its header is clicked again', async () => {
    const user = userEvent.setup();
    render(<LearningAccordion items={items} />);

    const header = screen.getByRole('button', { name: /Recon/i });
    await user.click(header);

    await waitFor(() => expect(screen.queryByText('Recon description')).not.toBeInTheDocument());
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });
});
