import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Lock, BookOpen,
} from 'lucide-react';
import FadeIn from '@/shared/components/ui/FadeIn';
import EmptyState from '@/shared/components/ui/EmptyState';
import Button from '@/shared/components/ui/Button';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import StepCard from '@/features/student/components/bootcamp-room/StepCard';
import QuizModal from '@/features/student/components/bootcamp-room/QuizModal';
import RoomCompletionCelebration from '@/features/student/components/bootcamp-room/RoomCompletionCelebration';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import { LearningTaskAccordion } from '@/shared/components/learning/LearningTaskAccordion';
import type { LearningTask } from '@/shared/components/learning/LearningTaskAccordion';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { scrollToStepId } from '@/shared/utils/scrollToStep';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import type { ApiCourse } from '@/features/student/components/bootcamp-room/types';
import SEO from '@/shared/components/SEO';
import { BootcampRoomSkeleton } from '@/features/student/components/StudentSkeletons';

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Format time
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const BootcampRoomPage: React.FC = () => {
  const { bootcampId, phaseId: phaseIdParam, moduleId, roomId } = useParams<{
    bootcampId?: string;
    phaseId?: string;
    moduleId?: string;
    roomId?: string;
  }>();

  const phaseId = phaseIdParam || (moduleId ? `phase${moduleId}` : undefined);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const mountedRef = useRef(true);
  const redirectCountRef = useRef(0);
  const MAX_REDIRECTS = 3;
  const { data: overview, refetch: refetchOverview } = useStudentOverview();

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const [apiCourse, setApiCourse] = useState<ApiCourse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [courseLoadError, setCourseLoadError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    const step = searchParams.get('step');
    return step ? Math.max(0, parseInt(step, 10) || 0) : 0;
  });
  const viewedStepsKey = `hpb_viewedSteps_${phaseId || 'hpb'}_${roomId || ''}`;
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(viewedStepsKey);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return new Set<number>(parsed);
    } catch { /* ignore */ }
    return new Set([0]);
  });
  const persistViewedSteps = useCallback((next: Set<number>) => {
    try { localStorage.setItem(viewedStepsKey, JSON.stringify([...next])); } catch { /* ignore */ }
  }, [viewedStepsKey]);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const [completionCpEarned, setCompletionCpEarned] = useState(250);
  const [completing, setCompleting] = useState(false);

  const { timeSpent, resetSession } = useRoomSession();
  const prefersReducedMotion = useReducedMotion();

  const bootcampStatus = (() => {
    const enrolledViaStatus = overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' && String(overview?.bootcampId || '') === String(bootcampId || '');
    const enrolledViaModules = (Array.isArray(overview?.modules) ? overview.modules : []).some((m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || ''));
    return enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled';
  })();

  const loadCourseData = useCallback(async () => {
    setCourseLoadError(false);
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const courseRes = await api.get(`/student/course${query}`);
      if (!mountedRef.current) return;
      setApiCourse(courseRes.data as ApiCourse);
    } catch {
      if (!mountedRef.current) return;
      setApiCourse(null);
      setCourseLoadError(true);
      addToast("Failed to verify bootcamp access", 'error');
    }
    finally { if (mountedRef.current) setApiLoading(false); }
  }, [bootcampId, addToast]);

  const markRoomComplete = async (phId: string, rmId: string) => {
    try {
      const phaseNum = parseInt(phId.replace('phase', ''), 10);
      const roomNum = parseInt(rmId.replace('room', ''), 10);
      const backendRoomId = phaseNum * 100 + roomNum;
      const response = await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/complete`, {});
      if (response.data?.reward?.points) setCompletionCpEarned(response.data.reward.points);
      setShowCompleteOverlay(true);
      loadCourseData();
      refetchOverview();
    } catch (err: any) {
      // Server enforces the quiz gate (F-04): if completion was rejected
      // because no graded quiz pass exists, route the user back to the quiz.
      if (err?.response?.status === 403 && err?.response?.data?.code === 'quiz_required') {
        setQuizPassed(false);
        const phaseConfig = BOOTCAMP_CONFIG.phases.find((p) => p.id === phId);
        const roomConfig = phaseConfig?.rooms.find((r) => r.id === rmId);
        const checkpointIdx = roomConfig?.steps.length ?? 0;
        setCurrentStepIdx(checkpointIdx);
        setSearchParams((prev) => {
          prev.set('step', String(checkpointIdx));
          return prev;
        }, { replace: true });
        window.requestAnimationFrame(() => {
          scrollToStepId('room-final-quiz', prefersReducedMotion ? 'auto' : 'smooth');
        });
        return;
      }
      console.error('Failed to complete room:', err?.response?.data || err);
      addToast("Failed to mark room as complete", 'error');
    }
  };

  useEffect(() => {
    setApiLoading(true);
    loadCourseData();
  }, [loadCourseData, phaseId, roomId]);

  useEffect(() => {
    if (!phaseId || !roomId || !bootcampId || apiLoading || bootcampStatus !== 'enrolled') return;
    const phaseNum = parseInt(phaseId.replace('phase', ''), 10);
    const roomNum = parseInt(roomId.replace('room', ''), 10);
    const backendRoomId = phaseNum * 100 + roomNum;
    const controller = new AbortController();
    const callSessionOpen = async () => {
      try {
        await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/session-open`, {}, { signal: controller.signal });
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        if (err?.response?.status === 403) return;
        console.error('Failed to open room session:', err?.response?.data || err?.message || err);
        addToast("Failed to open room session", 'error');
      }
    };
    callSessionOpen();
    return () => controller.abort();
  }, [phaseId, roomId, bootcampId, apiLoading, bootcampStatus, addToast]);

  useEffect(() => {
    if (!apiLoading && bootcampStatus === 'not_enrolled' && redirectCountRef.current < MAX_REDIRECTS) {
      redirectCountRef.current += 1;
      navigate('/dashboard/labs', { replace: true });
    }
  }, [apiLoading, bootcampStatus, navigate]);

  // The URL is the source of truth for the active step. Only the step is synced
  // here — session, quiz and viewed-step state are per-room, not per-step, and
  // resetting them on every step change wiped the "in session" timer and cleared
  // a passed quiz the moment you moved between steps.
  useEffect(() => {
    const step = searchParams.get('step');
    setCurrentStepIdx(step ? Math.max(0, parseInt(step, 10) || 0) : 0);
  }, [searchParams]);

  useEffect(() => {
    setViewedSteps(() => {
      try {
        const raw = localStorage.getItem(viewedStepsKey);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed)) return new Set<number>(parsed);
      } catch { /* ignore */ }
      return new Set([0]);
    });
    setQuizPassed(false);
    resetSession();
  }, [phaseId, roomId, viewedStepsKey, resetSession]);

  useEffect(() => {
    if (apiLoading || !phaseId || !roomId) return;
    const phaseConfig = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
    const roomConfig = phaseConfig?.rooms.find((r) => r.id === roomId);
    if (!roomConfig || currentStepIdx >= roomConfig.steps.length) return;

    setViewedSteps((prev) => {
      if (prev.has(currentStepIdx)) return prev;
      const next = new Set(prev);
      next.add(currentStepIdx);
      persistViewedSteps(next);
      return next;
    });
  }, [apiLoading, phaseId, roomId, currentStepIdx, persistViewedSteps]);

  useEffect(() => {
    if (apiLoading || !phaseId || !roomId) return;
    const phaseConfig = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
    const roomConfig = phaseConfig?.rooms.find((r) => r.id === roomId);
    const targetId = roomConfig && currentStepIdx >= roomConfig.steps.length
      ? 'room-final-quiz'
      : `${phaseId}-${roomId}-step-${currentStepIdx + 1}`;
    scrollToStepId(targetId, prefersReducedMotion ? 'auto' : 'smooth');
  }, [apiLoading, phaseId, roomId, currentStepIdx, prefersReducedMotion]);

  const completedRooms = new Set<string>();
  if (apiCourse) {
    apiCourse.modules.forEach((mod) => {
      const matchPhase = BOOTCAMP_CONFIG.phases.find((p) => p.title.toLowerCase() === mod.title.toLowerCase());
      if (matchPhase) {
        mod.rooms.forEach((apiRoom) => {
          const matchRoom = matchPhase.rooms.find((r) => r.title.toLowerCase() === apiRoom.title.toLowerCase());
          if (matchRoom) {
            if (apiRoom.completed) completedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
          }
        });
      }
    });
  }

  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const room = phase?.rooms.find((r) => r.id === roomId);
  const moduleNumber = phaseId ? Number.parseInt(phaseId.replace('phase', ''), 10) : Number.NaN;
  const apiModule = apiCourse?.modules.find((mod) => mod.moduleId === moduleNumber);
  const apiRoom = apiModule?.rooms.find(
    (apiRoomItem) => apiRoomItem.title.toLowerCase() === room?.title.toLowerCase(),
  );
  const isRoomLocked =
    courseLoadError || !apiModule || !apiRoom || Boolean(apiModule.locked || apiRoom.locked);
  const isRoomComplete = completedRooms.has(`${phaseId}:${roomId}`);
  const quizModuleId = apiModule ? String(apiModule.moduleId) : '';
  const quizCourseId = apiCourse?.id || bootcampId || '';
  const quizRoomId = room ? String(phase?.rooms.findIndex((r) => r.id === roomId) + 1) : '';

  const goToStep = (idx: number) => {
    const isCheckpoint = Boolean(room && idx >= room.steps.length);
    setCurrentStepIdx(idx);
    setSearchParams((prev) => {
      prev.set('step', String(idx));
      return prev;
    }, { replace: true });
    if (!isCheckpoint) {
      setViewedSteps((prev) => { const next = new Set(prev); next.add(idx); persistViewedSteps(next); return next; });
    }
    scrollToStepId(
      isCheckpoint ? 'room-final-quiz' : `${phaseId}-${roomId}-step-${idx + 1}`,
      prefersReducedMotion ? 'auto' : 'smooth',
    );
  };
  const handleComplete = async () => {
    if (completing) return; setCompleting(true);
    try {
      const nextUnviewedStep = room?.steps.findIndex((_, index) => !viewedSteps.has(index)) ?? -1;
      if (nextUnviewedStep >= 0) {
        goToStep(nextUnviewedStep);
        return;
      }
      if (!quizPassed && quizModuleId) {
        goToStep(room?.steps.length ?? 0);
        return;
      }
      if (phaseId && roomId) await markRoomComplete(phaseId, roomId); else setShowCompleteOverlay(true);
    } finally { setCompleting(false); }
  };

  if (apiLoading) return <BootcampRoomSkeleton />;

  const roomTitle = room?.title || "Room";

  if (!phase || !room || isRoomLocked) {
    return (
      <FadeIn>
        <div className="w-full bg-canvas min-h-dvh">
          <SEO
            title={roomTitle}
            description={`Complete the "${roomTitle}" room in the Hacker Protocol Bootcamp on QYVORA.`}
            noindex
          />
          <div className="w-full px-3 pt-8 pb-16 md:px-4 md:pb-20 lg:px-6 lg:pb-24">
            {!phase || !room ? (
              <EmptyState
                icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
                title={"Room not found."}
                description={"This room doesn't exist in the bootcamp config."}
                action={
                  <Button to="/dashboard/labs" variant="secondary">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {"Back to Labs"}
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Lock className="h-6 w-6" aria-hidden="true" />}
                title={courseLoadError ? "Access could not be verified" : room.title}
                description={
                  courseLoadError
                    ? "Bootcamp access could not be confirmed. Refresh and try again."
                    : "This room is locked. Your instructor will unlock it when it's time."
                }
                action={
                  <Button to="/dashboard/labs" variant="secondary">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {"Back to Labs"}
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </FadeIn>
    );
  }

  const tasks: LearningTask[] = room.steps.map((step, index) => ({
    id: `${phaseId}-${roomId}-step-${index + 1}`,
    title: step.title,
    description: viewedSteps.has(index) ? 'Viewed' : index === currentStepIdx ? 'Current task' : `${index + 1} of ${room.steps.length}`,
    completed: viewedSteps.has(index),
    content: (
      <StepCard
        step={step}
        stepNum={index + 1}
        phaseId={phaseId || ''}
        roomId={roomId || ''}
        isActive={index === currentStepIdx}
        isViewed={viewedSteps.has(index)}
        hideHeader
      />
    ),
  }));

  if (quizModuleId) {
    tasks.push({
      id: 'room-final-quiz',
      title: 'Final checkpoint',
      description: quizPassed ? 'Passed' : 'Required before the room can be completed',
      completed: quizPassed,
      content: (
        <QuizModal
          inline
          moduleId={quizModuleId}
          roomId={quizRoomId}
          courseId={quizCourseId}
          onClose={() => {}}
          onPassed={() => {
            setQuizPassed(true);
            const allStepsViewed = room.steps.every((_, index) => viewedSteps.has(index));
            if (allStepsViewed && phaseId && roomId) markRoomComplete(phaseId, roomId);
          }}
        />
      ),
    });
  }

  const activeTaskId = currentStepIdx < room.steps.length
    ? tasks[currentStepIdx]?.id
    : tasks.find((task) => task.id === 'room-final-quiz')?.id;
  const nextIncompleteIdx = room.steps.findIndex((_, index) => !viewedSteps.has(index));
  const continueIndex = nextIncompleteIdx >= 0
    ? nextIncompleteIdx
    : quizModuleId && !quizPassed
      ? room.steps.length
      : 0;

  return (
    <FadeIn>
    <div className="w-full bg-canvas overflow-x-hidden min-h-dvh">
      <SEO
        title={roomTitle}
        description={`Complete the "${roomTitle}" room in the Hacker Protocol Bootcamp on QYVORA.`}
        noindex
      />

      <RoomCompletionCelebration
        show={showCompleteOverlay} roomTitle={room.title} cpEarned={completionCpEarned}
        onClose={() => {
          setShowCompleteOverlay(false);
          navigate('/dashboard/labs');
        }}
      />

      <LearningWorkspaceShell
        kicker={`${phase.codename} - ${phase.title}`}
        title={room.title}
        description={room.overview}
        backTo="/dashboard/labs"
        backLabel={"Back to Labs"}
        icon={<img src={hpbLogo} alt="" />}
        heroArtSrc={hpbLogo}
        stats={[
          { label: "min", value: room.estimatedMinutes },
          { label: "steps", value: room.steps.length },
          { label: "in session", value: formatTime(timeSpent) },
          ...(isRoomComplete
            ? [{ label: "complete", value: '\u2713', accent: true }]
            : []),
        ]}
        progress={{
          value: room.steps.length > 0 ? (viewedSteps.size / room.steps.length) * 100 : 0,
          label: `${viewedSteps.size} / ${room.steps.length} steps`,
        }}
        actions={
          <Button variant="secondary" onClick={() => goToStep(continueIndex)}>
            {isRoomComplete ? "Review room" : nextIncompleteIdx >= 0 ? "Continue training" : "Go to checkpoint"}
          </Button>
        }
      >
          {room.steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="h-12 w-12 text-text-muted opacity-20 mb-4" />
              <p className="text-base font-bold text-text-muted">{"No steps available yet"}</p>
              <p className="text-sm text-text-muted/60 mt-1">{"Check back later for new content"}</p>
            </div>
          ) : (
            <>
              <LearningTaskAccordion
                tasks={tasks}
                activeId={activeTaskId}
                onActiveChange={(id) => {
                  const index = tasks.findIndex((task) => task.id === id);
                  if (index >= 0) goToStep(index);
                }}
              />

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border-subtle bg-surface px-6 py-5">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium tabular-nums text-text-primary">{viewedSteps.size}</span>
                  {` of ${room.steps.length} tasks viewed`}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {quizModuleId && !quizPassed && (
                    <Button variant="secondary" onClick={() => goToStep(room.steps.length)}>
                      {"Go to checkpoint"}
                    </Button>
                  )}
                  <Button onClick={handleComplete} disabled={completing || isRoomComplete}>
                    {completing
                      ? "Completing…"
                      : isRoomComplete
                        ? "Room complete"
                        : quizModuleId && !quizPassed
                          ? "Go to Checkpoint"
                          : "Complete Room"}
                  </Button>
                </div>
              </div>
            </>
          )}
      </LearningWorkspaceShell>
    </div>
    </FadeIn>
  );
};

export default BootcampRoomPage;