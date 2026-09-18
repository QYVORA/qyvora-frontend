import React, { useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useDocScrollSpy } from '@/shared/hooks/useDocScrollSpy';
import Button from '@/shared/components/ui/Button';
import type { ToolDocSection as ToolDocSectionItem } from './ToolDocTopbar';

interface DocTocProps {
  toolName: string;
  sections: ToolDocSectionItem[];
  installLabel?: string;
  onInstall?: () => void;
  onNavigate?: () => void;
}

/**
 * DocToc — "On this page" rail for tool documentation. Scroll-spies the same
 * section ids as the topbar pills. Used in the DocsShell sidebar (lg+) and the
 * mobile On-this-page sheet. `onNavigate` closes the sheet after a jump.
 */
const DocToc: React.FC<DocTocProps> = ({
  toolName,
  sections,
  installLabel = 'Install',
  onInstall,
  onNavigate,
}) => {
  const activeSection = useDocScrollSpy(sections.map((s) => s.id), 130);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const jump = (id: string) => {
    scrollTo(id);
    onNavigate?.();
  };

  return (
    <nav aria-label="On this page" className="flex flex-col gap-0.5">
      <p className="type-label mb-2 px-1 text-text-tertiary uppercase tracking-[0.12em]">
        On this page
      </p>

      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => jump(s.id)}
          aria-current={activeSection === s.id ? 'true' : undefined}
          className={cn(
            'w-full min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
            activeSection === s.id
              ? 'bg-accent/10 text-accent'
              : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
          )}
        >
          {s.label}
        </button>
      ))}

      {onInstall && (
        <div className="mt-6 flex flex-col gap-3 border-t border-border-subtle pt-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="type-label truncate text-text-tertiary">
              {toolName} docs
            </span>
          </div>
          <Button size="sm" onClick={onInstall} className="w-full">
            {installLabel}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default DocToc;