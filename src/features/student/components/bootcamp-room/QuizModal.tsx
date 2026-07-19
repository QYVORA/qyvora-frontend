import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ClipboardList, XCircle } from 'lucide-react';
import { IconX, IconCheck } from '@/shared/components/icons';
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
}

const QuizModal: React.FC<QuizModalProps> = ({ moduleId, roomId, courseId, onClose, onPassed }) => {
  const { t } = useTranslation();
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
      setError(t('student.bootcampRoom.quiz.loadError'));
    } finally {
      setLoading(false);
    }
  }, [moduleId, roomId, courseId]);

  const submit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      addToast(t('toast.quizAnswerAll'), 'error');
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
        addToast(t('toast.quizPassed', { score, cp: reward }), 'success');
        // Let the user see the "Passed" screen and click "Continue" themselves
      } else {
        addToast(t('toast.quizScore', { score }), 'info');
      }
    } catch (err: any) {
      addToast(err?.response?.data?.error || t('toast.quizSubmitError'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title={t('student.bootcampRoom.quiz.title')} maxWidth="max-w-5xl" className="shadow-none">
        <div>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              {t('student.bootcampRoom.quiz.loading')}
            </div>
          )}

          {!loading && !quiz && !result && (
            <p className={`py-8 text-center text-sm ${error ? 'text-red-400' : 'text-text-muted'}`}>
              {error || t('student.bootcampRoom.quiz.notAvailable')}
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
                    ? <><IconCheck size={16} /> {t('student.bootcampRoom.quiz.passed')}</>
                    : <><XCircle className="h-4 w-4" /> {t('student.bootcampRoom.quiz.failed')}</>
                  }
                </div>
                {result.passed && result.reward > 0 && (
                  <div className="mt-1 text-xs text-text-muted">+{result.reward} {t('student.bootcampRoom.quiz.cpEarned')}</div>
                )}
              </div>

              {result.passed ? (
                <div className="rounded-2xl border-2 border-accent/20 bg-accent-dim/30 p-6 text-center">
                  <p className="text-sm text-text-primary font-bold mb-4">
                    {t('student.bootcampRoom.quiz.excellent')}
                  </p>
                  <button
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onPassed(); }}
                    className="btn-primary w-full py-3 text-sm font-black uppercase"
                  >
                    {t('button.continue')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {result.questions.map((q, idx) => {
                      const chosen  = answers[q.id];
                      return (
                        <div key={q.id} className="rounded-2xl border border-border/30 bg-bg-card p-4">
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
                              const ansResult = result.answerResults[idx];
                              const isCorrectOpt = ansResult.correct && opt === ansResult.correctAnswer;
                              const showCorrect = isCorrectOpt && !isChosenOpt;
                              let cls = 'border-border text-text-muted';
                              if (isChosenOpt) {
                                cls = ansResult.correct
                                  ? 'border-green-500/50 bg-green-500/10 text-green-500 font-bold'
                                  : 'border-red-500/50 bg-red-500/10 text-red-500 font-bold';
                              } else if (showCorrect) {
                                cls = 'border-accent/30 bg-accent/5 text-accent';
                              }
                              return (
                                <div key={optIdx} className={`rounded-lg border px-3 py-2 text-xs flex items-center gap-2 ${cls}`}>
                                  <span className="font-mono opacity-50 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                                  <span>{opt}</span>
                                  {isChosenOpt && <span className="ml-auto text-[10px] font-black shrink-0">{ansResult.correct ? t('student.bootcampRoom.quiz.correct') : t('student.bootcampRoom.quiz.wrong')}</span>}
                                  {showCorrect && <span className="ml-auto text-[10px] font-black text-accent shrink-0">{t('student.bootcampRoom.quiz.correctAnswer')}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={() => { setResult(null); setAnswers({}); }}
                      className="btn-primary text-sm py-3"
                    >
                      {t('button.tryAgain')}
                    </button>
                    <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onClose(); }} className="btn-secondary text-sm py-3">
                      {t('button.close')}
                    </button>
                  </div>
                </>
              )}
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
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('student.bootcampRoom.quiz.scoring')}
                    </>
                  ) : (
                    t('student.bootcampRoom.quiz.submit')
                  )}
                </button>
                {Object.keys(answers).length < quiz.questions.length && (
                  <p className="text-center text-[10px] text-text-muted">
                    {t('student.bootcampRoom.quiz.remaining', { count: quiz.questions.length - Object.keys(answers).length })}
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
