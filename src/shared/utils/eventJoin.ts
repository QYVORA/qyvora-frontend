const STORAGE_KEY = 'qyvora_pending_event_join';

interface PendingJoin {
  eventId: string;
  timestamp: number;
}

export function setPendingEventJoin(eventId: string): void {
  try {
    const data: PendingJoin = { eventId, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable
  }
}

export function getPendingEventJoin(): PendingJoin | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingJoin;
    if (!parsed.eventId) return null;
    // Expire after 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      clearPendingEventJoin();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingEventJoin(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable
  }
}
