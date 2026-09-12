import React, { useCallback } from 'react';
import { Download, BookOpen } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useDocScrollSpy } from '@/shared/hooks/useDocScrollSpy';
import type { ToolDocSection as ToolDocSectionItem } from './ToolDocTopbar';

interface DocTocProps {
  toolName: string;
  sections: ToolDocSectionItem[];
  installLabel?: string;
  onInstall?: () => void;
}

/**
 * DocToc — sticky "On this page" rail for tool documentation pages.
 * Rendered in the left sidebar column on lg+; shares the same scroll-spy
 * state as the topbar pills so both stay in sync.
 */
const DocToc: React.FC<DocTocProps> = ({
  toolName,
  sections,
  installLabel = 'Install',
  onInstall,
}) => {
  const activeSection = useDocScrollSpy(sections.map((s) => s.id), 130);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <nav aria-label="On this page" className="flex flex-col gap-1">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-3">
        On this page
      </p>

      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollTo(s.id)}
          aria-current={activeSection === s.id ? 'true' : undefined}
          className={cn(
            'text-left relative pl-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-l-2 flex items-center gap-2',
            activeSection === s.id
              ? 'text-accent border-accent'
              : 'text-text-secondary border-transparent hover:text-accent hover:border-accent/50'
          )}
        >
          {s.label}
        </button>
      ))}

      {onInstall && (
        <div className="mt-5 pt-5 border-t border-border/10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-accent shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted truncate">
              {toolName} docs
            </span>
          </div>
          <button
            type="button"
            onClick={onInstall}
            className="btn-primary inline-flex items-center justify-center gap-2 !px-4 !py-2.5 !text-[10px] !rounded-xl"
          >
            <Download className="w-3.5 h-3.5" /> {installLabel}
          </button>
        </div>
      )}
    </nav>
  );
};

export default DocToc;