import React from 'react';
import { QyvoraMark } from '@/shared/components/brand/QyvoraMark';

interface ChainLogoProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
  labelClassName?: string;
  variant?: '3d' | 'flat';
}

const ChainLogo: React.FC<ChainLogoProps> = ({
  size = 40,
  className = '',
  showLabel = false,
  labelClassName = '',
  variant = 'flat',
}) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <QyvoraMark
      className="object-contain inline-block align-middle"
      style={{ width: size, height: size }}
      color={variant === '3d' ? '#06B66F' : '#06B66F'}
    />
    {showLabel && (
      <span
        className={`font-mono font-black uppercase tracking-widest text-accent ${labelClassName}`}
        style={{ fontSize: size * 0.28 }}
      >
        QYVORA CHAIN
      </span>
    )}
  </span>
);

export default ChainLogo;
