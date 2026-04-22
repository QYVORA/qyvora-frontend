import React from 'react';

interface BrandXIconProps {
  className?: string;
}

const BrandXIcon: React.FC<BrandXIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M18.9 2h3.68l-8.04 9.19L24 22h-7.41l-5.8-7.02L4.66 22H.98l8.6-9.83L0 2h7.6l5.24 6.35L18.9 2Zm-1.29 17.8h2.04L6.5 4.1H4.3L17.61 19.8Z" />
  </svg>
);

export default BrandXIcon;

