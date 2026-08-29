import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

export interface LearningToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'accent';
}

export interface LearningToolbarProps {
  actions: LearningToolbarAction[];
  className?: string;
}

const LearningToolbar: React.FC<LearningToolbarProps> = ({ actions, className = '' }) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  if (actions.length === 0) return null;

  return (
    <>
      {/* Desktop: fixed right sidebar */}
      <aside
        className={`hidden lg:flex fixed right-6 z-[90] flex-col items-center gap-2.5 ${className}`}
        style={{ top: '5rem', bottom: '1.5rem', justifyContent: 'center' }}
        aria-label={t('learning.toolbar.label')}
      >
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            title={action.label}
            aria-label={action.label}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors active:scale-95 shrink-0 ${
              action.active || action.variant === 'accent'
                ? 'bg-accent border-accent text-on-accent hover:brightness-110'
                : 'border-border/60 bg-transparent text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent-dim/10'
            }`}
          >
            {action.icon}
          </button>
        ))}
      </aside>

      {/* Mobile: floating trigger + expandable panel */}
      <div className="lg:hidden fixed right-4 bottom-20 z-[100]">
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.15 }}
            className="absolute bottom-14 right-0 flex flex-col gap-2 p-2 rounded-2xl border border-border/50 bg-bg-card"
            >
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.onClick();
                    setExpanded(false);
                  }}
                  title={action.label}
                  aria-label={action.label}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors active:scale-95 shrink-0 ${
                    action.active || action.variant === 'accent'
                      ? 'bg-accent border-accent text-on-accent'
                      : 'border-border/60 bg-transparent text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent-dim/10'
                  }`}
                >
                  {action.icon}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-transparent text-text-secondary hover:text-accent hover:border-accent/50 transition-colors active:scale-95"
          aria-label={t('learning.toolbar.toggle')}
        >
          {expanded ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4 rotate-180" />
          )}
        </button>
      </div>
    </>
  );
};

export default LearningToolbar;
