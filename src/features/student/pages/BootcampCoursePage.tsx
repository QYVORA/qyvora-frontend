
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen, Lock, CheckCircle2, ChevronDown, ChevronRight,
  Loader2, Flag, ArrowLeft, ExternalLink, Video, FileText, AlertCircle
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';

interface ReadingLink { title: string; url: string; }
interface LiveClass { title: string; instructor?: string; time?: string; link: string; }
interface Room {
  roomId: number; title: string; overview: string; locked: boolean; image?: string;
  completed?: boolean; readingContent?: string; readingLinks?: ReadingLink[];
  meetingLink?: string; liveClass?: LiveClass;
}
interface Module {
  moduleId: number; title: string; description: string; codename: string;
  roleTitle: string; badge: string; ctf: string; locked: boolean;
  rooms: Room[]; progress?: number; roomsCompleted?: number; roomsTotal?: number; ctfCompleted?: boolean;
}
interface Course { id: string; title: string; modules: Module[]; }
interface QuizQuestion { id: string; text: string; options: string[]; }
interface RoomQuiz {
  scope?: { type?: string; id?: string | number; moduleId?: string | number; courseId?: string };
  questions: QuizQuestion[];
}

const ROOM_CARD_IMAGES = [
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
];

const ROOM_PHASE_IMAGE_MAP: Record<string, string> = {
  hackermindset: '/images/bootcamp-room-images/hackermindset.png',
  linuxfoundations: '/images/bootcamp-room-images/LinuxFoundations.png',
  networking: '/images/bootcamp-room-images/networking.png',
  socialengineering: '/images/bootcamp-room-images/socialengineering.png',
  webandbackendsystems: '/images/bootcamp-room-images/webandbackendsystems.png',
};

const normalizeToken = (value = '') => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const resolveRoomPhaseImage = (...values: string[]) => {
  const text = normalizeToken(values.join(' '));
  if (text.includes('hackermindset')) return ROOM_PHASE_IMAGE_MAP.hackermindset;
  if (text.includes('linuxfoundation') || text.includes('linuxfundamental') || text.includes('linux')) return ROOM_PHASE_IMAGE_MAP.linuxfoundations;
  if (text.includes('network')) return ROOM_PHASE_IMAGE_MAP.networking;
  if (text.includes('socialengineering') || (text.includes('social') && text.includes('engineering'))) return ROOM_PHASE_IMAGE_MAP.socialengineering;
  if (text.includes('webandbackendsystem') || (text.includes('web') && text.includes('backend'))) return ROOM_PHASE_IMAGE_MAP.webandbackendsystems;
  return '';
};

const resolveRoomImage = (room: Room, idx: number, module?: Module) => {
  const explicit = String(room.image || '').trim();
  if (explicit) return explicit;
  const mapped = resolveRoomPhaseImage(module?.title || '', module?.codename || '', module?.description || '', room.title || '', room.overview || '');
  return mapped || ROOM_CARD_IMAGES[idx % ROOM_CARD_IMAGES.length];
};

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { user, refreshMe } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [joiningSessionKey, setJoiningSessionKey] = useState<string | null>(null);
  const [quizLoadingKey, setQuizLoadingKey] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<RoomQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const load = async () => {
    try {
      const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
      const [ovRes, courseRes] = await Promise.all([
        api.get('/student/overview'),
        api.get(`/student/course${query}`).catch(() => null),
      ]);
      setOverview(ovRes.data || null);
      setBootcampStatus(ovRes.data?.bootcampStatus || 'not_enrolled');
      if (courseRes?.data) {
        const nextCourse = courseRes.data as Course;
        setCourse(nextCourse);
        if (Array.isArray(nextCourse.modules) && nextCourse.modules.length > 0) {
          setExpandedModule((prev) => (prev === null ? Number(nextCourse.modules[0].moduleId) : prev));
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [bootcampId]);

  const enroll = async () => {
    setEnrolling(true);
    try {
      const res = await api.post('/student/bootcamp', { bootcampId: bootcampId || '' });
      setBootcampStatus(res.data?.bootcampStatus || 'enrolled');
      await refreshMe();
      addToast('Enrolled in bootcamp.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Enrollment failed.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const completeRoom = async (moduleId: number, roomId: number) => {
    const key = `${moduleId}-${roomId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/rooms/${roomId}/complete`, {});
      addToast('Room marked as complete.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete room.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const completeCtf = async (moduleId: number) => {
    const key = `ctf-${moduleId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/ctf/complete`, {});
      addToast('CTF marked as complete.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete CTF.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const completeModule = async (moduleId: number) => {
    const key = `module-${moduleId}`;
    setCompleting(key);
    try {
      await api.post(`/student/modules/${moduleId}/complete`, {});
      addToast('Module completed.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not complete module.', 'error');
    } finally {
      setCompleting(null);
    }
  };

  const joinRoomSession = async (moduleId: number, room: Room) => {
    const meetingLink = String(room.liveClass?.link || room.meetingLink || '').trim();
    if (!meetingLink) { addToast('No meeting link configured for this room yet.', 'error'); return; }
    const key = `${moduleId}-${room.roomId}`;
    setJoiningSessionKey(key);
    try {
      await api.post(`/student/modules/${moduleId}/rooms/${room.roomId}/session-open`, { meetingLink });
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not open session link.', 'error');
    } finally {
      setJoiningSessionKey(null);
    }
  };

  const openRoomQuiz = async (moduleId: number, roomId: number) => {
    const key = `${moduleId}-${roomId}`;
    setQuizLoadingKey(key);
    try {
      const res = await api.post('/student/quiz', {
        type: 'room', id: String(roomId), moduleId: String(moduleId),
        courseId: String(course?.id || bootcampId || ''),
      });
      const quiz = (res?.data || {}) as RoomQuiz;
      if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        addToast('Quiz is not available for this room yet.', 'error');
        return;
      }
      setActiveQuiz({
        scope: quiz.scope || { type: 'room', id: String(roomId), moduleId: String(moduleId), courseId: String(course?.id || bootcampId || '') },
        questions: quiz.questions,
      });
      setQuizAnswers({});
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Quiz is not available yet.', 'error');
    } finally {
      setQuizLoadingKey(null);
    }
  };

  const submitActiveQuiz = async () => {
    if (!activeQuiz?.scope) return;
    const total = activeQuiz.questions.length;
    if (Object.keys(quizAnswers).length < total) {
      addToast('Please answer all questions before submitting.', 'error');
      return;
    }
    setSubmittingQuiz(true);
    try {
      const res = await api.post('/student/quiz', { scope: activeQuiz.scope, answers: quizAnswers });
      const score = Number(res?.data?.score || 0);
      const passed = Boolean(res?.data?.passed);
      addToast(passed ? `Quiz passed (${score}%).` : `Quiz submitted (${score}%).`, passed ? 'success' : 'info');
      setActiveQuiz(null);
      setQuizAnswers({});
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const progressValue = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const moduleProgressMap = new Map<number, any>(
    (overview?.modules || []).map((m: any) => [Number(m.id), m])
  );

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <div className="mb-6 h-4 w-36 rounded bg-bg-card border border-border animate-pulse" />
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl animate-pulse mb-4">
            <div className="h-3 w-28 rounded bg-accent/20 mb-4" />
            <div className="h-8 w-64 rounded bg-bg mb-4" />
            <div className="h-2 w-full rounded bg-accent-dim" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-bg-card border border-border animate-pulse mb-3" />
          ))}
        </div>
      </div>
    );
  }

  // ── Not enrolled ──
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-6 opacity-60" />
            <h1 className="text-2xl font-black text-text-primary mb-3">Enroll to Access</h1>
            <p className="text-text-muted text-sm mb-8">Register for this bootcamp to unlock the curriculum.</p>
            <button onClick={enroll} disabled={enrolling} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
              {enrolling ? <><Loader2 className="w-4 h-4 animate-spin" /> Enrolling...</> : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Enrolled — show course ──
  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-20 md:pt-24">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <Link to="/bootcamps" className="hover:text-accent transition-colors flex items-center gap-1 font-bold uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Bootcamps
          </Link>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-text-primary font-bold uppercase tracking-widest truncate">{course?.title || 'Course'}</span>
        </div>

        {/* Progress header */}
        <ScrollReveal className="mb-8">
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// CURRICULUM</span>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-4">{course?.title || 'Bootcamp'}</h1>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-text-primary">Overall Progress</span>
              <span className="text-sm font-mono text-accent">{progressValue}</span>
            </div>
            <div className="h-2 w-full bg-accent-dim rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressValue }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Modules — full width stack */}
        <div className="space-y-4">
          {(course?.modules || []).map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const ctfDone = Boolean(prog?.ctfCompleted);
            const isExpanded = expandedModule === mod.moduleId;
            const isLocked = mod.locked;
            // All rooms must be done before module complete is allowed
            const allRoomsDone = roomsDone >= roomsTotal && roomsTotal > 0;

            return (
              <ScrollReveal key={mod.moduleId} delay={idx * 0.04}>
                <div className={`w-full bg-bg-card border rounded-xl overflow-hidden transition-all ${isLocked ? 'border-border opacity-60' : isExpanded ? 'border-accent/30' : 'border-border hover:border-accent/20'}`}>
                  {/* Module header */}
                  <button
                    onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.moduleId)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    disabled={isLocked}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none text-sm font-black font-mono ${
                      progress === 100 ? 'bg-accent text-bg' : isLocked ? 'bg-bg border border-border text-text-muted' : 'bg-accent-dim text-accent border border-accent/20'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-1">
                        <h3 className="text-sm font-bold text-text-primary">{mod.title}</h3>
                        {mod.roleTitle && <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{mod.roleTitle}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase">
                        <span>{roomsDone}/{roomsTotal} rooms</span>
                        {mod.ctf && <span className={ctfDone ? 'text-accent' : ''}>CTF {ctfDone ? '✓' : '○'}</span>}
                        {progress > 0 && <span className="text-accent">{progress}%</span>}
                      </div>
                    </div>
                    {/* Progress mini-bar */}
                    {!isLocked && progress > 0 && progress < 100 && (
                      <div className="hidden sm:block w-20 h-1.5 bg-accent-dim rounded-full overflow-hidden flex-none">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                    {isLocked
                      ? <Lock className="w-4 h-4 text-text-muted flex-none" />
                      : isExpanded
                        ? <ChevronDown className="w-4 h-4 text-text-muted flex-none" />
                        : <ChevronRight className="w-4 h-4 text-text-muted flex-none" />
                    }
                  </button>

                  {/* Expanded content */}
                  {isExpanded && !isLocked && (
                    <div className="border-t border-border">
                      {mod.description && (
                        <p className="px-5 py-3 text-xs text-text-muted border-b border-border/50">{mod.description}</p>
                      )}

                      {/* Rooms grid — responsive, fills container */}
                      <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {(mod.rooms || []).map((room, roomIdx) => {
                            const roomDone = Boolean(room.completed);
                            const key = `${mod.moduleId}-${room.roomId}`;
                            const isRoomLocked = room.locked;
                            const hasSessionLink = Boolean(String(room.liveClass?.link || room.meetingLink || '').trim());
                            const hasReading = Boolean(
                              String(room.readingContent || '').trim() ||
                              (Array.isArray(room.readingLinks) && room.readingLinks.length > 0)
                            );

                            return (
                              <div
                                key={room.roomId}
                                className={`rounded-xl border overflow-hidden bg-bg flex flex-col ${isRoomLocked ? 'border-border opacity-60' : roomDone ? 'border-accent/20' : 'border-border hover:border-accent/20'} transition-colors`}
                              >
                                <div className="relative">
                                  <img
                                    src={resolveRoomImage(room, roomIdx, mod)}
                                    alt={room.title || 'Room cover'}
                                    className="w-full h-28 object-cover"
                                  />
                                  {/* Completion overlay */}
                                  {roomDone && (
                                    <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                                      <div className="bg-accent text-bg rounded-full p-1.5">
                                        <CheckCircle2 className="w-5 h-5" />
                                      </div>
                                    </div>
                                  )}
                                  {isRoomLocked && (
                                    <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
                                      <Lock className="w-5 h-5 text-text-muted" />
                                    </div>
                                  )}
                                </div>

                                <div className="p-4 flex flex-col gap-3 flex-1">
                                  <div>
                                    <div className="text-xs font-bold text-text-primary mb-0.5">{room.title || `Room ${room.roomId}`}</div>
                                    {room.overview && <div className="text-[10px] text-text-muted line-clamp-2">{room.overview}</div>}
                                  </div>

                                  {isRoomLocked ? (
                                    <div className="mt-auto text-[10px] uppercase tracking-widest font-bold text-text-muted flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> Locked by admin
                                    </div>
                                  ) : (
                                    <>
                                      {hasReading && (
                                        <div className="space-y-2 border-t border-border/50 pt-2">
                                          {room.readingContent && (
                                            <p className="text-[11px] leading-relaxed text-text-secondary line-clamp-3">{room.readingContent}</p>
                                          )}
                                          {Array.isArray(room.readingLinks) && room.readingLinks.length > 0 && (
                                            <div className="flex flex-col gap-1">
                                              {room.readingLinks.slice(0, 3).map((item, i) => {
                                                const href = String(item.url || '').trim();
                                                return (
                                                  <a key={i} href={href || '#'} target="_blank" rel="noreferrer"
                                                    className={`text-[11px] font-medium inline-flex items-center gap-1 ${href ? 'text-accent hover:underline' : 'text-text-muted pointer-events-none'}`}>
                                                    <ExternalLink className="w-3 h-3 flex-none" />
                                                    {item.title || 'Reading resource'}
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <div className="mt-auto grid grid-cols-1 gap-2 pt-1">
                                        {hasSessionLink && (
                                          <button
                                            onClick={() => joinRoomSession(mod.moduleId, room)}
                                            disabled={joiningSessionKey === key}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-accent-dim border border-accent/20 hover:bg-accent/20 rounded text-[10px] font-bold text-accent uppercase transition-all disabled:opacity-50"
                                          >
                                            {joiningSessionKey === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                                            Join Session
                                          </button>
                                        )}
                                        <button
                                          onClick={() => openRoomQuiz(mod.moduleId, room.roomId)}
                                          disabled={quizLoadingKey === key}
                                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-accent-dim border border-accent/20 hover:bg-accent/20 rounded text-[10px] font-bold text-accent uppercase transition-all disabled:opacity-50"
                                        >
                                          {quizLoadingKey === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                                          Take Quiz
                                        </button>
                                        {roomDone ? (
                                          <div className="flex items-center justify-center gap-1.5 px-3 py-2 bg-accent/10 border border-accent/20 rounded text-[10px] font-bold text-accent uppercase">
                                            <CheckCircle2 className="w-3 h-3" /> Completed
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => completeRoom(mod.moduleId, room.roomId)}
                                            disabled={completing === key}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 btn-primary !py-2 text-[10px] disabled:opacity-50"
                                          >
                                            {completing === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                            Mark Complete
                                          </button>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* CTF */}
                      {mod.ctf && (
                        <div className="mx-5 mb-4 p-4 rounded-xl border border-border bg-bg flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                              <Flag className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-text-primary">CTF Challenge</div>
                              <div className="text-[10px] text-text-muted">{mod.ctf}</div>
                            </div>
                          </div>
                          {!ctfDone ? (
                            <button
                              onClick={() => completeCtf(mod.moduleId)}
                              disabled={completing === `ctf-${mod.moduleId}`}
                              className="flex items-center gap-1.5 px-4 py-2 btn-secondary !py-2 text-xs disabled:opacity-50 flex-none"
                            >
                              {completing === `ctf-${mod.moduleId}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
                              Complete CTF
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-accent flex items-center gap-1 flex-none"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>
                          )}
                        </div>
                      )}

                      {/* Complete module — only enabled when all rooms done */}
                      {progress < 100 && (
                        <div className="px-5 pb-5">
                          {!allRoomsDone && (
                            <div className="flex items-center gap-2 text-[10px] text-text-muted mb-2 px-1">
                              <AlertCircle className="w-3.5 h-3.5 flex-none" />
                              Complete all rooms before marking this module done.
                            </div>
                          )}
                          <button
                            onClick={() => completeModule(mod.moduleId)}
                            disabled={completing === `module-${mod.moduleId}` || !allRoomsDone}
                            className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-40"
                          >
                            {completing === `module-${mod.moduleId}` ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Completing...</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Mark Module Complete</>}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Quiz modal */}
        {activeQuiz && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 overflow-y-auto flex items-start justify-center">
            <div className="w-full max-w-2xl mt-8 mb-8 bg-bg-card border border-border rounded-xl overflow-hidden">
              {/* Modal header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-text-primary">Room Quiz</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">
                    {Object.keys(quizAnswers).length} / {activeQuiz.questions.length} answered
                  </p>
                </div>
                <button
                  onClick={() => { if (!submittingQuiz) { setActiveQuiz(null); setQuizAnswers({}); } }}
                  className="text-xs font-bold text-text-muted hover:text-text-primary uppercase tracking-widest px-3 py-1.5 border border-border rounded hover:border-accent/30 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-accent-dim">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(Object.keys(quizAnswers).length / activeQuiz.questions.length) * 100}%` }}
                />
              </div>

              {/* Questions */}
              <div className="p-5 space-y-5">
                {activeQuiz.questions.map((question, index) => (
                  <div key={question.id || index} className="p-4 border border-border rounded-xl bg-bg">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
                      Question {index + 1} of {activeQuiz.questions.length}
                    </div>
                    <div className="text-sm font-bold text-text-primary mb-3">{question.text}</div>
                    <div className="space-y-2">
                      {(question.options || []).map((option, optIdx) => {
                        const selected = Number(quizAnswers[question.id]) === optIdx;
                        return (
                          <button
                            key={`${question.id}-${optIdx}`}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [question.id]: optIdx }))}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                              selected
                                ? 'border-accent bg-accent-dim text-accent font-bold'
                                : 'border-border text-text-secondary hover:border-accent/30 hover:bg-accent-dim/30'
                            }`}
                          >
                            <span className="font-mono text-[10px] mr-2 opacity-60">{String.fromCharCode(65 + optIdx)}.</span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="px-5 pb-5 flex justify-end">
                <button
                  onClick={submitActiveQuiz}
                  disabled={submittingQuiz || Object.keys(quizAnswers).length < activeQuiz.questions.length}
                  className="btn-primary !py-2.5 text-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submittingQuiz ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</> : 'Submit Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BootcampCourse;
