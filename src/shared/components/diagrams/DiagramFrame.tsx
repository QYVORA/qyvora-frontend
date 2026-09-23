import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface DiagramFrameProps {
  /** Kicker rendered in the frame header. */
  title?: string;
  icon?: React.ReactNode;
  /** Optional extra content pinned to the right of the header row. */
  headerRight?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * DiagramFrame — shared foundation for every QYVORA diagram (flow diagrams,
 * kill-chain progress, future learning/docs diagrams). Owns the canonical
 * `wc-diagram` bordered frame and the accent kicker header so diagrams share
 * one visual grammar instead of each defining its own shell.
 */
export const DiagramFrame: React.FC<DiagramFrameProps> = ({
  title,
  icon,
  headerRight,
  className,
  children,
}) => (
  <div className={cn('wc-diagram relative overflow-hidden rounded-xl border border-border/50 bg-bg-card p-4 md:p-5', className)}>
    {title && (
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <span className="text-xs font-black uppercase tracking-widest text-accent">{title}</span>
        {headerRight && <div className="ml-auto">{headerRight}</div>}
      </div>
    )}
    {children}
  </div>
);

export default DiagramFrame;