import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import type { ToolDocSectionItem } from './ToolDocPage';

interface DocTocNavProps {
  sections: ToolDocSectionItem[];
}

const DocTocNav: React.FC<DocTocNavProps> = ({ sections }) => {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (!sections.length) return;
    let raf = 0;
    const offset = 96;
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
    <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={jumpTo(section.id)}
          aria-current={activeId === section.id ? 'true' : undefined}
          className={cn(
            'inline-flex min-h-[44px] items-center rounded-full border px-4 text-xs font-black uppercase tracking-widest transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            activeId === section.id
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-border-subtle bg-surface-raised text-text-secondary hover:border-accent/40 hover:text-accent',
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
};

export default DocTocNav;
