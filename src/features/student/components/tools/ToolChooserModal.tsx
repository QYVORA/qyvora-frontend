import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, Maximize2, LayoutPanelLeft, Code2, Terminal, Network } from 'lucide-react';

interface ToolChooserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolId: string;
  toolLabel: string;
  onSelectPanel: () => void;
  onSelectFullscreen: () => void;
}

const TOOL_ICONS: Record<string, typeof Code2> = {
  ide: Code2,
  terminal: Terminal,
  'network-visualizer': Network,
};

const ToolChooserModal: React.FC<ToolChooserModalProps> = ({
  open,
  onOpenChange,
  toolId,
  toolLabel,
  onSelectPanel,
  onSelectFullscreen,
}) => {
  const { t } = useTranslation();
  const Icon = TOOL_ICONS[toolId] || Code2;

  const handlePanel = () => {
    onOpenChange(false);
    onSelectPanel();
  };

  const handleFullscreen = () => {
    onOpenChange(false);
    onSelectFullscreen();
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          aria-label={t('components.toolChooser.openTool', { tool: toolLabel })}
          className="fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-bg-card border border-border/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
        >
          <RadixDialog.Title className="sr-only">{t('components.toolChooser.openTool', { tool: toolLabel })}</RadixDialog.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Icon size={18} className="text-accent" />
              </div>
              <div>
                <span className="text-sm font-black uppercase tracking-widest text-text-primary block">{toolLabel}</span>
                <span className="text-[10px] text-text-muted">{t('components.toolChooser.chooseHowToOpen')}</span>
              </div>
            </div>
            <RadixDialog.Close asChild>
              <button className="p-2 text-text-muted hover:text-accent active:scale-95 transition-colors rounded-lg hover:bg-accent-dim/50" aria-label="Close">
                <X size={16} />
              </button>
            </RadixDialog.Close>
          </div>

          {/* Options */}
          <div className="p-5 space-y-3">
            <button
              onClick={handlePanel}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:border-accent/40 bg-bg-elevated hover:bg-accent-dim/30 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                <LayoutPanelLeft size={22} className="text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                  {t('components.toolChooser.openInPanel')}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  {t('components.toolChooser.openInPanelDesc')}
                </div>
              </div>
            </button>

            <button
              onClick={handleFullscreen}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/30 hover:border-accent/40 bg-bg-elevated hover:bg-accent-dim/30 active:scale-[0.98] transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                <Maximize2 size={22} className="text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                  {t('components.toolChooser.openFullScreen')}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  {t('components.toolChooser.openFullScreenDesc')}
                </div>
              </div>
            </button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default ToolChooserModal;
