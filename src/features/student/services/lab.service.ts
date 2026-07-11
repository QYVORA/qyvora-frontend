/**
 * Lab Flag Verification Service
 *
 * Flags are stored server-side only. The frontend sends the user's
 * attempted flag to the backend for validation. No flag values are
 * ever exposed in the client-side JavaScript bundle.
 */
import api from '../../../core/services/api';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FlagVerificationResult {
  correct: boolean;
  message: string;
}

// ─── API calls ──────────────────────────────────────────────────────────────

/**
 * Verify a lab flag against the backend.
 *
 * @param labId      - The lab identifier (e.g., 'privesc', 'passwords')
 * @param scenarioId - The scenario/exercise identifier (e.g., 'privesc-001')
 * @param flag       - The flag string the user entered
 * @returns Verification result with correct status and message
 */
export const verifyLabFlag = async (
  labId: string,
  scenarioId: string,
  flag: string
): Promise<FlagVerificationResult> => {
  try {
    const { data } = await api.post('/student/labs/verify-flag', {
      labId,
      scenarioId,
      flag: flag.trim(),
    });
    return data;
  } catch {
    return {
      correct: false,
      message: 'Failed to verify flag. Please try again.',
    };
  }
};
