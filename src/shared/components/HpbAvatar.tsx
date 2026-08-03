import type { SVGProps } from 'react';
import { TeteAvatar } from './hpb/TeteAvatar';
import { AdyeiwaaAvatar } from './hpb/AdyeiwaaAvatar';
import { NiiAvatar } from './hpb/NiiAvatar';
import { MawusiAvatar } from './hpb/MawusiAvatar';
import { AwariAvatar } from './hpb/AwariAvatar';

type HpbVariant = 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5';

type HpbSize = 'xs' | 'sm' | 'md' | 'lg';

interface HpbAvatarProps {
  variant: HpbVariant;
  size?: HpbSize | number;
  className?: string;
  animated?: boolean;
}

const SIZE_MAP: Record<HpbSize, number> = {
  xs: 48,
  sm: 80,
  md: 128,
  lg: 176,
};

const VARIANT_MAP: Record<HpbVariant, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  phase1: TeteAvatar,
  phase2: AdyeiwaaAvatar,
  phase3: NiiAvatar,
  phase4: MawusiAvatar,
  phase5: AwariAvatar,
};

const HpbAvatar: React.FC<HpbAvatarProps> = ({
  variant,
  size,
  className = '',
  animated = false,
}) => {
  const px = typeof size === 'number' ? size : size ? SIZE_MAP[size] : undefined;
  const Component = VARIANT_MAP[variant];
  return (
    <Component
      width={px}
      height={px}
      className={`${animated ? 'dobia-float' : ''} ${className}`.trim()}
    />
  );
};

export default HpbAvatar;
export type { HpbVariant, HpbSize, HpbAvatarProps };
