import React, { useEffect, useState } from 'react';
import { Loader2, ClipboardList, XCircle } from 'lucide-react';
import { IconX, IconCheck } from '@/shared/components/icons';
import Dobia from '@/shared/components/Dobia';
import api from '../../../../core/services/api';
import { useToast } from '../../../../core/contexts/ToastContext';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';
import { ROOM_QUIZ_BANK, FALLBACK_QUESTIONS } from '../../data/quizzes';
import type { RoomQuiz, QuizQuestion } from './types';

interface QuizModalProps {
  moduleId: string;
  roomId: string;
  courseId: string;
  onClose: () => void;
  onPassed: () => void;
  inline?: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ moduleId, roomId, courseId, onClose, onPassed, inline = false }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<RoomQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    reward?: number;
    questions: QuizQuestion[];
    answerResults: Array<{ correct: boolean; correctAnswer: string }>;
  } | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const key = `${moduleId}:${roomId}`;
      const bankQuestions = ROOM_QUIZ_BANK[key];
      const questions: QuizQuestion[] = bankQuestions || FALLBACK_QUESTIONS.map((q) => ({
        ...q,
        correctIndex: q.correctIndex ?? 0,
      }));
      setQuiz({
        scope: { type: 'room', id: key, courseId, moduleId, roomId },
        questions,
      });
    } catch (err: any) {
      setError("Could not load quiz.");
    } finally {
      setLoading(false);
    }
  }, [moduleId, roomId, courseId]);

  const submit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      addToast("Answer all questions before submitting.", 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/student/quiz', { moduleId, roomId, courseId, answers });
      const score   = Number(res?.data?.score || 0);
      const passed  = Boolean(res?.data?.passed);
      const reward  = Number(res?.data?.reward?.points || 0);
      const answerResults = quiz.questions.map((q) => ({
        correct: answers[q.id] === q.correctIndex,
        correctAnswer: q.options[q.correctIndex],
      }));
      setResult({ score, passed, reward, questions: quiz.questions, answerResults });
      if (passed) {
        addToast(`Quiz passed! ${score}% · +${reward} CP`, 'success');
        // Let the user see the "Passed" screen and click "Continue" themselves
      } else {
        addToast(`Score: ${score}% · need 70% to pass`, 'info');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || "Could not submit quiz.", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              {"Loading quiz…"}
            </div>
          )}

          {!loading && !quiz && !result && (
            <p className={`py-8 text-center text-sm ${error ? 'text-danger' : 'text-text-muted'}`}>
              {error || "Quiz not available for this room yet."}
            </p>
          )}

          {!loading && result && (
            <div className="space-y-6">
              {/* Simple score display */}
              <div aria-live="polite" aria-atomic="true" className="text-center py-6">
                <div className={`text-6xl font-black mb-3 ${result.passed ? 'text-accent' : 'text-danger'}`}>
                  {result.score}%
                </div>
                <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${result.passed ? 'text-accent' : 'text-danger'}`}>
                  {result.passed ? 'Passed' : 'Try Again'}
                </div>
                {result.passed && result.reward > 0 && (
                  <div className="text-xs text-text-muted">+{result.reward} CP earned</div>
                )}
                {!result.passed && (
                  <p className="text-sm text-text-muted mt-3">
                    Review the content and retry when ready.
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                {result.passed ? (
                  <button
                    onClick={onPassed}
                    className="btn-primary w-full py-3 text-sm font-black uppercase"
                  >
                    {"Continue"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setResult(null); setAnswers({}); }}
                      className="btn-primary text-sm py-3"
                    >
                      {"Retry Quiz"}
                    </button>
                    {!inline && (
                      <button onClick={onClose} className="btn-secondary text-sm py-3">
                        {"Close"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {!loading && quiz && !result && (
            <>
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)]"
                  style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                />
              </div>

              <div className="space-y-6">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-3">
                    <p className="text-sm font-bold text-text-primary">
                      <span className="text-accent font-mono mr-2">Q{idx + 1}.</span>
                      {q.text}
                    </p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const selected = Number(answers[q.id]) === optIdx;
                        return (
                          <button
                            key={`${q.id}-${optIdx}`}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            aria-pressed={selected}
                            className={`w-full text-left text-sm border-l-2 px-3 py-2.5 transition-colors ${
                              selected
                                ? 'border-accent bg-accent/5 text-text-primary'
                                : 'border-transparent hover:border-accent/30 text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            <span className="font-mono text-accent mr-2">
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
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {"Scoring…"}
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </button>
                {Object.keys(answers).length < quiz.questions.length && (
                  <p className="text-center text-xs text-text-muted">
                    {`${quiz.questions.length - Object.keys(answers).length} question(s) remaining`}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
  );

  if (inline) {
    return (
      <section id="room-final-quiz" className="scroll-mt-20 rounded-2xl border border-border bg-surface p-5 md:scroll-mt-24 md:p-7">
        <h2 className="mb-6 text-xl font-black tracking-tight text-text-primary">Room Checkpoint</h2>
        {content}
      </section>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title={"Room Quiz"} maxWidth="max-w-5xl" className="shadow-none">
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
