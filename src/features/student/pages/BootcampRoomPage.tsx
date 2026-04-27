import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Video, FileText, Lock, Loader2, CheckCircle2, BookOpen,
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
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [joiningSession, setJoiningSession] = useState(false);

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
  const meetingLink = String(room?.meetingLink || '').trim();

  const trackSessionOpen = async () => {
    if (!meetingLink) return;
    setJoiningSession(true);
    try {
      await api.post(`/student/modules/${moduleId}/rooms/${roomId}/session-open`, { meetingLink });
    } catch { /* non-blocking */ }
    finally { setJoiningSession(false); }
  };

  const openQuiz = async () => {
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
    } finally { setQuizLoading(false); }
  };

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
      setActiveQuiz(null);
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

        {/* Live session */}
        {meetingLink && (
          <ScrollReveal delay={0.08}>
            <div className="mb-8 p-5 bg-bg-card border border-border rounded-xl">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Live Session</p>
              <a
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void trackSessionOpen()}
                className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-xl transition-colors text-sm"
              >
                {joiningSession
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Joining...</>
                  : <><Video className="w-5 h-5" /> Join Google Meet Session</>
                }
              </a>
            </div>
          </ScrollReveal>
        )}

        {/* Quiz */}
        <ScrollReveal delay={0.1}>
          <div className="mb-8">
            <button
              onClick={openQuiz}
              disabled={quizLoading}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-dim border border-accent/30 hover:bg-accent/20 text-accent font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
            >
              {quizLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading Quiz...</>
                : <><FileText className="w-4 h-4" /> Take Quiz</>
              }
            </button>
          </div>
        </ScrollReveal>

      </div>

      {/* Quiz modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 overflow-y-auto flex items-start justify-center">
          <div className="w-full max-w-2xl mt-8 mb-8 bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-text-primary">Room Quiz</h3>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">
                  {Object.keys(quizAnswers).length} / {activeQuiz.questions.length} answered
                </p>
              </div>
              <button
                onClick={() => { if (!submittingQuiz) { setActiveQuiz(null); setQuizAnswers({}); } }}
                className="text-xs font-bold text-text-muted hover:text-text-primary uppercase tracking-widest px-3 py-1.5 border border-border rounded-lg hover:border-accent/30 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="h-1 bg-accent-dim">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(Object.keys(quizAnswers).length / activeQuiz.questions.length) * 100}%` }}
              />
            </div>

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

            <div className="px-5 pb-5 flex justify-end">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default BootcampRoomPage;
