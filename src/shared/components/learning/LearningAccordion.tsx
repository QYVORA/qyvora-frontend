import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { DifficultyBadge } from './LearningCard';

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
  locked?: boolean;
  completed?: boolean;
  cpCost?: number;
  onUnlock?: () => void;
}

interface LearningAccordionProps {
  items: LearningAccordionItem[];
  className?: string;
  defaultOpen?: number;
}

function StartButton({ label, onClick, locked, cpCost, onUnlock }: { label: string; onClick?: () => void; locked?: boolean; cpCost?: number; onUnlock?: () => void }) {
  if (locked && cpCost) {
    return (
      <button type="button" onClick={onUnlock} className="btn-secondary px-5 py-2.5 mt-4 flex items-center gap-2">
        <Lock className="w-3 h-3" aria-hidden="true" />
        {`Unlock for ${cpCost} CP`}
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} className="btn-primary px-5 py-2.5 mt-4">
      {label}
    </button>
  );
}

/**
 * Task-card accordion reused for lab room/challenge listings.
 *
 * Every breakpoint now uses the same one-at-a-time, click-to-toggle card. A
 * completed item gets a green check, the open item gets an accent ring, and
 * opening a new item closes the previous one. Mobile cards stay full-width so
 * the reading column never gets squeezed on narrow screens.
 */
export function LearningAccordion({ items, className, defaultOpen = 0 }: LearningAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen >= 0 && defaultOpen < items.length ? defaultOpen : null,
  );

  const toggleSection = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <div className={cn('flex w-full flex-col gap-3 sm:gap-4', className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <section
            key={item.id}
            className={cn(
              'w-full overflow-hidden rounded-lg border bg-surface transition-colors duration-150',
              isOpen
                ? 'border-accent/50'
                : item.locked
                  ? 'border-border-subtle opacity-75'
                  : 'border-border-subtle hover:border-accent/35',
            )}
          >
            <button
              type="button"
              onClick={() => toggleSection(idx)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-4 text-left transition-colors duration-150 sm:gap-4 sm:px-6 sm:py-5',
                !isOpen && 'hover:bg-surface-raised/60',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-150',
                  item.completed
                    ? 'border-success/40 bg-success/10 text-success'
                    : item.locked
                      ? 'border-border-subtle bg-surface-raised text-text-muted'
                      : isOpen
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border-subtle bg-surface-raised text-text-tertiary',
                )}
              >
                {item.completed ? (
                  <Check className="h-4 w-4" />
                ) : item.locked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  String(idx + 1).padStart(2, '0')
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-snug text-text-primary sm:text-base">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-accent/60">
                    {item.subtitle}
                  </span>
                )}
              </span>

              <span className="hidden shrink-0 items-center gap-3 sm:flex">
                {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
                {item.meta}
              </span>

              <ChevronDown
                size={16}
                className={cn('shrink-0 text-text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    id={`accordion-panel-${item.id}`}
                    role="region"
                    className="px-3 pb-6 pt-1 sm:px-6 sm:pb-6 sm:pl-[4.5rem]"
                  >
                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
                      {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
                      {item.meta}
                    </div>
                    <p className="mb-4 text-[15px] leading-7 text-text-primary sm:text-base sm:leading-[2]">
                      {item.description}
                    </p>
                    {item.body}
                    {item.onStart && (
                      <StartButton
                        label={item.startLabel ?? 'Start'}
                        onClick={item.onStart}
                        locked={item.locked}
                        cpCost={item.cpCost}
                        onUnlock={item.onUnlock}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}

export default LearningAccordion;
