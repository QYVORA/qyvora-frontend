import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CONNECTION_MEDIA } from './devices';

interface ConnectionMediumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mediumId: string, mediumLabel: string) => void;
}

const ConnectionMediumModal: React.FC<ConnectionMediumModalProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[210] bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          aria-label="Select connection medium"
          className="fixed z-[211] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-bg-card border border-border/30 rounded-2xl shadow-2xl shadow-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
        >
          <RadixDialog.Title className="sr-only">Select Connection Medium</RadixDialog.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-accent">Connection Medium</div>
              <div className="text-[10px] text-text-muted mt-0.5">Choose the link type</div>
            </div>
            <RadixDialog.Close className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors">
              <X size={14} />
            </RadixDialog.Close>
          </div>

          {/* Medium options */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {CONNECTION_MEDIA.map((group) => (
              <div key={group.category}>
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">
                  {group.category}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((medium) => (
                    <button
                      key={medium.id}
                      onClick={() => {
                        onSelect(medium.id, medium.label);
                        onOpenChange(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/20 text-left transition-all hover:bg-accent-dim/50 hover:border-accent/20 active:scale-[0.98] group"
                    >
                      <span className="text-base">{medium.icon}</span>
                      <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary transition-colors">
                        {medium.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default ConnectionMediumModal;
