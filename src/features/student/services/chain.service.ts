/**
 * HSOCIETY CHAIN — Frontend service
 * Fetches chain history through the backend proxy.
 * The frontend never calls the chain directly.
 */
import api from '../../../core/services/api';

export interface ChainBlock {
  index: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  validator: string;
  data: {
    type: 'ROOM_COMPLETED' | 'MODULE_COMPLETED' | 'CP_REWARD' | 'CERTIFICATION_ISSUED' | 'USER_ACTIVITY_LOG';
    userId: string;
    bootcampId: string;
    moduleId: string | null;
    roomId: string | null;
    cpPoints: number | null;
    metadata: Record<string, unknown>;
  };
}

export const getChainHistory = async (): Promise<ChainBlock[]> => {
  try {
    const { data } = await api.get('/student/chain-history');
    return Array.isArray(data.history) ? data.history : [];
  } catch {
    return [];
  }
};

export const CHAIN_EVENT_LABELS: Record<string, string> = {
  ROOM_COMPLETED:       'Room Completed',
  MODULE_COMPLETED:     'Module Completed',
  CP_REWARD:            'CP Reward',
  CERTIFICATION_ISSUED: 'Certification Issued',
  USER_ACTIVITY_LOG:    'Activity',
};
