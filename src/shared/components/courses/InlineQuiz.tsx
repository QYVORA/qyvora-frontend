import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

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
  title = 'Knowledge Check',
  passThreshold = 70,
  onComplete,
  className = '',
}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQ];
  const selectedIdx = answers[question?.id] ?? -1;
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === questions.length;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [question.id]: idx }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(i => i + 1);
    } else if (!submitted) {
      setSubmitted(true);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    const correct = questions.filter((q, i) => answers[q.id] === q.correctIndex).length;
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
    const correct = questions.filter((q, i) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passThreshold;

    return (
      <div className={`border border-border bg-bg-card rounded-xl p-6 space-y-5 ${className}`}>
        <div className="text-center py-4">
          <div className={`text-5xl font-black font-mono mb-2 ${passed ? 'text-accent' : 'text-red-400'}`}>
            {score}%
          </div>
          <div className={`flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-widest ${passed ? 'text-accent' : 'text-red-400'}`}>
            {passed ? <><CheckCircle2 className="h-4 w-4" /> Passed</> : <><XCircle className="h-4 w-4" /> Needs Review</>}
          </div>
          <p className="text-xs text-text-muted mt-2">{correct} of {questions.length} correct ({(passThreshold)}% to pass)</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const chosen = answers[q.id];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div key={q.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 mt-0.5 ${isCorrect ? 'text-accent' : 'text-red-400'}`}>
                    {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{q.question}</p>
                    <p className="text-xs text-text-muted mt-1">Your answer: <span className={isCorrect ? 'text-accent' : 'text-red-400'}>{q.options[chosen]}</span></p>
                    {!isCorrect && (
                      <p className="text-xs text-accent mt-0.5">Correct answer: {q.options[q.correctIndex]}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-text-muted/70 border-t border-border/30 pt-2">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={handleRetry} className="btn-secondary text-xs py-2.5">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-border bg-bg-card rounded-xl p-6 space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">{title}</span>
        <span className="text-[10px] font-mono text-text-muted">{currentQ + 1} / {questions.length}</span>
      </div>

      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${((allAnswered ? questions.length : currentQ + (selectedIdx >= 0 ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold text-text-primary">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                selectedIdx === idx
                  ? 'border-accent bg-accent-dim text-accent font-bold'
                  : 'border-border text-text-secondary hover:border-accent/30 hover:bg-accent-dim/20'
              }`}
            >
              <span className="mr-2 font-mono text-[10px] opacity-50">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {currentQ < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={selectedIdx < 0}
            className="btn-primary text-xs py-2.5 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="btn-primary text-xs py-2.5 disabled:opacity-50"
          >
            Submit
          </button>
        )}
        {!allAnswered && (
          <p className="text-[10px] text-text-muted self-center ml-2">
            {questions.length - totalAnswered} remaining
          </p>
        )}
      </div>
    </div>
  );
};

export default InlineQuiz;
