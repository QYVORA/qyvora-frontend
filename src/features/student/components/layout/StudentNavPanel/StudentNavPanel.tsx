import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import {
  IconDashboard,
  IconCode,
  IconTerminal,
  IconLabs,
  IconMarketplace,
  IconProfile,
  IconNetwork,
  IconNotification,
  IconLeaderboard,
  IconSettings,
  IconPlay,
  IconChevronRight,
} from '@/shared/components/icons';
import { Wrench, LogOut } from 'lucide-react';
import ToolChooserModal from '@/features/student/components/tools/ToolChooserModal';
import { TOOLS } from '@/features/student/constants/tools';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface StudentNavPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unreadCount: number;
  continuePath?: string | null;
  onOpenTerminal: () => void;
  onOpenIDE: () => void;
  onOpenNetworkVisualizer: () => void;
  handleLogout: () => void;
}

interface NavMenuTriggerProps {
  open: boolean;
  onClick: () => void;
  className?: string;
}

export const NavMenuTrigger: React.FC<NavMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ open, onClick, className = '', ...rest }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      aria-label={open ? t('aria.closeMenu', 'Close menu') : t('aria.openMenu', 'Open menu')}
      aria-expanded={open}
      aria-controls="student-nav-panel"
      aria-haspopup="dialog"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
        open
          ? 'border-accent bg-accent text-on-accent'
          : 'border-accent text-accent hover:bg-accent/10'
      } ${className}`}
      {...rest}
    >
      <span className="relative block h-3.5 w-5" aria-hidden="true">
        <span
          className="absolute left-0 top-[1px] h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'translateY(0) rotate(0)' }}
        />
        <span
          className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-current transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: open ? 0 : 1, transform: open ? 'translateX(-100%)' : 'translateX(0)' }}
        />
        <span
          className="absolute left-0 top-[11px] h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: open ? 'translateY(-6px) rotate(-45deg)' : 'translateY(0) rotate(0)' }}
        />
      </span>
    </button>
  );
};

interface NavItem {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  to?: string;
  onClick?: () => void;
  badge?: number | null;
  accent?: boolean;
}

const StudentNavPanel: React.FC<StudentNavPanelProps> = ({
  open,
  onOpenChange,
  unreadCount,
  continuePath,
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [chosenTool, setChosenTool] = useState<typeof TOOLS[number] | null>(null);

  const panelHandlers: Record<string, () => void> = {
    ide: onOpenIDE,
    terminal: onOpenTerminal,
    'network-visualizer': onOpenNetworkVisualizer,
  };

  const close = () => onOpenChange(false);

  // Escape to close, focus-first-link on open, lock page scroll.
  // Locking overflow on BOTH <html> and <body> stops the document from
  // scrolling on desktop (overflow:hidden on body alone is not reliable).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const tId = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 50);
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(tId);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  const handleToolClick = (tool: typeof TOOLS[number]) => {
    close();
    setChosenTool(tool);
    setChooserOpen(true);
  };

  const handleSelectPanel = () => {
    if (chosenTool) panelHandlers[chosenTool.id]?.();
  };

  const handleSelectFullscreen = () => {
    if (chosenTool) window.open(chosenTool.route, '_blank');
  };

  const navigateAndClose = (fn?: () => void) => {
    close();
    if (fn) fn();
  };

  const groups: { key: string; title: string; items: NavItem[] }[] = [
    {
      key: 'learn',
      title: t('student.navPanel.learn', 'LEARN'),
      items: [
        {
          key: 'courses',
          label: t('student.navPanel.coursesTitle', 'Courses'),
          description: t('student.navPanel.coursesDesc', 'Learn through structured lessons and guided walkthroughs.'),
          icon: IconCode,
          to: '/dashboard/courses',
        },
        {
          key: 'bootcamp',
          label: t('student.navPanel.bootcampTitle', 'Bootcamp'),
          description: t('student.navPanel.bootcampDesc', 'Follow the full Hacker Protocol Bootcamp curriculum phase by phase.'),
          icon: IconTerminal,
          to: '/dashboard/bootcamps',
        },
        {
          key: 'labs',
          label: t('student.navPanel.labsTitle', 'Labs'),
          description: t('student.navPanel.labsDesc', 'Practice hands-on offensive security in a live sandbox.'),
          icon: IconLabs,
          to: '/dashboard/labs',
        },
        {
          key: 'marketplace',
          label: t('student.navPanel.marketplaceTitle', 'Marketplace'),
          description: t('student.navPanel.marketplaceDesc', 'Browse and unlock courses to grow your skills.'),
          icon: IconMarketplace,
          to: '/dashboard/marketplace',
        },
      ],
    },
    {
      key: 'account',
      title: t('student.navPanel.account', 'ACCOUNT'),
      items: [
        {
          key: 'dashboard',
          label: t('student.navPanel.dashboardTitle', 'Dashboard'),
          description: t('student.navPanel.dashboardDesc', 'Overview of your progress, cyber points and quick actions.'),
          icon: IconDashboard,
          to: '/dashboard',
        },
        {
          key: 'profile',
          label: t('student.navPanel.profileTitle', 'Profile'),
          description: t('student.navPanel.profileDesc', 'Your rank, achievements and everything you have completed.'),
          icon: IconProfile,
          to: '/dashboard/profile',
        },
        {
          key: 'network-lab',
          label: t('student.navPanel.networkLabTitle', 'Network Lab'),
          description: t('student.navPanel.networkLabDesc', 'Build and explore network topologies.'),
          icon: IconNetwork,
          to: '/dashboard/networks',
        },
        {
          key: 'notifications',
          label: t('student.navPanel.notificationsTitle', 'Notifications'),
          description: t('student.navPanel.notificationsDesc', 'Alerts, updates and activity on your account.'),
          icon: IconNotification,
          to: '/dashboard/notifications',
          badge: unreadCount,
        },
      ],
    },
    {
      key: 'more',
      title: t('student.navPanel.more', 'MORE'),
      items: [
        {
          key: 'competitive',
          label: t('student.navPanel.competitiveTitle', 'Competitive'),
          description: t('student.navPanel.competitiveDesc', 'Rankings and competitive challenges.'),
          icon: IconLeaderboard,
          to: '/dashboard/competitive',
        },
        {
          key: 'settings',
          label: t('student.navPanel.settingsTitle', 'Settings'),
          description: t('student.navPanel.settingsDesc', 'Appearance, notifications, learning, security and account.'),
          icon: IconSettings,
          to: '/dashboard/settings',
        },
      ],
    },
  ];

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const inner = (
      <>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg-elevated text-accent transition-colors group-hover:bg-accent/10">
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-text-primary">
            <span className="truncate">{item.label}</span>
            {item.badge ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black uppercase leading-none text-on-accent tabular-nums">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">{item.description}</span>
        </span>
        {item.accent ? (
          <IconChevronRight size={14} className="shrink-0 text-on-accent/60" />
        ) : (
          <IconChevronRight size={14} className="shrink-0 text-text-muted/30 transition-colors group-hover:text-accent" />
        )}
      </>
    );

    const cls = `group flex items-start gap-3 rounded-2xl border border-border/50 p-4 text-left transition-colors focus:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent active:scale-[0.99] ${
      item.accent
        ? 'bg-accent text-on-accent hover:brightness-110'
        : 'bg-bg-card text-text-primary hover:border-accent/50 hover:bg-accent-dim/10'
    }`;

    if (item.to) {
      return (
        <Link key={item.key} to={item.to} onClick={() => close()} className={cls}>
          {inner}
        </Link>
      );
    }
    return (
      <button
        key={item.key}
        onClick={() => navigateAndClose(item.onClick)}
        className={cls}
      >
        {inner}
      </button>
    );
  };

  return (
    <>
      {/* ── Viewport-level navigation panel ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] bg-black/50"
              onClick={close}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              id="student-nav-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('student.navPanel.title', 'Navigation')}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 top-20 md:top-24 z-[96] overflow-y-auto bg-bg-alt"
            >
              <div className="w-full px-3 pb-5 pt-2 md:px-4 md:pb-8 md:pt-3 lg:px-6">
                {/* Continue Mission — prominent accent card */}
                {continuePath && (
                  <Link
                    to={continuePath}
                    onClick={close}
                    className="group mb-6 flex items-center gap-3 rounded-2xl bg-accent p-4 text-on-accent transition-[filter,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:brightness-110 active:scale-[0.99] md:mb-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20">
                      <IconPlay size={20} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-black uppercase tracking-widest">
                        {t('student.topbar.continueMission', 'Continue Mission')}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-on-accent/80">
                        {t('student.navPanel.continueDesc', 'Resume your active bootcamp where you left off.')}
                      </span>
                    </span>
                    <IconChevronRight size={16} className="shrink-0 text-on-accent/60" />
                  </Link>
                )}

                {/* Groups */}
                <div className="space-y-6 md:space-y-8">
                  {groups.map((group) => (
                    <section key={group.key}>
                      <h3 className="mb-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-accent md:mb-3">
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {group.items.map(renderItem)}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Tools + Logout */}
                <div className="mt-6 flex flex-col gap-3 md:mt-8 sm:flex-row sm:items-stretch">
                  <div className="flex-1 rounded-2xl border border-border/50 bg-bg-card p-3">
                    <button
                      onClick={() => setToolsOpen((v) => !v)}
                      aria-expanded={toolsOpen}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-accent-dim/10"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-elevated text-accent">
                        <Wrench size={16} />
                      </span>
                      <span className="flex-1 min-w-0 text-[10px] font-black uppercase tracking-widest text-text-primary">
                        {t('student.tools.title', 'Tools')}
                      </span>
                      <IconChevronRight
                        size={13}
                        className={`shrink-0 text-text-muted/40 transition-transform duration-200 ${toolsOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {toolsOpen && (
                        <motion.div
                          initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-1.5 px-1 pb-1 pt-1 sm:grid-cols-3">
                            {TOOLS.map((tool) => {
                              const TIcon = tool.icon;
                              return (
                                <button
                                  key={tool.id}
                                  onClick={() => handleToolClick(tool)}
                                  className="flex items-center gap-2.5 rounded-xl border border-border/40 px-3 py-2.5 text-left transition-colors hover:border-accent/50 hover:bg-accent-dim/10 active:scale-[0.99]"
                                >
                                  <TIcon size={16} className="shrink-0 text-text-secondary" />
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[11px] font-bold text-text-primary">{tool.label}</span>
                                  </span>
                                  <span className="hidden shrink-0 font-mono text-[9px] text-text-muted/50 sm:block">{tool.shortcut}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={() => navigateAndClose(handleLogout)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-danger/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-danger transition-colors hover:bg-danger/10 active:scale-[0.99]"
                  >
                    <LogOut className="h-4 w-4" /> {t('button.logOut')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
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
    </>
  );
};

export default StudentNavPanel;
