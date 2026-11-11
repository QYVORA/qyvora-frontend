import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CornerDownLeft, FlaskConical, LayoutDashboard, Search, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import Input from '@/shared/components/ui/Input';
import { COURSES, ALL_LESSONS } from '@/features/student/data/courses';
import { HACKER_PROTOCOL_BOOTCAMP_ID } from '@/features/student/constants/bootcampIds';

type SearchKind = 'Page' | 'Lesson' | 'Lab' | 'Room';

interface SearchEntry {
  id: string;
  title: string;
  description: string;
  to: string;
  kind: SearchKind;
  keywords?: string;
  meta?: string;
}

const PAGE_ENTRIES: SearchEntry[] = [
  { id: 'page-dashboard', title: 'Dashboard', description: 'Your learning overview', to: '/dashboard', kind: 'Page' },
  { id: 'page-bootcamps', title: 'Bootcamps', description: 'Your bootcamp programme and rooms', to: '/dashboard/bootcamps', kind: 'Page' },
  { id: 'page-labs', title: 'Labs', description: 'Every learning experience on QYVORA', to: '/dashboard/labs', kind: 'Page' },
  { id: 'page-competitive', title: 'Competitive', description: 'CTFs, events, and rankings', to: '/dashboard/competitive', kind: 'Page' },
  { id: 'page-networks', title: 'Networks', description: 'Network visualizer and tooling', to: '/dashboard/networks', kind: 'Page' },
  { id: 'page-marketplace', title: 'Marketplace', description: 'Spend CP on tools and resources', to: '/dashboard/marketplace', kind: 'Page' },
  { id: 'page-certificates', title: 'Certificates', description: 'Your issued credentials', to: '/dashboard/certificates', kind: 'Page' },
  { id: 'page-notifications', title: 'Notifications', description: 'Account and platform updates', to: '/dashboard/notifications', kind: 'Page' },
  { id: 'page-settings', title: 'Settings', description: 'Profile, security, and preferences', to: '/dashboard/settings', kind: 'Page' },
  { id: 'page-profile', title: 'Profile', description: 'Your public operator profile', to: '/dashboard/profile', kind: 'Page' },
  { id: 'page-leaderboard', title: 'Leaderboard', description: 'Top operators by CP earned', to: '/leaderboard', kind: 'Page' },
  { id: 'page-cp', title: 'Cyber Coin', description: 'CP balance and transactions', to: '/cp', kind: 'Page' },
  { id: 'page-market', title: 'Zero-Day Market', description: 'Browse zero-day listings', to: '/zero-day-market', kind: 'Page' },
  { id: 'page-resources', title: 'Cheat sheets', description: 'Command references and framework sheets', to: '/resources', kind: 'Page' },
  { id: 'page-changelog', title: 'Tool changelog', description: 'Recent framework releases', to: '/changelog', kind: 'Page' },
  { id: 'page-hpb', title: 'Hacker Protocol Bootcamp', description: 'HPB programme details', to: '/hpb', kind: 'Page' },
  { id: 'page-qose', title: 'QOSE', description: 'QYVORA Offensive Security Expert programme', to: '/qose', kind: 'Page' },
  { id: 'page-terminal', title: 'Terminal tool', description: 'Full-screen simulated terminal', to: '/dashboard/tools/terminal', kind: 'Page' },
];

const LAB_ENTRIES: SearchEntry[] = [
  { id: 'lab-privesc', title: 'Privilege Escalation Lab', description: 'Escalate from a low-privilege shell', to: '/dashboard/labs/privesc', kind: 'Lab', keywords: 'privesc sudo suid' },
  { id: 'lab-passwords', title: 'Password Lab', description: 'Hashing, cracking, and credential attacks', to: '/dashboard/labs/passwords', kind: 'Lab', keywords: 'hashcat john brute force' },
  { id: 'lab-sqli', title: 'SQL Injection Lab', description: 'Union, blind, and error-based injection', to: '/dashboard/labs/sql-injection', kind: 'Lab', keywords: 'sqli database sqlmap' },
  { id: 'lab-osint', title: 'OSINT Lab', description: 'Open-source intelligence collection', to: '/dashboard/labs/osint', kind: 'Lab', keywords: 'recon whois dns metadata' },
  { id: 'lab-killchain', title: 'Kill Chain Lab', description: 'Walk the full attack lifecycle', to: '/dashboard/labs/kill-chain', kind: 'Lab', keywords: 'recon exploitation lateral movement' },
  { id: 'lab-access-control', title: 'Web Access Control Lab', description: 'IDOR and broken authorization', to: '/dashboard/labs/web-access-control', kind: 'Lab', keywords: 'idor authorization owasp' },
  { id: 'lab-api', title: 'API Security Lab', description: 'Test REST and GraphQL APIs', to: '/dashboard/labs/api-security', kind: 'Lab', keywords: 'api rest graphql jwt' },
  { id: 'lab-automation', title: 'Automation Lab', description: 'Script repeatable security workflows', to: '/dashboard/labs/automation', kind: 'Lab', keywords: 'python scripting' },
  { id: 'lab-methodology', title: 'Methodology Lab', description: 'Structure an engagement end to end', to: '/dashboard/labs/methodology', kind: 'Lab', keywords: 'pentest report scope' },
  { id: 'lab-network', title: 'Network Security Lab', description: 'Assess services and network paths', to: '/dashboard/labs/network-security', kind: 'Lab', keywords: 'nmap services pivoting' },
  { id: 'lab-wlan', title: 'Wireless Security Lab', description: 'WLAN discovery and attacks', to: '/dashboard/labs/wlan-security', kind: 'Lab', keywords: 'wifi wlan aircrack handshake' },
  { id: 'lab-ad-enum', title: 'AD Enumeration Lab', description: 'Enumerate Active Directory', to: '/dashboard/labs/ad-enum', kind: 'Lab', keywords: 'active directory ldap bloodhound' },
  { id: 'lab-attack-paths', title: 'Attack Paths Lab', description: 'Chain findings into an attack path', to: '/dashboard/labs/attack-paths', kind: 'Lab', keywords: 'privilege domain chain' },
];

const SEARCH_INDEX: SearchEntry[] = [
  ...PAGE_ENTRIES,
  ...COURSES.map((course) => ({
    id: `course-${course.id}`,
    title: course.title,
    description: course.description,
    to: `/dashboard/courses/${course.id}`,
    kind: 'Lab' as const,
    keywords: course.categoryId,
  })),
  ...COURSES.flatMap((course) =>
    (ALL_LESSONS[course.id] ?? course.lessons).map((lesson, index) => ({
      id: `lesson-${course.id}-${lesson.id}`,
      title: lesson.title,
      description: course.title,
      to: `/dashboard/courses/${course.id}?lesson=${index}`,
      kind: 'Lesson' as const,
      keywords: course.title,
    })),
  ),
  ...LAB_ENTRIES,
];

const KIND_ICON: Record<SearchKind, React.ComponentType<{ className?: string }>> = {
  Page: LayoutDashboard,
  Lesson: BookOpen,
  Lab: FlaskConical,
  Room: ShieldCheck,
};

interface StudentSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Command-palette style search for the student dashboard.
 * Searches pages, courses, individual lessons, and labs; supports keyboard
 * navigation and Cmd/Ctrl+K from anywhere in the dashboard shell.
 */
const StudentSearchDialog: React.FC<StudentSearchDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [roomEntries, setRoomEntries] = useState<SearchEntry[]>([]);
  const [roomLoadError, setRoomLoadError] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setRoomLoadError(false);

    void import('@/features/student/constants/bootcampConfig')
      .then(({ BOOTCAMP_CONFIG }) => {
        if (!active) return;
        setRoomEntries(
          BOOTCAMP_CONFIG.phases.flatMap((phase) =>
            phase.rooms.map((room) => ({
              id: `room-${phase.id}-${room.id}`,
              title: room.title,
              description: room.overview,
              to: `/dashboard/bootcamps/${HACKER_PROTOCOL_BOOTCAMP_ID}/phases/${phase.id}/rooms/${room.id}`,
              kind: 'Room' as const,
              keywords: `${phase.title} ${phase.codename} bootcamp room`,
              meta: `${phase.title} · ${room.estimatedMinutes} min`,
            })),
          ),
        );
        setRoomLoadError(false);
      })
      .catch(() => {
        if (active) setRoomLoadError(true);
      });

    return () => {
      active = false;
    };
  }, [open]);

  const searchableEntries = useMemo(
    () => [...SEARCH_INDEX, ...roomEntries],
    [roomEntries],
  );

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [...roomEntries, ...LAB_ENTRIES].slice(0, 12);
    const tokens = trimmed.split(/\s+/);

    return searchableEntries.map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${title} ${entry.description} ${entry.keywords ?? ''}`.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (!haystack.includes(token)) return null;
        if (title.startsWith(token)) score += 6;
        else if (title.includes(token)) score += 4;
        else score += 1;
      }
      return { entry, score };
    })
      .filter((result): result is { entry: SearchEntry; score: number } => result !== null)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 20)
      .map((result) => result.entry);
  }, [query, roomEntries, searchableEntries]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex > results.length - 1) setActiveIndex(Math.max(0, results.length - 1));
  }, [activeIndex, results.length]);

  const selectResult = (entry: SearchEntry) => {
    onOpenChange(false);
    navigate(entry.to);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      selectResult(results[activeIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Search learning experiences"
        description="Find a room, lab, lesson, or dashboard page."
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col gap-4">
          <Input
            ref={inputRef}
            type="search"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="Search rooms, labs, or lessons…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            icon={<Search className="h-4 w-4" aria-hidden="true" />}
            aria-label="Search the dashboard"
            aria-controls="student-search-results"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="type-meta text-text-muted" aria-live="polite">
              {query.trim()
                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                : 'Rooms and popular labs'}
            </p>
            <p className="type-meta hidden items-center gap-1 text-text-tertiary sm:flex">
              <kbd className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px]">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[10px]">
                K
              </kbd>
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-bg p-6 text-center">
              <p className="text-sm font-bold text-text-primary">No results</p>
              <p className="type-body-sm mt-1 text-text-secondary">
                {`Nothing matches “${query.trim()}”. Try a room, phase, or lab name.`}
              </p>
            </div>
          ) : (
            <ul
              id="student-search-results"
              className="grid max-h-[min(65vh,560px)] grid-cols-1 gap-3 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2"
              aria-label="Search results"
            >
              {results.map((entry, index) => {
                const Icon = KIND_ICON[entry.kind];
                const isActive = index === activeIndex;
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => selectResult(entry)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex min-h-32 w-full flex-col items-stretch gap-3 rounded-xl border p-4 text-left transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive
                          ? 'border-accent/50 bg-accent/10 shadow-sm'
                          : 'border-border-subtle bg-surface-raised hover:border-accent/40 hover:bg-bg'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-bg text-accent">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="type-meta uppercase tracking-wider text-text-tertiary">
                            {entry.kind}
                          </span>
                        </span>
                        {isActive && (
                          <CornerDownLeft className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block line-clamp-2 text-sm font-bold text-text-primary">
                          {entry.title}
                        </span>
                        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-text-muted">
                          {entry.description}
                        </span>
                      </span>
                      {entry.meta && (
                        <span className="mt-auto block truncate text-[11px] font-semibold text-accent">
                          {entry.meta}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {roomLoadError && (
            <p role="alert" className="type-meta text-danger">
              Room search could not load. Try again or browse Labs directly.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSearchDialog;
