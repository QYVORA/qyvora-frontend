import React from 'react';

const InlineDiagram: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-8 p-3 md:p-8 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center w-full">
    {children}
  </div>
);

export default InlineDiagram;
export { InlineDiagram };
