import { Link } from 'react-router-dom';
import { IconArrowLeft, IconMenu, IconTerminal, IconChevronRight } from '@/shared/components/icons';
import Identicon from '@/shared/components/Identicon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface RoomTopBarAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: string;
  variant?: 'default' | 'primary';
  hideOnMobile?: boolean;
}

export interface RoomTopBarProps {
  breadcrumbs: BreadcrumbItem[];
  actions?: RoomTopBarAction[];
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  username?: string;
  onOpenTerminal?: () => void;
  showProfile?: boolean;
  profileHref?: string;
  progress?: { current: number; total: number };
  mobileTitle?: string;
  mobileSubtitle?: string;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function RoomTopBar({
  breadcrumbs,
  actions = [],
  onMenuToggle,
  showMenuButton = false,
  backHref,
  onBack,
  backLabel,
  username,
  onOpenTerminal,
  showProfile = true,
  profileHref = '/dashboard/profile',
  progress,
  mobileTitle,
  mobileSubtitle,
}: RoomTopBarProps) {
  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        <div className="px-3 md:px-4 lg:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
          {/* Back button */}
          {backHref ? (
            <Link
              to={backHref}
              className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
              aria-label={backLabel || 'Go back'}
            >
              <IconArrowLeft size={20} />
            </Link>
          ) : onBack ? (
            <button
              onClick={handleBack}
              className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
              aria-label={backLabel || 'Go back'}
            >
              <IconArrowLeft size={20} />
            </button>
          ) : null}

          {/* Mobile menu toggle */}
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
              aria-label="Toggle sidebar"
            >
              <IconMenu size={20} />
            </button>
          )}

          {/* Desktop breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0 flex-1">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <IconChevronRight size={12} className="opacity-40 shrink-0" />}
                {item.href ? (
                  <Link to={item.href} className="hover:text-accent transition-colors shrink-0">
                    {item.label}
                  </Link>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? 'text-text-primary font-black truncate' : 'shrink-0'}>
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Mobile title */}
          <div className="flex sm:hidden flex-col min-w-0 flex-1">
            {mobileSubtitle && (
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">
                {mobileSubtitle}
              </span>
            )}
            <span className="text-sm font-black text-text-primary truncate leading-tight">
              {mobileTitle || breadcrumbs[breadcrumbs.length - 1]?.label || ''}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* Custom actions */}
            {actions.map((action, i) => {
              const content = (
                <>
                  {action.icon}
                  {action.badge && (
                    <span className="absolute top-1 right-1 min-w-3 h-3 px-0.5 bg-accent text-bg text-[7px] font-black rounded-full flex items-center justify-center leading-none">
                      {action.badge}
                    </span>
                  )}
                </>
              );

              if (action.href) {
                return (
                  <Link
                    key={i}
                    to={action.href}
                    className={`relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-colors rounded-xl ${
                      action.variant === 'primary'
                        ? 'bg-accent text-bg hover:brightness-110'
                        : 'text-text-muted hover:text-accent hover:bg-accent-dim/50'
                    } ${action.hideOnMobile ? 'hidden md:flex' : 'flex'}`}
                    aria-label={action.label}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={i}
                  onClick={action.onClick}
                  className={`relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-colors rounded-xl ${
                    action.variant === 'primary'
                      ? 'bg-accent text-bg hover:brightness-110'
                      : 'text-text-muted hover:text-accent hover:bg-accent-dim/50'
                  } ${action.hideOnMobile ? 'hidden md:flex' : 'flex'}`}
                  aria-label={action.label}
                >
                  {content}
                </button>
              );
            })}

            {/* Terminal button */}
            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                aria-label="Open terminal"
              >
                <IconTerminal size={20} />
              </button>
            )}

            {/* Profile button */}
            {showProfile && username && (
              <Link
                to={profileHref}
                className="w-9 h-9 md:w-11 md:h-11 flex-none transition-colors"
              >
                <Identicon value={username} size={44} className="w-full h-full" />
              </Link>
            )}
          </div>
        </div>

        {/* Optional progress bar */}
        {progress && progress.total > 0 && (
          <div className="h-1 bg-bg-elevated">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        )}
      </header>
    </>
  );
}
