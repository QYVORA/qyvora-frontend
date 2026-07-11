import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Loader2,
  CheckCircle2, BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
  type BootcampPhase,
} from '@/features/student/constants/bootcampConfig';
import CopyButton from '@/features/student/components/bootcamp-room/CopyButton';
import StepJumpMenu from '@/features/student/components/bootcamp-room/StepJumpMenu';
import ReportIssueModal from '@/features/student/components/bootcamp-room/ReportIssueModal';
import StepCard from '@/features/student/components/bootcamp-room/StepCard';
import RoomSidebar from '@/features/student/components/bootcamp-room/RoomSidebar';
import QuizModal from '@/features/student/components/bootcamp-room/QuizModal';
import QuizGateModal from '@/features/student/components/bootcamp-room/QuizGateModal';
import RoomCompletionCelebration from '@/features/student/components/bootcamp-room/RoomCompletionCelebration';
import RoomHeader from '@/features/student/components/bootcamp-room/RoomHeader';
import RoomProgress from '@/features/student/components/bootcamp-room/RoomProgress';
import RoomNavigation from '@/features/student/components/bootcamp-room/RoomNavigation';
import DesktopToolbar from '@/features/student/components/bootcamp-room/DesktopToolbar';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
import type { ApiCourse, RoomQuiz, QuizQuestion } from '@/features/student/components/bootcamp-room/types';
import SEO from '@/shared/components/SEO';
import PageLoader from '@/shared/components/PageLoader';

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

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const [apiCourse, setApiCourse] = useState<ApiCourse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    const step = searchParams.get('step');
    return step ? Math.max(0, parseInt(step, 10) || 0) : 0;
  });
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set([0]));
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

  const { timeSpent, fullscreen, toggleFullscreen, resetSession } = useRoomSession();

  const loadCourseData = useCallback(async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const [ovRes, courseRes] = await Promise.all([
        api.get('/student/overview'),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      if (!mountedRef.current) return;
      const ov = ovRes.data;
      const enrolledViaStatus = ov?.bootcampStatus && ov.bootcampStatus !== 'not_enrolled' && String(ov?.bootcampId || '') === String(bootcampId || '');
      const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some((m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || ''));
      setBootcampStatus(enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled');
      if (courseRes?.data) setApiCourse(courseRes.data as ApiCourse);
    } catch { addToast('Failed to load course data', 'error'); }
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
    } catch (err: any) {
      console.error('❌ Failed to complete room:', err?.response?.data || err);
      addToast('Failed to mark room as complete', 'error');
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
        console.error('❌ Failed to open room session:', err?.response?.data || err?.message || err);
        addToast('Failed to open room session', 'error');
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
    const sidebarHandler = () => setSidebarOpen(true);
    window.addEventListener('bootcamp:openSidebar', sidebarHandler);
    return () => {
      window.removeEventListener('bootcamp:openSidebar', sidebarHandler);
    };
  }, []);

  useEffect(() => {
    const step = searchParams.get('step');
    setCurrentStepIdx(step ? Math.max(0, parseInt(step, 10) || 0) : 0);
    setViewedSteps(new Set([0]));
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
    setViewedSteps((prev) => { const next = new Set(prev); next.add(idx); return next; });
  };
  const handleComplete = async () => {
    if (completing) return; setCompleting(true);
    try {
      const allStepIdxs = room?.steps.map((_, i) => i) || []; setViewedSteps(new Set(allStepIdxs));
      if (!quizPassed && quizModuleId) { setQuizGateOpen(true); return; }
      if (phaseId && roomId) await markRoomComplete(phaseId, roomId); else setShowCompleteOverlay(true);
    } finally { setCompleting(false); }
  };

  if (apiLoading) return <PageLoader />;

  const roomTitle = room?.title || 'Room';
  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO
        title={roomTitle}
        description={`Complete the "${roomTitle}" room in the Hacker Protocol Bootcamp on QYVORA.`}
      />
      <AnimatePresence>
        {quizGateOpen && <QuizGateModal onClose={() => setQuizGateOpen(false)} onTakeQuiz={() => { setQuizGateOpen(false); setQuizOpen(true); }} />}
      </AnimatePresence>

      {quizOpen && quizModuleId && (
        <QuizModal moduleId={quizModuleId} roomId={quizRoomId} courseId={quizCourseId} onClose={() => setQuizOpen(false)} onPassed={() => { setQuizPassed(true); setQuizOpen(false); if (phaseId && roomId) markRoomComplete(phaseId, roomId); }} />
      )}

      <AnimatePresence>
        {jumpMenuOpen && room && <StepJumpMenu steps={room.steps} currentStepIdx={currentStepIdx} viewedSteps={viewedSteps} onJump={goToStep} isOpen={jumpMenuOpen} onClose={() => setJumpMenuOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {reportIssueOpen && phaseId && roomId && <ReportIssueModal phaseId={phaseId} roomId={roomId} stepIdx={reportStepIdx} onClose={() => setReportIssueOpen(false)} />}
      </AnimatePresence>

      <RoomCompletionCelebration
        show={showCompleteOverlay} roomTitle={room?.title || ''} cpEarned={completionCpEarned}
        onClose={() => {
          setShowCompleteOverlay(false);
          if (nextRoom && !lockedRooms.has(`${nextRoom.phaseId}:${nextRoom.roomId}`)) handleNavigate(nextRoom.phaseId, nextRoom.roomId);
          else navigate(`/dashboard/bootcamps/${bootcampId}`);
        }}
      />

      <DesktopToolbar
        setJumpMenuOpen={setJumpMenuOpen} toggleFullscreen={toggleFullscreen} fullscreen={fullscreen}
        isLastStep={isLastStep} isRoomComplete={isRoomComplete} nextRoom={nextRoom}
        quizModuleId={quizModuleId} completing={completing} currentStepIdx={currentStepIdx} goToStep={goToStep} handleComplete={handleComplete}
      />

      <RoomSidebar phases={BOOTCAMP_CONFIG.phases} activePhaseId={phaseId || ''} activeRoomId={roomId || ''} completedRooms={completedRooms} lockedRooms={lockedRooms} bootcampId={bootcampId || ''} onNavigate={handleNavigate} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div className="mx-auto w-full max-w-6xl md:max-w-[1600px] px-4 sm:px-6 md:px-8 pt-8 pb-20 lg:pb-24">
          {!phase || !room ? (
            <div className="mx-auto max-w-4xl px-4 py-12"><Link to={`/dashboard/bootcamps/${bootcampId}`} className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp</Link><div className="rounded-2xl border border-border bg-bg-card p-10 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" /><h1 className="mb-2 text-lg font-black text-text-primary">Room Not Found</h1><p className="text-sm text-text-muted">This room doesn't exist in the bootcamp config.</p></div></div>
          ) : isRoomLocked ? (
            <div className="mx-auto max-w-4xl px-4 py-12"><Link to={`/dashboard/bootcamps/${bootcampId}`} className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp</Link><div className="rounded-2xl border border-border bg-bg-card p-10 text-center"><Lock className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" /><h1 className="mb-2 text-lg font-black text-text-primary">{room.title}</h1><p className="text-sm text-text-muted">This room is locked. Your instructor will unlock it when it's time.</p></div></div>
          ) : (
            <>
              <RoomHeader phase={phase} room={room} timeSpent={timeSpent} formatTime={formatTime} isRoomComplete={isRoomComplete} />
              <RoomProgress viewedStepsCount={viewedSteps.size} totalStepsCount={room.steps.length} timeSpent={timeSpent} formatTime={formatTime} currentStepIdx={currentStepIdx} goToStep={goToStep} steps={room.steps} viewedSteps={viewedSteps} />
              {room.steps.length === 0 && !apiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="h-12 w-12 text-text-muted opacity-20 mb-4" />
                  <p className="text-base font-bold text-text-muted">No steps available yet</p>
                  <p className="text-sm text-text-muted/60 mt-1">Check back later for new content</p>
                </div>
              ) : (
                <>
                  <div className="hidden md:block mb-10 space-y-8">{room.steps.map((s, i) => <StepCard key={i} step={s} stepNum={i+1} phaseId={phaseId || ''} roomId={roomId || ''} isActive={i===currentStepIdx} isViewed={viewedSteps.has(i)} isBookmarked={isStepBookmarked(i)} gotIt={gotItSteps.has(i+1)} onGotIt={handleGotIt} phaseColor={phase.color} footer={null} onToggleBookmark={() => toggleBookmark(i)} onReportIssue={() => { setReportStepIdx(i); setReportIssueOpen(true); }} onClick={() => goToStep(i)} onNext={() => goToStep(Math.min(i + 1, room.steps.length - 1))} onPrev={() => goToStep(Math.max(i - 1, 0))} />)}</div>
                  <div className="md:hidden mb-10"><StepCard key={currentStepIdx} step={room.steps[currentStepIdx]} stepNum={currentStepIdx+1} phaseId={phaseId || ''} roomId={roomId || ''} isActive isViewed={viewedSteps.has(currentStepIdx)} isBookmarked={isStepBookmarked(currentStepIdx)} gotIt={gotItSteps.has(currentStepIdx+1)} onGotIt={handleGotIt} phaseColor={phase.color} footer={null} onToggleBookmark={() => toggleBookmark(currentStepIdx)} onReportIssue={() => { setReportStepIdx(currentStepIdx); setReportIssueOpen(true); }} onClick={() => goToStep(currentStepIdx)} onNext={() => goToStep(Math.min(currentStepIdx + 1, room.steps.length - 1))} onPrev={() => goToStep(Math.max(currentStepIdx - 1, 0))} /></div>
                </>
              )}
              <RoomNavigation currentStepIdx={currentStepIdx} totalSteps={room.steps.length} isLastStep={isLastStep} isRoomComplete={isRoomComplete} nextRoom={nextRoom} quizPassed={quizPassed} quizModuleId={quizModuleId} completing={completing} fullscreen={fullscreen} goToStep={goToStep} handleComplete={handleComplete} toggleFullscreen={toggleFullscreen} setJumpMenuOpen={setJumpMenuOpen} />
            </>
          )}
      </div>
    </div>
  );
};

export default BootcampRoomPage;
