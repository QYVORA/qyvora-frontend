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
 *
 * A controlled `activeId` requests which task should open, but the accordion
 * still owns the immediate open/close state so clicking an open header can
 * collapse it even when the parent keeps the same current step selected.
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
    activeId ?? defaultActiveId ?? tasks[0]?.id ?? '',
  );
  const previousActiveId = useRef(activeId);
  const handledHash = useRef('');
  const taskIdsKey = tasks.map((task) => task.id).join('|');
  const openId = internalActiveId;

  const openTask = (id: string, options: { scroll?: boolean } = {}) => {
    setInternalActiveId(id);
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
    if (activeId === previousActiveId.current) return;
    previousActiveId.current = activeId;
    if (activeId !== undefined) setInternalActiveId(activeId);
  }, [activeId]);

  useEffect(() => {
    if (!internalActiveId) return;
    if (tasks.some((task) => task.id === internalActiveId)) return;

    const fallback =
      defaultActiveId && tasks.some((task) => task.id === defaultActiveId)
        ? defaultActiveId
        : tasks[0]?.id ?? '';
    setInternalActiveId(fallback);
  }, [defaultActiveId, internalActiveId, taskIdsKey, tasks]);

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
    <div className={cn('flex flex-col gap-3 sm:gap-4', className)}>
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
              'w-full scroll-mt-24 overflow-hidden rounded-lg border bg-surface transition-colors duration-150',
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
                'flex w-full items-center gap-3 px-3 py-4 text-left transition-colors duration-150 sm:gap-4 sm:px-6 sm:py-6',
                task.locked ? 'cursor-not-allowed' : 'cursor-pointer',
                !task.locked && !isOpen && 'hover:bg-surface-raised/60',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-black transition-colors duration-150',
                  task.completed
                    ? 'border-success/40 bg-success/10 text-success'
                    : isOpen
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-border-subtle bg-surface-raised text-text-tertiary',
                )}
              >
                {task.completed ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-snug text-text-primary sm:text-base">
                  {task.title}
                </span>
                {task.description && (
                  <span className="mt-1 block text-[13px] leading-relaxed text-text-tertiary sm:text-sm">
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
              <p id={`${panelId}-locked`} className="px-3 pb-4 pl-[2.75rem] text-sm text-text-tertiary sm:px-6 sm:pb-5 sm:pl-[4.5rem]">
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
                  <div className="border-t border-border-subtle px-3 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
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
