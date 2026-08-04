import React from 'react';

interface AthenaBoxesProps {
  size?: string;
  gap?: string;
}

const AthenaBoxes: React.FC<AthenaBoxesProps> = ({
  size = 'w-2.5 h-2.5',
  gap = 'gap-1.5',
}) => (
  <span className={`inline-flex items-center ${gap}`} aria-hidden="true">
    <span className={`${size} bg-accent rounded-sm animate-athena-box-1 flex-none`} />
    <span className={`${size} bg-accent/60 rounded-sm animate-athena-box-2 flex-none`} />
    <span className={`${size} bg-accent/30 rounded-sm animate-athena-box-3 flex-none`} />
  </span>
);

export default AthenaBoxes;
