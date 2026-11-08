import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { IconChevronRight } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface InlineQuizProps {
  questions: QuizQuestion[];
  title?: string;
  passThreshold?: number;
  onComplete?: (passed: boolean, score: number) => void;
  className?: string;
}

const InlineQuiz: React.FC<InlineQuizProps> = ({
  questions,
  title,
  passThreshold = 70,
  onComplete,
  className = '',
}) => {
  const resolvedTitle = title ?? 'Knowledge Check';
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className={cn('wc-interactive rounded-2xl border border-border bg-bg-card p-6 text-center', className)}>
        <p className="text-sm text-text-muted">No questions available.</p>
      </div>
    );
  }

  const question = questions[currentQ];
  const selectedIdx = answers[question?.id] ?? -1;
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === questions.length;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [question.id]: idx }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((i) => i + 1);
    } else if (!submitted) {
      setSubmitted(true);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    onComplete?.(score >= passThreshold, score);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQ(0);
    setSubmitted(false);
    setShowResults(false);
  };

  if (showResults) {
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passThreshold;

    return (
      <div
        className={cn(
          'wc-interactive relative overflow-hidden rounded-2xl border-2 p-5 sm:p-6',
          passed ? 'border-accent/40 bg-accent/5' : 'border-danger/30 bg-danger/5',
          className,
        )}
      >
        <div className="text-center">
          <div
            aria-live="polite"
            aria-atomic="true"
            className={cn('font-display text-5xl font-bold tracking-tight', passed ? 'text-accent' : 'text-danger')}
          >
            {score}%
          </div>
          <div className={cn('mt-2 text-xs font-black uppercase tracking-[0.18em]', passed ? 'text-accent' : 'text-danger')}>
            {passed ? 'Passed' : 'Needs Review'}
          </div>
          <p className="mt-2 text-xs leading-5 text-text-muted sm:text-sm">
            {correct} of {questions.length} correct · {passThreshold}% to pass
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {questions.map((q) => {
            const isCorrect = answers[q.id] === q.correctIndex;
            return (
              <div key={q.id} className="rounded-xl border border-border/50 bg-bg-card/80 px-3.5 py-3">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-text-primary">{q.question}</p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        Correct answer: {q.options[q.correctIndex]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="mt-1 text-sm leading-6 text-text-muted">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-center">
          <button onClick={handleRetry} className="btn-secondary px-5 py-2.5 text-xs">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'wc-interactive relative overflow-hidden rounded-2xl border-2 border-accent/25 bg-gradient-to-br from-bg-card via-bg-card to-accent-dim/50 p-5 sm:p-6',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Knowledge check</p>
            <h3 className="font-display text-base font-bold leading-snug text-text-primary sm:text-lg">
              {resolvedTitle}
            </h3>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-border/60 bg-bg-card/80 px-2.5 py-1 font-mono text-[11px] text-text-muted">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div
        className="mb-5 h-1 overflow-hidden rounded-full bg-bg-elevated"
        role="progressbar"
        aria-valuenow={allAnswered ? questions.length : currentQ + (selectedIdx >= 0 ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-label="Quiz progress"
      >
        <div
          className="h-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]"
          style={{
            width: `${((allAnswered ? questions.length : currentQ + (selectedIdx >= 0 ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="space-y-3">
        <p className="text-base font-semibold leading-7 text-text-primary sm:text-lg">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              aria-pressed={selectedIdx === idx}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm leading-6 transition-[border-color,background-color,color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] sm:text-[15px]',
                selectedIdx === idx
                  ? 'border-accent bg-accent/10 font-semibold text-text-primary'
                  : 'border-border/70 bg-bg-card/80 text-text-secondary hover:border-accent/50 hover:bg-accent/5',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 shrink-0 font-mono text-xs font-bold',
                  selectedIdx === idx ? 'text-accent' : 'text-text-muted',
                )}
              >
                {String.fromCharCode(65 + idx)}.
              </span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {currentQ < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedIdx < 0}
            className="btn-primary inline-flex items-center gap-1.5 py-2.5 text-xs disabled:opacity-50"
          >
            Next <IconChevronRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="btn-primary py-2.5 text-xs disabled:opacity-50"
          >
            Submit
          </button>
        )}
        {!allAnswered && (
          <p className="text-xs text-text-muted">
            {questions.length - totalAnswered} remaining
          </p>
        )}
      </div>
    </div>
  );
};

export default InlineQuiz;
