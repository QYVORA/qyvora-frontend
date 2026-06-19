import React from 'react';

interface HeroBackgroundProps {
  className?: string;
}

function HeroBackground({ className = "" }: HeroBackgroundProps) {
  return null;
}

export default React.memo(HeroBackground);
