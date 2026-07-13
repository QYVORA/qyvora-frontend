import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Map, BookOpen, Swords, Globe, BarChart3,
  Layers, BookMarked, Loader2,
} from 'lucide-react';
import {
  IconDashboard,
  IconMarketplace,
  IconNotification,
  IconSettings,
  IconX,
  IconLeaderboard,
  IconFire,
  IconCheck,
  IconLock,
  IconLabs,
} from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { getRankInfo } from '@/features/student/utils/rankUtils';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import Logo from '@/shared/components/brand/Logo';
import CpLogo from '@/shared/components/CpLogo';
import { useScrollLock } from '@/core/hooks/useScrollLock';

const PRIMARY_NAV = [
  { label: 'Dashboard',      icon: IconDashboard, path: '/dashboard' },
  { label: 'Courses',        icon: BookMarked,      path: '/dashboard/courses' },
  { label: 'Bootcamp',       icon: Map,             path: '/dashboard/bootcamps' },
  { label: 'Attack Labs',    icon: IconLabs,        path: '/dashboard/labs' },
  { label: 'Competitive',    icon: Swords,          path: '/dashboard/competitive' },
  { label: 'Networks',       icon: Globe,           path: '/dashboard/networks' },
  { label: 'My Progress',    icon: BarChart3,       path: '/dashboard/profile' },
];

const SECONDARY_NAV = [
  { label: 'Market',      icon: IconMarketplace, path: '/dashboard/marketplace' },
  { label: 'Notifications', icon: IconNotification, path: '/dashboard/notifications' },
  { label: 'Settings',    icon: IconSettings,    path: '/dashboard/settings' },
];

const SidebarPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-3 mb-2 rounded-xl border border-border/30 bg-bg-card p-3 text-xs space-y-2">
    {children}
  </div>
);

const PanelRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5 text-text-muted">
      <span className="w-3.5 h-3.5 shrink-0">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="font-mono text-xs font-bold text-text-primary truncate">{value}</span>
  </div>
);

const DashboardOverviewPanel = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    api.get('/student/overview').then((res) => {
      if (!mounted) return;
      setOverview(res.data || null);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [user?.uid]);

  const totalRoomsDone = Array.isArray(overview?.modules)
    ? overview.modules.reduce((sum: number, m: any) => sum + Number(m.roomsCompleted || 0), 0)
    : 0;
  const cp = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;
  const { rank: _r } = getRankInfo(cp);
  const streakDays = overview?.xpSummary?.streakDays ?? null;
  const rankName = _r?.name || 'Candidate';

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Overview</div>
      <PanelRow icon={<IconLeaderboard size={14} className="text-accent" />} label="Rank" value={rankName} />
      <PanelRow icon={<Layers className="w-3.5 h-3.5 text-text-primary" />} label="Rooms" value={String(totalRoomsDone)} />
      <PanelRow icon={<CpLogo className="w-3.5 h-3.5" />} label="CP" value={Number(cp).toLocaleString()} />
      <PanelRow icon={<IconFire size={14} className="text-orange-400" />} label="Streak" value={`${streakDays ?? 0}d`} />
    </SidebarPanel>
  );
};

const LeaderboardFiltersPanel = () => {
  const { search } = useLocation();
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(search);
    setPeriod(params.get('period') || 'all');
  }, [search]);

  const PERIODS = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Filter</div>
      <div className="flex flex-col gap-1">
        {PERIODS.map((p) => {
          const active = period === p.key;
          return (
            <Link
              key={p.key}
              to={`/dashboard/competitive?period=${p.key}`}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                active
                  ? 'bg-accent text-bg'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/30'
              }`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </SidebarPanel>
  );
};

const CourseProgressPanel = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);

  const bootcampId = pathname.split('/dashboard/bootcamps/')[1]?.split('/')[0];

  useEffect(() => {
    if (!bootcampId) return;
    let mounted = true;
    Promise.all([
      api.get('/student/overview'),
      api.get(`/student/course?bootcampId=${encodeURIComponent(bootcampId)}`).catch(() => null),
    ]).then(([ovRes, courseRes]) => {
      if (!mounted) return;
      setOverview(ovRes.data || null);
      if (courseRes?.data) setCourse(courseRes.data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [bootcampId, user?.uid]);

  const progMap = Object.fromEntries(
    (overview?.modules || []).map((m: any) => [Number(m.moduleId ?? m.id), m])
  );
  const courseModules = course?.modules || [];
  const totalRooms = courseModules.reduce((acc: number, m: any) => acc + (m.rooms?.length || 0), 0);
  const doneRooms = courseModules.reduce((acc: number, _m: any, idx: number) => {
    const prog = progMap[idx + 1];
    return acc + Number(prog?.roomsCompleted || 0);
  }, 0);
  const progressNum = totalRooms > 0 ? Math.round((doneRooms / totalRooms) * 100) : 0;

  return (
    <div className="mx-3 mb-2 space-y-2">
      <div className="rounded-xl border border-accent/25 bg-accent-dim p-3">
        <p className="text-[8px] font-black uppercase tracking-widest text-accent mb-1">Progress</p>
        <div className="text-2xl font-black text-accent font-mono">{progressNum}%</div>
        <div className="h-1 overflow-hidden rounded-full bg-bg/40 mt-1.5 mb-1">
          <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${progressNum}%` }} />
        </div>
        <p className="text-[10px] text-text-secondary">{doneRooms}/{totalRooms} rooms</p>
      </div>
      <div className="rounded-xl border border-border/30 bg-bg-card divide-y divide-border/30 max-h-[260px] overflow-y-auto">
        {courseModules.map((mod: any, idx: number) => {
          const prog = progMap[idx + 1];
          const pct = Number(prog?.progress || 0);
          const isComplete = pct === 100;
          const configPhase = BOOTCAMP_CONFIG.phases[idx];
          return (
            <div key={mod.moduleId} className="flex items-center gap-2 px-3 py-2">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[8px] font-bold font-mono ${
                isComplete ? 'border-accent/30 bg-accent text-bg'
                  : 'border-border text-text-muted'
              }`}>
                {isComplete ? <IconCheck size={12} /> : String(idx + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-accent leading-none">{configPhase?.codename || `Phase ${idx + 1}`}</p>
                <p className="text-[10px] font-bold text-text-primary truncate">{mod.title}</p>
              </div>
              {pct > 0 && !isComplete && (
                <span className="text-[9px] font-mono font-black text-accent">{pct}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CoursesListPanel = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    api.get('/student/courses').then((res) => {
      if (!mounted) return;
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      setCourses(items);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [user?.uid]);

  const enrolled = courses.filter((c: any) => c.enrolled);
  const inProgress = enrolled.filter((c: any) => (c.progress || 0) < 100);

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Courses</div>
      <PanelRow icon={<BookMarked className="w-3.5 h-3.5 text-accent" />} label="Enrolled" value={String(enrolled.length)} />
      <PanelRow icon={<BarChart3 className="w-3.5 h-3.5" />} label="In Progress" value={String(inProgress.length)} />
      {courses.length > 0 && (
        <div className="pt-1 space-y-1 max-h-[180px] overflow-y-auto">
          {courses.map((c: any) => {
            const pct = c.progress || 0;
            return (
              <Link
                key={c.id}
                to={`/dashboard/courses/${c.id}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent-dim/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text-primary truncate">{c.title}</p>
                </div>
                <span className="text-[9px] font-mono font-black text-accent">{pct}%</span>
              </Link>
            );
          })}
        </div>
      )}
    </SidebarPanel>
  );
};

const LessonNavPanel = () => {
  const { pathname } = useLocation();
  const [lessons, setLessons] = useState<any[]>([]);
  const courseId = pathname.split('/dashboard/courses/')[1]?.split('/')[0];

  useEffect(() => {
    if (!courseId) return;
    let mounted = true;
    api.get(`/student/course?courseId=${encodeURIComponent(courseId)}`).then((res) => {
      if (!mounted) return;
      setLessons(Array.isArray(res.data?.lessons) ? res.data.lessons : []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [courseId]);

  const currentLessonId = pathname.split('/lessons/')[1] || '';

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Lessons</div>
      <div className="space-y-0.5 max-h-[260px] overflow-y-auto">
        {lessons.map((lesson: any) => {
          const active = lesson.id === currentLessonId || lesson.slug === currentLessonId;
          return (
            <Link
              key={lesson.id}
              to={`/dashboard/courses/${courseId}/lessons/${lesson.slug || lesson.id}`}
              className={`block px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                active ? 'text-accent bg-accent-dim' : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/30'
              }`}
            >
              {lesson.title}
            </Link>
          );
        })}
      </div>
    </SidebarPanel>
  );
};

const MarketBalancePanel = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    api.get('/cp/balance').then((res) => {
      if (!mounted) return;
      setBalance(res.data?.balance ?? null);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Balance</div>
      <PanelRow icon={<CpLogo className="w-3.5 h-3.5" />} label="CP" value={Number(balance ?? user?.cp ?? 0).toLocaleString()} />
      <Link
        to="/dashboard/marketplace"
        className="block text-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-accent text-bg hover:brightness-110 transition-all mt-1"
      >
        Browse Market
      </Link>
    </SidebarPanel>
  );
};

const NotificationsFilterPanel = () => {
  const { search } = useLocation();
  const filter = new URLSearchParams(search).get('filter') || 'all';

  return (
    <SidebarPanel>
      <div className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Filter</div>
      <div className="flex flex-col gap-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'system', label: 'System' },
          { key: 'achievement', label: 'Achievements' },
        ].map((f) => {
          const active = filter === f.key;
          return (
            <Link
              key={f.key}
              to={`/dashboard/notifications?filter=${f.key}`}
              className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                active
                  ? 'bg-accent text-bg'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/30'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>
    </SidebarPanel>
  );
};

const RoomCurriculumPanel = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const match = pathname.match(/\/dashboard\/bootcamps\/([^/]+)\/phases\/([^/]+)\/rooms\/([^/]+)/);
  const bootcampId = match?.[1];
  const activePhaseId = match?.[2];
  const activeRoomId = match?.[3];

  const [apiCourse, setApiCourse] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!bootcampId) return;
    let mounted = true;
    setLoading(true);
    Promise.all([
      api.get('/student/overview'),
      api.get(`/student/course?bootcampId=${encodeURIComponent(bootcampId)}`).catch(() => null),
    ]).then(([ovRes, courseRes]) => {
      if (!mounted) return;
      setOverview(ovRes.data);
      if (courseRes?.data) setApiCourse(courseRes.data);
    }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [bootcampId, user?.uid]);

  const completedRooms = new Set<string>();
  const lockedRooms = new Set<string>();
  if (apiCourse) {
    apiCourse.modules.forEach((mod: any) => {
      const matchPhase = BOOTCAMP_CONFIG.phases.find(p => p.title.toLowerCase() === mod.title.toLowerCase());
      if (matchPhase) {
        if (mod.locked) matchPhase.rooms.forEach((r) => lockedRooms.add(`${matchPhase.id}:${r.id}`));
        mod.rooms.forEach((apiRoom: any) => {
          const matchRoom = matchPhase.rooms.find(r => r.title.toLowerCase() === apiRoom.title.toLowerCase());
          if (matchRoom) {
            if (apiRoom.completed) completedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
            if (apiRoom.locked) lockedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
          }
        });
      }
    });
  }

  return (
    <div className="mx-3 mb-2 space-y-2">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-accent/50" />
        </div>
      ) : (
        BOOTCAMP_CONFIG.phases.map((phase) => (
          <div key={phase.id} className="mb-2">
            <p className="mb-1 px-2 text-[8px] font-black uppercase tracking-[0.3em] text-accent/70">
              {phase.codename}
            </p>
            <div className="space-y-0.5 border-l border-border/30 ml-2 pl-2">
              {phase.rooms.map((room) => {
                const key = `${phase.id}:${room.id}`;
                const isActive = phase.id === activePhaseId && room.id === activeRoomId;
                const isCompleted = completedRooms.has(key);
                const isLocked = lockedRooms.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => { if (!isLocked) navigate(`/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`); }}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                      isActive
                        ? 'text-accent font-semibold bg-accent-dim/20'
                        : isLocked
                        ? 'opacity-40 cursor-not-allowed text-text-muted'
                        : 'text-text-secondary hover:text-accent hover:bg-accent-dim/10'
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[7px] font-bold font-mono ${
                      isCompleted ? 'border-accent/40 text-accent' : isActive ? 'border-accent/40 text-accent' : 'border-border text-text-muted'
                    }`}>
                      {isCompleted ? <IconCheck size={10} /> : isLocked ? <IconLock size={10} /> : null}
                    </span>
                    <span className="truncate flex-1">{room.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const NavLink = ({ item, active }: { item: typeof PRIMARY_NAV[0]; active: boolean }) => (
  <Link
    to={item.path}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
      active
        ? 'text-accent bg-accent-dim'
        : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
    }`}
  >
    <item.icon className="w-5 h-5 shrink-0" />
    {item.label}
  </Link>
);

const RightRailSection = () => {
  const { pathname } = useLocation();

  if (pathname === '/dashboard') return <DashboardOverviewPanel />;
  if (pathname.startsWith('/dashboard/competitive')) return <LeaderboardFiltersPanel />;
  if (pathname.match(/^\/dashboard\/bootcamps\/[^/]+$/)) return <CourseProgressPanel />;
  if (pathname === '/dashboard/courses') return <CoursesListPanel />;
  if (pathname.startsWith('/dashboard/courses/')) return <LessonNavPanel />;
  if (pathname === '/dashboard/marketplace') return <MarketBalancePanel />;
  if (pathname === '/dashboard/notifications') return <NotificationsFilterPanel />;
  if (pathname.includes('/rooms/')) return <RoomCurriculumPanel />;

  return null;
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useScrollLock(mobileOpen);

  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener('qyvora:open-main-sidebar', handler);
    return () => window.removeEventListener('qyvora:open-main-sidebar', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const isRoomPage = pathname.includes('/rooms/');

  const navContent = (
    <>
      {/* Logo */}
      <div className="h-20 md:h-24 flex items-center px-6 border-b border-border shrink-0">
        <Link to="/dashboard" className="flex-1">
          <Logo size="lg" />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors"
          aria-label="Close sidebar"
        >
          <IconX size={20} />
        </button>
      </div>

      {/* Scrollable middle area: primary nav + page panels */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!isRoomPage && (
          <nav className="flex flex-col gap-0.5 px-3 pt-4">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.path} item={item} active={isActive(item.path)} />
            ))}
          </nav>
        )}
        <RightRailSection />
      </div>

      {/* Secondary nav */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        {SECONDARY_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                active
                  ? 'text-accent bg-accent-dim'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-bg border-r border-border z-40">
        {navContent}
      </aside>

      {/* Mobile sidebar — drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm lg:hidden"
          />
          <aside className="fixed left-0 top-0 bottom-0 z-[70] w-[85vw] max-w-[320px] flex flex-col bg-bg border-r border-border lg:hidden overflow-y-auto">
            {navContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
