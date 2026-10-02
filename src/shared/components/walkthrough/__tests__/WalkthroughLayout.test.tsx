import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WalkthroughLayout } from '../WalkthroughLayout';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';

/**
 * Regression tests for walkthrough step navigation.
 *
 * Every step renders on one page, so "Next" has to scroll to the step it just
 * activated. Before the fix, WalkthroughLayout passed the step index straight to
 * the caller's state setter and never scrolled — the page changed but the reader
 * stayed where they were, which reads as a dead button.
 */

vi.mock('@/features/student/hooks/useLabConnection', () => ({
  useLabConnection: () => ({
    connection: null,
    isConnected: false,
    isLoading: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

vi.mock('@/features/student/components/simulations', () => ({
  SimulationPanel: () => null,
  useSimulation: () => ({
    network: { setActiveProfile: vi.fn() },
    browser: { resetBrowser: vi.fn() },
  }),
  getNetworkProfileForLab: () => null,
}));

const STEP_TITLES = ['Mission Briefing', 'Enumeration', 'Exploitation', 'Reporting'];

function makeStepList(activeIndex: number): FocusedStepListItem[] {
  return STEP_TITLES.map((title, i) => ({
    index: i,
    number: i + 1,
    title,
    isActive: i === activeIndex,
    isCompleted: i < activeIndex,
    isLocked: false,
  }));
}

function Shell({ activeIndex, onStepSelect }: { activeIndex: number; onStepSelect: (i: number) => void }) {
  return (
    <WalkthroughLayout
      title="SQL Injection"
      subtitle="test lab"
      icon={<span />}
      labId="sql-injection"
      completedCount={activeIndex}
      totalSteps={STEP_TITLES.length}
      stepList={makeStepList(activeIndex)}
      activeStepIndex={activeIndex}
      onStepSelect={onStepSelect}
      stepIdPrefix="ws-step"
      showConnectionGuide={false}
    >
      {STEP_TITLES.map((title) => (
        <div key={title}>{title} content</div>
      ))}
    </WalkthroughLayout>
  );
}

/** Fully controlled: the test drives which step is active. */
function ControlledHarness({ activeIndex }: { activeIndex: number }) {
  return <Shell activeIndex={activeIndex} onStepSelect={() => {}} />;
}

/** Real state, so activating a step actually re-renders the list. */
function StatefulHarness({ startIndex = 0 }: { startIndex?: number }) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  return <Shell activeIndex={activeIndex} onStepSelect={setActiveIndex} />;
}

function renderWalkthrough(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

/** Ids of every element scrollIntoView was called on, in order. */
function scrolledIds(): string[] {
  const spy = Element.prototype.scrollIntoView as unknown as ReturnType<typeof vi.fn>;
  return spy.mock.instances.map((node) => (node as Element)?.id).filter(Boolean);
}

describe('WalkthroughLayout step navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom implements neither scrollIntoView nor matchMedia.
    Element.prototype.scrollIntoView = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  it('renders the active step under its scroll-target id', () => {
    renderWalkthrough(<ControlledHarness activeIndex={0} />);
    expect(document.getElementById('ws-step-1')).toBeInTheDocument();
    expect(screen.getByText('Mission Briefing content')).toBeInTheDocument();
  });

  it('offsets the active step for the sticky topbar', () => {
    renderWalkthrough(<ControlledHarness activeIndex={0} />);
    const section = document.getElementById('ws-step-1')!;
    expect(section.className).toContain('scroll-mt-20');
    expect(section.className).toContain('md:scroll-mt-24');
  });

  it('collapses every non-active step into a selectable row', () => {
    renderWalkthrough(<ControlledHarness activeIndex={0} />);
    expect(screen.getByRole('button', { name: /04 Reporting/ })).toBeInTheDocument();
    expect(screen.queryByText('Reporting content')).toBeNull();
  });

  it('scrolls to the newly activated step when Next is pressed', async () => {
    const user = userEvent.setup();
    renderWalkthrough(<StatefulHarness />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    // The target id only exists after React commits the new active step, so this
    // also covers the retry the fix depends on.
    await waitFor(() => expect(scrolledIds()).toContain('ws-step-2'));
    expect(screen.getByText('Enumeration content')).toBeInTheDocument();
  });

  it('scrolls when a collapsed step row is selected', async () => {
    const user = userEvent.setup();
    renderWalkthrough(<StatefulHarness />);

    await user.click(screen.getByRole('button', { name: /04 Reporting/ }));

    await waitFor(() => expect(scrolledIds()).toContain('ws-step-4'));
    expect(screen.getByText('Reporting content')).toBeInTheDocument();
  });

  it('scrolls back to the previous step', async () => {
    const user = userEvent.setup();
    renderWalkthrough(<StatefulHarness startIndex={1} />);

    await user.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => expect(scrolledIds()).toContain('ws-step-1'));
    expect(screen.getByText('Mission Briefing content')).toBeInTheDocument();
  });

  it('has no Previous on the first step and no Next on the last', () => {
    const first = renderWalkthrough(<ControlledHarness activeIndex={0} />);
    expect(screen.queryByRole('button', { name: /previous/i })).toBeNull();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    first.rerender(
      <MemoryRouter>
        <ControlledHarness activeIndex={STEP_TITLES.length - 1} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });

  it('does not scroll on initial render', () => {
    renderWalkthrough(<ControlledHarness activeIndex={0} />);
    expect(scrolledIds()).toHaveLength(0);
  });
});