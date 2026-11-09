import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import StudentSearchDialog from '../StudentSearchDialog';

const CurrentPath = () => {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
};

const SearchHarness = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <StudentSearchDialog open={open} onOpenChange={setOpen} />
      <CurrentPath />
    </>
  );
};

describe('StudentSearchDialog', () => {
  it('searches configured bootcamp rooms and opens a room directly', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SearchHarness />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole('searchbox', { name: /Search the dashboard/i }), 'Introduction to Offensive Security');

    await user.click(
      await screen.findByRole('button', { name: /Introduction to Offensive Security/i }),
    );

    expect(screen.getByTestId('current-path')).toHaveTextContent(
      '/dashboard/bootcamps/bc_1775270338500/phases/phase1/rooms/room1',
    );
  });
});
