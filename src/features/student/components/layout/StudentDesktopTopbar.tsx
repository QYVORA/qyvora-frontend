import { useEffect, useState } from 'react';
import { Award, BookOpen, Home, Search, ShieldCheck, Swords, Terminal as TerminalIcon } from 'lucide-react';
import api from '@/core/services/api';
import { useAuth } from '@/core/contexts/AuthContext';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import SiteTopbar from '@/shared/components/layout/SiteTopbar';
import type { NavItem } from '@/shared/components/layout/SiteTopbar';
import AvatarMenu from '@/shared/components/layout/AvatarMenu';
import StudentSearchDialog from './StudentSearchDialog';
import TopbarSearch from './TopbarSearch';

interface StudentDesktopTopbarProps {
  onMobileMenuOpen?: () => void;
  mobileMenuOpen?: boolean;
}

const DASHBOARD_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: Home },
  { key: 'labs', label: 'Labs', to: '/dashboard/labs', icon: BookOpen },
  {
    key: 'practice',
    label: 'Practice',
    icon: Swords,
    children: [
      { label: 'Bootcamp', to: '/dashboard/bootcamps', icon: ShieldCheck },
      { label: 'Competitive', to: '/dashboard/competitive', icon: Swords },
    ],
  },
  { key: 'certificates', label: 'Certificates', to: '/dashboard/certificates', icon: Award },
  {
    key: 'develop',
    label: 'Develop',
    icon: TerminalIcon,
    children: [
      { label: 'Network', to: '/dashboard/networks', icon: ShieldCheck },
      { label: 'Terminal', to: '/dashboard/tools/terminal', icon: TerminalIcon },
    ],
  },
];

const isActive = (item: NavItem, pathname: string) => {
  if (item.key === 'labs') {
    return pathname.startsWith('/dashboard/labs') || pathname.startsWith('/dashboard/courses');
  }
  if (item.key === 'practice') {
    return pathname.startsWith('/dashboard/bootcamps') || pathname.startsWith('/dashboard/competitive');
  }
  if (item.key === 'develop') {
    return pathname.startsWith('/dashboard/networks') || pathname.startsWith('/dashboard/tools');
  }
  if (item.key === 'dashboard') return pathname === '/dashboard';
  return pathname.startsWith(item.to ?? '');
};

/**
 * StudentDesktopTopbar — thin dashboard wrapper around the shared SiteTopbar.
 * Dashboard items + search/notifications/account cluster only.
 */
const StudentDesktopTopbar: React.FC<StudentDesktopTopbarProps> = ({
  onMobileMenuOpen,
  mobileMenuOpen = false,
}) => {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: overview } = useStudentOverview();

  useEffect(() => {
    let mounted = true;
    api
      .get('/notifications')
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res.data) ? res.data : [];
        setUnread(items.filter((n: { read?: boolean }) => !n.read).length);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const stats = {
    streakDays: overview?.xpSummary?.streakDays ?? 0,
    cp: user?.cp ?? overview?.xpSummary?.cp ?? 0,
    rank: overview?.xpSummary?.progression?.rank ?? user?.rank ?? 'Candidate',
  };

  return (
    <>
      <SiteTopbar
        items={DASHBOARD_ITEMS}
        activeMatcher={isActive}
        onMobileMenuOpen={onMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        logoTo="/dashboard"
        logoLabel="QYVORA dashboard"
        rightSlot={
          <>
            <div className="hidden lg:block">
              <TopbarSearch />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              aria-controls="student-search-results"
              title="Search Labs"
              className="flex h-12 w-12 items-center justify-center rounded-md text-accent transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            >
              <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>
            <AvatarMenu unread={unread} stats={stats} />
          </>
        }
      />
      <StudentSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default StudentDesktopTopbar;
