import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import TopbarSearch from '../TopbarSearch';

const CurrentPath = () => {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
};

const renderSearch = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <TopbarSearch />
      <CurrentPath />
    </MemoryRouter>,
  );

describe('TopbarSearch', () => {
  it('expands, searches real Labs, and opens the first result with Enter', async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole('button', { name: /Search Labs/i }));

    const input = screen.getByRole('combobox', { name: /Search Labs/i });
    expect(input).toHaveFocus();

    await user.type(input, 'sql injection');
    const options = await screen.findAllByRole('option', { name: /SQL Injection/i });
    expect(options.length).toBeGreaterThan(0);

    await user.keyboard('{Enter}');

    expect(screen.getByTestId('current-path')).toHaveTextContent('/dashboard/labs/sql-injection');
  });

  it('shows an empty state for queries with no matching Labs', async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole('button', { name: /Search Labs/i }));
    await user.type(screen.getByRole('combobox', { name: /Search Labs/i }), 'not-a-real-lab');

    expect(await screen.findByText(/No Labs found/i)).toBeInTheDocument();
  });

  it('closes with Escape and clears the query', async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole('button', { name: /Search Labs/i }));
    await user.type(screen.getByRole('combobox', { name: /Search Labs/i }), 'sql');
    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: /Search Labs/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
