import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

export interface LearningTask {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  completed?: boolean;
  locked?: boolean;
  lockedMessage?: React.ReactNode;
  content: React.ReactNode;
}

export interface LearningTaskAccordionProps {
  tasks: LearningTask[];
  /** Controlled open task id. Omit for internal accordion state. */
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}

/**
 * One-at-a-time task accordion used by courses, bootcamp rooms and labs.
 *
 * The current task opens by default, completed and locked states are shown on
 * the task header, and hash links such as #task-3 open and reveal the matching
 * task without introducing a second learning navigation rail.
 */
export function LearningTaskAccordion({
  tasks,
  activeId,
  defaultActiveId,
  onActiveChange,
  className,
}: LearningTaskAccordionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? tasks[0]?.id ?? '',
  );
  const handledHash = useRef('');
  const taskIdsKey = tasks.map((task) => task.id).join('|');
  const openId = activeId !== undefined ? activeId : internalActiveId;

  const openTask = (id: string, options: { scroll?: boolean } = {}) => {
    if (activeId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);

    if (options.scroll) {
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    }
  };

  useEffect(() => {
    if (activeId === undefined && !tasks.some((task) => task.id === internalActiveId)) {
      setInternalActiveId(defaultActiveId ?? tasks[0]?.id ?? '');
    }
  }, [activeId, defaultActiveId, internalActiveId, tasks]);

  useEffect(() => {
    const syncHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash || handledHash.current === hash) return;
      if (!taskIdsKey.split('|').includes(hash)) return;
      handledHash.current = hash;
      openTask(hash, { scroll: true });
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
    // openTask is intentionally excluded: the hash/task list are the triggers.
  }, [taskIdsKey]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {tasks.map((task, index) => {
        const isOpen = !task.locked && task.id === openId;
        const panelId = `learning-task-panel-${task.id}`;
        const headerId = `learning-task-header-${task.id}`;
        const lockedMessage = task.lockedMessage ?? 'Complete the previous task to unlock this step.';

        return (
          <section
            key={task.id}
            id={task.id}
            className={cn(
              'scroll-mt-24 overflow-hidden rounded-lg border bg-surface transition-colors duration-150',
              isOpen
                ? 'border-accent/50'
                : task.locked
                  ? 'border-border-subtle opacity-75'
                  : 'border-border-subtle hover:border-accent/35',
            )}
          >
            <button
              type="button"
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={task.locked ? undefined : panelId}
              aria-disabled={task.locked || undefined}
              aria-describedby={task.locked ? `${panelId}-locked` : undefined}
              onClick={() => {
                if (task.locked) return;
                openTask(isOpen ? '' : task.id);
              }}
              className={cn(
                'flex w-full items-center gap-4 p-6 text-left transition-colors duration-150',
                task.locked ? 'cursor-not-allowed' : 'cursor-pointer',
                !task.locked && !isOpen && 'hover:bg-surface-raised/60',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-black',
                  task.completed
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : isOpen
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-border-subtle bg-surface-raised text-text-tertiary',
                )}
              >
                {task.completed ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold leading-snug text-text-primary">
                  {task.title}
                </span>
                {task.description && (
                  <span className="mt-1 block text-sm leading-relaxed text-text-tertiary">
                    {task.description}
                  </span>
                )}
              </span>

              {task.meta && <span className="hidden shrink-0 sm:block">{task.meta}</span>}

              {task.completed && (
                <span className="hidden shrink-0 text-xs font-bold uppercase tracking-widest text-accent sm:block">
                  Complete
                </span>
              )}

              {task.locked ? (
                <Lock className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
              ) : (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-text-muted transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              )}
            </button>

            {task.locked && (
              <p id={`${panelId}-locked`} className="px-6 pb-5 pl-[4.5rem] text-sm text-text-tertiary">
                {lockedMessage}
              </p>
            )}

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border-subtle px-6 pb-8 pt-6">
                    <div className="min-w-0">{task.content}</div>
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

export default LearningTaskAccordion;
