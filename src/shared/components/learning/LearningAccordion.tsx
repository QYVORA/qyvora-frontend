import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type LearningAccordionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningAccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  difficulty?: LearningAccordionDifficulty;
  meta?: React.ReactNode;
  body?: React.ReactNode;
  onStart?: () => void;
  startLabel?: string;
}

interface LearningAccordionProps {
  items: LearningAccordionItem[];
  className?: string;
  defaultOpen?: number;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

function DifficultyBadge({ difficulty }: { difficulty: LearningAccordionDifficulty }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border', DIFFICULTY_STYLES[difficulty])}>
      {difficulty}
    </span>
  );
}

function StartButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn-primary !rounded-xl !text-[10px] px-5 py-2.5 mt-4">
      {label}
    </button>
  );
}

/**
 * Terms-page style strip accordion, reused for lab room listings.
 * - Desktop (md+): horizontal expandable strips — multiple can be open, first opens by default.
 * - Mobile (<md): stacked always-expanded terminal cards.
 */
export function LearningAccordion({ items, className, defaultOpen = 0 }: LearningAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([defaultOpen]));

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, idx) => {
        const isOpen = openSections.has(idx);
        return (
          <div
            key={item.id}
            className="hidden md:block rounded-xl border border-border/30 bg-bg-card overflow-hidden transition-colors hover:border-border/50"
          >
            {/* Strip header — always visible */}
            <button
              type="button"
              onClick={() => toggleSection(idx)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[10px] font-black text-accent/60 font-mono w-6 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-tight truncate">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent/60 mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
                {item.meta}
                <ChevronDown
                  size={16}
                  className={cn('text-text-muted shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </div>
            </button>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-15">
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 pl-10 max-w-2xl">
                      {item.description}
                    </p>
                    {item.body}
                    {item.onStart && (
                      <div className="pl-10">
                        <StartButton label={item.startLabel ?? 'Start'} onClick={item.onStart} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Mobile: stacked terminal cards (always expanded) */}
      <div className="md:hidden flex flex-col gap-4">
        {items.map((item, idx) => (
          <div key={item.id} className="terminal-card relative rounded-2xl border border-border bg-bg-card overflow-hidden">
            <div className="relative p-5">
              <div
                className="absolute top-3 right-4 font-mono text-2xl font-black leading-none select-none pointer-events-none"
                style={{ color: 'var(--color-accent-dim)' }}
                aria-hidden="true"
              >
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h3 className="text-sm font-black text-text-primary mb-1 font-mono uppercase tracking-tight pr-10">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[10px] font-black uppercase tracking-widest text-accent/60 mb-3">
                  {item.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 mb-4">
                {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
                {item.meta}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              {item.body}
              {item.onStart && <StartButton label={item.startLabel ?? 'Start'} onClick={item.onStart} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningAccordion;
