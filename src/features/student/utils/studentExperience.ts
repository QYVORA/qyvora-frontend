import { BOOTCAMP_CONFIG } from '../constants/bootcampConfig';

const DATA_SAVER_KEY = 'hs_data_saver_v1';
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

export function resolveNextRoomPath(bootcampId: string, apiCourse?: any): string | null {
  if (!bootcampId) return null;
  
  // Build completed rooms set from API course data if provided
  const done = new Set<string>();
  if (apiCourse?.modules) {
    apiCourse.modules.forEach((mod: any) => {
      // Find matching phase by title
      const matchPhase = BOOTCAMP_CONFIG.phases.find(
        (p) => p.title.toLowerCase() === (mod.title || '').toLowerCase()
      );
      if (matchPhase) {
        (mod.rooms || []).forEach((apiRoom: any) => {
          if (apiRoom.completed) {
            const matchRoom = matchPhase.rooms.find(
              (r) => r.title.toLowerCase() === (apiRoom.title || '').toLowerCase()
            );
            if (matchRoom) {
              done.add(`${matchPhase.id}:${matchRoom.id}`);
            }
          }
        });
      }
    });
  }

  // Find first incomplete room
  for (const phase of BOOTCAMP_CONFIG.phases) {
    for (const room of phase.rooms) {
      const key = `${phase.id}:${room.id}`;
      if (!done.has(key)) {
        return `/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`;
      }
    }
  }

  // All rooms completed or no API data provided, return first room
  const first = BOOTCAMP_CONFIG.phases[0]?.rooms[0];
  if (!first) return null;
  return `/dashboard/bootcamps/${bootcampId}/phases/${BOOTCAMP_CONFIG.phases[0].id}/rooms/${first.id}`;
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
