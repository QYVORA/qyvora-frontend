import React from 'react';
import { useTheme } from '../../../core/contexts/ThemeContext';

export const DARK_LOGO_SRC = '/images/HSOCIETY_LOGO.png';
export const LIGHT_LOGO_SRC = '/images/HSOCIETY_LOGO_LIGHT.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// PNG is 1536×1024 (3:2). We render at 2.5× visual height so the mark fills
// the container, then clip with overflow-hidden.
const sizes: Record<string, { containerH: string; containerW: string; imgH: string }> = {
  sm: { containerH: 'h-8',   containerW: 'w-[120px]', imgH: 'h-[72px]'  },
  md: { containerH: 'h-10',  containerW: 'w-[150px]', imgH: 'h-[90px]'  },
  lg: { containerH: 'h-12',  containerW: 'w-[180px]', imgH: 'h-[108px]' },
  xl: { containerH: 'h-14',  containerW: 'w-[210px]', imgH: 'h-[126px]' },
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
          alt="HSociety"
          className={`${imgH} w-auto object-contain flex-none`}
        />
      </div>
    </div>
  );
};

export const HSocietyLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
  return (
    <div className={`logo-wrap ${className}`}>
      <div className="h-12 w-[180px] overflow-hidden flex-none flex items-center justify-center">
        <img src={logoSrc} alt="HSociety" className="h-[108px] w-auto object-contain flex-none" />
      </div>
    </div>
  );
};

export default Logo;
