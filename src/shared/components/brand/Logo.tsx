import React from 'react';
import { QyvoraLogotype } from './QyvoraLogotype';
import { QyvoraMark } from './QyvoraMark';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type LogoVariant = 'full' | 'mark';

interface LogoProps {
  className?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  color?: string;
}

const sizes: Record<LogoSize, string> = {
  sm: 'w-[175px]',
  md: 'w-[234px]',
  lg: 'w-[292px]',
  xl: 'w-[351px]',
  '2xl': 'w-[468px]',
  '3xl': 'w-[585px]',
};

const markSizes: Record<LogoSize, string> = {
  sm: 'w-[42px]',
  md: 'w-[56px]',
  lg: 'w-[70px]',
  xl: 'w-[84px]',
  '2xl': 'w-[112px]',
  '3xl': 'w-[140px]',
};

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'full', color = '#06B66F' }) => {
  if (variant === 'mark') {
    return (
      <div className={`logo-wrap flex-none ${markSizes[size]} max-w-full ${className}`}>
        <QyvoraMark className="w-full h-auto block" color={color} />
      </div>
    );
  }

  return (
    <div className={`logo-wrap flex-none ${sizes[size]} max-w-full ${className}`}>
      <div className="overflow-hidden aspect-[848/116] flex items-center">
        <QyvoraLogotype className="w-full h-auto block -ml-[24%]" color={color} />
      </div>
    </div>
  );
};

export const QyvoraLogo: React.FC<{ className?: string; color?: string }> = ({ className = '', color = '#06B66F' }) => {
  return (
    <div className={`logo-wrap flex-none w-[292px] max-w-full ${className}`}>
      <div className="overflow-hidden aspect-[848/116] flex items-center">
        <QyvoraLogotype className="w-full h-auto block -ml-[24%]" color={color} />
      </div>
    </div>
  );
};

export default Logo;
