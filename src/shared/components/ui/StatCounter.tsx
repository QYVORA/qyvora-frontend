import React, { useRef } from 'react';
import { useInView } from 'motion/react';
import { useCountUp } from '../../../core/hooks/useCountUp';

interface StatCounterProps {
  end: number;
  suffix?: string;
  className?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ end, suffix = '', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCountUp(end, 2000, isInView);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
};

export default StatCounter;
