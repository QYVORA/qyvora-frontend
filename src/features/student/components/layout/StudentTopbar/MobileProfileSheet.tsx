import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, Terminal, Code2, Network, Wrench, Settings, Globe } from 'lucide-react';
import { IconX } from '@/shared/components/icons';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '../../../../../shared/components/ui/BottomSheet';
import Identicon from '../../../../../shared/components/Identicon';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';

interface MobileProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    uid: string;
    username: string;
    email: string;
    rank: string;
  } | null;
  unreadCount: number;
  onOpenTerminal: () => void;
  onOpenIDE: () => void;
  onOpenNetworkVisualizer: () => void;
  handleLogout: () => void;
}

const TOOLS = [
  { id: 'terminal' as const, label: 'Terminal', description: 'Kali Linux terminal emulator', icon: Terminal, shortcut: 'Ctrl+`', route: '/dashboard/tools/terminal' },
  { id: 'ide' as const, label: 'IDE', description: 'Write and run Python/Bash', icon: Code2, shortcut: 'Ctrl+Shift+I', route: '/dashboard/tools/ide' },
  { id: 'network-visualizer' as const, label: 'Network Visualizer', description: 'Build network topologies', icon: Network, shortcut: 'Ctrl+Shift+N', route: '/dashboard/tools/network-visualizer' },
];

const MobileProfileSheet: React.FC<MobileProfileSheetProps> = ({
  open,
  onOpenChange,
  user,
  unreadCount,
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const [chooserOpen, setChooserOpen] = useState(false);
  const [chosenTool, setChosenTool] = useState<typeof TOOLS[number] | null>(null);

  const panelHandlers: Record<string, () => void> = {
    ide: onOpenIDE,
    terminal: onOpenTerminal,
    'network-visualizer': onOpenNetworkVisualizer,
  };

  const handleToolClick = (tool: typeof TOOLS[number]) => {
    onOpenChange(false);
    setChosenTool(tool);
    setChooserOpen(true);
  };

  const handleSelectPanel = () => {
    if (chosenTool) panelHandlers[chosenTool.id]?.();
  };

  const handleSelectFullscreen = () => {
    if (chosenTool) window.open(chosenTool.route, '_blank');
  };

  return (
    <>
      <BottomSheet open={open} onOpenChange={onOpenChange}>
        <BottomSheetContent ariaLabel="Profile menu" className="max-h-[75svh] flex flex-col">
          <div className="flex justify-center pt-3 pb-1 flex-none">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 flex-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                <Identicon value={user?.username || '?'} size={48} className="w-full h-full" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-text-primary">
                  {user?.username || '—'}
                </div>
                <div className="text-[10px] text-text-muted">{user?.email || '—'}</div>
                {user?.rank && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">
                    {user.rank}
                  </span>
                )}
              </div>
            </div>
            <BottomSheetClose className="p-2 text-text-muted hover:text-accent transition-colors" aria-label="Close menu">
              <IconX size={20} />
            </BottomSheetClose>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Notifications */}
            <Link
              to="/dashboard/notifications"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/30"
            >
              <div className="relative w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent text-bg text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                  {t('student.topbar.notifications.title')}
                </div>
                {unreadCount > 0 && (
                  <div className="text-[10px] text-accent mt-0.5">{unreadCount} unread</div>
                )}
              </div>
            </Link>

            {/* Tools */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0">
                  <Wrench size={16} className="text-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                    {t('student.tools.title')}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-3 space-y-1">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98]"
                    >
                      <Icon size={14} className="text-text-muted shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-text-primary">{tool.label}</div>
                        <div className="text-[9px] text-text-muted truncate">{tool.description}</div>
                      </div>
                      <span className="text-[8px] font-mono text-text-muted/40 shrink-0">{tool.shortcut}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile link */}
            <Link
              to="/dashboard/profile"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/30"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0">
                <User size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                  {t('nav.profile') || 'Profile'}
                </div>
              </div>
            </Link>

            {/* Network Lab */}
            <Link
              to="/dashboard/networks"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/30"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0">
                <Globe size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                  {t('nav.networkLab') || 'Network Lab'}
                </div>
              </div>
            </Link>

            {/* Settings */}
            <Link
              to="/dashboard/settings"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/30"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0">
                <Settings size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                  {t('nav.settings') || 'Settings'}
                </div>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="px-4 pb-4 flex-none">
            <button
              onClick={() => { onOpenChange(false); handleLogout(); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-400/20 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" /> {t('button.logOut')}
            </button>
          </div>
        </BottomSheetContent>
      </BottomSheet>

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

export default MobileProfileSheet;
