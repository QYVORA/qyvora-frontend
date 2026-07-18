import React from 'react';
import cyberPointsLogo from '@/assets/branding/logos/cyber-points-logo.webp';

interface CpLogoProps {
  className?: string;
  alt?: string;
}

const CpLogo: React.FC<CpLogoProps> = ({ className = 'w-4 h-4', alt = 'Cyber Points' }) => (
  <img
    src={cyberPointsLogo}
    alt={alt}
    width={16}
    height={16}
    className={`${className} object-contain inline-block align-middle`}
  />
);

export default CpLogo;
