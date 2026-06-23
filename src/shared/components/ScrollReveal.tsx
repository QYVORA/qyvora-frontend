import React from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useAdaptiveUi } from '../../core/hooks/useAdaptiveUi';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  amount?: number;
  scale?: number;
  staggerChildren?: number;
}

const DIRECTION_OFFSET = 40;

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

  const noAnimation = prefersReducedMotion || isMobile;

  const variants = React.useMemo(() => ({
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -DIRECTION_OFFSET : direction === 'right' ? DIRECTION_OFFSET : 0,
      y: direction === 'up' ? DIRECTION_OFFSET : direction === 'down' ? -DIRECTION_OFFSET : 0,
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
  }), [direction, scale, delay, staggerChildren]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={noAnimation ? false : 'hidden'}
      animate={noAnimation ? false : (isInView ? 'visible' : 'hidden')}
      variants={noAnimation ? undefined : variants}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
