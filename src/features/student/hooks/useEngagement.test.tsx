import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useEngagement from './useEngagement';

const api = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('@/core/services/api', () => ({ default: api }));

describe('useEngagement', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.get.mockRejectedValue(new Error('Request failed'));
  });

  it('exposes request failures instead of returning a successful empty mission state', async () => {
    const { result } = renderHook(() => useEngagement());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
