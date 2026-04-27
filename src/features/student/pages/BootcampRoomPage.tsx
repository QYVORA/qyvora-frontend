import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Video, Lock, Loader2, CheckCircle2, BookOpen,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';

interface Room {
  roomId: number; title: string; overview: string; locked: boolean;
  completed?: boolean; meetingLink?: string;
}
interface Module {
  moduleId: number; title: string; description: string; locked: boolean; rooms: Room[];
}
interface Course { id: string; title: string; modules: Module[]; }
interface QuizQuestion { id: string; text: string; options: string[]; }
interface RoomQuiz {
  scope?: { type?: string; id?: string | number; moduleId?: string | number; courseId?: string };
  questions: QuizQuestion[];
}

const BootcampRoomPage: React.FC = () => {
  const { bootcampId, moduleId, roomId } = useParams<{
    bootcampId?: string; moduleId?: string; roomId?: string;
  }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootcampStatus, setBootcampStatus] = useState('not_enrolled');

  const [quizLoading, setQuizLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<RoomQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizError, setQuizError] = useState<string>('');
  const [quizLoadedForRoom, setQuizLoadedForRoom] = useState<string>('');
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [joiningSession, setJoiningSession] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const query = bootcampId ? `?bootcampId=${encodeURIComponent(bootcampId)}` : '';
        const [ovRes, courseRes] = await Promise.all([
          api.get('/student/overview'),
          api.get(`/student/course${query}`).catch(() => null),
        ]);
        const ov = ovRes.data;
        const enrolledViaStatus =
          ov?.bootcampStatus && ov.bootcampStatus !== 'not_enrolled' &&
          String(ov?.bootcampId || '') === String(bootcampId || '');
        const enrolledViaModules = (Array.isArray(ov?.modules) ? ov.modules : []).some(
          (m: any) => String(m.bootcampId || m.id || '') === String(bootcampId || '')
        );
        setBootcampStatus(enrolledViaStatus || enrolledViaModules ? 'enrolled' : 'not_enrolled');
        if (courseRes?.data) setCourse(courseRes.data as Course);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, [bootcampId]);

  useEffect(() => {
    if (!loading && bootcampStatus === 'not_enrolled') navigate('/bootcamps', { replace: true });
  }, [loading, bootcampStatus, navigate]);

  const mod = course?.modules.find(m => String(m.moduleId) === String(moduleId));
  const room = mod?.rooms.find(r => String(r.roomId) === String(roomId));
  const roomScopeKey = `${String(bootcampId || '')}:${String(moduleId || '')}:${String(roomId || '')}`;

  useEffect(() => {
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizError('');
  }, [roomScopeKey]);

  const openRoom = async () => {
    if (hasOpened) return;
    setJoiningSession(true);
    try {
      const res = await api.post(`/student/modules/${moduleId}/rooms/${roomId}/session-open`, {});
      if (res.data?.reward) {
        addToast(`Room opened! You earned ${res.data.reward.points} CP.`, 'success');
      }
      setHasOpened(true);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not open room.', 'error');
    } finally {
      setJoiningSession(false);
    }
  };

  const openQuiz = async () => {
    setQuizError('');
    setQuizLoading(true);
    try {
      const res = await api.post('/student/quiz', {
        type: 'room',
        id: String(roomId),
        moduleId: String(moduleId),
        courseId: String(course?.id || bootcampId || ''),
      });
      const quiz = (res?.data || {}) as RoomQuiz;
      if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        setActiveQuiz(null);
        setQuizError('Quiz is not available for this room yet.');
        return;
      }
      setActiveQuiz({
        scope: quiz.scope || { type: 'room', id: String(roomId), moduleId: String(moduleId), courseId: String(course?.id || bootcampId || '') },
        questions: quiz.questions,
      });
      setQuizAnswers({});
    } catch (err: any) {
      setActiveQuiz(null);
      const status = Number(err?.response?.status || 0);
      const backendMessage = String(err?.response?.data?.error || '');
      if (status === 403) {
        setQuizError(backendMessage || 'Quiz access is currently restricted for this room.');
      } else {
        setQuizError(backendMessage || 'Quiz is not available yet.');
      }
    } finally { setQuizLoading(false); }
  };

  useEffect(() => {
    if (loading || !course || !mod || !room || room.locked) return;
    if (quizLoadedForRoom === roomScopeKey) return;
    setQuizLoadedForRoom(roomScopeKey);
    void openQuiz();
  }, [loading, course, mod, room, roomScopeKey, quizLoadedForRoom]);

  const submitQuiz = async () => {
    if (!activeQuiz?.scope) return;
    if (Object.keys(quizAnswers).length < activeQuiz.questions.length) {
      addToast('Please answer all questions before submitting.', 'error');
      return;
    }
    setSubmittingQuiz(true);
    try {
      const res = await api.post('/student/quiz', { scope: activeQuiz.scope, answers: quizAnswers });
      const score = Number(res?.data?.score || 0);
      const passed = Boolean(res?.data?.passed);
      addToast(passed ? `Quiz passed (${score}%).` : `Quiz submitted (${score}%).`, passed ? 'success' : 'info');
      setQuizAnswers({});
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally { setSubmittingQuiz(false); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24 space-y-4">
          <div className="h-4 w-40 rounded-lg bg-bg-card border border-border animate-pulse" />
          <div className="h-10 w-3/4 rounded-lg bg-bg-card border border-border animate-pulse" />
          <div className="h-4 w-full rounded-lg bg-bg-card border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (!mod || !room) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <Link to={`/bootcamps/${bootcampId}`} className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <h1 className="text-lg font-black text-text-primary mb-2">Room Not Found</h1>
            <p className="text-text-muted text-sm">This room doesn't exist or hasn't been loaded yet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (room.locked) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24">
          <Link to={`/bootcamps/${bootcampId}`} className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <Lock className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <h1 className="text-lg font-black text-text-primary mb-2">{room.title}</h1>
            <p className="text-text-muted text-sm">This room is locked. Complete previous rooms to unlock it.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Room page ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-2xl mx-auto px-4 md:px-8 pt-20 md:pt-24">

        {/* Back */}
        <Link to={`/bootcamps/${bootcampId}`} className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamp
        </Link>

        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-8">
            <Link to="/bootcamps" className="hover:text-accent transition-colors">Bootcamps</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors truncate max-w-[120px]">{course?.title || 'Bootcamp'}</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors truncate max-w-[120px]">{mod.title}</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-text-primary truncate max-w-[160px]">{room.title}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={0.05}>
          <header className="mb-10">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">// {mod.title}</span>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary leading-tight mb-4">{room.title}</h1>
            {room.overview && (
              <p className="text-base text-text-secondary leading-relaxed border-l-2 border-accent pl-4">{room.overview}</p>
            )}
            {room.completed && (
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> Completed
              </div>
            )}
          </header>
        </ScrollReveal>

        {/* Session — WhatsApp group for link (MVP) */}
        <ScrollReveal delay={0.08}>
          <div className="mb-8 p-5 bg-bg-card border border-border rounded-xl">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Live Session</p>
            <div className="flex items-start gap-3 p-4 rounded-lg mb-4"
              style={{ background: 'var(--color-accent-dim)', border: '1px solid rgba(183,255,153,0.2)' }}>
              <span className="text-accent text-lg flex-none">📱</span>
              <div>
                <p className="text-sm font-bold text-text-primary mb-1">Check the WhatsApp Group</p>
                <p className="text-xs text-text-muted">The session link for this room is shared in the Hacker Protocol WhatsApp group before each class.</p>
              </div>
            </div>
            <button
              onClick={openRoom}
              disabled={joiningSession || hasOpened || Boolean(room.completed)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-bg font-bold rounded-xl transition-all text-sm disabled:opacity-60 hover:brightness-110 active:scale-95"
            >
              {joiningSession
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening...</>
                : (hasOpened || room.completed)
                  ? <><CheckCircle2 className="w-4 h-4" /> Room Opened</>
                  : <><Video className="w-4 h-4" /> Mark Room as Opened</>
              }
            </button>
            {(hasOpened || room.completed) && (
              <p className="text-xs text-accent mt-2 font-bold">✓ CP reward granted</p>
            )}
          </div>
        </ScrollReveal>

        {/* Quiz */}
        <ScrollReveal delay={0.1}>
          <div className="mb-8 p-5 bg-bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">Room Quiz</h2>
              {activeQuiz && (
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  {Object.keys(quizAnswers).length} / {activeQuiz.questions.length} answered
                </p>
              )}
            </div>

            {quizLoading && (
              <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                Loading quiz questions...
              </div>
            )}

    {!quizLoading && quizError && (
              <div className="text-sm text-text-secondary rounded-lg border border-border bg-bg px-4 py-3">
                {/* 403 just means no quiz released yet — show neutral message */}
                No quiz available for this room yet. Check back after your session.
              </div>
            )}

            {!quizLoading && activeQuiz && (
              <>
                <div className="h-1 bg-accent-dim rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${(Object.keys(quizAnswers).length / activeQuiz.questions.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-5">
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
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [question.id]: optIdx }))}
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

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={submitQuiz}
                    disabled={submittingQuiz || Object.keys(quizAnswers).length < activeQuiz.questions.length}
                    className="btn-primary !py-2.5 text-sm disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {submittingQuiz
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                      : 'Submit Quiz'
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default BootcampRoomPage;
