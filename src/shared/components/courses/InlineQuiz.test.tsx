import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InlineQuiz, { QuizQuestion } from './InlineQuiz';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: string | Record<string, unknown>) =>
      typeof opts === 'string' ? opts : key,
    i18n: { language: 'en' },
  }),
}));

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which port is the service exposed on?',
    options: ['8080', '3306', '443'],
    correctIndex: 0,
    explanation: 'The evidence log showed port 8080 open.',
  },
];

const onComplete = vi.fn<(passed: boolean, score: number) => void>();

beforeEach(() => {
  onComplete.mockReset();
});

describe('InlineQuiz — quiz feedback', () => {
  it('reports a pass and score when all answers are correct', async () => {
    render(<InlineQuiz questions={questions} title="Check your understanding" onComplete={onComplete} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /8080/ }));
    await user.click(screen.getByRole('button', { name: 'components.common.submit' }));
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('components.quiz.passed')).toBeInTheDocument();
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(true, 100));
  });

  it('reports a fail and shows the correct answer on review', async () => {
    render(<InlineQuiz questions={questions} title="Check your understanding" onComplete={onComplete} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /3306/ }));
    await user.click(screen.getByRole('button', { name: 'components.common.submit' }));
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('components.quiz.needsReview')).toBeInTheDocument();
    expect(screen.getByText(/components.quiz.correctAnswer/)).toBeInTheDocument();
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(false, 0));
  });

  it('does not submit until every question is answered', async () => {
    render(
      <InlineQuiz
        questions={[
          questions[0],
          { ...questions[0], id: 'q2', question: 'Second question?', options: ['a', 'b'], correctIndex: 1 },
        ]}
        title="Check your understanding"
        onComplete={onComplete}
      />,
    );
    const user = userEvent.setup();
    const submit = screen.getByRole('button', { name: 'components.quiz.next' });
    expect(submit).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /8080/ }));
    expect(submit).toBeEnabled();
    await user.click(submit);
    await user.click(screen.getByRole('button', { name: /^B\./ }));
    await user.click(screen.getByRole('button', { name: 'components.common.submit' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(true, 100));
  });

  it('resets the quiz state on retry', async () => {
    render(<InlineQuiz questions={questions} title="Check your understanding" onComplete={onComplete} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /8080/ }));
    await user.click(screen.getByRole('button', { name: 'components.common.submit' }));
    await user.click(screen.getByRole('button', { name: 'components.quiz.retry' }));
    expect(screen.getByText('Which port is the service exposed on?')).toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });

  it('renders an empty state when no questions exist', () => {
    render(<InlineQuiz questions={[]} title="Check your understanding" />);
    expect(screen.getByText('No questions available.')).toBeInTheDocument();
  });
});