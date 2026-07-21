import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, User, ChevronRight, Terminal, Code2, Network, Wrench, Settings, Globe } from 'lucide-react';
import Identicon from '../../../../../shared/components/Identicon';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';

interface ProfileDropdownProps {
  user: {
    uid: string;
    username: string;
    email: string;
    rank: string;
  } | null;
  unreadCount: number;
  onOpenNotifications: () => void;
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

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [chosenTool, setChosenTool] = useState<typeof TOOLS[number] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const panelHandlers: Record<string, () => void> = {
    ide: onOpenIDE,
    terminal: onOpenTerminal,
    'network-visualizer': onOpenNetworkVisualizer,
  };

  const close = useCallback(() => {
    setOpen(false);
    setToolsExpanded(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(e.target as Node)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const handleToolClick = (tool: typeof TOOLS[number]) => {
    setChosenTool(tool);
    setChooserOpen(true);
    close();
  };

  const handleSelectPanel = () => {
    if (chosenTool) panelHandlers[chosenTool.id]?.();
  };

  const handleSelectFullscreen = () => {
    if (chosenTool) window.open(chosenTool.route, '_blank');
  };

  const handleItemClick = (action: () => void) => {
    close();
    action();
  };

  return (
    <div ref={dropdownRef} className="relative hidden md:block">
      <button
        ref={triggerRef}
        onClick={() => setOpen(prev => !prev)}
className="w-11 h-11 md:w-12 md:h-12 flex-none transition-colors focus:outline-none"
        aria-label="Profile menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Identicon value={user?.username || '?'} size={48} className="w-full h-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border/30 bg-bg-card shadow-2xl shadow-black/40 z-[80] overflow-hidden"
            role="menu"
          >
            {/* User header */}
            <div className="px-4 py-3 border-b border-border/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  <Identicon value={user?.username || '?'} size={40} className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-text-primary truncate">
                    {user?.username || '—'}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">{user?.email || '—'}</div>
                  {user?.rank && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">
                      {user.rank}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              {/* Notifications */}
              <button
                onClick={() => handleItemClick(onOpenNotifications)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="relative w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-1 bg-accent text-bg text-[7px] font-black rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('student.topbar.notifications.title')}
                  </div>
                  {unreadCount > 0 && (
                    <div className="text-[9px] text-accent mt-0.5">{unreadCount} unread</div>
                  )}
                </div>
                <ChevronRight size={12} className="text-text-muted/30 shrink-0" />
              </button>

              {/* Tools */}
              <div>
                <button
                  onClick={() => setToolsExpanded(prev => !prev)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                  role="menuitem"
                  aria-expanded={toolsExpanded}
                >
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                    <Wrench size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                      {t('student.tools.title')}
                    </div>
                  </div>
                  <ChevronRight
                    size={12}
                    className={`text-text-muted/30 shrink-0 transition-transform ${toolsExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {toolsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pr-2 pb-1">
                        {TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.id}
                              onClick={() => handleToolClick(tool)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                            >
                              <Icon size={12} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold text-text-muted group-hover:text-text-primary transition-colors">
                                  {tool.label}
                                </div>
                              </div>
                              <span className="text-[8px] font-mono text-text-muted/40 shrink-0">{tool.shortcut}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile link */}
              <Link
                to="/dashboard/profile"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                  <User size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('nav.profile') || 'Profile'}
                  </div>
                </div>
                <ChevronRight size={12} className="text-text-muted/30 shrink-0" />
              </Link>

              {/* Network Lab */}
              <Link
                to="/dashboard/networks"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                  <Globe size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('nav.networkLab') || 'Network Lab'}
                  </div>
                </div>
                <ChevronRight size={12} className="text-text-muted/30 shrink-0" />
              </Link>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                onClick={close}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/50 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 group-hover:bg-accent/10 transition-colors">
                  <Settings size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('nav.settings') || 'Settings'}
                  </div>
                </div>
                <ChevronRight size={12} className="text-text-muted/30 shrink-0" />
              </Link>
            </div>

            {/* Logout */}
            <div className="px-2 pb-2">
              <button
                onClick={() => handleItemClick(handleLogout)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all hover:bg-red-400/10 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border/30 flex items-center justify-center shrink-0 group-hover:border-red-400/30 group-hover:bg-red-400/10 transition-colors">
                  <LogOut size={14} className="text-text-muted group-hover:text-red-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-red-400 transition-colors">
                    {t('button.logOut')}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default ProfileDropdown;
