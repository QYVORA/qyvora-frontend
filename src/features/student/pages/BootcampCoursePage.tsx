import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen, Lock, CheckCircle2, ChevronDown, ChevronRight,
  Loader2, Flag, ArrowLeft, CreditCard, Smartphone, Zap, ExternalLink, Video, FileText
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import { useAuth } from '../../../core/contexts/AuthContext';

interface ReadingLink { title: string; url: string; }
interface LiveClass { title: string; instructor?: string; time?: string; link: string; }
interface Room {
  roomId: number;
  title: string;
  overview: string;
  locked: boolean;
  image?: string;
  completed?: boolean;
  readingContent?: string;
  readingLinks?: ReadingLink[];
  meetingLink?: string;
  liveClass?: LiveClass;
}
interface Module {
  moduleId: number; title: string; description: string; codename: string;
  roleTitle: string; badge: string; ctf: string; locked: boolean;
  rooms: Room[]; progress?: number; roomsCompleted?: number; roomsTotal?: number; ctfCompleted?: boolean;
}
interface Course { id: string; title: string; modules: Module[]; }

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

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

const resolveRoomImage = (room: Room, idx: number) =>
  String(room.image || '').trim() || ROOM_CARD_IMAGES[idx % ROOM_CARD_IMAGES.length];

const BootcampCourse: React.FC = () => {
  const { bootcampId } = useParams<{ bootcampId?: string }>();
  const { user, refreshMe } = useAuth();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'btc'>('momo');
  const [btcHash, setBtcHash] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
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
      setPaymentStatus(ovRes.data?.bootcampPaymentStatus || 'unpaid');
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
      setPaymentStatus(res.data?.bootcampPaymentStatus || 'unpaid');
      await refreshMe();
      addToast('Enrolled in bootcamp.', 'success');
      await load();
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Enrollment failed.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const initPayment = async () => {
    if (paymentMethod === 'btc') {
      if (!btcHash.trim()) { addToast('Enter your BTC transaction hash.', 'error'); return; }
      setPaymentLoading(true);
      try {
        await api.post('/student/bootcamp/payments/btc', { txHash: btcHash.trim() });
        setPaymentStatus('pending');
        addToast('BTC payment submitted. Awaiting admin approval.', 'success');
        setShowPayment(false);
      } catch (err: any) {
        addToast(err?.response?.data?.error || 'BTC submission failed.', 'error');
      } finally {
        setPaymentLoading(false);
      }
      return;
    }
    setPaymentLoading(true);
    try {
      const res = await api.post('/student/bootcamp/payments/initialize', { method: paymentMethod });
      if (res.data?.authorizationUrl) {
        window.location.href = res.data.authorizationUrl;
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Payment initialization failed.', 'error');
      setPaymentLoading(false);
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
    if (!meetingLink) {
      addToast('No meeting link has been configured for this room yet.', 'error');
      return;
    }
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
        type: 'room',
        id: String(roomId),
        moduleId: String(moduleId),
        courseId: String(course?.id || bootcampId || ''),
      });
      const quiz = (res?.data || {}) as RoomQuiz;
      if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        addToast('Quiz is not available for this room yet.', 'error');
        return;
      }
      setActiveQuiz({
        scope: quiz.scope || {
          type: 'room',
          id: String(roomId),
          moduleId: String(moduleId),
          courseId: String(course?.id || bootcampId || ''),
        },
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
      const res = await api.post('/student/quiz', {
        scope: activeQuiz.scope,
        answers: quizAnswers,
      });
      const score = Number(res?.data?.score || 0);
      const passed = Boolean(res?.data?.passed);
      addToast(
        passed
          ? `Quiz passed (${score}%).`
          : `Quiz submitted (${score}%).`,
        passed ? 'success' : 'info'
      );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
          <div className="mb-8 h-4 w-36 rounded bg-bg-card border border-border animate-pulse" />
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl animate-pulse">
            <div className="h-3 w-28 rounded bg-accent/20 mb-4" />
            <div className="h-8 w-64 rounded bg-bg mb-4" />
            <div className="h-2 w-full rounded bg-accent-dim" />
          </div>
          <div className="mt-4 space-y-4">
            <div className="h-24 rounded-xl bg-bg-card border border-border animate-pulse" />
            <div className="h-24 rounded-xl bg-bg-card border border-border animate-pulse" />
            <div className="h-24 rounded-xl bg-bg-card border border-border animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not enrolled
  if (bootcampStatus === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-8">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <BookOpen className="w-12 h-12 text-accent mx-auto mb-6 opacity-60" />
            <h1 className="text-2xl font-black text-text-primary mb-3">Enroll to Access</h1>
            <p className="text-text-muted text-sm mb-8">Register for this bootcamp to unlock the curriculum.</p>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              {enrolling ? <><Loader2 className="w-4 h-4 animate-spin" /> Enrolling...</> : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enrolled but unpaid
  if (paymentStatus !== 'paid') {
    return (
      <div className="min-h-screen bg-bg pb-8">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-8">
          <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl">
            <h1 className="text-2xl font-black text-text-primary mb-2">Complete Payment</h1>
            <p className="text-text-muted text-sm mb-2">
              {paymentStatus === 'pending'
                ? 'Your payment is pending verification. If you paid via BTC, an admin will approve it shortly.'
                : 'Payment is required to access the full bootcamp curriculum.'}
            </p>

            {paymentStatus === 'pending' ? (
              <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-sm text-yellow-400 font-bold">
                ⏳ Payment pending — awaiting confirmation.
              </div>
            ) : (
              <>
                {!showPayment ? (
                  <button onClick={() => setShowPayment(true)} className="btn-primary mt-6 inline-flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Pay Now
                  </button>
                ) : (
                  <div className="mt-6 space-y-5">
                    <div className="flex gap-3">
                      {(['momo', 'card', 'btc'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`flex-1 py-2.5 rounded-lg border text-xs font-bold uppercase transition-all ${
                            paymentMethod === m
                              ? 'bg-accent text-bg border-accent'
                              : 'bg-bg border-border text-text-muted hover:border-accent/40'
                          }`}
                        >
                          {m === 'momo' ? <><Smartphone className="w-3 h-3 inline mr-1" />MoMo</> : m === 'card' ? <><CreditCard className="w-3 h-3 inline mr-1" />Card</> : '₿ BTC'}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'btc' && (
                      <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5">BTC Transaction Hash</label>
                        <input
                          type="text"
                          value={btcHash}
                          onChange={(e) => setBtcHash(e.target.value)}
                          placeholder="Paste your BTC txid here"
                          className="w-full bg-bg border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none font-mono"
                        />
                        <p className="text-[10px] text-text-muted mt-1">Send payment to the BTC address provided by admin, then paste the transaction hash above.</p>
                      </div>
                    )}

                    <button
                      onClick={initPayment}
                      disabled={paymentLoading}
                      className="w-full btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {paymentLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Zap className="w-4 h-4" /> Proceed to Payment</>}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Paid — show course
  return (
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8">
        <Link to="/bootcamps" className="flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamps
        </Link>

        <ScrollReveal className="mb-8">
          <div className="p-6 md:p-8 bg-bg-card border border-border rounded-2xl">
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-2 block">// CURRICULUM</span>
            <h1 className="text-3xl font-black text-text-primary mb-4">{course?.title || 'Bootcamp'}</h1>
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

        {/* Modules */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,360px))] justify-start items-start gap-4">
          {(course?.modules || []).map((mod, idx) => {
            const prog = moduleProgressMap.get(Number(mod.moduleId));
            const progress = Number(prog?.progress || 0);
            const roomsDone = Number(prog?.roomsCompleted || 0);
            const roomsTotal = Number(prog?.roomsTotal || mod.rooms?.length || 0);
            const ctfDone = Boolean(prog?.ctfCompleted);
            const isExpanded = expandedModule === mod.moduleId;
            const isLocked = mod.locked;

            return (
              <ScrollReveal key={mod.moduleId} delay={idx * 0.05}>
                <div className={`w-full max-w-[360px] bg-bg-card border rounded-xl overflow-hidden transition-all ${isLocked ? 'border-border opacity-60' : 'border-border hover:border-accent/30'}`}>
                  <button
                    onClick={() => !isLocked && setExpandedModule(isExpanded ? null : mod.moduleId)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                    disabled={isLocked}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none text-sm font-black font-mono ${
                      progress === 100 ? 'bg-accent text-bg' : isLocked ? 'bg-bg border border-border text-text-muted' : 'bg-accent-dim text-accent border border-accent/20'
                    }`}>
                      {progress === 100 ? <CheckCircle2 className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-text-primary truncate">{mod.title}</h3>
                        {mod.roleTitle && <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest hidden md:block">{mod.roleTitle}</span>}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase">
                        <span>{roomsDone}/{roomsTotal} rooms</span>
                        {mod.ctf && <span className={ctfDone ? 'text-accent' : ''}>CTF {ctfDone ? '✓' : '○'}</span>}
                        {progress > 0 && <span className="text-accent">{progress}%</span>}
                      </div>
                    </div>
                    {isLocked
                      ? <Lock className="w-4 h-4 text-text-muted flex-none" />
                      : isExpanded
                        ? <ChevronDown className="w-4 h-4 text-text-muted flex-none" />
                        : <ChevronRight className="w-4 h-4 text-text-muted flex-none" />
                    }
                  </button>

                  {isExpanded && !isLocked && (
                    <div className="border-t border-border">
                      {mod.description && (
                        <p className="px-5 py-3 text-xs text-text-muted border-b border-border/50">{mod.description}</p>
                      )}

                      {/* Rooms */}
                      <div className="p-5">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,320px))] justify-start gap-4">
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
                                className={`w-full max-w-[320px] rounded-xl border overflow-hidden bg-bg/50 flex flex-col ${isRoomLocked ? 'border-border opacity-60' : 'border-border hover:border-accent/30'}`}
                              >
                                <img
                                  src={resolveRoomImage(room, roomIdx)}
                                  alt={room.title || 'Room cover'}
                                  className={`w-full h-32 object-cover ${isRoomLocked ? 'grayscale' : ''}`}
                                />
                                <div className="p-4 flex flex-col gap-3 h-full">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-text-primary truncate">{room.title || `Room ${room.roomId}`}</div>
                                      {room.overview && <div className="text-[10px] text-text-muted line-clamp-2 mt-1">{room.overview}</div>}
                                    </div>
                                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-none ${isRoomLocked ? 'bg-bg border border-border' : roomDone ? 'bg-accent border border-accent' : 'bg-accent-dim border border-accent/20'}`}>
                                      {roomDone ? <CheckCircle2 className="w-3 h-3 text-bg" /> : isRoomLocked ? <Lock className="w-3 h-3 text-text-muted" /> : <BookOpen className="w-3 h-3 text-accent" />}
                                    </div>
                                  </div>

                                  {isRoomLocked ? (
                                    <div className="mt-auto text-[10px] uppercase tracking-widest font-bold text-text-muted">Locked by admin</div>
                                  ) : (
                                    <>
                                      {hasReading && (
                                        <div className="space-y-2">
                                          {room.readingContent && (
                                            <p className="text-[11px] leading-relaxed text-text-secondary line-clamp-4">{room.readingContent}</p>
                                          )}
                                          {Array.isArray(room.readingLinks) && room.readingLinks.length > 0 && (
                                            <div className="flex flex-col gap-1">
                                              {room.readingLinks.slice(0, 3).map((item, idx) => {
                                                const href = String(item.url || '').trim();
                                                return (
                                                  <a
                                                    key={`${room.roomId}-${idx}`}
                                                    href={href || '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`text-[11px] font-medium inline-flex items-center gap-1 ${href ? 'text-accent hover:underline' : 'text-text-muted pointer-events-none'}`}
                                                  >
                                                    <ExternalLink className="w-3 h-3" />
                                                    {item.title || 'Reading resource'}
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      <div className="mt-auto grid grid-cols-1 gap-2">
                                        {hasSessionLink && (
                                          <button
                                            onClick={() => joinRoomSession(mod.moduleId, room)}
                                            disabled={joiningSessionKey === key}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded text-[10px] font-bold text-blue-300 uppercase transition-all disabled:opacity-50"
                                          >
                                            {joiningSessionKey === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                                            Join Session
                                          </button>
                                        )}
                                        <button
                                          onClick={() => openRoomQuiz(mod.moduleId, room.roomId)}
                                          disabled={quizLoadingKey === key}
                                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[10px] font-bold text-yellow-500 uppercase transition-all disabled:opacity-50"
                                        >
                                          {quizLoadingKey === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                                          Quiz
                                        </button>
                                        <button
                                          onClick={() => completeRoom(mod.moduleId, room.roomId)}
                                          disabled={completing === key || roomDone}
                                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-accent-dim border border-accent/20 hover:bg-accent/20 rounded text-[10px] font-bold text-accent uppercase transition-all disabled:opacity-50"
                                        >
                                          {completing === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                          {roomDone ? 'Done' : 'Complete'}
                                        </button>
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
                        <div className="px-5 py-3 flex items-center justify-between border-b border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-none">
                              <Flag className="w-3 h-3 text-yellow-500" />
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
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[10px] font-bold text-yellow-500 uppercase transition-all disabled:opacity-50 flex-none"
                            >
                              {completing === `ctf-${mod.moduleId}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
                              Complete CTF
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-accent flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
                          )}
                        </div>
                      )}

                      {/* Complete module button */}
                      {progress < 100 && (
                        <div className="px-5 py-4">
                          <button
                            onClick={() => completeModule(mod.moduleId)}
                            disabled={completing === `module-${mod.moduleId}`}
                            className="w-full btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
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

        {activeQuiz && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto mt-8 bg-bg-card border border-border rounded-xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-text-primary">Room Quiz</h3>
                <button
                  onClick={() => {
                    if (submittingQuiz) return;
                    setActiveQuiz(null);
                    setQuizAnswers({});
                  }}
                  className="text-xs font-bold text-text-muted hover:text-text-primary uppercase"
                >
                  Close
                </button>
              </div>
              <div className="space-y-4">
                {activeQuiz.questions.map((question, index) => (
                  <div key={question.id || index} className="p-3 border border-border rounded-lg">
                    <div className="text-sm font-bold text-text-primary mb-2">{index + 1}. {question.text}</div>
                    <div className="space-y-2">
                      {(question.options || []).map((option, optIdx) => (
                        <label key={`${question.id}-${optIdx}`} className="flex items-start gap-2 text-xs text-text-secondary">
                          <input
                            type="radio"
                            name={question.id}
                            checked={Number(quizAnswers[question.id]) === optIdx}
                            onChange={() => setQuizAnswers((prev) => ({ ...prev, [question.id]: optIdx }))}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={submitActiveQuiz}
                  disabled={submittingQuiz}
                  className="btn-primary !py-2.5 text-xs disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submittingQuiz ? <><Loader2 className="w-3 h-3 animate-spin" /> Submitting...</> : 'Submit Quiz'}
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
