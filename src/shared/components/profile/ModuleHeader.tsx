import type { ReactNode } from 'react';

interface ModuleHeaderProps {
  icon: ReactNode;
  /** Color class for the icon (accent only). */
  iconClassName?: string;
  title: string;
  trailing?: ReactNode;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  icon,
  iconClassName = 'text-accent',
  title,
  trailing,
}) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised ${iconClassName}`}
        >
          {icon}
        </span>
        <h3 className="type-label uppercase tracking-[0.12em] text-text-muted">
          {title}
        </h3>
      </div>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </div>
  );
};

export default ModuleHeader;