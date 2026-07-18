import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  BookOpen, Loader2, ArrowRight, Play, ListChecks,
  BarChart3, Layers, Trophy, Github, FileText, TrendingUp, MapIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BOOTCAMP_CONFIG, PHASE_COLORS } from '@/features/student/constants/bootcampConfig';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { useAuth } from '@/core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '@/features/student/utils/studentExperience';
import SEO from '@/shared/components/SEO';
import { BootcampCourseSkeleton } from '@/features/student/components/StudentSkeletons';
import PhaseSection from '@/features/student/components/bootcamp-course/PhaseSection';
import { LearningOverviewCard, LearningFilterStrip } from '@/features/student/components/learning';
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
  const [activePhase, setActivePhase] = useState('all');
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

  const moduleProgressMap: Map<number, any> = new Map(
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

  const phaseFilters = useMemo(() => {
    if (!course?.modules) return [{ id: 'all', label: 'All Phases' }];
    return [
      { id: 'all', label: 'All Phases', count: totalModules },
      ...course.modules.map((mod) => ({
        id: String(mod.moduleId),
        label: mod.title,
        count: mod.rooms?.length,
      })),
    ];
  }, [course, totalModules]);

  const filteredModules = useMemo(() => {
    if (!course?.modules) return [];
    if (activePhase === 'all') return course.modules;
    return course.modules.filter((mod) => String(mod.moduleId) === activePhase);
  }, [course, activePhase]);

  if (loading) return <BootcampCourseSkeleton />;

  return (
    <div className="bg-bg">
      <SEO
        title={course?.title || 'Bootcamp Course'}
        description={`Track your progress through ${course?.title || 'the bootcamp'} on QYVORA — ${progressValue} complete.`}
        noindex
      />

      <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">

        <LearningOverviewCard
          icon={<BookOpen className="w-6 h-6 text-bg" />}
          title={course?.title || 'Bootcamp'}
          description={syncError || `Track your progress through ${course?.title || 'the bootcamp'}. ${formatSyncLabel(lastSync)}`}
          stats={[
            { label: 'Modules', value: `${doneModules}/${totalModules}` },
            { label: 'Rooms', value: `${doneRooms}/${totalRooms}` },
          ]}
          action={nextRoomPath ? {
            label: 'Continue Training',
            to: nextRoomPath,
          } : undefined}
          progress={progressNum}
          breadcrumbs={[
            { label: 'Bootcamps', to: '/dashboard/bootcamps' },
            { label: course?.title || 'Course' },
          ]}
        />

        <LearningFilterStrip
          filters={phaseFilters}
          activeFilter={activePhase}
          onFilterChange={setActivePhase}
        />

        <div className="border border-border/30 rounded-2xl bg-bg-card p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <MapIcon className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Journey Map</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {BOOTCAMP_CONFIG.phases.map((phase, idx) => {
              const color = PHASE_COLORS[phase.id] || '#06B66F';
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

        {nextRoomLabel && nextRoomLabel.path && !nextRoomLabel.path.includes('undefined') && (
          <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent truncate">Recommended Next</p>
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

        {filteredModules.map((mod, modIdx) => {
          const originalIdx = course?.modules ? course.modules.indexOf(mod) : modIdx;
          return (
            <PhaseSection
              key={mod.moduleId}
              bootcampId={bootcampId || ''}
              mod={mod}
              modIdx={originalIdx}
              moduleProgressMap={moduleProgressMap}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BootcampCourse;
