import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardDeckSurface } from './CardDeckSurface';
import type { LearningBlock } from '../types/blocks';

vi.mock('@/shared/components/courses/CodeBlockRenderer', () => ({
  EducationalMarkdownRenderer: ({ text }: { text: string }) => <div data-testid="md">{text}</div>,
}));

const blocks: LearningBlock[] = [
  { type: 'text', id: 'c1', content: 'First card content.' },
  { type: 'text', id: 'c2', content: 'Second card content.' },
  { type: 'text', id: 'c3', content: 'Third card content.' },
];

function renderDeck(overrides: Partial<{ enabled: boolean; deckId: string }> = {}) {
  return render(
    <CardDeckSurface
      deckId={overrides.deckId ?? 'test-deck'}
      surface="course"
      sequenceId="seq"
      unitId="unit"
      blocks={blocks}
      enabled={overrides.enabled ?? true}
    />,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('CardDeckSurface', () => {
  it('renders the first card expanded with its type label', () => {
    renderDeck();
    expect(screen.getByText('First card content.')).toBeInTheDocument();
    expect(screen.getAllByText('Read').length).toBeGreaterThan(0);
    expect(screen.getByText('+10 XP')).toBeInTheDocument();
  });

  it('completes the active card and reveals an XP award on Next', async () => {
    renderDeck();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Complete card and continue/ }));

    // First card moves to the done row; the second becomes active.
    expect(await screen.findByText('Second card content.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Review Read card 1/ })).toBeInTheDocument();

    // Award flash appears in the status region.
    expect(await screen.findByRole('status', { name: 'XP awarded' })).toBeInTheDocument();
  });

  it('tracks deck progress as cards are cleared', async () => {
    renderDeck();
    const user = userEvent.setup();
    expect(screen.getByText('0/3·0%')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Complete card and continue/ }));
    expect(await screen.findByText('1/3·33%')).toBeInTheDocument();
  });

  it('does not award XP or persist when the deck is disabled (locked surface)', async () => {
    renderDeck({ enabled: false });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Complete card and continue/ }));
    expect(await screen.findByText('Second card content.')).toBeInTheDocument();
    expect(screen.getByText('0/3·0%')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Review Read card 1/ })).not.toBeInTheDocument();
    expect(window.localStorage.getItem('qv.deck.test-deck')).toBeNull();
  });

  it('persists a deck under its own storage key', async () => {
    renderDeck({ deckId: 'persist-deck' });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Complete card and continue/ }));
    await screen.findByText('Second card content.');
    const stored = JSON.parse(window.localStorage.getItem('qv.deck.persist-deck')!);
    expect(stored.done).toContain('c1');
  });
});