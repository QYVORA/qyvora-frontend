import { useMemo } from 'react';
import { DobiaIdle } from './dobia/DobiaIdle';
import { DobiaSuccess } from './dobia/DobiaSuccess';
import { DobiaAlert } from './dobia/DobiaAlert';
import { DobiaScanning } from './dobia/DobiaScanning';
import { DobiaLoading } from './dobia/DobiaLoading';
import { DobiaGreeting } from './dobia/DobiaGreeting';
import { DobiaAngry } from './dobia/DobiaAngry';
import { DobiaThinking } from './dobia/DobiaThinking';
import { DobiaConfused } from './dobia/DobiaConfused';
import { DobiaSurprised } from './dobia/DobiaSurprised';

type DobiaExpression =
  | 'idle' | 'success' | 'alert' | 'scanning' | 'loading'
  | 'greeting' | 'angry' | 'thinking' | 'confused' | 'surprised' | 'waving';

type DobiaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface DobiaProps {
  expression?: DobiaExpression;
  size?: DobiaSize;
  className?: string;
  animated?: boolean;
}

const SIZE_MAP: Record<DobiaSize, number> = {
  xs: 32,
  sm: 48,
  md: 80,
  lg: 128,
  xl: 224,
  hero: 320,
};

const EXPRESSION_MAP: Record<DobiaExpression, React.ComponentType<{ size: number; className?: string }>> = {
  idle: DobiaIdle,
  success: DobiaSuccess,
  alert: DobiaAlert,
  scanning: DobiaScanning,
  loading: DobiaLoading,
  greeting: DobiaGreeting,
  angry: DobiaAngry,
  thinking: DobiaThinking,
  confused: DobiaConfused,
  surprised: DobiaSurprised,
  waving: DobiaGreeting,
};

const IDLE_ANIMATION = {
  y: [0, -6, 0, 3, 0],
} as const;

const Dobia: React.FC<DobiaProps> = ({
  expression = 'idle',
  size = 'md',
  className = '',
  animated = true,
}) => {
  const pxSize = SIZE_MAP[size];
  const Component = EXPRESSION_MAP[expression];

  const animClass = useMemo(() => {
    if (!animated) return '';
    if (expression === 'waving') return 'dobia-wave';
    return 'dobia-float';
  }, [animated, expression]);

  return (
    <span
      className={`inline-flex items-end justify-center ${animClass} ${className}`}
    >
      <Component size={pxSize} />
    </span>
  );
};

export default Dobia;
export type { DobiaExpression, DobiaSize, DobiaProps };
