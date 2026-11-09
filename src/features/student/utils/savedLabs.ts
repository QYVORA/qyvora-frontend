/**
 * Local "saved Labs" store.
 *
 * There is no server-side bookmark API yet, so saved Labs are persisted in the
 * browser. This is a genuine local preference (not mock content) and never
 * implies a backend write. A window event keeps every mounted dashboard card in
 * sync when a Lab is saved or removed.
 */
const SAVED_KEY = 'qyvora_saved_labs';
export const SAVED_LABS_EVENT = 'qyvora:saved-labs-changed';

export function getSavedLabIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SAVED_LABS_EVENT));
  }
}

export function toggleSavedLab(id: string): boolean {
  const current = new Set(getSavedLabIds());
  const nowSaved = !current.has(id);
  if (nowSaved) current.add(id);
  else current.delete(id);
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // Storage can be unavailable in private mode — the UI still reflects intent.
  }
  emitChange();
  return nowSaved;
}

export function isLabSaved(id: string): boolean {
  return getSavedLabIds().includes(id);
}

const RECENT_KEY = 'qyvora_recent_labs';
export const RECENT_LABS_EVENT = 'qyvora:recent-labs-changed';

export function getRecentLabIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function markLabRecent(id: string): void {
  if (!id) return;
  const next = [id, ...getRecentLabIds().filter((entry) => entry !== id)].slice(0, 12);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(RECENT_LABS_EVENT));
  }
}

const COURSE_PROGRESS_KEY = 'qyvora_course_progress';

/** Reads the local content-Lab progress percentage (0–100). */
export function getContentLabProgress(labId: string, totalLessons: number): number {
  if (!totalLessons) return 0;
  try {
    const raw = localStorage.getItem(`${COURSE_PROGRESS_KEY}_${labId}`);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const completed = Array.isArray(parsed?.completedLessons) ? parsed.completedLessons.length : 0;
    return Math.min(100, Math.round((completed / totalLessons) * 100));
  } catch {
    return 0;
  }
}
