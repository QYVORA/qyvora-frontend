import React from 'react';

export interface ToolSectionHeaderProps {
  kicker: string;
  title: string;
  accent: string;
  description?: string;
}

/** Shared kicker/title/accent/description block for the open-source tool pages. */
const ToolSectionHeader: React.FC<ToolSectionHeaderProps> = ({
  kicker,
  title,
  accent,
  description,
}) => (
  <div className="space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{kicker}</p>
    <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-tight">
      {title} <span className="text-accent">{accent}</span>
    </h2>
    {description && (
      <p className="max-w-xl text-base sm:text-lg text-text-muted leading-relaxed font-mono">{description}</p>
    )}
  </div>
);

export default ToolSectionHeader;
