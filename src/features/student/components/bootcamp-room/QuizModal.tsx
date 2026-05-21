import React, { useEffect, useState } from 'react';
import { Loader2, ClipboardList, X, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../../../core/services/api';
import { useToast } from '../../../../core/contexts/ToastContext';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';
import type { RoomQuiz, QuizQuestion } from './types';

interface QuizModalProps {
  moduleId: string;
  roomId: string;
  courseId: string;
  onClose: () => void;
  onPassed: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ moduleId, roomId, courseId, onClose, onPassed }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<RoomQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    reward?: number;
    questions: QuizQuestion[];
  } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .post('/student/quiz', { moduleId, roomId, courseId })
      .then((res) => {
        const q = res?.data as RoomQuiz;
        if (Array.isArray(q?.questions) && q.questions.length > 0) {
          setQuiz(q);
        } else {
          setError('No questions available for this room yet.');
        }
      })
      .catch((err: any) => {
        if (err?.response?.status !== 403) {
          setError(String(err?.response?.data?.error || '') || 'Could not load quiz.');
        }
      })
      .finally(() => setLoading(false));
  }, [moduleId, roomId, courseId]);

  const submit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      addToast('Answer all questions before submitting.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/student/quiz', { moduleId, roomId, courseId, answers });
      const score   = Number(res?.data?.score || 0);
      const passed  = Boolean(res?.data?.passed);
      const reward  = Number(res?.data?.reward?.points || 0);
      setResult({ score, passed, reward, questions: quiz.questions });
      if (passed) {
        addToast(`Quiz passed! ${score}% — +${reward} CP`, 'success');
        onPassed();
      } else {
        addToast(`Score: ${score}% — need 70% to pass`, 'info');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Could not submit quiz.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title="Room Quiz" maxWidth="max-w-2xl" className="max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg-card px-6 py-4 -mx-6 -mt-6 mb-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">
              Room Quiz
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              Loading quiz…
            </div>
          )}

          {!loading && !quiz && !result && (
            <p className={`py-8 text-center text-sm ${error ? 'text-red-400' : 'text-text-muted'}`}>
              {error || 'Quiz not available for this room yet.'}
            </p>
          )}

          {!loading && result && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className={`text-6xl font-black mb-2 ${result.passed ? 'text-accent' : 'text-red-400'}`}>
                  {result.score}%
                </div>
                <div className={`flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-widest ${result.passed ? 'text-accent' : 'text-red-400'}`}>
                  {result.passed
                    ? <><CheckCircle2 className="h-4 w-4" /> Passed</>
                    : <><XCircle className="h-4 w-4" /> Not quite — 70% needed</>
                  }
                </div>
                {result.passed && result.reward > 0 && (
                  <div className="mt-1 text-xs text-text-muted">+{result.reward} CP earned</div>
                )}
              </div>

              <div className="space-y-5">
                {result.questions.map((q, idx) => {
                  const chosen  = answers[q.id];
                  return (
                    <div key={q.id} className="rounded-xl border border-border bg-bg-card p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="shrink-0 mt-0.5 text-text-muted">
                          <ClipboardList className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-bold text-text-primary leading-snug">
                          <span className="text-text-muted font-mono text-[10px] mr-1">Q{idx + 1}.</span>
                          {q.text}
                        </p>
                      </div>
                      <div className="space-y-1.5 pl-5">
                        {q.options.map((opt, optIdx) => {
                          const isChosenOpt  = optIdx === chosen;
                          const cls = isChosenOpt
                            ? 'border-accent/50 bg-accent/10 text-accent font-bold'
                            : 'border-border text-text-muted';
                          return (
                            <div key={optIdx} className={`rounded-lg border px-3 py-2 text-xs flex items-center gap-2 ${cls}`}>
                              <span className="font-mono opacity-50 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                              {isChosenOpt && <span className="ml-auto text-[10px] font-black text-accent shrink-0">Your answer</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {!result.passed && (
                  <button
                    onClick={() => { setResult(null); setAnswers({}); }}
                    className="btn-primary text-sm py-3"
                  >
                    Try Again
                  </button>
                )}
                <button onClick={onClose} className={`text-sm py-3 ${result.passed ? 'btn-primary' : 'btn-secondary'}`}>
                  {result.passed ? 'Continue to Next Room' : 'Close'}
                </button>
              </div>
            </div>
          )}

          {!loading && quiz && !result && (
            <>
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                />
              </div>

              <div className="space-y-7">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 rounded border border-border bg-bg px-2 py-0.5 font-mono text-[10px] font-black text-text-muted">
                        Q{idx + 1}
                      </span>
                      <p className="text-sm font-bold leading-snug text-text-primary">{q.text}</p>
                    </div>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const selected = Number(answers[q.id]) === optIdx;
                        return (
                          <button
                            key={`${q.id}-${optIdx}`}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                              selected
                                ? 'border-accent bg-accent-dim font-bold text-accent'
                                : 'border-border text-text-secondary hover:border-accent/30 hover:bg-accent-dim/20'
                            }`}
                          >
                            <span className="mr-2 font-mono text-[10px] opacity-50">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2">
                <button
                  onClick={submit}
                  disabled={submitting || Object.keys(answers).length < quiz.questions.length}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
                >
                  {submitting
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</>
                    : 'Submit Quiz'}
                </button>
                {Object.keys(answers).length < quiz.questions.length && (
                  <p className="text-center text-[10px] text-text-muted">
                    {quiz.questions.length - Object.keys(answers).length} question{quiz.questions.length - Object.keys(answers).length !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
