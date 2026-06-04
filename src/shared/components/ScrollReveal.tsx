import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useAdaptiveUi } from '../../core/hooks/useAdaptiveUi';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction to reveal from. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** How much of the element must be visible before triggering. Default: 0.1 */
  amount?: number;
  /** Scale from value. Default: 0.95 */
  scale?: number;
  /** If true, children will be staggered. Requires children to be motion elements or use variants. */
  staggerChildren?: number;
}

/**
 * ScrollReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * A sophisticated reveal-on-scroll component that makes elements "build" into 
 * place with cinematic easing and optional staggering.
 */
const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.1,
  scale = 0.95,
  staggerChildren = 0,
}) => {
  // All animations are disabled - component now just renders children directly
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
