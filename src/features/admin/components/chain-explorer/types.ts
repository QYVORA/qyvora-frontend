export interface ChainBlock {
  index: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  validator: string;
  data: {
    type: string;
    userId: string;
    bootcampId: string;
    moduleId: string | null;
    roomId: string | null;
    cpPoints: number | null;
    metadata: Record<string, unknown>;
  };
}

export interface ChainStats {
  totalBlocks: number;
  lastBlockHash: string;
  eventBreakdown: Record<string, number>;
}

export interface ValidateResult {
  valid: boolean;
  length: number;
  errors: string[];
}

export const EVENT_COLORS: Record<string, string> = {
  ROOM_COMPLETED:    'text-accent border-accent/30 bg-accent/10',
  MODULE_COMPLETED:  'text-accent border-accent/30 bg-accent/10',
  CP_REWARD:         'text-accent border-accent/30 bg-accent/10',
  USER_ACTIVITY_LOG: 'text-text-muted border-border bg-bg',
};

export const EVENT_LABELS: Record<string, string> = {
  ROOM_COMPLETED:    'Room Completed',
  MODULE_COMPLETED:  'Module Completed',
  CP_REWARD:         'CP Reward',
  USER_ACTIVITY_LOG: 'Activity Log',
};

export const shortHash = (h: string) => `${h.slice(0, 8)}…${h.slice(-6)}`;
