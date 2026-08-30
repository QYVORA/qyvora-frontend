import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, CheckCircle2,
  Loader2, ArrowRight, Play, ListChecks,
  BarChart3, Layers, Trophy, Github, FileText, TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { useAuth } from '@/core/contexts/AuthContext';
import { formatSyncLabel, getLastSync, resolveNextRoomPath, setLastSyncNow } from '@/features/student/utils/studentExperience';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import SEO from '@/shared/components/SEO';
import FadeIn from '../../../../shared/components/ui/FadeIn';
import { BootcampCourseSkeleton } from '@/features/student/components/StudentSkeletons';
import PhaseSection from '@/features/student/components/bootcamp-course/PhaseSection';
import { LearningFilterStrip } from '@/features/student/components/learning';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import type { Course } from '@/features/student/components/bootcamp-course/types';

const BootcampCourse: React.FC = () => {
  const { t } = useTranslation();
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
    if (!course?.modules) return [{ id: 'all', label: t('student.bootcampCourse.allPhases', 'All Phases') }];
    return [
      { id: 'all', label: t('student.bootcampCourse.allPhases', 'All Phases'), count: totalModules },
      ...course.modules.map((mod) => ({
        id: String(mod.moduleId),
        label: mod.title,
        count: mod.rooms?.length,
      })),
    ];
  }, [course, totalModules, t]);

  const filteredModules = useMemo(() => {
    if (!course?.modules) return [];
    if (activePhase === 'all') return course.modules;
    return course.modules.filter((mod) => String(mod.moduleId) === activePhase);
  }, [course, activePhase]);

  if (loading || overviewLoading) return <BootcampCourseSkeleton />;

  return (
    <FadeIn>
    <div className="min-h-full">
      <SEO
        title={course?.title || t('student.bootcampCourse.header.label', 'Bootcamp')}
        description={`${t('student.bootcampCourse.journeyProgress', 'Track your progress through')} ${course?.title || t('student.bootcampCourse.header.label', 'the bootcamp')} | ${progressValue} complete.`}
        noindex
      />

      <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
        <StudentHeroSection
          fullHeight={false}
          title={course?.title || t('student.bootcampCourse.header.label', 'Bootcamp')}
          description={syncError || `${t('student.bootcampCourse.journeyProgress', 'Track your progress through')} ${course?.title || t('student.bootcampCourse.header.label', 'the bootcamp')}. ${formatSyncLabel(lastSync)}`}
          stats={[
            { label: t('student.bootcampCourse.modules', 'Modules'), value: `${doneModules}/${totalModules}` },
            { label: t('student.bootcampCourse.rooms', 'Rooms'), value: `${doneRooms}/${totalRooms}` },
          ]}
        >
          {nextRoomPath && (
            <Link
              to={nextRoomPath}
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
            >
              {t('student.bootcampCourse.continueTraining', 'Continue Training')}
            </Link>
          )}
        </StudentHeroSection>
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-8">

        <LearningFilterStrip
          filters={phaseFilters}
          activeFilter={activePhase}
          onFilterChange={setActivePhase}
        />

        {nextRoomLabel && nextRoomLabel.path && (
          <div className="border border-accent/20 rounded-2xl bg-accent-dim/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent truncate">{t('student.bootcampCourse.recommendedNext', 'Recommended Next')}</p>
                  <p className="text-sm font-bold text-text-primary">{nextRoomLabel.phase}, {nextRoomLabel.room}</p>
                </div>
              </div>
              <Link
                to={nextRoomLabel.path}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-on-accent text-[10px] font-black uppercase tracking-widest transition-[filter] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:brightness-110 shrink-0"
              >
                {t('student.bootcampCourse.continue', 'Continue')} <Play className="h-3 w-3" />
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
    </FadeIn>
  );
};

export default BootcampCourse;
