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
  <div className="max-w-2xl">
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">{kicker}</h3>
    <h4 className="text-xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-tight mt-2">
      {title} <span className="text-accent">{accent}</span>
    </h4>
    {description && (
      <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-3 font-mono">{description}</p>
    )}
  </div>
);

export default ToolSectionHeader;
