import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/features/student/services/lab.service', () => ({
  verifyLabFlag: vi.fn(),
}));

import { verifyLabFlag } from '@/features/student/services/lab.service';
import useLabScenario from '../useLabScenario';
import { WEB_ACCESS_CONTROL_SCENARIOS } from '@/features/student/data/simulations';
import type { WebLabScenario } from '@/features/student/data/simulations';

const scenario: WebLabScenario = WEB_ACCESS_CONTROL_SCENARIOS[0];

const setup = () =>
  renderHook(() =>
    useLabScenario<WebLabScenario>({
      labId: 'web-access-control',
      getScenarioId: (s) => s.id,
      getStepIds: (s) => s.steps.map((_, i) => `${s.id}-step-${i}`),
    })
  );

const readProgress = (id: string) => JSON.parse(localStorage.getItem('qyvora_lab_progress') || '{}')[id];

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('EX-BC-005 — new lab scenario completion is recorded', () => {
  it('marks every step and the scenario complete when flags are correct', async () => {
    vi.mocked(verifyLabFlag).mockResolvedValue({ correct: true, message: 'ok' });
    const { result } = setup();

    act(() => {
      result.current.startScenario(scenario);
    });

    for (let i = 0; i < scenario.steps.length; i++) {
      await act(async () => {
        await result.current.handleFlagSubmit(`${scenario.id}-step-${i}`, 'FLAG{x}');
      });
    }

    expect(result.current.allDone).toBe(true);
    expect(vi.mocked(verifyLabFlag)).toHaveBeenCalledTimes(scenario.steps.length);
    expect(vi.mocked(verifyLabFlag)).toHaveBeenCalledWith('web-access-control', scenario.id, 'FLAG{x}');
    expect(readProgress(scenario.id).completed).toBe(true);
  });

  it('does not complete the scenario when a flag is wrong', async () => {
    vi.mocked(verifyLabFlag).mockResolvedValue({ correct: false, message: 'nope' });
    const { result } = setup();

    act(() => {
      result.current.startScenario(scenario);
    });

    await act(async () => {
      await result.current.handleFlagSubmit(`${scenario.id}-step-0`, 'FLAG{wrong}');
    });

    expect(result.current.allDone).toBe(false);
    expect(readProgress(scenario.id)?.completed ?? false).toBe(false);
  });
});
