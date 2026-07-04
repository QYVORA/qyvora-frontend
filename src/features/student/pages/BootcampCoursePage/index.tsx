import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight, Play, ListChecks,
  BarChart3, Layers, Trophy, Github, FileText, Map, TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BOOTCAMP_CONFIG, PHASE_COLORS } from '@/features/student/constants/bootcampConfig';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { useAuth } from '@/core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '@/features/student/utils/studentExperience';
import OptionalDecorImage from '@/shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '@/features/student/constants/studentDecorPaths';
import PageLoader from '@/shared/components/PageLoader';
import CourseHeader from '@/features/student/components/bootcamp-course/CourseHeader';
import SidebarProgress from '@/features/student/components/bootcamp-course/SidebarProgress';
import PhaseSection from '@/features/student/components/bootcamp-course/PhaseSection';
import type { Course } from '@/features/student/components/bootcamp-course/types';

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { addToast } = useToast();
  const { refreshMe } = useAuth();

  const [course, setCourse]     = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [syncError, setSyncError]   = useState('');
  const [lastSync, setLastSync]     = useState<string | null>(getLastSync('bootcamp-course'));
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        load();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [bootcampId]);

  const load = async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const cacheBust = `?_t=${Date.now()}`;
      const [ovRes, courseRes] = await Promise.all([
        api.get(`/student/overview${cacheBust}`),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      if (!mountedRef.current) return;
      const ov = ovRes.data || null;
      setOverview(ov);
      
      if (courseRes?.data) setCourse(courseRes.data as Course);
      setLastSync(setLastSyncNow('bootcamp-course'));
      setSyncError('');
    } catch {
      if (!mountedRef.current) return;
      setSyncError('Could not sync. Displaying available data.');
      addToast('Failed to load course data', 'error');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bootcampId]);

  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.moduleId ?? m.id), m])
  );

  const totalModules = course?.modules?.length || 0;
  const totalRooms   = (course?.modules || []).reduce((acc, m) => acc + (m.rooms?.length || 0), 0);
  const snapshotProgress = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value;
  const snapshotDoneModules = overview?.snapshot?.find((s: any) => s?.id === 'modules')?.value;
  const snapshotDoneRooms   = overview?.snapshot?.find((s: any) => s?.id === 'rooms')?.value;

  const ovModules: any[] = Array.isArray(overview?.modules) ? overview.modules : [];

  const doneModules = snapshotDoneModules != null
    ? Number(snapshotDoneModules)
    : ovModules.filter((m: any) => Number(m.progress || 0) === 100).length;

  const doneRooms = snapshotDoneRooms != null
    ? Number(snapshotDoneRooms)
    : ovModules.reduce((acc: number, m: any) => acc + Number(m.roomsCompleted || 0), 0);

  const progressValue = snapshotProgress != null
    ? String(snapshotProgress)
    : totalRooms > 0
      ? `${Math.round((doneRooms / totalRooms) * 100)}%`
      : '0%';

  const progressNum = parseInt(progressValue, 10) || 0;

  // Find the next recommended room
  const nextRoomPath = resolveNextRoomPath(String(bootcampId || ''), course);
  const nextRoomLabel = (() => {
    if (!course) return null;
    for (const mod of course.modules || []) {
      if (mod.locked) continue;
      for (const room of mod.rooms || []) {
        if (!room.completed && !room.locked) {
          return { phase: mod.title, room: room.title, path: `/dashboard/bootcamps/${bootcampId}/phases/${BOOTCAMP_CONFIG.phases.find(p => p.title.toLowerCase() === mod.title.toLowerCase())?.id}/rooms/${BOOTCAMP_CONFIG.phases.find(p => p.title.toLowerCase() === mod.title.toLowerCase())?.rooms.find(r => r.title.toLowerCase() === room.title.toLowerCase())?.id}` };
        }
      }
    }
    return null;
  })();

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg">
      <CourseHeader
        bootcampId={bootcampId || ''}
        courseTitle={loading ? 'Loading Bootcamp...' : (course?.title || 'Bootcamp')}
        syncError={syncError}
        lastSync={lastSync}
        progressValue={progressValue}
        progressNum={progressNum}
        resumePath={nextRoomPath}
        mobileOnly
      />

      <div className="
        lg:fixed lg:left-0 lg:right-0 lg:bottom-0 lg:top-24
        lg:flex lg:flex-row lg:overflow-hidden
      ">

        {/* ── LEFT SIDEBAR ── */}
        <div className="
          w-full
          lg:w-72 xl:w-80 lg:flex-none lg:h-full
          lg:overflow-y-auto lg:overscroll-contain scroll-hover
          lg:border-r lg:border-border lg:bg-bg
        ">
          {loading ? (
            <div className="p-6 space-y-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-accent-dim/20 rounded" />
                <div className="h-2 w-full bg-accent-dim/20 rounded-full" />
                <div className="h-3 w-1/2 bg-accent-dim/20 rounded" />
              </div>
              <div className="space-y-6 pt-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-accent-dim/20 rounded-full" />
                    <div className="h-4 w-32 bg-accent-dim/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <SidebarProgress
              progressValue={progressValue}
              progressNum={progressNum}
              doneRooms={doneRooms}
              totalRooms={totalRooms}
              doneModules={doneModules}
              totalModules={totalModules}
              courseModules={course?.modules || []}
              moduleProgressMap={moduleProgressMap}
            />
          )}
        </div>

        {/* ── RIGHT MAIN ── */}
        <div className="w-full flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain scroll-hover">
          <div className="px-2 pb-16 lg:px-8 lg:py-6 space-y-8 max-w-5xl">
            {/* Desktop header */}
            <CourseHeader
              bootcampId={bootcampId || ''}
              courseTitle={loading ? 'Loading Bootcamp...' : (course?.title || 'Bootcamp')}
              syncError={syncError}
              lastSync={lastSync}
              progressValue={progressValue}
              progressNum={progressNum}
              resumePath={nextRoomPath}
            />

            {/* Journey Map */}
            <div className="border border-border/30 rounded-xl bg-bg-card p-5 md:p-6">
              <div className="flex items-center gap-2 mb-5">
                <Map className="h-4 w-4 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Journey Map</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {BOOTCAMP_CONFIG.phases.map((phase, idx) => {
                  const color = PHASE_COLORS[phase.id] || '#66B870';
                  const modProgress = moduleProgressMap.get(idx + 1);
                  const isComplete = modProgress && Number(modProgress.progress) === 100;
                  const isCurrent = !isComplete && (!moduleProgressMap.get(idx) || Number(moduleProgressMap.get(idx)?.progress) === 100);
                  return (
                    <div key={phase.id} className="flex-1 min-w-[120px]">
                      <div
                        className={`rounded-lg border px-3 py-2.5 transition-all ${
                          isComplete ? 'border-accent/30 bg-accent-dim' :
                          isCurrent ? 'border-accent/50 bg-accent-dim/30' :
                          'border-border/20 bg-bg-elevated'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{phase.codename}</span>
                        </div>
                        <p className="text-xs font-bold text-text-primary truncate">{phase.title}</p>
                        {modProgress && (
                          <div className="mt-1.5 h-1 bg-bg-elevated rounded-full overflow-hidden">
                            <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${modProgress.progress}%`, backgroundColor: color }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Next Room */}
            {nextRoomLabel && !nextRoomPath.includes('undefined') && (
              <div className="border border-accent/20 rounded-xl bg-accent-dim/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">Recommended Next</p>
                      <p className="text-sm font-bold text-text-primary">{nextRoomLabel.phase} — {nextRoomLabel.room}</p>
                    </div>
                  </div>
                  <Link
                    to={nextRoomLabel.path}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110 shrink-0"
                  >
                    Continue <Play className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-8 animate-pulse">
                {[0, 1].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-48 bg-accent-dim/20 rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[0, 1].map(j => (
                        <div key={j} className="h-24 bg-accent-dim/10 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (course?.modules || []).map((mod, modIdx) => {
                const configPhase = BOOTCAMP_CONFIG.phases[modIdx];
                return (
                  <PhaseSection
                    key={mod.moduleId}
                    bootcampId={bootcampId || ''}
                    mod={mod}
                    modIdx={modIdx}
                    moduleProgressMap={moduleProgressMap}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampCourse;
