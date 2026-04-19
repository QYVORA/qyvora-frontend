import React from 'react';

const LOGO_SRC = '/HSOCIETY_LOGO.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// PNG is 1536×1024 (3:2) with the text mark in the centre ~40% of the height.
// We render the image at 2.5× the desired visual height so the mark fills the
// container, then clip with overflow-hidden.
const sizes: Record<string, { containerH: string; containerW: string; imgH: string }> = {
  sm: { containerH: 'h-6',  containerW: 'w-[90px]',  imgH: 'h-[56px]'  },
  md: { containerH: 'h-7',  containerW: 'w-[110px]', imgH: 'h-[66px]'  },
  lg: { containerH: 'h-8',  containerW: 'w-[130px]', imgH: 'h-[76px]'  },
  xl: { containerH: 'h-10', containerW: 'w-[160px]', imgH: 'h-[96px]'  },
};

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { containerH, containerW, imgH } = sizes[size];
  return (
    // logo-wrap gives a bg-bg-card pill so the white logo text is always visible
    <div className={`logo-wrap ${className}`}>
      <div className={`${containerH} ${containerW} overflow-hidden flex-none flex items-center justify-center`}>
        <img
          src={LOGO_SRC}
          alt="HSociety"
          className={`${imgH} w-auto object-contain flex-none`}
        />
      </div>
    </div>
  );
};

export const HSocietyLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`logo-wrap ${className}`}>
    <div className="h-8 w-[130px] overflow-hidden flex-none flex items-center justify-center">
      <img src={LOGO_SRC} alt="HSociety" className="h-[76px] w-auto object-contain flex-none" />
    </div>
  </div>
);

export default Logo;
