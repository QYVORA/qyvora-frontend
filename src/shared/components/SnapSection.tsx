import React from 'react';

const SnapSection: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}> = ({ id, children, className = '', innerClassName = '' }) => {
  return (
    <section
      id={id}
      className={`relative md:snap-start md:snap-always md:h-screen w-full flex-shrink-0 box-border bg-transparent md:overflow-hidden ${className}`}
    >
      <div
        className={`w-full h-full relative z-10 flex flex-col justify-center py-12 md:py-0 ${innerClassName}`}
        data-snap-child=""
      >
        {children}
      </div>
    </section>
  );
};

export default SnapSection;
export { SnapSection };
