import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Lock, Loader2, CheckCircle2, BookOpen,
  ChevronDown, ImageOff,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { useToast } from '../../../core/contexts/ToastContext';
import {
  ROOM_WALKTHROUGHS,
  buildWalkthroughImagePath,
} from '../constants/walkthroughContent';

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

// ── Step image with fallback ──────────────────────────────────────────────────
const StepImage: React.FC<{ src: string; alt: string; stepNum: number }> = ({ src, alt, stepNum }) => {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-bg py-10 text-text-muted">
      <ImageOff className="h-7 w-7 opacity-30" />
      <span className="text-[11px] font-bold uppercase tracking-widest opacity-40">
        Step {stepNum} image coming soon
      </span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="w-full rounded-xl border border-border object-contain bg-bg"
      loading="lazy"
    />
  );
};

// ── Walkthrough text renderer ─────────────────────────────────────────────────
const WalkthroughText: React.FC<{ text: string }> = ({ text }) => (
  <div className="space-y-2.5">
    {text.split('\n').map((line, i) => {
      const t = line.trim();
      if (!t) return null;
      if (t.startsWith('•')) {
        return (
          <div key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{t.slice(1).trim()}</span>
          </div>
        );
      }
      if (t.startsWith('"') && t.endsWith('"')) {
        return (
          <p key={i} className="border-l-2 border-accent pl-4 text-sm italic text-accent leading-relaxed">{t}</p>
        );
      }
      return <p key={i} className="text-sm text-text-secondary leading-relaxed">{t}</p>;
    })}
  </div>
);

// ── Walkthrough section (collapsible) ─────────────────────────────────────────
const WalkthroughSection: React.FC<{ moduleId: string; roomId: string }> = ({ moduleId, roomId }) => {
  const key = `${moduleId}:${roomId}`;
  const content = ROOM_WALKTHROUGHS[key];
  const [open, setOpen] = useState(false);

  if (!content) return null;

  const hasSteps = content.steps.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-accent-dim/20 transition-colors"
      >
        <BookOpen className="h-4 w-4 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-black text-text-primary uppercase tracking-widest">
            Walkthrough Guide
          </span>
          {!open && (
            <span className="ml-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {hasSteps ? `${content.steps.length} steps` : 'Overview only'}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-text-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-border px-6 pb-6 pt-5 space-y-6">
          {/* Overview text */}
          <WalkthroughText text={content.walkthroughText} />

          {/* Steps */}
          {hasSteps && (
            <div className="space-y-8 pt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                Steps — {content.steps.length} total
              </p>
              {content.steps.map((step, idx) => {
                const stepNum = idx + 1;
                const imageSrc = buildWalkthroughImagePath(moduleId, roomId, step.image);
                return (
                  <div key={idx} className="relative pl-10 sm:pl-12">
                    {/* Step badge */}
                    <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent-dim text-accent font-black font-mono text-xs">
                      {String(stepNum).padStart(2, '0')}
                    </div>
                    {/* Connector */}
                    {idx < content.steps.length - 1 && (
                      <div
                        className="absolute left-[15px] top-9 bottom-[-24px] w-px bg-border"
                        aria-hidden
                      />
                    )}
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-text-primary leading-relaxed pt-0.5">
                        {step.instruction}
                      </p>
                      <StepImage
                        src={imageSrc}
                        alt={`Step ${stepNum}: ${step.instruction}`}
                        stepNum={stepNum}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
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
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; reward?: number } | null>(null);
  const [quizError, setQuizError] = useState<string>('');
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizLoadedForModule, setQuizLoadedForModule] = useState<string>('');

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
  const moduleScopeKey = `${String(bootcampId || '')}:${String(moduleId || '')}`;

  useEffect(() => {
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);
    setQuizError('');
  }, [moduleScopeKey]);

  useEffect(() => {
    if (loading || !course || !mod || !room || room.locked) return;

    api.post(`/student/modules/${moduleId}/rooms/${roomId}/session-open`, {}).catch(() => {});

    if (quizLoadedForModule === moduleScopeKey) return;
    setQuizLoadedForModule(moduleScopeKey);
    setQuizLoading(true);
    setQuizError('');
    api.post('/student/quiz', {
      moduleId: String(moduleId),
      courseId: String(course?.id || bootcampId || ''),
    })
      .then(res => {
        const quiz = (res?.data || {}) as RoomQuiz;
        if (Array.isArray(quiz.questions) && quiz.questions.length > 0) {
          setActiveQuiz({
            scope: quiz.scope || {
              type: 'module',
              id: String(moduleId),
              moduleId: String(moduleId),
              courseId: String(course?.id || bootcampId || ''),
            },
            questions: quiz.questions,
          });
        } else {
          setQuizError('No questions found for this module.');
        }
      })
      .catch((err: any) => {
        if (err?.response?.status === 403) {
          setQuizError('');
        } else {
          setQuizError(String(err?.response?.data?.error || '') || 'Could not load quiz.');
        }
      })
      .finally(() => setQuizLoading(false));
  }, [loading, course, mod, room, moduleScopeKey, quizLoadedForModule]);

  const submitQuiz = async () => {
    if (!activeQuiz?.scope) return;
    if (Object.keys(quizAnswers).length < activeQuiz.questions.length) {
      addToast('Please answer all questions before submitting.', 'error');
      return;
    }
    setSubmittingQuiz(true);
    try {
      const res = await api.post('/student/quiz', {
        moduleId: String(moduleId),
        courseId: String(course?.id || bootcampId || ''),
        answers: quizAnswers,
      });
      const score = Number(res?.data?.score || 0);
      const passed = Boolean(res?.data?.passed);
      const reward = Number(res?.data?.reward?.points || 0);
      setQuizResult({ score, passed, reward });
      addToast(passed ? `Quiz passed! ${score}% — +${reward} CP` : `Quiz submitted. Score: ${score}%`, passed ? 'success' : 'info');
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 space-y-4">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">
          <Link to={`/bootcamps/${bootcampId}`} className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="p-10 bg-bg-card border border-border rounded-2xl text-center">
            <Lock className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <h1 className="text-lg font-black text-text-primary mb-2">{room.title}</h1>
            <p className="text-text-muted text-sm">This module is locked. Wait for your instructor to unlock it.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Room page ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24">

        {/* Back */}
        <Link
          to={`/bootcamps/${bootcampId}`}
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Bootcamp
        </Link>

        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-10">
            <Link to="/bootcamps" className="hover:text-accent transition-colors">Bootcamps</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors truncate max-w-[140px]">{course?.title || 'Bootcamp'}</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to={`/bootcamps/${bootcampId}`} className="hover:text-accent transition-colors truncate max-w-[140px]">{mod.title}</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-text-primary truncate max-w-[200px]">{room.title}</span>
          </nav>
        </ScrollReveal>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Room content ── */}
          <div className="space-y-6 min-w-0">

            {/* Header */}
            <ScrollReveal delay={0.04}>
              <header>
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">// {mod.title}</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-tight mb-5">{room.title}</h1>
                {room.overview && (
                  <p className="text-base md:text-lg text-text-secondary leading-relaxed border-l-2 border-accent pl-5">{room.overview}</p>
                )}
                {room.completed && (
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Completed · CP Earned
                  </div>
                )}
              </header>
            </ScrollReveal>

            {/* Session info */}
            <ScrollReveal delay={0.07}>
              <div className="p-6 bg-bg-card border border-border rounded-2xl space-y-3">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Live Session</p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Your instructor will share the session link in the bootcamp WhatsApp group. Attend the live session, then complete the module quiz to earn your CP reward.
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs text-accent font-bold">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Check WhatsApp group for session link
                </div>
              </div>
            </ScrollReveal>

            {/* ── Walkthrough Guide ── */}
            <ScrollReveal delay={0.09}>
              <WalkthroughSection
                moduleId={String(moduleId || '')}
                roomId={String(roomId || '')}
              />
            </ScrollReveal>

            {/* Other rooms in this module */}
            <ScrollReveal delay={0.11}>
              <div className="p-6 bg-bg-card border border-border rounded-2xl">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Other Rooms in {mod.title}</p>
                <div className="space-y-2">
                  {mod.rooms.map((r, idx) => {
                    const isCurrent = String(r.roomId) === String(roomId);
                    return (
                      <div
                        key={r.roomId}
                        onClick={() => !r.locked && !isCurrent && navigate(`/bootcamps/${bootcampId}/modules/${mod.moduleId}/rooms/${r.roomId}`)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'border-accent/40 bg-accent-dim/30 cursor-default'
                            : r.locked
                              ? 'border-border/50 opacity-50 cursor-not-allowed'
                              : 'border-border hover:border-accent/30 hover:bg-accent-dim/20 cursor-pointer'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-none text-xs font-black ${
                          r.completed ? 'bg-accent text-bg' : isCurrent ? 'bg-accent-dim border border-accent/30 text-accent' : 'bg-bg border border-border text-text-muted'
                        }`}>
                          {r.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : String(idx + 1)}
                        </div>
                        <span className={`text-sm font-bold truncate ${isCurrent ? 'text-accent' : 'text-text-primary'}`}>{r.title}</span>
                        {isCurrent && <span className="ml-auto text-[9px] font-bold text-accent uppercase tracking-widest flex-none">Current</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT: Quiz ── */}
          <div className="lg:sticky lg:top-24">
            <ScrollReveal delay={0.12}>
              <div className="p-6 bg-bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">Module Quiz</h2>
                  {activeQuiz && !quizResult && (
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">
                      {Object.keys(quizAnswers).length} / {activeQuiz.questions.length}
                    </p>
                  )}
                </div>

                {quizLoading && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    Loading quiz…
                  </div>
                )}

                {!quizLoading && !activeQuiz && !quizResult && (
                  <div className="text-sm text-text-muted py-4 text-center">
                    {quizError
                      ? <p className="text-red-400 text-xs">{quizError}</p>
                      : <p className="text-text-muted text-xs">Quiz not available for this module yet.</p>
                    }
                  </div>
                )}

                {!quizLoading && quizResult && (
                  <div className="space-y-4 text-center py-4">
                    <div className={`text-4xl font-black ${quizResult.passed ? 'text-accent' : 'text-text-primary'}`}>
                      {quizResult.score}%
                    </div>
                    <div className={`text-sm font-bold uppercase tracking-widest ${quizResult.passed ? 'text-accent' : 'text-text-muted'}`}>
                      {quizResult.passed ? '✓ Passed' : 'Keep going'}
                    </div>
                    {quizResult.passed && quizResult.reward > 0 && (
                      <div className="text-xs text-text-muted">+{quizResult.reward} CP earned</div>
                    )}
                    {!quizResult.passed && (
                      <button
                        onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                        className="btn-secondary text-xs !py-2 !px-4"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}

                {!quizLoading && activeQuiz && !quizResult && (
                  <>
                    <div className="h-1 bg-accent-dim rounded-full mb-5 overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${(Object.keys(quizAnswers).length / activeQuiz.questions.length) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-5">
                      {activeQuiz.questions.map((question, index) => (
                        <div key={question.id || index} className="space-y-3">
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                            Q{index + 1} of {activeQuiz.questions.length}
                          </div>
                          <div className="text-sm font-bold text-text-primary leading-snug">{question.text}</div>
                          <div className="space-y-2">
                            {(question.options || []).map((option, optIdx) => {
                              const selected = Number(quizAnswers[question.id]) === optIdx;
                              return (
                                <button
                                  key={`${question.id}-${optIdx}`}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [question.id]: optIdx }))}
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                                    selected
                                      ? 'border-accent bg-accent-dim text-accent font-bold'
                                      : 'border-border text-text-secondary hover:border-accent/30 hover:bg-accent-dim/20'
                                  }`}
                                >
                                  <span className="font-mono text-[10px] mr-2 opacity-50">{String.fromCharCode(65 + optIdx)}.</span>
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={submitQuiz}
                        disabled={submittingQuiz || Object.keys(quizAnswers).length < activeQuiz.questions.length}
                        className="btn-primary w-full !py-3 text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        {submittingQuiz
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
                          : 'Submit Quiz'
                        }
                      </button>
                      {Object.keys(quizAnswers).length < activeQuiz.questions.length && (
                        <p className="text-[10px] text-text-muted text-center mt-2">
                          Answer all {activeQuiz.questions.length} questions to submit
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BootcampRoomPage;
