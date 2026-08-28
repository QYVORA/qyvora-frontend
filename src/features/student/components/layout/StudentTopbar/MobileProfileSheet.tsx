import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Wrench, Settings, Globe } from 'lucide-react';
import { IconX } from '@/shared/components/icons';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '../../../../../shared/components/ui/BottomSheet';
import Identicon from '../../../../../shared/components/Identicon';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';
import { TOOLS } from '@/features/student/constants/tools';
import { SETTINGS_SECTIONS, isSettingsPath } from '@/features/student/constants/settingsSections';

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
  const location = useLocation();
  const onSettingsPage = isSettingsPath(location.pathname);
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
          {onSettingsPage ? (
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 flex-none">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">CONFIGURE</div>
                <div className="text-sm font-black uppercase tracking-widest text-text-primary">Settings</div>
              </div>
              <BottomSheetClose className="p-2 text-text-muted hover:text-accent transition-colors" aria-label="Close menu">
                <IconX size={20} />
              </BottomSheetClose>
            </div>
          ) : (
            <Link
              to="/dashboard/profile"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-5 py-4 border-b border-border/50 flex-none hover:bg-accent-dim/30 transition-colors"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden border border-accent/40">
                <Identicon value={user?.username || '?'} size={44} className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black uppercase tracking-widest text-text-primary truncate">
                  {user?.username || '-'}
                </div>
                <div className="text-[10px] text-text-muted truncate">{user?.email || '-'}</div>
              </div>
              {user?.rank && (
                <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent shrink-0">
                  {user.rank}
                </span>
              )}
              <BottomSheetClose className="p-1.5 text-text-muted hover:text-accent transition-colors shrink-0" aria-label="Close menu">
                <IconX size={18} />
              </BottomSheetClose>
            </Link>
          )}

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {onSettingsPage ? (
              SETTINGS_SECTIONS.map((section) => {
                const active = location.pathname === section.path;
                const Icon = section.icon;
                return (
                  <Link
                    key={section.id}
                    to={section.path}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                      active ? 'border-accent/40 bg-accent/5' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                      <Icon size={15} className={active ? 'text-accent' : 'text-text-muted'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-black uppercase tracking-widest ${active ? 'text-accent' : 'text-text-primary'}`}>
                        {t(section.labelKey)}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                {/* Notifications */}
                <Link
                  to="/dashboard/notifications"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/50"
                >
                  <div className="relative w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-accent text-on-accent text-[8px] font-black rounded-full flex items-center justify-center leading-none">
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
                    <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                      <Wrench size={15} className="text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                        {t('student.tools.title')}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-3 space-y-0.5">
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all hover:bg-accent-dim/40 active:scale-[0.98]"
                        >
                          <Icon size={13} className="text-text-muted shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-text-primary">{tool.label}</div>
                          </div>
                          <span className="text-[8px] font-mono text-text-muted/40 shrink-0">{tool.shortcut}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Network Lab */}
                <Link
                  to="/dashboard/networks"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/50"
                >
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-text-muted" />
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
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-left transition-all active:scale-[0.98] hover:border-accent/50"
                >
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                    <Settings size={15} className="text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black uppercase tracking-widest text-text-primary">
                      {t('nav.settings') || 'Settings'}
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="px-4 pb-4 flex-none">
            <button
              onClick={() => { onOpenChange(false); handleLogout(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-danger/20 text-danger text-xs font-bold uppercase tracking-widest hover:bg-danger/10 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" /> {t('button.logOut')}
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
