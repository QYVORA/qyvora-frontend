import React from 'react';
import { useTheme } from '../../../core/contexts/ThemeContext';

export const DARK_LOGO_SRC = '/qyvora-full-logo.webp';
export const LIGHT_LOGO_SRC = '/qyvora-full-logo.webp';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface LogoProps {
  className?: string;
  size?: LogoSize;
}

// PNG is 1536×1024 (3:2). We render at 2.5× visual height so the mark fills
// the container, then clip with overflow-hidden.
const sizes: Record<LogoSize, { containerH: string; containerW: string; imgH: string }> = {
  sm: { containerH: 'h-10',  containerW: 'w-[150px]', imgH: 'h-[90px]'  },
  md: { containerH: 'h-12',  containerW: 'w-[180px]', imgH: 'h-[108px]' },
  lg: { containerH: 'h-14',  containerW: 'w-[210px]', imgH: 'h-[126px]' },
  xl: { containerH: 'h-16',  containerW: 'w-[240px]', imgH: 'h-[144px]' },
  '2xl': { containerH: 'h-20', containerW: 'w-[300px]', imgH: 'h-[180px]' },
  '3xl': { containerH: 'h-24', containerW: 'w-[360px]', imgH: 'h-[216px]' },
};

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { theme } = useTheme();
  const { containerH, containerW, imgH } = sizes[size];
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
  return (
    <div className={`logo-wrap ${className}`}>
      <div className={`${containerH} ${containerW} overflow-hidden flex-none flex items-center justify-center`}>
        <img
          src={logoSrc}
          alt="QYVORA"
          className={`${imgH} w-auto object-contain flex-none`}
        />
      </div>
    </div>
  );
};

export const QyvoraLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
  return (
    <div className={`logo-wrap ${className}`}>
      <div className="h-12 w-[180px] overflow-hidden flex-none flex items-center justify-center">
        <img src={logoSrc} alt="QYVORA" className="h-[108px] w-auto object-contain flex-none" />
      </div>
    </div>
  );
};

export default Logo;
