import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, ChevronRight, Wrench, Settings, Globe } from 'lucide-react';
import Identicon from '../../../../../shared/components/Identicon';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';
import { TOOLS } from '@/features/student/constants/tools';

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
        className="w-11 h-11 md:w-12 md:h-12 flex-none rounded-xl overflow-hidden aspect-square transition-colors focus:outline-none border-2 border-accent bg-black min-h-0"
        aria-label="Profile menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Identicon value={user?.username || '?'} size={48} className="w-full h-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/50 bg-bg-card shadow-2xl shadow-black/50 z-[80] overflow-hidden"
            role="menu"
          >
            {/* User header */}
            <Link
              to="/dashboard/profile"
              onClick={close}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20 transition-colors hover:bg-accent-dim/30"
              role="menuitem"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden border border-accent/40">
                <Identicon value={user?.username || '?'} size={36} className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-text-primary truncate">
                  {user?.username || '-'}
                </div>
                <div className="text-[9px] text-text-muted truncate">{user?.email || '-'}</div>
              </div>
              {user?.rank && (
                <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[7px] font-black uppercase tracking-widest text-accent shrink-0">
                  {user.rank}
                </span>
              )}
            </Link>

            {/* Menu items */}
            <div className="p-1.5">
              {/* Notifications */}
              <button
                onClick={() => handleItemClick(onOpenNotifications)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="relative w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-accent text-on-accent text-[7px] font-black rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('student.topbar.notifications.title')}
                  </div>
                </div>
                <ChevronRight size={11} className="text-text-muted/30 shrink-0" />
              </button>

              {/* Tools */}
              <div>
                <button
                  onClick={() => setToolsExpanded(prev => !prev)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98] group"
                  role="menuitem"
                  aria-expanded={toolsExpanded}
                >
                  <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                    <Wrench size={13} className="text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                      {t('student.tools.title')}
                    </div>
                  </div>
                  <ChevronRight
                    size={11}
                    className={`text-text-muted/30 shrink-0 transition-transform duration-200 ${toolsExpanded ? 'rotate-90' : ''}`}
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
                      <div className="pl-4 pr-1.5 pb-1 space-y-0.5">
                        {TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.id}
                              onClick={() => handleToolClick(tool)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98] group"
                            >
                              <Icon size={11} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
                              <span className="text-[9px] font-bold text-text-muted group-hover:text-text-primary transition-colors flex-1 min-w-0 truncate">
                                {tool.label}
                              </span>
                              <span className="text-[7px] font-mono text-text-muted/40 shrink-0">{tool.shortcut}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Network Lab */}
              <Link
                to="/dashboard/networks"
                onClick={close}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                  <Globe size={13} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('nav.networkLab') || 'Network Lab'}
                  </div>
                </div>
                <ChevronRight size={11} className="text-text-muted/30 shrink-0" />
              </Link>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                onClick={close}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                  <Settings size={13} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">
                    {t('nav.settings') || 'Settings'}
                  </div>
                </div>
                <ChevronRight size={11} className="text-text-muted/30 shrink-0" />
              </Link>
            </div>

            {/* Logout */}
            <div className="p-1.5 border-t border-border/20">
              <button
                onClick={() => handleItemClick(handleLogout)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-red-400/10 active:scale-[0.98] group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 group-hover:bg-red-400/10 transition-colors">
                  <LogOut size={13} className="text-text-muted group-hover:text-red-400 transition-colors" />
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
