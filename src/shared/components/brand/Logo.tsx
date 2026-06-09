import React from 'react';
import { useTheme } from '../../../core/contexts/ThemeContext';

export const DARK_LOGO_SRC = '/qyvora-full-logo.png';
export const LIGHT_LOGO_SRC = '/qyvora-full-logo.png';
export const DARK_MARK_SRC = '/qyvora-single-logo.png';
export const LIGHT_MARK_SRC = '/qyvora-single-logo.png';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type LogoVariant = 'full' | 'mark';

interface LogoProps {
  className?: string;
  size?: LogoSize;
  variant?: LogoVariant;
}

// The full logo PNG has significant transparent padding.
// Canvas: 1536×1024
// Visible Box: 848×116
// Left: 367, Top: 431
// Aspect Ratio: ~7.31:1
const VISIBLE_W = 848;
const VISIBLE_H = 116;
const CANVAS_W = 1536;
const CANVAS_H = 1024;
const LEFT_M = 367;
const TOP_M = 431;

const IMG_H_PCT = (CANVAS_H / VISIBLE_H) * 100;    // ~882.76%
const IMG_TOP_PCT = -(TOP_M / VISIBLE_H) * 100;    // ~-371.55%
const IMG_LEFT_PCT = -(LEFT_M / VISIBLE_W) * 100;  // ~-43.28%

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

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'full' }) => {
  const { theme } = useTheme();
  
  if (variant === 'mark') {
    const markSrc = theme === 'light' ? LIGHT_MARK_SRC : DARK_MARK_SRC;
    const widthClass = markSizes[size];
    return (
      <div className={`logo-wrap flex-none ${widthClass} max-w-full ${className}`}>
        <img
          src={markSrc}
          alt="QYVORA"
          className="w-full h-auto block"
        />
      </div>
    );
  }

  const widthClass = sizes[size];
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
  return (
    <div className={`logo-wrap flex-none ${widthClass} max-w-full ${className}`}>
      <div className="w-full aspect-[848/116] overflow-hidden relative">
        <img
          src={logoSrc}
          alt="QYVORA"
          className="absolute max-w-none"
          style={{
            height: `${IMG_H_PCT}%`,
            top: `${IMG_TOP_PCT}%`,
            left: `${IMG_LEFT_PCT}%`,
          }}
        />
      </div>
    </div>
  );
};

export const QyvoraLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
  return (
    <div className={`logo-wrap flex-none w-[292px] max-w-full ${className}`}>
      <div className="w-full aspect-[848/116] overflow-hidden relative">
        <img 
          src={logoSrc} 
          alt="QYVORA" 
          className="absolute max-w-none"
          style={{
            height: `${IMG_H_PCT}%`,
            top: `${IMG_TOP_PCT}%`,
            left: `${IMG_LEFT_PCT}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
