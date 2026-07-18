import React, { useState, useRef, useEffect } from 'react';
import { Wrench, Terminal, Code2, Network } from 'lucide-react';
import { BottomSheet, BottomSheetContent, BottomSheetClose } from '@/shared/components/ui/BottomSheet';
import { IconX } from '@/shared/components/icons';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';

interface ToolsDropdownProps {
  onOpenTerminal: () => void;
  onOpenIDE: () => void;
  onOpenNetworkVisualizer: () => void;
}

const TOOL_ITEMS = [
  { id: 'ide', label: 'IDE', description: 'Write and run Python/Bash for course exercises', icon: Code2, shortcut: 'Ctrl+Shift+I', route: '/dashboard/tools/ide' },
  { id: 'terminal', label: 'Terminal', description: 'Kali Linux terminal emulator', icon: Terminal, shortcut: 'Ctrl+`', route: '/dashboard/tools/terminal' },
  { id: 'network-visualizer', label: 'Network Visualizer', description: 'Build and explore network topologies', icon: Network, shortcut: 'Ctrl+Shift+N', route: '/dashboard/tools/network-visualizer' },
];

const ToolsDropdown: React.FC<ToolsDropdownProps> = ({
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
}) => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [chosenTool, setChosenTool] = useState<typeof TOOL_ITEMS[number] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const panelHandlers: Record<string, () => void> = {
    ide: onOpenIDE,
    terminal: onOpenTerminal,
    'network-visualizer': onOpenNetworkVisualizer,
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        onOpenIDE();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        onOpenNetworkVisualizer();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenIDE, onOpenNetworkVisualizer]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const handleToolClick = (tool: typeof TOOL_ITEMS[number]) => {
    setOpen(false);
    setMobileOpen(false);
    setChosenTool(tool);
    setChooserOpen(true);
  };

  const handleSelectPanel = () => {
    if (chosenTool) panelHandlers[chosenTool.id]?.();
  };

  const handleSelectFullscreen = () => {
    if (chosenTool) {
      window.open(chosenTool.route, '_blank');
    }
  };

  const toolList = (
    <div className="flex flex-col gap-1 p-2">
      {TOOL_ITEMS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
              <Icon size={18} className="text-text-muted group-hover:text-accent transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                {tool.label}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5 truncate">{tool.description}</div>
            </div>
            <span className="text-[9px] font-mono text-text-muted/50 shrink-0">{tool.shortcut}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop trigger */}
      <div ref={dropdownRef} className="relative hidden md:block">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-12 h-12 md:w-13 md:h-13 flex items-center justify-center transition-colors rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50"
          aria-label="Open tools"
          aria-expanded={open}
        >
          <Wrench size={28} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/30 bg-bg-card shadow-2xl shadow-black/40 z-[80] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">Tools</span>
            </div>
            {toolList}
          </div>
        )}
      </div>

      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
        aria-label="Open tools"
      >
        <Wrench size={20} />
      </button>

      {/* Mobile bottom sheet */}
      <BottomSheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <BottomSheetContent ariaLabel="Tools">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Wrench size={18} className="text-accent" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-text-primary">Tools</span>
            </div>
            <BottomSheetClose className="p-2 text-text-muted hover:text-accent transition-colors" aria-label="Close tools">
              <IconX size={20} />
            </BottomSheetClose>
          </div>
          {toolList}
        </BottomSheetContent>
      </BottomSheet>

      {/* Tool chooser modal */}
      {chosenTool && (
        <ToolChooserModal
          open={chooserOpen}
          onOpenChange={setChooserOpen}
          toolId={chosenTool.id}
          toolLabel={chosenTool.label}
          onSelectPanel={handleSelectPanel}
          onSelectFullscreen={handleSelectFullscreen}
        />
      )}
    </>
  );
};

export default ToolsDropdown;
