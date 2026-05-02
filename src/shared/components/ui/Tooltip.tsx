/**
 * Tooltip — accessible tooltip built on Radix UI Tooltip primitive.
 *
 * Handles keyboard focus, ARIA, and pointer events automatically.
 * Styled to match the hsociety design system.
 *
 * Usage (simple):
 *   <Tooltip content="Delete user">
 *     <button><Trash2 /></button>
 *   </Tooltip>
 *
 * Usage (controlled side):
 *   <Tooltip content="Copy to clipboard" side="left">
 *     <button><Copy /></button>
 *   </Tooltip>
 */

import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../utils/cn';

// ── Provider — wrap your app root once ───────────────────────────────────────
// Already exported so you can add it to main.tsx if needed.
// Default delayDuration of 400ms feels snappy without being instant.
export const TooltipProvider = RadixTooltip.Provider;

// ── Main component ────────────────────────────────────────────────────────────
interface TooltipProps {
  /** The tooltip label */
  content: React.ReactNode;
  /** The element that triggers the tooltip */
  children: React.ReactNode;
  /** Which side to show the tooltip. Default: 'top' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Offset from the trigger in px. Default: 6 */
  sideOffset?: number;
  /** Delay before showing in ms. Default: 400 */
  delayDuration?: number;
  /** Extra classes on the tooltip bubble */
  className?: string;
  /** Disable the tooltip entirely */
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  sideOffset = 6,
  delayDuration = 400,
  className,
  disabled = false,
}) => {
  if (disabled) return <>{children}</>;

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {/* Wrap in span so any element (including disabled buttons) works */}
          <span className="inline-flex">{children}</span>
        </RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              // Surface
              'z-[300] px-2.5 py-1.5 rounded-lg',
              'bg-bg-card border border-border',
              'shadow-lg shadow-black/30',
              // Typography
              'text-[11px] font-bold text-text-primary uppercase tracking-widest font-mono',
              // Radix data-state animations
              'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-1',
              'data-[side=top]:slide-in-from-bottom-1',
              'data-[side=left]:slide-in-from-right-1',
              'data-[side=right]:slide-in-from-left-1',
              'duration-150',
              className,
            )}
          >
            {content}
            {/* Arrow */}
            <RadixTooltip.Arrow
              className="fill-border"
              width={10}
              height={5}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
