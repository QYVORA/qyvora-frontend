import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Loader2,
  CheckCircle2, BookOpen, Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import {
  BOOTCAMP_CONFIG,
  type BootcampPhase,
} from '../constants/bootcampConfig';
import CopyButton from '../components/bootcamp-room/CopyButton';
import StepJumpMenu from '../components/bootcamp-room/StepJumpMenu';
import ReportIssueModal from '../components/bootcamp-room/ReportIssueModal';
import StepCard from '../components/bootcamp-room/StepCard';
import RoomSidebar from '../components/bootcamp-room/RoomSidebar';
import QuizModal from '../components/bootcamp-room/QuizModal';
import QuizGateModal from '../components/bootcamp-room/QuizGateModal';
import RoomCompletionCelebration from '../components/bootcamp-room/RoomCompletionCelebration';
import RoomHeader from '../components/bootcamp-room/RoomHeader';
import RoomProgress from '../components/bootcamp-room/RoomProgress';
import RoomNavigation from '../components/bootcamp-room/RoomNavigation';
import DesktopToolbar from '../components/bootcamp-room/DesktopToolbar';
import { useRoomSession } from '../hooks/useRoomSession';
import type { ApiCourse, RoomQuiz, QuizQuestion } from '../components/bootcamp-room/types';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import PageLoader from '../../../shared/components/PageLoader';

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

  const [apiCourse, setApiCourse] = useState<ApiCourse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      const ov = ovRes.data;
      const enrolledViaStatus = ov?.bootcampStatus && ov.bootcampStatus !== 'not_enrolled' && String(ov?.bootcampId || '') === String(bootcampId || '');
      const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some((m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || ''));
      setBootcampStatus(enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled');
      if (courseRes?.data) setApiCourse(courseRes.data as ApiCourse);
    } catch { /* silent */ }
    finally { setApiLoading(false); }
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
    const callSessionOpen = async () => {
      try { await api.post(`/student/modules/${phaseNum}/rooms/${backendRoomId}/session-open`, {}); }
      catch (err: any) { console.error('❌ Failed to open room session:', err?.response?.data || err?.message || err); }
    };
    callSessionOpen();
  }, [phaseId, roomId, bootcampId, apiLoading, bootcampStatus]);

  useEffect(() => {
    if (!apiLoading && bootcampStatus === 'not_enrolled') navigate('/dashboard/bootcamps', { replace: true });
  }, [apiLoading, bootcampStatus, navigate]);

  useEffect(() => {
    const handler = () => setQuizOpen(true);
    window.addEventListener('bootcamp:openQuiz', handler);
    return () => window.removeEventListener('bootcamp:openQuiz', handler);
  }, []);

  useEffect(() => {
    setCurrentStepIdx(0);
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
  const goToStep = (idx: number) => { setCurrentStepIdx(idx); setViewedSteps((prev) => { const next = new Set(prev); next.add(idx); return next; }); };
  const handleComplete = async () => {
    if (completing) return; setCompleting(true);
    try {
      const allStepIdxs = room?.steps.map((_, i) => i) || []; setViewedSteps(new Set(allStepIdxs));
      if (!quizPassed && quizModuleId) { setQuizGateOpen(true); return; }
      if (phaseId && roomId) await markRoomComplete(phaseId, roomId); else setShowCompleteOverlay(true);
    } finally { setCompleting(false); }
  };

  if (apiLoading) return <PageLoader />;

  return (
    <div className="bg-bg overflow-x-hidden">
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

      <div className="md:fixed md:inset-0 md:top-24 md:flex md:flex-row md:overflow-hidden">
        <aside className={`hidden md:flex md:flex-col shrink-0 bg-bg-card border-r border-border overflow-hidden transition-all duration-300 relative ${sidebarCollapsed ? 'w-0 border-r-0' : 'w-72 xl:w-80'}`}>
          <div className="w-72 xl:w-80 h-full overflow-y-auto overscroll-contain scroll-hover">
            <nav className={`flex flex-col gap-1 p-4 pb-8 transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <div className="mb-4 px-1"><Link to={`/dashboard/bootcamps/${bootcampId}`} className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Curriculum</Link></div>
              {BOOTCAMP_CONFIG.phases.map((p_) => (
                <div key={p_.id} className="mb-4">
                  <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">{p_.codename} — {p_.title}</p>
                  <div className="space-y-0.5 border-l-2 border-border/40 ml-2 pl-3">
                    {p_.rooms.map((r_) => {
                      const k = `${p_.id}:${r_.id}`; const act = p_.id === phaseId && r_.id === roomId; const comp = completedRooms.has(k); const lock = lockedRooms.has(k);
                      return (
                        <button key={k} onClick={() => { if (!lock) handleNavigate(p_.id, r_.id); }} disabled={lock} className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all min-h-[52px] ${act ? 'bg-accent-dim border border-accent/30 text-accent font-bold' : lock ? 'opacity-40 cursor-not-allowed text-text-muted' : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'}`}>
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black font-mono ${comp ? 'border-accent/40 bg-accent text-bg' : act ? 'border-accent/40 bg-accent-dim text-accent' : 'border-border bg-bg text-text-muted'}`}>{comp ? <CheckCircle2 className="h-3 w-3" /> : lock ? <Lock className="h-3 w-3" /> : null}</span>
                          <span className="truncate text-sm">{r_.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={`hidden md:flex absolute top-6 z-50 h-8 w-8 rounded-full border border-border bg-bg-card items-center justify-center text-text-muted hover:text-accent transition-all shadow-xl hover:scale-110 active:scale-95 ${sidebarCollapsed ? 'left-6 rotate-180' : 'left-[274px] xl:left-[306px]'}`} title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}><Menu className="h-4 w-4" /></button>
        <RoomSidebar phases={BOOTCAMP_CONFIG.phases} activePhaseId={phaseId || ''} activeRoomId={roomId || ''} completedRooms={completedRooms} lockedRooms={lockedRooms} bootcampId={bootcampId || ''} onNavigate={handleNavigate} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-h-0 min-w-0 md:overflow-y-auto md:overscroll-contain scroll-hover">
          {!phase || !room ? (
            <div className="mx-auto max-w-4xl px-4 py-12"><Link to={`/dashboard/bootcamps/${bootcampId}`} className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp</Link><div className="rounded-2xl border border-border bg-bg-card p-10 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" /><h1 className="mb-2 text-lg font-black text-text-primary">Room Not Found</h1><p className="text-sm text-text-muted">This room doesn't exist in the bootcamp config.</p></div></div>
          ) : isRoomLocked ? (
            <div className="mx-auto max-w-4xl px-4 py-12"><Link to={`/dashboard/bootcamps/${bootcampId}`} className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors"><ArrowLeft className="h-3.5 w-3.5" /> Back to Bootcamp</Link><div className="rounded-2xl border border-border bg-bg-card p-10 text-center"><Lock className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" /><h1 className="mb-2 text-lg font-black text-text-primary">{room.title}</h1><p className="text-sm text-text-muted">This room is locked. Your instructor will unlock it when it's time.</p></div></div>
          ) : (
            <div className="mx-auto w-full max-w-6xl md:max-w-7xl px-4 sm:px-6 md:px-8 py-8 md:py-12 pb-safe-bottom">
              <div className="mb-6 flex flex-wrap items-center gap-2.5 md:hidden"><button onClick={() => setSidebarOpen(true)} className="inline-flex items-center gap-2 rounded-xl border-2 border-accent/40 bg-accent-dim px-3.5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-accent"><Menu className="h-4 w-4" /> Curriculum</button><span className="min-w-0 flex-1 text-[11px] font-black uppercase tracking-[0.12em] text-text-muted">{phase.codename} — {room.title}</span></div>
              <RoomHeader phase={phase} room={room} timeSpent={timeSpent} formatTime={formatTime} isRoomComplete={isRoomComplete} />
              <RoomProgress viewedStepsCount={viewedSteps.size} totalStepsCount={room.steps.length} timeSpent={timeSpent} formatTime={formatTime} currentStepIdx={currentStepIdx} goToStep={goToStep} steps={room.steps} viewedSteps={viewedSteps} />
              <div className="hidden md:block mb-10 space-y-8">{room.steps.map((s, i) => <StepCard key={i} step={s} stepNum={i+1} phaseId={phaseId || ''} roomId={roomId || ''} isActive={i===currentStepIdx} isViewed={viewedSteps.has(i)} isBookmarked={isStepBookmarked(i)} phaseColor={phase.color} footer={null} onToggleBookmark={() => toggleBookmark(i)} onReportIssue={() => { setReportStepIdx(i); setReportIssueOpen(true); }} onClick={() => goToStep(i)} />)}</div>
              <div className="md:hidden mb-10"><StepCard key={currentStepIdx} step={room.steps[currentStepIdx]} stepNum={currentStepIdx+1} phaseId={phaseId || ''} roomId={roomId || ''} isActive isViewed={viewedSteps.has(currentStepIdx)} isBookmarked={isStepBookmarked(currentStepIdx)} phaseColor={phase.color} footer={null} onToggleBookmark={() => toggleBookmark(currentStepIdx)} onReportIssue={() => { setReportStepIdx(currentStepIdx); setReportIssueOpen(true); }} onClick={() => goToStep(currentStepIdx)} /></div>
              <RoomNavigation currentStepIdx={currentStepIdx} totalSteps={room.steps.length} isLastStep={isLastStep} isRoomComplete={isRoomComplete} nextRoom={nextRoom} quizPassed={quizPassed} quizModuleId={quizModuleId} completing={completing} fullscreen={fullscreen} goToStep={goToStep} handleComplete={handleComplete} toggleFullscreen={toggleFullscreen} setJumpMenuOpen={setJumpMenuOpen} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BootcampRoomPage;
