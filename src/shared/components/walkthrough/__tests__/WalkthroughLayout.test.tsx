import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { WalkthroughLayout } from '../WalkthroughLayout';
import type { FocusedStepListItem } from '@/shared/components/learning/FocusedStepList';

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

describe('WalkthroughLayout continuous rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('renders every step on the page, not only the active one', () => {
    renderWalkthrough(<StatefulHarness />);
    for (const title of STEP_TITLES) {
      expect(screen.getByText(`${title} content`)).toBeInTheDocument();
    }
  });

  it('gives every step a stable scroll-target id', () => {
    renderWalkthrough(<StatefulHarness />);
    for (let i = 0; i < STEP_TITLES.length; i += 1) {
      const section = document.getElementById(`ws-step-${i + 1}`);
      expect(section).toBeInTheDocument();
      expect(section?.className).toContain('scroll-mt-20');
      expect(section?.className).toContain('md:scroll-mt-24');
    }
  });

  it('renders an outline with one link per step', () => {
    renderWalkthrough(<StatefulHarness />);
    expect(screen.getByRole('navigation', { name: /on this page/i })).toBeInTheDocument();
    for (const title of STEP_TITLES) {
      expect(screen.getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `#ws-step-${STEP_TITLES.indexOf(title) + 1}`,
      );
    }
  });

  it('scrolls to the next step anchor without collapsing the current step', async () => {
    const user = userEvent.setup();
    renderWalkthrough(<StatefulHarness />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => expect(scrolledIds()).toContain('ws-step-2'));
    expect(screen.getByText('Mission Briefing content')).toBeInTheDocument();
    expect(screen.getByText('Enumeration content')).toBeInTheDocument();
  });

  it('scrolls back to the previous step anchor', async () => {
    const user = userEvent.setup();
    renderWalkthrough(<StatefulHarness startIndex={1} />);

    await user.click(screen.getByRole('button', { name: /previous/i }));

    await waitFor(() => expect(scrolledIds()).toContain('ws-step-1'));
  });

  it('has no Previous on the first step and no Next on the last', () => {
    const first = renderWalkthrough(<StatefulHarness startIndex={0} />);
    expect(screen.queryByRole('button', { name: /previous/i })).toBeNull();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    first.unmount();

    renderWalkthrough(<StatefulHarness startIndex={STEP_TITLES.length - 1} />);
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  });
});
