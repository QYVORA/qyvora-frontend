import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CurriculumItem } from '@/shared/types/learning';
import { cn } from '@/shared/utils/cn';

interface LearningCurriculumTreeProps {
  items: CurriculumItem[];
  activeId: string;
  collapsed?: boolean;
  className?: string;
}

interface CurriculumSectionProps {
  item: CurriculumItem;
  activeId: string;
  collapsed?: boolean;
  expanded: boolean;
  onToggle: () => void;
}

interface CurriculumItemProps {
  item: CurriculumItem;
  active: boolean;
  collapsed?: boolean;
}

/**
 * Single curriculum item (leaf node - no children)
 */
function CurriculumItemComponent({ item, active, collapsed }: CurriculumItemProps) {
  const navigate = useNavigate();
  const isLocked = item.status === 'locked';
  const isCompleted = item.status === 'completed';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLocked) {
      navigate(item.href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isLocked) {
        navigate(item.href);
      }
    }
  };

  return (
    <a
      href={item.href}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={active ? 'page' : undefined}
      aria-disabled={isLocked}
      className={cn(
        'group relative flex items-center rounded-xl py-2 text-sm transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)]',
        'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
        collapsed ? 'h-12 w-12 justify-center px-0' : 'gap-3 px-3',
        active
          ? 'bg-accent/10 font-medium text-accent'
          : isLocked
          ? 'cursor-not-allowed text-text-muted/50'
          : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
        isLocked && 'pointer-events-none'
      )}
      data-curriculum-item
      tabIndex={isLocked ? -1 : 0}
    >
      {active && (
        <>
          <span
            className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent"
            aria-hidden="true"
          />
          {/* Corner ticks for active item */}
          <span className="nav-ticks" aria-hidden="true">
            <i />
            <i />
          </span>
        </>
      )}

      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-black transition-colors',
          isCompleted
            ? 'border-accent/40 bg-accent-dim/20 text-accent'
            : active
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-border bg-surface-raised text-text-muted'
        )}
        aria-hidden="true"
      >
        {isCompleted ? (
          <Check className="h-3 w-3" strokeWidth={3} />
        ) : isLocked ? (
          <Lock className="h-3 w-3" />
        ) : (
          String(item.number).padStart(2, '0')
        )}
      </span>

      {!collapsed && (
        <span className="flex-1 truncate">
          {item.title}
        </span>
      )}
    </a>
  );
}

/**
 * Curriculum section (parent node with collapsible children)
 */
function CurriculumSection({ item, activeId, collapsed, expanded, onToggle }: CurriculumSectionProps) {
  const isLocked = item.status === 'locked';
  const isActive = item.status === 'active';
  const hasActiveChild = item.children?.some(child => child.id === activeId);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    } else if (e.key === 'ArrowLeft' && expanded) {
      e.preventDefault();
      onToggle();
    } else if (e.key === 'ArrowRight' && !expanded) {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        aria-label={`${item.title}, ${item.children?.length || 0} items`}
        className={cn(
          'group flex w-full items-center rounded-xl py-2 text-sm font-black uppercase tracking-wider transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          collapsed ? 'h-10 w-10 justify-center px-0 text-[10px]' : 'gap-2 px-3',
          isActive || hasActiveChild
            ? 'text-accent'
            : isLocked
            ? 'text-text-muted/50'
            : 'text-text-muted hover:text-text-primary'
        )}
      >
        {!collapsed && (
          <>
            <span
              className={cn(
                'shrink-0 transition-transform duration-200',
                expanded && 'rotate-90'
              )}
              aria-hidden="true"
            >
              <ChevronRight className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="flex-1 truncate text-left">
              {item.title}
            </span>
            {isLocked && <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />}
          </>
        )}
        {collapsed && (
          <span className="font-mono">{item.number}</span>
        )}
      </button>

      {!collapsed && (
        <AnimatePresence initial={false}>
          {expanded && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="ml-3 space-y-0.5 border-l border-border/30 pl-2 pt-1 pb-1">
                {item.children.map(child => (
                  <CurriculumItemComponent
                    key={child.id}
                    item={child}
                    active={child.id === activeId}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * LearningCurriculumTree - Renders the curriculum navigation tree
 * for bootcamp/course/lab pages.
 * 
 * Features:
 * - Nested collapsible sections
 * - Status indicators (completed, active, locked)
 * - Keyboard navigation (Enter, Space, Arrow keys)
 * - Active item highlighting
 * - Collapsed sidebar support
 */
export function LearningCurriculumTree({
  items,
  activeId,
  collapsed = false,
  className,
}: LearningCurriculumTreeProps) {
  // Auto-expand sections that contain the active item
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    items.forEach(item => {
      if (item.type === 'section' && item.children) {
        const hasActiveChild = item.children.some(child => child.id === activeId);
        if (hasActiveChild || item.id === activeId) {
          expanded.add(item.id);
        }
      }
    });
    return expanded;
  });

  // Update expanded sections when activeId changes
  useEffect(() => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      items.forEach(item => {
        if (item.type === 'section' && item.children) {
          const hasActiveChild = item.children.some(child => child.id === activeId);
          if (hasActiveChild || item.id === activeId) {
            next.add(item.id);
          }
        }
      });
      return next;
    });
  }, [activeId, items]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  return (
    <nav aria-label="Learning curriculum" className={cn('space-y-0.5', className)}>
      {items.map(item => {
        if (item.type === 'section') {
          return (
            <CurriculumSection
              key={item.id}
              item={item}
              activeId={activeId}
              collapsed={collapsed}
              expanded={expandedSections.has(item.id)}
              onToggle={() => toggleSection(item.id)}
            />
          );
        }

        return (
          <CurriculumItemComponent
            key={item.id}
            item={item}
            active={item.id === activeId}
            collapsed={collapsed}
          />
        );
      })}
    </nav>
  );
}

export default LearningCurriculumTree;
