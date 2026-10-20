import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuiterootPage from '../QuiterootPage';
import { QUITEROOT_OPEN_ROLES, QUITEROOT_ROLE_COUNT } from '@/features/marketing/content/quiterootData';

vi.mock('@/shared/components/SEO', () => ({
  default: () => null,
}));

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

const renderQuiteroot = (query = '') =>
  render(
    <MemoryRouter initialEntries={[`/quiteroot${query}`]}>
      <QuiterootPage />
    </MemoryRouter>,
  );

describe('QuiterootPage', () => {
  it('places the Tech Team member in their role', () => {
    renderQuiteroot('?team=tech');
    expect(screen.getByText('Abdul Rahman Peligah')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Abdul Rahman Peligah' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Junior Frontend Developer' })).toBeTruthy();
  });

  it('places both Security Team members with working profile links', () => {
    renderQuiteroot('?team=security');

    expect(screen.getByText('Peter Oriasotie')).toBeTruthy();
    expect(screen.getByText('Peace Chika Mgboji')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Senior Penetration Tester' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Junior Penetration Tester' })).toBeTruthy();

    const linkedin = screen.getByRole('link', { name: /Peace Chika Mgboji on linkedin/i });
    expect(linkedin.getAttribute('href')).toBe(
      'https://www.linkedin.com/in/peace-chika-mgboji-780468244',
    );
    expect(linkedin.getAttribute('rel')).toBe('noopener noreferrer');

    const github = screen.getByRole('link', { name: /Peace Chika Mgboji on github/i });
    expect(github.getAttribute('href')).toBe('https://github.com/verm-collab');
  });

  it('uses the site image fallback for a member with no supplied photograph', () => {
    renderQuiteroot('?team=security');

    expect(screen.getByRole('img', { name: 'Portrait of Peace Chika Mgboji' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Peace Chika Mgboji' })).toBeNull();

    expect(screen.getByRole('img', { name: 'Peter Oriasotie' })).toBeTruthy();
  });

  it('switches branches from the tab control', () => {
    renderQuiteroot('?team=tech');
    expect(screen.queryByText('Peace Chika Mgboji')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: /Security Team/i }));

    expect(screen.getByText('Peace Chika Mgboji')).toBeTruthy();
    expect(screen.queryByText('Abdul Rahman Peligah')).toBeNull();
  });

  it('derives roster counts from the data rather than hardcoding them', () => {
    renderQuiteroot('?team=security');

    expect(QUITEROOT_ROLE_COUNT).toBe(12);
    expect(QUITEROOT_OPEN_ROLES.length).toBe(8);

    // The header renders the role total straight from QUITEROOT_ROLE_COUNT.
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('keeps filled seats free of an application CTA while open seats stay applyable', () => {
    renderQuiteroot('?team=security');

    // Peter + Peace are in place; the remaining three Security roles stay open.
    expect(screen.getAllByText('In place').length).toBe(2);
    expect(screen.getAllByRole('link', { name: /^Apply —/i }).length).toBe(3);
    expect(screen.getByText('Not open to applicants')).toBeTruthy();
  });
});
