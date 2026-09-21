import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import type { ToolDocSectionItem } from './ToolDocPage';

interface DocTocNavProps {
  sections: ToolDocSectionItem[];
  /** Align the chip row to the centered content column while the sticky bar stays full-bleed. */
  contained?: boolean;
}

const STICKY_BAR_HEIGHT = 60;

const DocTocNav: React.FC<DocTocNavProps> = ({ sections, contained = false }) => {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (!sections.length) return;
    let raf = 0;
    const offset = 80 + STICKY_BAR_HEIGHT + 16;
    const update = () => {
      let current = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = section.id;
        }
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections]);

  const jumpTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  if (!sections.length) return null;

  return (
    <div className="sticky top-[80px] z-[85] bg-canvas">
      <div className={cn(contained && 'mx-auto w-full max-w-[1320px] px-3 md:px-4 lg:px-6')}>
        <nav
          aria-label="On this page"
          className={cn(
            'scroll-x no-scrollbar flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto py-2',
            !contained && 'px-3 md:px-4 lg:px-6',
          )}
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={jumpTo(section.id)}
              aria-current={activeId === section.id ? 'true' : undefined}
              className={cn(
                'inline-flex min-h-[44px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-3 text-xs font-black uppercase tracking-widest transition-colors',
                activeId === section.id
                  ? 'bg-accent text-on-accent'
                  : 'border border-border bg-surface-raised text-text-muted hover:border-accent/50 hover:text-accent',
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DocTocNav;