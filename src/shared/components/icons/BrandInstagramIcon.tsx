import React from 'react';

interface BrandInstagramIconProps {
  className?: string;
}

const BrandInstagramIcon: React.FC<BrandInstagramIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M7.065 0C3.161 0 0 3.161 0 7.065v9.87C0 20.839 3.161 24 7.065 24h9.87c3.904 0 7.065-3.161 7.065-7.065V7.065C24 3.161 20.839 0 16.935 0zm0 2.152h9.87c2.723 0 4.913 2.19 4.913 4.913v9.87c0 2.723-2.19 4.913-4.913 4.913H7.065c-2.723 0-4.913-2.19-4.913-4.913V7.065c0-2.723 2.19-4.913 4.913-4.913zm9.87 2.228c-.792 0-1.433.641-1.433 1.433s.641 1.433 1.433 1.433 1.433-.641 1.433-1.433-.641-1.433-1.433-1.433zm-4.935 2.685a4.935 4.935 0 1 0 0 9.87 4.935 4.935 0 0 0 0-9.87zm0 2.152a2.783 2.783 0 1 1 0 5.566 2.783 2.783 0 0 1 0-5.566z" />
  </svg>
);

export default BrandInstagramIcon;
