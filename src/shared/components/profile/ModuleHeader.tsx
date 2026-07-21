import type { ReactNode } from 'react';

interface ModuleHeaderProps {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  trailing?: ReactNode;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  icon,
  iconClassName = 'bg-accent/10',
  title,
  trailing,
}) => {
  return (
    <div className="px-5 py-4 border-b border-border/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClassName}`}
          >
            {icon}
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
            {title}
          </h3>
        </div>
        {trailing && <span>{trailing}</span>}
      </div>
    </div>
  );
};

export default ModuleHeader;
