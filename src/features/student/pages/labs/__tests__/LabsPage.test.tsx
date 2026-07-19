import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LabsPage from '../LabsPage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => translations[key] || key,
    i18n: { language: 'en' },
  }),
}));

const translations: Record<string, string> = {
  'student.labs.title': 'Attack Labs',
  'student.labs.list.privesc.title': 'Privilege Escalation',
  'student.labs.list.passwords.title': 'Password Cracking',
  'student.labs.list.webapp.title': 'Web Exploitation',
  'student.labs.list.sqli.title': 'SQL Injection',
  'student.labs.list.phishing.title': 'Phishing Analysis',
  'student.labs.list.proxy.title': 'Web Proxy',
  'student.labs.list.traffic.title': 'Traffic Analysis',
  'student.labs.list.osint.title': 'OSINT Recon',
  'student.labs.list.wireless.title': 'Wireless Security',
  'student.labs.list.killchain.title': 'Kill Chain',
  'student.labs.filter.all': 'All',
  'student.labs.search.placeholder': 'Search labs...',
};

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

const renderLabsPage = () =>
  render(
    <MemoryRouter>
      <LabsPage />
    </MemoryRouter>,
  );

describe('LabsPage', () => {
  it('renders the page title', () => {
    renderLabsPage();
    expect(screen.getByText('Attack Labs')).toBeTruthy();
  });

  it('renders all 10 lab cards', () => {
    renderLabsPage();
    expect(screen.getByText('Privilege Escalation')).toBeTruthy();
    expect(screen.getByText('Password Cracking')).toBeTruthy();
    expect(screen.getByText('SQL Injection')).toBeTruthy();
    expect(screen.getByText('Phishing Analysis')).toBeTruthy();
    expect(screen.getByText('Web Proxy')).toBeTruthy();
    expect(screen.getByText('Traffic Analysis')).toBeTruthy();
    expect(screen.getByText('OSINT Recon')).toBeTruthy();
    expect(screen.getByText('Wireless Security')).toBeTruthy();
    expect(screen.getByText('Kill Chain')).toBeTruthy();
    expect(screen.getAllByText('Web Exploitation').length).toBeGreaterThanOrEqual(1);
  });

  it('each lab card links to the correct route', () => {
    renderLabsPage();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/dashboard/labs/privesc');
    expect(hrefs).toContain('/dashboard/labs/passwords');
    expect(hrefs).toContain('/dashboard/labs/web-exploitation');
    expect(hrefs).toContain('/dashboard/labs/sql-injection');
    expect(hrefs).toContain('/dashboard/labs/phishing');
    expect(hrefs).toContain('/dashboard/labs/proxy');
    expect(hrefs).toContain('/dashboard/labs/traffic');
    expect(hrefs).toContain('/dashboard/labs/osint');
    expect(hrefs).toContain('/dashboard/labs/wireless');
    expect(hrefs).toContain('/dashboard/labs/kill-chain');
  });

  it('does not render the simulated environment banner', () => {
    renderLabsPage();
    expect(screen.queryByText(/simulated environment/i)).toBeNull();
  });
});
