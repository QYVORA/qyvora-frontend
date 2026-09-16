import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface ImmersiveToolShellProps {
  title: React.ReactNode;
  /** Context chip clarifying tool scope, e.g. "Standalone terminal" or "Room terminal". */
  scope?: React.ReactNode;
  /** Right-side status (connection/save state). */
  status?: React.ReactNode;
  /** Extra actions (save/reset/help). */
  actions?: React.ReactNode;
  /** Router exit destination; defaults back to the student tools hub. */
  exitTo?: string;
  exitLabel?: React.ReactNode;
  /** Callback exit for non-route exits. */
  onExit?: () => void;
  children?: React.ReactNode;
}

/**
 * ImmersiveToolShell — full-viewport chrome for standalone IDE, terminal and
 * network-visualizer routes. One quiet top bar (exit, title, scope, status,
 * actions) and the tool filling the remaining viewport. Terminal colour stays
 * strictly inside the tool content, never on this shell.
 */
const ImmersiveToolShell: React.FC<ImmersiveToolShellProps> = ({
  title,
  scope,
  status,
  actions,
  exitTo = '/dashboard/tools',
  exitLabel,
  onExit,
  children,
}) => {
  const exit = exitTo ? (
    <Button to={exitTo} variant="ghost" className="shrink-0 px-2.5">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {exitLabel}
    </Button>
  ) : onExit ? (
    <Button variant="ghost" onClick={onExit} className="shrink-0 px-2.5">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {exitLabel}
    </Button>
  ) : null;

  return (
    <div className="flex h-dvh w-full flex-col bg-canvas">
      <header className="z-[100] flex min-h-[56px] items-center justify-between gap-3 border-b border-border-subtle bg-canvas px-3 py-2.5 md:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {exit}
          <h1 className="truncate text-sm font-black uppercase tracking-tight text-text-primary md:text-base">
            {title}
          </h1>
          {scope && (
            <span className="type-meta hidden items-center rounded-md border border-border-subtle bg-surface-raised px-2 py-1 text-text-secondary sm:inline-flex">
              {scope}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {status}
          {actions}
        </div>
      </header>

      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
};

export default ImmersiveToolShell;