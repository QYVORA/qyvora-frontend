import React from 'react';

const InlineDiagram: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative my-10 md:my-12 p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <div className="relative z-10 flex items-center justify-center w-full">
      {children}
    </div>
  </div>
);

export default InlineDiagram;
export { InlineDiagram };
