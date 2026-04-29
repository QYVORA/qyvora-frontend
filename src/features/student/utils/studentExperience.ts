import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';

const DATA_SAVER_KEY = 'hs_data_saver_v1';
const DAILY_MISSION_KEY = 'hs_daily_mission_v1';
const LAST_SYNC_KEY = 'hs_last_sync_v1';

export type OverviewModule = {
  id?: string | number;
  bootcampId?: string | number;
  moduleId?: string | number;
  title?: string;
  progress?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
};

export function getDataSaverEnabled(): boolean {
  try {
    return localStorage.getItem(DATA_SAVER_KEY) === '1';
  } catch {
    return false;
  }
}

export function setDataSaverEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(DATA_SAVER_KEY, enabled ? '1' : '0');
  } catch {
    // ignore storage failures
  }
}

export function getBootcampProgressMap(overview: any): Map<string, OverviewModule> {
  const map = new Map<string, OverviewModule>();
  const mods = Array.isArray(overview?.modules) ? overview.modules : [];
  mods.forEach((m: OverviewModule) => {
    const key = String(m.bootcampId || m.id || '');
    if (key) map.set(key, m);
  });
  if (
    overview?.bootcampStatus &&
    overview.bootcampStatus !== 'not_enrolled' &&
    overview?.bootcampId
  ) {
    const key = String(overview.bootcampId);
    if (!map.has(key)) map.set(key, { bootcampId: key, progress: 0 });
  }
  return map;
}

export function getEnrolledIds(overview: any): Set<string> {
  return new Set([...getBootcampProgressMap(overview).keys()]);
}

export function resolveNextRoomPath(bootcampId: string): string | null {
  if (!bootcampId) return null;
  const done = getCompletedRoomSet(bootcampId);

  for (const phase of BOOTCAMP_CONFIG.phases) {
    for (const room of phase.rooms) {
      const key = `${phase.id}:${room.id}`;
      if (!done.has(key)) {
        return `/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`;
      }
    }
  }

  const first = BOOTCAMP_CONFIG.phases[0]?.rooms[0];
  if (!first) return null;
  return `/bootcamps/${bootcampId}/phases/${BOOTCAMP_CONFIG.phases[0].id}/rooms/${first.id}`;
}

function getCompletedRoomSet(bootcampId: string): Set<string> {
  try {
    const raw = localStorage.getItem(`hpb_completed_${bootcampId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

export function getDailyMission(bootcampId?: string): { date: string; text: string; completed: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const missions = [
    'Complete 1 room step and take notes.',
    'Review one previous room and summarize 3 lessons.',
    'Run one command from today\'s lesson in your terminal.',
    'Teach one concept to a squad member on WhatsApp.',
    'Complete one room and mark one blocker you faced.',
  ];

  try {
    const raw = localStorage.getItem(DAILY_MISSION_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { date: string; text: string; completed: boolean };
      if (saved.date === today) return saved;
    }
    const seed = Number(String(bootcampId || '0').replace(/\D/g, '')) || 1;
    const pick = missions[(seed + Number(today.slice(-2))) % missions.length];
    const created = { date: today, text: pick, completed: false };
    localStorage.setItem(DAILY_MISSION_KEY, JSON.stringify(created));
    return created;
  } catch {
    return { date: today, text: missions[0], completed: false };
  }
}

export function completeDailyMission(): { date: string; text: string; completed: boolean } {
  const current = getDailyMission();
  const next = { ...current, completed: true };
  try {
    localStorage.setItem(DAILY_MISSION_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }
  return next;
}

export function setLastSyncNow(scope: string): string {
  const value = new Date().toISOString();
  try {
    localStorage.setItem(`${LAST_SYNC_KEY}:${scope}`, value);
  } catch {
    // ignore
  }
  return value;
}

export function getLastSync(scope: string): string | null {
  try {
    return localStorage.getItem(`${LAST_SYNC_KEY}:${scope}`);
  } catch {
    return null;
  }
}

export function formatSyncLabel(value: string | null): string {
  if (!value) return 'Not synced yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not synced yet';
  return `Last synced ${date.toLocaleString()}`;
}
