import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import Input from '@/shared/components/ui/Input';
import Skeleton from '@/shared/components/ui/Skeleton';
import type { UnifiedLab } from '@/features/student/data/labs';
import LabSearchResultRow from './search/LabSearchResultRow';
import { useLabSearch } from './search/useLabSearch';

const isDesktopViewport = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(min-width: 1024px)').matches;

interface StudentSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile Lab search dialog.
 *
 * Desktop uses the inline `TopbarSearch`; this dialog keeps the full-screen
 * search experience available on smaller viewports with the same real Lab
 * index, badge artwork and keyboard navigation.
 */
const StudentSearchDialog: React.FC<StudentSearchDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { results, isLoading, error, retry, isStale } = useLabSearch(query, open, 6);
  const waiting = (isLoading || isStale) && results.length === 0;

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (isDesktopViewport()) return;
      event.preventDefault();
      onOpenChange(!open);
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
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeIndex > results.length - 1) {
      setActiveIndex(Math.max(0, results.length - 1));
    }
  }, [activeIndex, results.length]);

  const selectResult = (lab: UnifiedLab) => {
    onOpenChange(false);
    navigate(lab.route);
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

  const activeOptionId = results[activeIndex]
    ? `student-lab-option-${activeIndex}`
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Search learning experiences"
        description="Find a Lab by title, topic, difficulty, or delivery format."
        maxWidth="max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <Input
            ref={inputRef}
            type="search"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-label="Search Labs"
            aria-expanded={open}
            aria-controls="student-lab-search-results"
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            placeholder="Search Labs…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            icon={<Search className="h-4 w-4" aria-hidden="true" />}
          />

          <div className="flex items-center justify-between gap-3">
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
              className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-xs text-text-secondary"
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
            <div className="space-y-2 rounded-xl border border-border-subtle bg-surface-raised p-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton variant="icon" className="shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" className="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-surface-raised px-4 py-8 text-center">
              <Search className="mx-auto h-5 w-5 text-text-tertiary" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-text-primary">No Labs found</p>
              <p className="mt-1 text-xs text-text-muted">
                {`Nothing matches “${query.trim()}”. Try a different title, category, or difficulty.`}
              </p>
            </div>
          ) : (
            <ul
              id="student-lab-search-results"
              role="listbox"
              aria-label="Labs"
              className="max-h-[min(65vh,32rem)] space-y-1 overflow-y-auto overscroll-contain"
            >
              {results.map((lab, index) => (
                <li key={lab.id} role="presentation">
                  <LabSearchResultRow
                    lab={lab}
                    id={`student-lab-option-${index}`}
                    active={index === activeIndex}
                    onSelect={selectResult}
                    onActive={() => setActiveIndex(index)}
                    variant="dialog"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSearchDialog;
