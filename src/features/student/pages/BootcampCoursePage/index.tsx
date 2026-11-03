import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  Loader2, ArrowRight, ListChecks,
  BarChart3, Layers, Trophy, Github, FileText,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { useAuth } from '@/core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '@/features/student/utils/studentExperience';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import SEO from '@/shared/components/SEO';
import FadeIn from '@/shared/components/ui/FadeIn';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import PageBody from '@/shared/components/layout/PageBody';
import { BootcampCourseSkeleton } from '@/features/student/components/StudentSkeletons';
import PhaseSection from '@/features/student/components/bootcamp-course/PhaseSection';
import { LearningFilterStrip } from '@/shared/components/learning';
import type { Course } from '@/features/student/components/bootcamp-course/types';

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { addToast } = useToast();
  const { refreshMe } = useAuth();
  const { data: overview, loading: overviewLoading } = useStudentOverview();

  const [course, setCourse]     = useState<Course | null>(null);
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
      const courseRes = await api.get(`/student/course${query}`).catch(() => null);
      if (!mountedRef.current) return;
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
          const phaseId = BOOTCAMP_CONFIG.phases.find(p => p.title.toLowerCase() === mod.title.toLowerCase())?.id;
          const roomId = BOOTCAMP_CONFIG.phases.find(p => p.title.toLowerCase() === mod.title.toLowerCase())?.rooms.find(r => r.title.toLowerCase() === room.title.toLowerCase())?.id;
          if (!phaseId || !roomId) continue;
          return { phase: mod.title, room: room.title, path: `/dashboard/bootcamps/${bootcampId}/phases/${phaseId}/rooms/${roomId}` };
        }
      }
    }
    return null;
  })();

  const phaseFilters = useMemo(() => {
    if (!course?.modules) return [{ id: 'all', label: "All Phases" }];
    return [
      { id: 'all', label: "All Phases", count: totalModules },
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

  if (loading || overviewLoading) return <BootcampCourseSkeleton />;

  return (
    <FadeIn>
    <div className="min-h-full bg-canvas">
      <SEO
        title={course?.title || "Bootcamp"}
        description={`${"Journey Progress"} ${course?.title || "Bootcamp"} | ${progressValue} complete.`}
        noindex
      />

      <PageBody spacing="sections">
        <PageHeader
          kicker={"QYVORA · Bootcamp"}
          title={course?.title || "Bootcamp"}
          description={syncError || `${progressValue} complete`}
          actions={
            nextRoomPath ? (
              <Button to={nextRoomPath}>
                {"Continue Training"}
              </Button>
            ) : undefined
          }
        />

        <LearningFilterStrip
          filters={phaseFilters}
          activeFilter={activePhase}
          onFilterChange={setActivePhase}
        />

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
      </PageBody>
    </div>
    </FadeIn>
  );
};

export default BootcampCourse;
