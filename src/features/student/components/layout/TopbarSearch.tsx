import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import Input from '@/shared/components/ui/Input';
import Skeleton from '@/shared/components/ui/Skeleton';
import type { UnifiedLab } from '@/features/student/data/labs';
import { cn } from '@/shared/utils/cn';
import LabSearchResultRow from './search/LabSearchResultRow';
import { useLabSearch } from './search/useLabSearch';

const isDesktopViewport = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(min-width: 1024px)').matches;

/**
 * Expandable desktop Lab search.
 *
 * Collapsed: a single icon in the topbar. Expanded: an inline input with a
 * floating result panel. No modal — the topbar keeps its own chrome and the
 * page underneath stays visible.
 */
const TopbarSearch = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { results, isLoading, error, retry, isStale } = useLabSearch(query, open);
  const waiting = (isLoading || isStale) && results.length === 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const selectResult = (lab: UnifiedLab) => {
    close();
    navigate(lab.route);
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex > results.length - 1) {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  }, [activeIndex, results.length]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, close]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (!isDesktopViewport()) return;
      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

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
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  const activeOptionId = results[activeIndex]
    ? `topbar-lab-option-${activeIndex}`
    : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] motion-reduce:transition-none',
        open ? 'w-[clamp(15rem,26vw,23rem)]' : 'w-12',
      )}
    >
      {open ? (
        <Input
          ref={inputRef}
          type="search"
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-label="Search Labs"
          aria-expanded={open}
          aria-controls="topbar-lab-search-results"
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          placeholder="Search Labs…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          icon={<Search className="h-4 w-4" aria-hidden="true" />}
          className="h-12 min-h-12 rounded-md bg-canvas"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search Labs"
          aria-expanded={false}
          aria-controls="topbar-lab-search-results"
          title="Search Labs (Ctrl+K)"
          className="flex h-12 w-12 items-center justify-center rounded-md text-accent transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[110] w-[min(34rem,calc(100vw-1rem))] animate-slide-down overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-[var(--elevation-raised)] motion-reduce:animate-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-3 py-2">
            <p className="type-meta text-text-muted" aria-live="polite">
              {query.trim()
                ? `${results.length} Lab${results.length === 1 ? '' : 's'}`
                : 'Suggested Labs'}
            </p>
            {(isLoading || isStale) && (
              <span className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                Searching
              </span>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 border-b border-border-subtle bg-canvas px-3 py-2 text-xs text-text-secondary"
            >
              <span>Some bootcamp Labs could not load.</span>
              <button
                type="button"
                onClick={retry}
                className="rounded-md px-2 py-1 text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Retry
              </button>
            </div>
          )}

          {waiting ? (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center gap-3 px-0.5 py-1">
                  <Skeleton variant="icon" className="shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" className="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto h-5 w-5 text-text-tertiary" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-text-primary">No Labs found</p>
              <p className="mt-1 text-xs text-text-muted">
                Try a different title, category, or difficulty.
              </p>
            </div>
          ) : (
            <ul
              id="topbar-lab-search-results"
              role="listbox"
              aria-label="Labs"
              className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-1.5"
            >
              {results.map((lab, index) => (
                <li key={lab.id} role="presentation">
                  <LabSearchResultRow
                    lab={lab}
                    id={`topbar-lab-option-${index}`}
                    active={index === activeIndex}
                    onSelect={selectResult}
                    onActive={() => setActiveIndex(index)}
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-3 py-2 text-[11px] text-text-tertiary">
            <span>
              <kbd className="rounded border border-border-subtle px-1 py-0.5">Enter</kbd> to open
            </span>
            <span>
              <kbd className="rounded border border-border-subtle px-1 py-0.5">Esc</kbd> to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopbarSearch;
