import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardCollection, ViewToggle, type ViewMode } from '..';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const ITEMS = [{ id: 'a', name: 'Item A' }, { id: 'b', name: 'Item B' }];

const renderItem = (item: { id: string; name: string }) => (
  <div data-testid={`item-${item.id}`}>{item.name}</div>
);

describe('ViewToggle', () => {
  it('renders both view-mode buttons with the active one marked pressed', () => {
    render(<ViewToggle value="grid" onChange={vi.fn()} />);
    const grid = screen.getByRole('button', { name: /grid view/i });
    const expanded = screen.getByRole('button', { name: /list view/i });
    expect(grid).toHaveAttribute('aria-pressed', 'true');
    expect(expanded).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the new mode when switching', () => {
    const onChange = vi.fn();
    render(<ViewToggle value="grid" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /list view/i }));
    expect(onChange).toHaveBeenCalledWith('expanded');
  });
});

describe('CardCollection', () => {
  it('renders every item', () => {
    render(
      <CardCollection
        items={ITEMS}
        renderItem={renderItem}
        keyOf={(item) => item.id}
        view="grid"
      />,
    );
    expect(screen.getByText('Item A')).toBeTruthy();
    expect(screen.getByText('Item B')).toBeTruthy();
  });

  it('applies grid classes in grid mode and list classes in expanded mode', () => {
    const view: ViewMode = 'grid';
    const { container, rerender } = render(
      <CardCollection
        items={ITEMS}
        renderItem={renderItem}
        keyOf={(item) => item.id}
        view={view}
      />,
    );
    expect(container.querySelector('div')!.className).toMatch(/grid grid-cols-1/);

    rerender(
      <CardCollection
        items={ITEMS}
        renderItem={renderItem}
        keyOf={(item) => item.id}
        view="expanded"
      />,
    );
    expect(container.querySelector('div')!.className).toMatch(/flex flex-col/);
  });

  it('honours custom grid and expanded class overrides', () => {
    const view: ViewMode = 'grid';
    const { container, rerender } = render(
      <CardCollection
        items={ITEMS}
        renderItem={renderItem}
        keyOf={(item) => item.id}
        view={view}
        gridClassName="custom-grid"
      />,
    );
    expect(container.querySelector('div')!.className).toContain('custom-grid');

    rerender(
      <CardCollection
        items={ITEMS}
        renderItem={renderItem}
        keyOf={(item) => item.id}
        view="expanded"
        expandedClassName="custom-expanded"
      />,
    );
    expect(container.querySelector('div')!.className).toContain('custom-expanded');
  });
});
