/**
 * chainService.ts
 *
 * Frontend service layer for reading data from the HSOCIETY CHAIN blockchain.
 *
 * Architecture decision — proxy pattern:
 *   The frontend never calls the chain node directly. All chain reads go
 *   through the backend REST API (/student/chain-history), which acts as a
 *   proxy. This means:
 *     - The chain node's internal URL is never exposed to the browser.
 *     - Authentication and authorisation are enforced by the backend before
 *       any chain data is returned to the client.
 *     - The frontend cannot be used to probe or enumerate the chain directly.
 */
import api from '../../../core/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Represents a single block on the HSOCIETY CHAIN as returned by the
 * backend proxy. Fields mirror the chain's block structure exactly so the
 * frontend can render chain history without any further transformation.
 */
export interface ChainBlock {
  /** Sequential block number starting from 0 (genesis block). */
  index: number;

  /** ISO 8601 timestamp of when the block was sealed by the validator. */
  timestamp: string;

  /** SHA-256 hash of this block's contents. Uniquely identifies the block. */
  hash: string;

  /**
   * Hash of the immediately preceding block. Linking blocks by hash is the
   * core mechanism that makes the chain tamper-evident — altering any block
   * would invalidate all hashes that follow it.
   */
  previousHash: string;

  /**
   * Identifier of the node (validator) that produced this block.
   * In the Proof-of-Authority model used by HSOCIETY CHAIN, only
   * pre-approved validators may seal blocks.
   */
  validator: string;

  /**
   * The payload recorded on-chain for this event.
   * Each block stores exactly one event; the `type` field drives how the
   * UI labels and renders the block in the chain history view.
   */
  data: {
    /**
     * The category of on-chain event:
     *   ROOM_COMPLETED    — A student finished a bootcamp room.
     *   MODULE_COMPLETED  — A student completed a full module.
     *   CP_REWARD         — Cyber Points were awarded to a student.
     *   USER_ACTIVITY_LOG — A general activity event (catch-all).
     */
    type: 'ROOM_COMPLETED' | 'MODULE_COMPLETED' | 'CP_REWARD' | 'USER_ACTIVITY_LOG';

    /** The platform user ID the event belongs to. */
    userId: string;

    /** The bootcamp the event occurred within. */
    bootcampId: string;

    /** The module the event occurred within, if applicable. Null for account-level events. */
    moduleId: string | null;

    /** The specific room the event occurred within, if applicable. Null for module-level events. */
    roomId: string | null;

    /**
     * The number of Cyber Points associated with this event.
     * Null for event types that do not award CP (e.g. USER_ACTIVITY_LOG).
     */
    cpPoints: number | null;

    /**
     * Arbitrary additional data specific to the event type.
     * Typed as a generic record because the shape varies per event type —
     * consumers should treat this as opaque unless they know the event type.
     */
    metadata: Record<string, unknown>;
  };
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetches the full chain history for the authenticated student.
 *
 * The backend proxy handles pagination and filtering; the frontend receives
 * the pre-shaped array directly.
 *
 * Error handling:
 *   Returns an empty array on any failure (network error, non-2xx response,
 *   unexpected payload shape). The chain history view is non-critical — a
 *   failure should degrade gracefully rather than crash the dashboard.
 *
 * Shape guard:
 *   `Array.isArray(data.history)` ensures a malformed response (e.g. the
 *   backend returns null or an object) never causes a downstream `.map()` crash.
 */
export const getChainHistory = async (): Promise<ChainBlock[]> => {
  try {
    const { data } = await api.get('/student/chain-history');
    return Array.isArray(data.history) ? data.history : [];
  } catch {
    // All errors are intentionally swallowed. Chain history is read-only
    // supplementary data — the student dashboard must still load even if the
    // chain service or its backend proxy is temporarily unavailable.
    return [];
  }
};

// ─── Display helpers ──────────────────────────────────────────────────────────

/**
 * Maps raw on-chain event type strings to the human-readable labels
 * shown in the UI (e.g. in the chain history feed).
 *
 * Kept as a plain object rather than an enum so it can be used directly
 * in JSX without an additional lookup function.
 *
 * If a new event type is added to the chain, add its label here to prevent
 * the UI from displaying the raw type string to students.
 */
export const CHAIN_EVENT_LABELS: Record<string, string> = {
  ROOM_COMPLETED:    'Room Completed',
  MODULE_COMPLETED:  'Module Completed',
  CP_REWARD:         'CP Reward',
  USER_ACTIVITY_LOG: 'Activity',
};