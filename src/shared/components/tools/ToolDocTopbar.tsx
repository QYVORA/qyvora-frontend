import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/shared/utils/cn';

export interface ToolDocSection {
  id: string;
  label: string;
}

interface ToolDocTopbarProps {
  toolName: string;
  accentWord?: string;
  sections: ToolDocSection[];
  githubUrl?: string;
  installLabel?: string;
  onInstall?: () => void;
}

const ToolDocTopbar: React.FC<ToolDocTopbarProps> = ({
  toolName,
  accentWord,
  sections,
  githubUrl,
  installLabel = 'Install',
  onInstall,
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const offsets = sections.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el ? el.getBoundingClientRect().top : Infinity };
      });

      const current = offsets.reduce((closest, s) => {
        if (s.top <= 120 && s.top > closest.top) return s;
        return closest;
      }, { id: sections[0]?.id || '', top: -Infinity });

      if (current.id) setActiveSection(current.id);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-[100] transition-all duration-200',
        scrolled
          ? 'bg-bg-card/90 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center h-14 px-4 md:px-6 lg:px-8">
        {/* Tool name */}
        <div className="flex items-center gap-2 shrink-0 mr-6">
          <span className="text-sm font-black uppercase tracking-tight text-text-primary">
            {toolName}
          </span>
          {accentWord && (
            <span className="text-sm font-black uppercase tracking-tight text-accent">
              {accentWord}
            </span>
          )}
        </div>

        {/* Section links — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                'relative px-3 py-1.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors shrink-0',
                activeSection === s.id
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {s.label}
              {activeSection === s.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </nav>

        {/* Section links — mobile (scrollable) */}
        <nav className="flex md:hidden items-center gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                'relative px-2.5 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors shrink-0',
                activeSection === s.id
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary border border-border/50 hover:border-border transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden lg:inline">GitHub</span>
            </a>
          )}
          {onInstall && (
            <button
              onClick={onInstall}
              className="btn-primary !px-4 !py-1.5 !text-[10px] !rounded-lg"
            >
              {installLabel}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ToolDocTopbar;
