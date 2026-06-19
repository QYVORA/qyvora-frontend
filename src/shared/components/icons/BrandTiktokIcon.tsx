import React from 'react';

interface BrandTiktokIconProps {
  className?: string;
}

const BrandTiktokIcon: React.FC<BrandTiktokIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v6.39c0 .73-.07 1.47-.25 2.19-.57 2.37-2.39 4.38-4.75 4.96-1.63.4-3.38.31-4.96-.28-2.61-.98-4.41-3.66-4.32-6.5.03-2.6 1.7-5.06 4.19-5.96.88-.32 1.83-.45 2.77-.41v4.03c-.6-.11-1.24-.03-1.8.2-.98.41-1.69 1.4-1.78 2.47-.14 1.59 1.02 3.1 2.61 3.28.91.1 1.84-.19 2.48-.86.51-.54.74-1.28.72-2.02V.02z" />
  </svg>
);

export default BrandTiktokIcon;
