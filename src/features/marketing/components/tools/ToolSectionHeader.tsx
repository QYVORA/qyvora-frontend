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
    <p className="text-kicker font-black uppercase tracking-[0.3em] text-accent">{kicker}</p>
    <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary md:text-4xl">
      {title} <span className="text-accent">{accent}</span>
    </h2>
    {description && (
      <p className="max-w-2xl text-sm font-mono text-text-secondary leading-[2] md:text-base md:leading-[2.2]">
        {description}
      </p>
    )}
  </div>
);

export default ToolSectionHeader;