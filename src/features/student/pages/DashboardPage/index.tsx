import { useEffect, useMemo, useState, useRef } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { getRankInfo } from '@/features/student/utils/rankUtils';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import { Skeleton } from '@/shared/components/ui';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import type { BootcampRoom, BootcampPhase } from '@/features/student/constants/bootcampConfig';
import { COURSES, COURSE_CATEGORIES } from '@/features/student/data/courses/courseData';
import SEO from '@/shared/components/SEO';
import EventReviewModal from '@/features/student/components/EventReviewModal';
import OnboardingWizard from '@/features/student/components/OnboardingWizard';
import LearningPathMap from '@/features/student/components/LearningPathMap';
import { getPendingEventJoin, clearPendingEventJoin } from '@/shared/utils/eventJoin';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import { DashboardHero } from '@/features/student/components/dashboard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';
import RoomCard from '@/features/student/components/bootcamp-course/RoomCard';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import {
  Layers, Shield, Flame, Trophy, BookOpen, Search, X,
  ArrowRight, Map, Swords, Globe, Clock,
} from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import CpLogo from '@/shared/components/CpLogo';
import { Link } from 'react-router-dom';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const SEARCHABLE_PAGES = [
  { label: 'Competitive', path: '/dashboard/competitive', icon: Swords },
  { label: 'Networks',     path: '/dashboard/networks',    icon: Globe },
  { label: 'Learning Paths', path: '/dashboard/bootcamps', icon: Map },
];

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

const DashboardSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-8 pb-20 lg:pb-24 space-y-6">
    <Skeleton className="h-24 w-full bg-border/30 rounded-2xl" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 bg-border/30 rounded-xl" />)}
    </div>
    <Skeleton className="h-48 w-full bg-border/30 rounded-2xl" />
  </div>
);

const SectionHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-[1.5px] w-6 bg-accent" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">{label}</span>
  </div>
);

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-bg-card">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-accent/10' : 'bg-bg-elevated'}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <div className="font-mono text-lg font-black text-text-primary leading-none">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-0.5">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const pending = getPendingEventJoin();
  const [showReviewModal, setShowReviewModal] = useState(!!pending);
  const [, setReviewSubmitted] = useState(false);

  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [terminalOpen, setTerminalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ovRes, bcRes] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        setCpBalance(user?.cp ?? 0);
        setSyncError('');
      } catch {
        setSyncError('Could not sync. Showing cached data.');
        addToast('Failed to load dashboard data', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.uid, user?.cp]);

  const moduleProgressById = getBootcampProgressMap(overview);
  const enrolledBootcamps: StudentBootcampCardData[] = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4)
    .map(({ item, prog }) => ({
      id: String(item.id || ''),
      title: item.title || 'Bootcamp',
      description: String(item.description || '').trim(),
      level: String(item.level || '').trim(),
      duration: String(item.duration || '').trim(),
      priceLabel: String(item.priceLabel || '').trim(),
      progress: Number(prog?.progress || 0),
      img: BOOTCAMP_COVER_IMGS[String(item.id || '')] ?? BOOTCAMP_FALLBACK_IMG,
      isEnrolled: true,
      isLocked: false,
    }));

  const activeBootcamp = bootcamps.find((bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined);
  const continuePath = activeBootcamp ? resolveNextRoomPath(String(activeBootcamp.id || '')) || `/dashboard/bootcamps/${activeBootcamp.id}` : '/dashboard/bootcamps';
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const cpBalance = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  const { rank: _r, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);
  const nextMission = (overview?.learningPath || []).find((m: any) => m.status === 'in-progress' || m.status === 'next');

  const allRooms = useMemo(() => BOOTCAMP_CONFIG.phases.flatMap(p => p.rooms.map(r => ({ ...r, phase: p }))), []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedRooms: (BootcampRoom & { phase: BootcampPhase })[] = [];
    const matchedBootcamps: any[] = [];
    const matchedCourses: typeof COURSES = [];
    const matchedPages: typeof SEARCHABLE_PAGES = [];

    for (const room of allRooms) {
      const stepMatch = room.steps.some(s => s.title.toLowerCase().includes(q) || s.instruction.toLowerCase().includes(q));
      if (room.title.toLowerCase().includes(q) || room.overview.toLowerCase().includes(q) || stepMatch) {
        matchedRooms.push(room);
      }
    }

    for (const bc of bootcamps) {
      if ((bc.title || '').toLowerCase().includes(q) || (bc.description || '').toLowerCase().includes(q)) {
        matchedBootcamps.push(bc);
      }
    }

    for (const course of COURSES) {
      if (course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q)) {
        matchedCourses.push(course);
      }
    }

    for (const page of SEARCHABLE_PAGES) {
      if (page.label.toLowerCase().includes(q)) {
        matchedPages.push(page);
      }
    }

    return { rooms: matchedRooms, bootcamps: matchedBootcamps, courses: matchedCourses, pages: matchedPages };
  }, [searchQuery, bootcamps, allRooms]);

  const isSearching = searchQuery.trim().length > 0;

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce((sum: number, m: any) => sum + Number(m.roomsCompleted || 0), 0);
  const allDone = isEnrolled && !nextMission && totalRoomsDone > 0;
  const streakDays = overview?.xpSummary?.streakDays ?? null;
  const rankName = _r?.name || 'Candidate';

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Dashboard" description="Your training overview and active deployments on QYVORA." />
      <OnboardingWizard />
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-8 pb-20 lg:pb-24 space-y-8">

        {/* 1. Welcome Banner */}
        <DashboardHero
          isEnrolled={isEnrolled}
          allDone={allDone}
          nextMission={nextMission}
          continuePath={continuePath}
          currentPhaseTitle={overview?.progressMeta?.currentPhase?.title}
          username={user?.username}
        />

        {/* 2. Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search rooms, bootcamps, courses..."
            className="w-full bg-bg-card border border-border/40 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-mono text-text-primary placeholder:text-text-muted/30 outline-none focus:border-accent/40 transition-all caret-accent"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-accent-dim/30 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 3. Stats Strip */}
        <div>
          <SectionHeader label="Overview" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={<Trophy className="w-5 h-5 text-accent" />} label="Rank" value={rankName} accent />
            <StatCard icon={<Layers className="w-5 h-5 text-text-primary" />} label="Rooms Done" value={String(totalRoomsDone)} />
            <StatCard icon={<CpLogo className="w-5 h-5" />} label="CP Earned" value={cpBalance.toLocaleString()} accent />
            <StatCard icon={<Flame className="w-5 h-5 text-orange-400" />} label="Day Streak" value={`${streakDays ?? 0}d`} />
          </div>
        </div>

        {isSearching ? (
          /* ── Search Results ──────────────────────────────────── */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono text-text-muted">
                Results for "<span className="text-accent font-bold">{searchQuery}</span>"
                {(() => {
                  const total = (searchResults?.rooms.length || 0) + (searchResults?.bootcamps.length || 0)
                    + (searchResults?.courses.length || 0) + (searchResults?.pages.length || 0);
                  return total > 0 ? <span> — {total} match{total === 1 ? '' : 'es'}</span> : null;
                })()}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                Clear
              </button>
            </div>

            {searchResults && (
              <>
                {/* Rooms */}
                {searchResults.rooms.length > 0 && (
                  <div>
                    <SectionHeader label={`Rooms (${searchResults.rooms.length})`} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.rooms.map((room, idx) => {
                        const configPhase = room.phase;
                        const configRoom = configPhase.rooms.find(r => r.id === room.id);
                        return (
                          <RoomCard
                            key={room.id}
                            bootcampId="bc_1775270338500"
                            room={room}
                            roomIdx={idx}
                            configPhase={configPhase}
                            configRoom={configRoom}
                            roomImg={hpbCoverImg}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bootcamps */}
                {searchResults.bootcamps.length > 0 && (
                  <div>
                    <SectionHeader label={`Bootcamps (${searchResults.bootcamps.length})`} />
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-hover">
                      {searchResults.bootcamps.map((bc: any) => {
                        const prog = moduleProgressById.get(String(bc.id || ''));
                        const cardData: StudentBootcampCardData = {
                          id: String(bc.id || ''),
                          title: bc.title || 'Bootcamp',
                          description: String(bc.description || '').trim(),
                          level: String(bc.level || '').trim(),
                          duration: String(bc.duration || '').trim(),
                          priceLabel: String(bc.priceLabel || '').trim(),
                          progress: Number(prog?.progress || 0),
                          img: BOOTCAMP_COVER_IMGS[String(bc.id || '')] ?? BOOTCAMP_FALLBACK_IMG,
                          isEnrolled: moduleProgressById.has(String(bc.id || '')),
                          isLocked: false,
                        };
                        return (
                          <div key={bc.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
                            <StudentBootcampCard data={cardData} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {searchResults.courses.length > 0 && (
                  <div>
                    <SectionHeader label={`Courses (${searchResults.courses.length})`} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.courses.map(course => {
                        const category = COURSE_CATEGORIES.find(c => c.id === course.categoryId);
                        return (
                          <Link
                            key={course.id}
                            to={`/dashboard/courses/${course.id}`}
                            className="group block overflow-hidden rounded-2xl border border-border/70 bg-bg-card transition-all hover:border-accent/30 hover:scale-[1.01]"
                          >
                            <div className="aspect-[8/5] overflow-hidden bg-bg-elevated relative">
                              <img
                                src={course.coverSvg}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent border border-accent/20">
                                  {category?.name || course.categoryId}
                                </span>
                                <span className="flex items-center gap-1 text-[9px] text-text-muted font-mono">
                                  <Clock className="h-2.5 w-2.5" /> {course.estimatedMinutes} min
                                </span>
                              </div>
                              <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-tight">
                                {course.title}
                              </h3>
                              <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-accent group-hover:gap-2.5 transition-all pt-1">
                                Open Course <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pages */}
                {searchResults.pages.length > 0 && (
                  <div>
                    <SectionHeader label={`Pages (${searchResults.pages.length})`} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.pages.map(page => {
                        const Icon = page.icon;
                        return (
                          <Link
                            key={page.path}
                            to={page.path}
                            className="flex items-center gap-3 rounded-xl border border-border/30 bg-bg-card p-4 hover:border-accent/30 hover:bg-accent-dim/10 transition-all duration-300 group"
                          >
                            <Icon className="w-5 h-5 text-accent/70 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{page.label}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No results */}
                {searchResults.rooms.length === 0 && searchResults.bootcamps.length === 0
                  && searchResults.courses.length === 0 && searchResults.pages.length === 0 && (
                  <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
                    <Search className="mx-auto h-12 w-12 text-text-muted opacity-20" />
                    <p className="text-sm text-text-muted font-bold mt-4">No results found</p>
                    <p className="text-xs text-text-muted mt-1">Try a different search term</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* ── Normal Dashboard Content ────────────────────────── */
          <>
            {/* 4. In-Progress Bootcamps Carousel */}
            {enrolledBootcamps.length > 0 && (
              <div>
                <SectionHeader label="In Progress" />
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-hover">
                  {enrolledBootcamps.map((bc, idx) => (
                    <div key={bc.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
                      <StudentBootcampCard data={bc} index={idx} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Learning Paths */}
            <div>
              <SectionHeader label="Learning Path" />
              <LearningPathMap
                overview={overview}
                bootcampId={activeBootcamp ? String(activeBootcamp.id) : BOOTCAMP_CONFIG.id}
                isEnrolled={isEnrolled}
              />
            </div>

            {/* 6. Room Grid / Browse All */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <SectionHeader label="All Rooms" />
                <Link to="/dashboard/bootcamps/bc_1775270338500" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOOTCAMP_CONFIG.phases.flatMap(p => p.rooms).slice(0, 6).map((room) => (
                  <Link
                    key={room.id}
                    to={`/dashboard/bootcamps/bc_1775270338500/phases/${room.id.split('-')[0]}/rooms/${room.id}`}
                    className="group rounded-xl border border-border/30 bg-bg-card p-4 hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-accent/60" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Room</span>
                    </div>
                    <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">{room.title}</h3>
                  </Link>
                ))}
              </div>
            </div>

            {/* 7. Next Rank Progress */}
            {nextRank && (
              <div>
                <SectionHeader label="Next Rank" />
                <div className="rounded-xl border border-border/30 bg-bg-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-text-muted">Target: <span className="text-accent">{nextRank.name}</span></span>
                    <span className="font-mono text-sm font-black text-accent">{rankProgress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-accent-dim/20 overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_8px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {pending && showReviewModal && (
        <EventReviewModal
          open={showReviewModal}
          onOpenChange={(open) => {
            setShowReviewModal(open);
            if (!open) clearPendingEventJoin();
          }}
          eventId={pending.eventId}
          onReviewSubmitted={() => {
            setReviewSubmitted(true);
            clearPendingEventJoin();
          }}
        />
      )}

      <SimulatedTerminal
        open={terminalOpen}
        onOpenChange={setTerminalOpen}
        context={{ type: 'dashboard' }}
        mode="modal"
      />
    </div>
  );
};

export default Dashboard;
