/**
 * LAB PROGRESS TRACKING
 * =====================
 * Persists lab scenario completion to localStorage.
 * Key: qyvora_lab_progress → Record<string, LabProgressEntry>
 */

export interface LabProgressEntry {
  completed: boolean;
  completedAt: number;
  hintsUsed: number;
  steps?: string[];
}

const STORAGE_KEY = 'qyvora_lab_progress';

function readAll(): Record<string, LabProgressEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, LabProgressEntry>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markLabCompleted(scenarioId: string, hintsUsed = 0): void {
  const data = readAll();
  const existing = data[scenarioId];
  if (existing?.completed) return; // already completed
  data[scenarioId] = {
    completed: true,
    completedAt: Date.now(),
    hintsUsed,
    steps: existing?.steps ?? [],
  };
  writeAll(data);
}

/**
 * Persist a single step as completed. A scenario is only considered fully
 * complete (via markLabCompleted) once every step has been checked off.
 */
export function markStepCompleted(scenarioId: string, stepId: string): void {
  const data = readAll();
  const entry = data[scenarioId] ?? {
    completed: false,
    completedAt: 0,
    hintsUsed: 0,
    steps: [],
  };
  const steps = new Set(entry.steps ?? []);
  if (steps.has(stepId)) return;
  steps.add(stepId);
  data[scenarioId] = { ...entry, steps: [...steps] };
  writeAll(data);
}

export function getCompletedSteps(scenarioId: string): Set<string> {
  const entry = readAll()[scenarioId];
  return new Set(entry?.steps ?? []);
}

export function getLabProgress(scenarioId: string): LabProgressEntry | null {
  const data = readAll();
  return data[scenarioId] ?? null;
}

export function getAllCompletedLabIds(): Set<string> {
  const data = readAll();
  const ids = new Set<string>();
  for (const [id, entry] of Object.entries(data)) {
    if (entry.completed) ids.add(id);
  }
  return ids;
}

export function isLabCompleted(scenarioId: string): boolean {
  const data = readAll();
  return !!data[scenarioId]?.completed;
}
