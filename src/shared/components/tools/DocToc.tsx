import React, { useCallback } from 'react';
import { cn } from '@/shared/utils/cn';
import { useDocScrollSpy } from '@/shared/hooks/useDocScrollSpy';
import type { ToolDocSection as ToolDocSectionItem } from './ToolDocTopbar';

interface DocTocProps {
  sections: ToolDocSectionItem[];
  onNavigate?: () => void;
}

/**
 * DocToc — "On this page" rail for tool documentation. Scroll-spies the same
 * section ids as the topbar pills. Used in the fixed desktop docs rail (lg+)
 * and the mobile On-this-page sheet; `onNavigate` closes the sheet after a
 * jump. Nav styling mirrors the StudentSidebar items.
 */
const DocToc: React.FC<DocTocProps> = ({ sections, onNavigate }) => {
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
      <p className="type-label mb-1 px-3 text-text-tertiary uppercase tracking-[0.12em]">
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
    </nav>
  );
};

export default DocToc;