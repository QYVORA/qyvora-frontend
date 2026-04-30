import React from 'react';

interface CpLogoProps {
  className?: string;
  alt?: string;
}

const CpLogo: React.FC<CpLogoProps> = ({ className = 'w-4 h-4', alt = 'CP' }) => (
  <img
    src="/assets/branding/logos/cyber-points-logo.png"
    alt={alt}
    className={`${className} object-contain inline-block align-middle`}
  />
);

export default CpLogo;
