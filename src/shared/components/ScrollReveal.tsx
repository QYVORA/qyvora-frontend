import React from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
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

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  amount = 0.1,
  scale = 0.95,
  staggerChildren = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useAdaptiveUi();
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });

  if (prefersReducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  const directionOffset = 40;
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -directionOffset : direction === 'right' ? directionOffset : 0,
      y: direction === 'up' ? directionOffset : direction === 'down' ? -directionOffset : 0,
      scale: direction === 'none' ? 1 : scale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: staggerChildren || undefined,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
