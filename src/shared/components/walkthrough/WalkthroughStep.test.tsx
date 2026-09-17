import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalkthroughStep, ProgressiveHintLevel } from './WalkthroughStep';

const mockFlagSubmit = vi.fn<(step: string, flag: string) => Promise<{ correct: boolean }>>();
const onComplete = vi.fn();

vi.mock('@/shared/components/courses/CodeBlockRenderer', () => ({
  EducationalMarkdownRenderer: ({ text }: { text: string }) => (
    <div data-testid="narrative">{text}</div>
  ),
}));

function renderStep(overrides: Parameters<typeof WalkthroughStep>[0] = {} as never) {
  return render(
    <WalkthroughStep
      stepIndex={0}
      title="Reconnaissance"
      narrative="Start with enumeration."
      mission="Find the open port."
      objectives={['Scan the target', 'Identify the service']}
      evidence={['[+] port 8080 open']}
      reflection="Note what you learned."
      hint="Try nmap."
      isLocked={false}
      isCompleted={false}
      isActive
      flagId="step-1"
      labId="password-lab"
      onFlagSubmit={mockFlagSubmit}
      onComplete={onComplete}
      {...overrides}
    />,
  );
}

beforeEach(() => {
  mockFlagSubmit.mockReset();
  onComplete.mockReset();
});

describe('WalkthroughStep — content rendering', () => {
  it('renders mission, objectives, narrative, evidence and reflection', () => {
    renderStep();
    expect(screen.getByText('Find the open port.')).toBeInTheDocument();
    expect(screen.getByText('Scan the target')).toBeInTheDocument();
    expect(screen.getByText('Identify the service')).toBeInTheDocument();
    expect(screen.getByTestId('narrative')).toHaveTextContent('Start with enumeration.');
    expect(screen.getByText('[+] port 8080 open')).toBeInTheDocument();
    expect(screen.getByText('Note what you learned.')).toBeInTheDocument();
  });
});

describe('WalkthroughStep — flag feedback', () => {
  it('reports a submitted step and shows the completion state on a correct flag', async () => {
    mockFlagSubmit.mockResolvedValue({ correct: true });
    renderStep();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Submit flag'), 'QYVORA-ok');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(mockFlagSubmit).toHaveBeenCalledWith('step-1', 'QYVORA-ok'));
    expect(onComplete).toHaveBeenCalledWith('step-1');
    expect(await screen.findByText('Step completed!')).toBeInTheDocument();
  });

  it('submits on Enter key', async () => {
    mockFlagSubmit.mockResolvedValue({ correct: true });
    renderStep();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Submit flag'), 'QYVORA-flag');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(mockFlagSubmit).toHaveBeenCalledWith('step-1', 'QYVORA-flag'));
  });

  it('shows an error and does not complete on an incorrect flag', async () => {
    mockFlagSubmit.mockResolvedValue({ correct: false });
    renderStep();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Submit flag'), 'QYVORA{wrong}');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Incorrect flag. Try again.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByText('Step completed!')).not.toBeInTheDocument();
  });

  it('handles a failed submission gracefully without completing', async () => {
    mockFlagSubmit.mockRejectedValue(new Error('network'));
    renderStep();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Submit flag'), 'QYVORA{x}');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Submission failed.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('hides the flag input when skipFlag is set', () => {
    renderStep({ skipFlag: true } as never);
    expect(screen.queryByLabelText('Submit flag')).not.toBeInTheDocument();
  });

  it('hides the flag input on an already-completed step', () => {
    renderStep({ isCompleted: true } as never);
    expect(screen.queryByLabelText('Submit flag')).not.toBeInTheDocument();
  });
});

describe('WalkthroughStep — hint reveals', () => {
  it('reveals the single legacy hint on demand', async () => {
    renderStep();
    const user = userEvent.setup();
    expect(screen.queryByText('Try nmap.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Need a hint?' }));
    expect(screen.getByText('Try nmap.')).toBeInTheDocument();
  });

  it('reveals progressive hints one level at a time', async () => {
    const progressiveHints: ProgressiveHintLevel[] = [
      { level: 1, content: 'Think about ports.' },
      { level: 2, content: 'Try nmap -p 8080.' },
    ];
    renderStep({ progressiveHints } as never);
    const user = userEvent.setup();
    expect(screen.queryByText('Think about ports.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Need a hint?' }));
    expect(screen.getByText('Think about ports.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Need another hint?' }));
    expect(screen.getByText('Try nmap -p 8080.')).toBeInTheDocument();
  });
});