import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Lock, Loader2 } from 'lucide-react';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { resolveNextRoomPath, setLastSyncNow } from '@/features/student/utils/studentExperience';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import SEO from '@/shared/components/SEO';
import FadeIn from '@/shared/components/ui/FadeIn';
import Button from '@/shared/components/ui/Button';
import EmptyState from '@/shared/components/ui/EmptyState';
import { BootcampCourseSkeleton } from '@/features/student/components/StudentSkeletons';
import { LearningAccordion, LearningFilterStrip } from '@/shared/components/learning';
import type { LearningAccordionItem } from '@/shared/components/learning/LearningAccordion';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import type { Course } from '@/features/student/components/bootcamp-course/types';

/**
 * BootcampCourse — the single bootcamp overview/task page.
 *
 * The previous version rendered a phase hero and a grid of square room cards,
 * which made the learner navigate phase → room before reaching a task. This
 * page flattens the programme into one filterable task list: every room is a
 * row in the shared one-at-a-time accordion, grouped by phase through its
 * subtitle. Starting a task still goes to the existing protected room route, so
 * progress, quiz gates, sessions and completion rewards are unchanged.
 */
const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: overview, loading: overviewLoading } = useStudentOverview();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
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
      setCourse(courseRes?.data ? (courseRes.data as Course) : null);
      setLastSyncNow('bootcamp-course');
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

  const bootcampStatus = overview?.bootcampStatus || 'not_enrolled';
  const isEnrolled = bootcampStatus !== 'not_enrolled';

  const totalModules = course?.modules?.length || 0;
  const totalRooms = (course?.modules || []).reduce((acc, m) => acc + (m.rooms?.length || 0), 0);

  const ovModules: any[] = Array.isArray(overview?.modules) ? overview.modules : [];
  const doneModules = ovModules.filter((m: any) => Number(m.progress || 0) === 100).length;
  const doneRooms = ovModules.reduce((acc: number, m: any) => acc + Number(m.roomsCompleted || 0), 0);
  const progressNum = totalRooms > 0 ? Math.round((doneRooms / totalRooms) * 100) : 0;

  const nextRoomPath = resolveNextRoomPath(String(bootcampId || ''), course);

  const phaseFilters = useMemo(() => {
    if (!course?.modules) return [{ id: 'all', label: 'All Phases' }];
    return [
      { id: 'all', label: 'All Phases', count: totalRooms },
      ...course.modules.map((mod) => ({
        id: String(mod.moduleId),
        label: mod.title,
        count: mod.rooms?.length,
      })),
    ];
  }, [course, totalRooms]);

  const taskItems = useMemo<LearningAccordionItem[]>(() => {
    if (!course?.modules) return [];

    const modules = activePhase === 'all'
      ? course.modules
      : course.modules.filter((mod) => String(mod.moduleId) === activePhase);

    return modules.flatMap((mod, modIdx) => {
      const originalIdx = course.modules.indexOf(mod);
      const configPhase = BOOTCAMP_CONFIG.phases.find(
        (phase) => phase.title.toLowerCase() === String(mod.title || '').toLowerCase(),
      ) || BOOTCAMP_CONFIG.phases[originalIdx] || BOOTCAMP_CONFIG.phases[modIdx];

      return (mod.rooms || []).map((room, roomIdx) => {
        const configRoom = configPhase?.rooms.find(
          (candidate) => candidate.title.toLowerCase() === String(room.title || '').toLowerCase(),
        ) || configPhase?.rooms[roomIdx];

        const phaseId = configPhase?.id;
        const roomId = configRoom?.id;
        const locked = Boolean(mod.locked || room.locked);
        const completed = Boolean(room.completed);
        const steps = configRoom?.steps.length ?? 0;
        const path = phaseId && roomId
          ? `/dashboard/bootcamps/${bootcampId}/phases/${phaseId}/rooms/${roomId}`
          : null;

        return {
          id: `${phaseId || mod.moduleId}:${roomId || room.roomId}`,
          title: configRoom?.title || room.title || `Room ${roomIdx + 1}`,
          subtitle: `${configPhase?.codename || `Phase ${originalIdx + 1}`} · ${mod.title}`,
          description: configRoom?.overview || room.overview || '',
          meta: (
            <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-tertiary">
              {steps > 0 && <span>{steps} steps</span>}
              {locked && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
            </span>
          ),
          locked,
          completed,
          startLabel: completed ? 'Review room' : 'Start room',
          onStart: path && !locked ? () => navigate(path) : undefined,
        };
      });
    });
  }, [activePhase, bootcampId, course, navigate]);

  const firstIncompleteIdx = taskItems.findIndex((item) => !item.completed && !item.locked);

  if (loading || overviewLoading) return <BootcampCourseSkeleton />;

  if (!isEnrolled) {
    return (
      <FadeIn>
        <div className="min-h-full bg-canvas">
          <SEO title="Bootcamp" description="QYVORA bootcamp enrolment required." noindex />
          <LearningWorkspaceShell
            kicker="QYVORA · Bootcamp"
            title="Hacker Protocol Bootcamp"
            description="Registration is required before the programme overview and task list open."
            backTo="/dashboard"
            backLabel="Back to Dashboard"
          >
            <EmptyState
              icon={<Lock className="h-6 w-6" aria-hidden="true" />}
              title="Bootcamp access required"
              description="Your account does not have an active seat. Complete enrolment or check your payment status to unlock the programme."
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button to="/qose">View enrolment</Button>
                  <Button to="/dashboard/settings" variant="secondary">Account settings</Button>
                </div>
              }
            />
          </LearningWorkspaceShell>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="min-h-full bg-canvas">
        <SEO
          title={course?.title || 'Bootcamp'}
          description={`Journey progress for ${course?.title || 'Bootcamp'} — ${progressNum}% complete.`}
          noindex
        />

        <LearningWorkspaceShell
          kicker="QYVORA · Bootcamp"
          title={course?.title || 'Hacker Protocol Bootcamp'}
          description={syncError || 'One programme overview. Open any task to enter the protected room.'}
          backTo="/dashboard"
          backLabel="Back to Dashboard"
          icon={<img src={hpbLogo} alt="" />}
          heroArtSrc={hpbLogo}
          stats={[
            { label: 'progress', value: `${progressNum}%`, accent: true },
            { label: 'rooms', value: `${doneRooms}/${totalRooms}` },
            { label: 'phases', value: `${doneModules}/${totalModules}` },
          ]}
          progress={{ value: progressNum, label: `${doneRooms}/${totalRooms} rooms` }}
          actions={
            nextRoomPath ? (
              <Button to={nextRoomPath}>
                Continue training
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : undefined
          }
        >
          <div className="space-y-6">
            <LearningFilterStrip
              filters={phaseFilters}
              activeFilter={activePhase}
              onFilterChange={setActivePhase}
            />

            {taskItems.length > 0 ? (
              <LearningAccordion
                key={activePhase}
                items={taskItems}
                defaultOpen={firstIncompleteIdx}
              />
            ) : (
              <EmptyState
                icon={<Loader2 className="h-6 w-6" aria-hidden="true" />}
                title="No tasks available"
                description="This programme does not have any rooms yet. Check back after your instructor publishes the curriculum."
              />
            )}
          </div>
        </LearningWorkspaceShell>
      </div>
    </FadeIn>
  );
};

export default BootcampCourse;
