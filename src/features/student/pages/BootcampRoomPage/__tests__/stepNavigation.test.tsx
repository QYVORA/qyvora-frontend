import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import FocusedStepList from '@/shared/components/learning/FocusedStepList';
import LearningNav from '@/shared/components/learning/LearningNav';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';
import { scrollToStepId } from '@/shared/utils/scrollToStep';

/**
 * Regression tests for HPB bootcamp room step navigation.
 *
 * This mirrors the wiring in BootcampRoomPage (URL is the source of truth for the
 * active step, plus a separate per-room reset effect) so the two failure modes we
 * hit are covered:
 *
 *  1. An effect depending on an unstable resetSession re-ran on every render and
 *     looped forever, freezing the page so Next appeared to do nothing.
 *  2. Session/quiz/viewed-step state was reset on every step change, wiping the
 *     "in session" timer and clearing a passed quiz just by moving between steps.
 */

const STEP_TITLES = ['What Is Offensive Security?', 'The QYVORA Operating Model', 'Career Paths'];

let renderCount = 0;

function RoomPageLike() {
  renderCount += 1;
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStepIdx, setCurrentStepIdx] = useState(() => {
    const step = searchParams.get('step');
    return step ? Math.max(0, parseInt(step, 10) || 0) : 0;
  });
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set([0]));
  const [quizPassed, setQuizPassed] = useState(false);
  const { timeSpent, resetSession } = useRoomSession();

  // Step sync: URL only.
  useEffect(() => {
    const step = searchParams.get('step');
    setCurrentStepIdx(step ? Math.max(0, parseInt(step, 10) || 0) : 0);
  }, [searchParams]);

  // Per-room reset: not re-run when the step changes.
  useEffect(() => {
    setQuizPassed(false);
    resetSession();
  }, [resetSession]);

  const persistViewedSteps = (next: Set<number>) => {
    try { localStorage.setItem('viewed', JSON.stringify([...next])); } catch { /* ignore */ }
  };

  const goToStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setSearchParams((prev) => { prev.set('step', String(idx)); return prev; }, { replace: true });
    setViewedSteps((prev) => { const next = new Set(prev); next.add(idx); persistViewedSteps(next); return next; });
    scrollToStepId(`step-${idx + 1}`, 'smooth');
  };

  const items = STEP_TITLES.map((title, i) => ({
    index: i,
    number: i + 1,
    title,
    isActive: i === currentStepIdx,
    isCompleted: viewedSteps.has(i) && i !== currentStepIdx,
    isLocked: false,
  }));

  return (
    <div>
      <FocusedStepList idPrefix="step" items={items} onSelect={goToStep}
        renderActive={(i) => <div>{`${STEP_TITLES[i]} content`}</div>} />
      <LearningNav
        currentStep={currentStepIdx}
        totalSteps={STEP_TITLES.length}
        isLastStep={currentStepIdx === STEP_TITLES.length - 1}
        isComplete={false}
        onPrev={currentStepIdx > 0 ? () => goToStep(currentStepIdx - 1) : undefined}
        onNext={currentStepIdx < STEP_TITLES.length - 1 ? () => goToStep(currentStepIdx + 1) : undefined}
      />
      <button type="button" onClick={() => setQuizPassed(true)}>{"Pass quiz"}</button>
      <p data-testid="idx">{String(currentStepIdx)}</p>
      <p data-testid="quiz">{String(quizPassed)}</p>
      <p data-testid="time">{String(timeSpent)}</p>
    </div>
  );
}

function scrolledIds(): string[] {
  const spy = Element.prototype.scrollIntoView as unknown as ReturnType<typeof vi.fn>;
  return spy.mock.instances.map((n) => (n as Element)?.id).filter(Boolean);
}

describe('HPB bootcamp room step navigation', () => {
  beforeEach(() => {
    renderCount = 0;
    localStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('shows the first step on load', () => {
    render(<MemoryRouter><RoomPageLike /></MemoryRouter>);
    expect(screen.getByText('What Is Offensive Security? content')).toBeInTheDocument();
    expect(document.getElementById('step-1')).toBeInTheDocument();
  });

  it('changes the step content when Next is pressed', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RoomPageLike /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => expect(screen.getByTestId('idx')).toHaveTextContent('1'));
    expect(screen.getByText('The QYVORA Operating Model content')).toBeInTheDocument();
    expect(document.getElementById('step-2')).toBeInTheDocument();
  });

  it('keeps advancing and scrolling across every step', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RoomPageLike /></MemoryRouter>);

    for (const [idx, title, id] of [
      ['1', 'The QYVORA Operating Model', 'step-2'],
      ['2', 'Career Paths', 'step-3'],
    ] as const) {
      await user.click(screen.getByRole('button', { name: /next/i }));
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(screen.getByTestId('idx')).toHaveTextContent(idx));
      expect(screen.getByText(`${title} content`)).toBeInTheDocument();
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(scrolledIds()).toContain(id));
    }
  });

  it('goes back with Previous', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/rooms/room1?step=1']}><RoomPageLike /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => expect(screen.getByTestId('idx')).toHaveTextContent('0'));
    expect(screen.getByText('What Is Offensive Security? content')).toBeInTheDocument();
  });

  it('settles instead of looping: one Next click stays cheap', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RoomPageLike /></MemoryRouter>);
    const before = renderCount;

    await user.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByTestId('idx')).toHaveTextContent('1'));

    expect(renderCount - before).toBeLessThan(10);
  });

  it('does not clear a passed quiz when moving between steps', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RoomPageLike /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /pass quiz/i }));
    expect(screen.getByTestId('quiz')).toHaveTextContent('true');

    // Before the fix, stepping forward re-ran the per-room reset effect and
    // cleared quizPassed, so completing a room became impossible to record.
    await user.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => expect(screen.getByTestId('idx')).toHaveTextContent('1'));
    expect(screen.getByTestId('quiz')).toHaveTextContent('true');
  });
});