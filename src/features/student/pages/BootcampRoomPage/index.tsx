import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Lock, BookOpen,
  List, ChevronRight,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import FadeIn from '@/shared/components/ui/FadeIn';
import EmptyState from '@/shared/components/ui/EmptyState';
import Button from '@/shared/components/ui/Button';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
} from '@/features/student/constants/bootcampConfig';
import StepJumpMenu from '@/features/student/components/bootcamp-room/StepJumpMenu';
import ReportIssueModal from '@/features/student/components/bootcamp-room/ReportIssueModal';
import StepCard from '@/features/student/components/bootcamp-room/StepCard';
import RoomSidebar from '@/features/student/components/bootcamp-room/RoomSidebar';
import QuizModal from '@/features/student/components/bootcamp-room/QuizModal';
import QuizGateModal from '@/features/student/components/bootcamp-room/QuizGateModal';
import RoomCompletionCelebration from '@/features/student/components/bootcamp-room/RoomCompletionCelebration';
import LearningNav from '@/shared/components/learning/LearningNav';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import FocusedStepList from '@/shared/components/learning/FocusedStepList';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import type { ApiCourse } from '@/features/student/components/bootcamp-room/types';
import SEO from '@/shared/components/SEO';
import { BootcampRoomSkeleton } from '@/features/student/components/StudentSkeletons';
import { getRelatedContentForHpbRoom } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';

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
  const persistViewedSteps = (next: Set<number>) => {
    try { localStorage.setItem(viewedStepsKey, JSON.stringify([...next])); } catch { /* ignore */ }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizGateOpen, setQuizGateOpen] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showCompleteOverlay, setShowCompleteOverlay] = useState(false);
  const [completionCpEarned, setCompletionCpEarned] = useState(250);
  const [completing, setCompleting] = useState(false);
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [reportStepIdx, setReportStepIdx] = useState(0);
  const [jumpMenuOpen, setJumpMenuOpen] = useState(false);

  const { timeSpent, resetSession } = useRoomSession();
  const prefersReducedMotion = useReducedMotion();

  const bootcampStatus = (() => {
    const enrolledViaStatus = overview?.bootcampStatus && overview.bootcampStatus !== 'not_enrolled' && String(overview?.bootcampId || '') === String(bootcampId || '');
    const enrolledViaModules = (Array.isArray(overview?.modules) ? overview.modules : []).some((m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || ''));
    return enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled';
  })();

  const loadCourseData = useCallback(async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const courseRes = await api.get(`/student/course${query}`).catch(() => null);
      if (!mountedRef.current) return;
      if (courseRes?.data) setApiCourse(courseRes.data as ApiCourse);
    } catch { addToast("Failed to load course data", 'error'); }
    finally { if (mountedRef.current) setApiLoading(false); }
  }, [bootcampId]);

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
        setQuizGateOpen(true);
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
  }, [phaseId, roomId, bootcampId, apiLoading, bootcampStatus]);

  useEffect(() => {
    if (!apiLoading && bootcampStatus === 'not_enrolled' && redirectCountRef.current < MAX_REDIRECTS) {
      redirectCountRef.current += 1;
      navigate('/dashboard/bootcamps', { replace: true });
    }
  }, [apiLoading, bootcampStatus, navigate]);

  useEffect(() => {
    const step = searchParams.get('step');
    setCurrentStepIdx(step ? Math.max(0, parseInt(step, 10) || 0) : 0);
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
  }, [phaseId, roomId]);

  const completedRooms = new Set<string>();
  const lockedRooms = new Set<string>();
  if (apiCourse) {
    apiCourse.modules.forEach((mod) => {
      const matchPhase = BOOTCAMP_CONFIG.phases.find((p) => p.title.toLowerCase() === mod.title.toLowerCase());
      if (matchPhase) {
        if (mod.locked) matchPhase.rooms.forEach((r) => lockedRooms.add(`${matchPhase.id}:${r.id}`));
        mod.rooms.forEach((apiRoom) => {
          const matchRoom = matchPhase.rooms.find((r) => r.title.toLowerCase() === apiRoom.title.toLowerCase());
          if (matchRoom) {
            if (apiRoom.completed) completedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
            if (apiRoom.locked) lockedRooms.add(`${matchPhase.id}:${matchRoom.id}`);
          }
        });
      }
    });
  }

  const allRooms: Array<{ phaseId: string; roomId: string; title: string }> = [];
  BOOTCAMP_CONFIG.phases.forEach((p) => { p.rooms.forEach((r) => allRooms.push({ phaseId: p.id, roomId: r.id, title: r.title })); });

  const phase = BOOTCAMP_CONFIG.phases.find((p) => p.id === phaseId);
  const room = phase?.rooms.find((r) => r.id === roomId);
  const isRoomLocked = lockedRooms.has(`${phaseId}:${roomId}`);
  const isRoomComplete = completedRooms.has(`${phaseId}:${roomId}`);
  const isLastStep = room ? currentStepIdx === room.steps.length - 1 : false;
  const currentRoomIdx = allRooms.findIndex((r) => r.phaseId === phaseId && r.roomId === roomId);
  const nextRoom = currentRoomIdx < allRooms.length - 1 ? allRooms[currentRoomIdx + 1] : null;
  const apiModule = apiCourse?.modules.find((m) => m.title.toLowerCase() === phase?.title.toLowerCase());
  const quizModuleId = apiModule ? String(apiModule.moduleId) : '';
  const quizCourseId = apiCourse?.id || bootcampId || '';
  const quizRoomId = room ? String(phase?.rooms.findIndex((r) => r.id === roomId) + 1) : '';

  const bookmarksKey = `hpb_bookmarks_${bootcampId || 'hpb'}`;
  const [bookmarkedSteps, setBookmarkedSteps] = useState<Set<string>>(() => {
    try { const raw = localStorage.getItem(bookmarksKey); return raw ? new Set(JSON.parse(raw)) : new Set(); }
    catch { return new Set(); }
  });

  const gotItKey = `gotit_${phaseId}_${roomId}`;
  const [gotItSteps, setGotItSteps] = useState<Set<number>>(() => {
    try { const raw = localStorage.getItem(gotItKey); return raw ? new Set(JSON.parse(raw)) : new Set(); }
    catch { return new Set(); }
  });
  const handleGotIt = useCallback((stepNum: number, val: boolean) => {
    setGotItSteps((prev) => {
      const next = new Set(prev);
      if (val) next.add(stepNum); else next.delete(stepNum);
      try { localStorage.setItem(gotItKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [gotItKey]);
  const toggleBookmark = (stepIdx: number) => {
    const key = `${phaseId}:${roomId}:${stepIdx}`;
    setBookmarkedSteps(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      try { localStorage.setItem(bookmarksKey, JSON.stringify([...next])); } catch (_e) { /* ignore */ }
      return next;
    });
  };
  const isStepBookmarked = (stepIdx: number) => bookmarkedSteps.has(`${phaseId}:${roomId}:${stepIdx}`);

  const handleNavigate = (pId: string, rId: string) => navigate(`/dashboard/bootcamps/${bootcampId}/phases/${pId}/rooms/${rId}`);
  const goToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setSearchParams((prev) => {
      prev.set('step', String(idx));
      return prev;
    }, { replace: true });
    setViewedSteps((prev) => { const next = new Set(prev); next.add(idx); persistViewedSteps(next); return next; });
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    const attemptScroll = (tries = 0) => {
      if (tries > 20) return;
      if (idx === 0) {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const el = document.getElementById(`step-${idx + 1}`);
      if (el) el.scrollIntoView({ behavior, block: 'start' });
      else window.setTimeout(() => attemptScroll(tries + 1), 50);
    };
    requestAnimationFrame(() => attemptScroll());
  };
  const handleComplete = async () => {
    if (completing) return; setCompleting(true);
    try {
      const allStepIdxs = room?.steps.map((_, i) => i) || [];
      const allViewed = new Set(allStepIdxs);
      persistViewedSteps(allViewed);
      setViewedSteps(allViewed);
      if (!quizPassed && quizModuleId) { setQuizGateOpen(true); return; }
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
                  <Button to={`/dashboard/bootcamps/${bootcampId}`} variant="secondary">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {"Back to Bootcamp"}
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Lock className="h-6 w-6" aria-hidden="true" />}
                title={room.title}
                description={"This room is locked. Your instructor will unlock it when it's time."}
                action={
                  <Button to={`/dashboard/bootcamps/${bootcampId}`} variant="secondary">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {"Back to Bootcamp"}
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
    <div className="w-full bg-canvas overflow-x-hidden min-h-dvh">
      <SEO
        title={roomTitle}
        description={`Complete the "${roomTitle}" room in the Hacker Protocol Bootcamp on QYVORA.`}
        noindex
      />
      <AnimatePresence>
        {quizGateOpen && <QuizGateModal onClose={() => setQuizGateOpen(false)} onTakeQuiz={() => { setQuizGateOpen(false); setQuizOpen(true); }} />}
      </AnimatePresence>

      {quizOpen && quizModuleId && (
        <QuizModal moduleId={quizModuleId} roomId={quizRoomId} courseId={quizCourseId} onClose={() => setQuizOpen(false)} onPassed={() => { setQuizPassed(true); setQuizOpen(false); if (phaseId && roomId) markRoomComplete(phaseId, roomId); }} />
      )}

      <AnimatePresence>
        {jumpMenuOpen && <StepJumpMenu steps={room.steps} currentStepIdx={currentStepIdx} viewedSteps={viewedSteps} onJump={goToStep} isOpen={jumpMenuOpen} onClose={() => setJumpMenuOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {reportIssueOpen && phaseId && roomId && <ReportIssueModal phaseId={phaseId} roomId={roomId} stepIdx={reportStepIdx} onClose={() => setReportIssueOpen(false)} />}
      </AnimatePresence>

      <RoomCompletionCelebration
        show={showCompleteOverlay} roomTitle={room.title} cpEarned={completionCpEarned}
        onClose={() => {
          setShowCompleteOverlay(false);
          if (nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`)) handleNavigate(nextRoom.phaseId, nextRoom.roomId);
          else navigate(`/dashboard/bootcamps/${bootcampId}`);
        }}
      />

      <RoomSidebar phases={BOOTCAMP_CONFIG.phases} activePhaseId={phaseId || ''} activeRoomId={roomId || ''} completedRooms={completedRooms} lockedRooms={lockedRooms} bootcampId={bootcampId || ''} onNavigate={handleNavigate} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <LearningWorkspaceShell
        kicker={`${phase.codename} - ${phase.title}`}
        title={room.title}
        description={room.overview}
        backTo={`/dashboard/bootcamps/${bootcampId}`}
        backLabel={"Back to Bootcamp"}
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
      >
          {room.steps.length === 0 && !apiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="h-12 w-12 text-text-muted opacity-20 mb-4" />
                  <p className="text-base font-bold text-text-muted">{"No steps available yet"}</p>
                  <p className="text-sm text-text-muted/60 mt-1">{"Check back later for new content"}</p>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <FocusedStepList
                      idPrefix="step"
                      items={room.steps.map((s, i) => ({
                        index: i,
                        number: i + 1,
                        title: s.title,
                        isActive: i === currentStepIdx,
                        isCompleted: viewedSteps.has(i) && i !== currentStepIdx,
                        isLocked: false,
                      }))}
                      onSelect={goToStep}
                      renderActive={(i) => (
                        <StepCard
                          key={i}
                          step={room.steps[i]}
                          stepNum={i + 1}
                          phaseId={phaseId || ''}
                          roomId={roomId || ''}
                          isActive
                          isViewed={viewedSteps.has(i)}
                          isBookmarked={isStepBookmarked(i)}
                          gotIt={gotItSteps.has(i + 1)}
                          onGotIt={handleGotIt}
                          phaseColor={phase.color}
                          footer={null}
                          onToggleBookmark={() => toggleBookmark(i)}
                          onReportIssue={() => { setReportStepIdx(i); setReportIssueOpen(true); }}
                          onClick={() => goToStep(i)}
                          onNext={() => goToStep(Math.min(i + 1, room.steps.length - 1))}
                          onPrev={() => goToStep(Math.max(i - 1, 0))}
                        />
                      )}
                    />
                  </div>
                </>
              )}
              {phaseId && roomId && (
                <div className="mb-8">
                  <RelatedContent {...getRelatedContentForHpbRoom(phaseId, roomId)} title={"Continue This Topic"} />
                </div>
              )}
              <LearningNav
                currentStep={currentStepIdx}
                totalSteps={room.steps.length}
                isLastStep={isLastStep}
                isComplete={isRoomComplete}
                completing={completing}
                onPrev={currentStepIdx > 0 ? () => goToStep(currentStepIdx - 1) : undefined}
                onNext={!isLastStep ? () => goToStep(currentStepIdx + 1) : undefined}
                onComplete={!isLastStep ? undefined : isRoomComplete ? undefined : handleComplete}
                completeLabel={
                  quizModuleId && !quizPassed
                    ? "Take Quiz & Complete"
                    : "Complete Room"
                }
                nextLabel={"Next Step"}
                nextLabelMobile={"Next"}
                leading={
                  <>
                    <button
                      onClick={() => setJumpMenuOpen(true)}
                      className="btn-secondary md:hidden inline-flex items-center gap-1.5 !rounded-xl !text-xs !font-black !uppercase !tracking-widest px-3.5 py-2"
                      aria-label={"Jump to step"}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </>
                }
                finishContent={
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full">
                    {nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`) ? (
                      <button
                        type="button"
                        onClick={() => handleNavigate(nextRoom.phaseId, nextRoom.roomId)}
                        className="btn-primary inline-flex min-h-[44px] flex-1 md:flex-none items-center justify-center gap-1.5 px-5 py-2.5"
                      >
                        {"Continue to Next Room"}
                        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    ) : (
                      <span className="flex-1 text-center sm:text-left font-mono text-xs font-semibold text-text-muted">
                        {!nextRoom
                          ? "Bootcamp complete — all rooms finished."
                          : "Room complete. The next room unlocks when the phase is ready."}
                      </span>
                    )}
                    <Link
                      to={`/dashboard/bootcamps/${bootcampId}`}
                      className="btn-secondary inline-flex min-h-[44px] flex-1 md:flex-none items-center justify-center gap-1.5 px-5 py-2.5"
                    >
                      {"Back to Bootcamp"}
                    </Link>
                  </div>
                }
              />
      </LearningWorkspaceShell>
    </div>
    </FadeIn>
  );
};

export default BootcampRoomPage;
