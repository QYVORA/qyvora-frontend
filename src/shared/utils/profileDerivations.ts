import type { ProfileData, Trophy, ActivityEvent } from '@/shared/types/profile';

/**
 * Derives trophies from available profile data.
 * Trophy tiers are based on milestones.
 */
export function deriveTrophies(profile: ProfileData): Trophy[] {
  const trophies: Trophy[] = [];

  if (profile.bootcampCompleted) {
    trophies.push({
      id: 'hpb-graduate',
      title: 'HPB Graduate',
      description: 'Completed the Hacker Protocol Bootcamp',
      tier: 'gold',
      earnedAt: undefined,
    });
  }

  if (profile.labsCompleted >= 50) {
    trophies.push({
      id: 'lab-master',
      title: 'Lab Master',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'platinum',
    });
  } else if (profile.labsCompleted >= 20) {
    trophies.push({
      id: 'lab-expert',
      title: 'Lab Expert',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'gold',
    });
  } else if (profile.labsCompleted >= 10) {
    trophies.push({
      id: 'lab-operator',
      title: 'Lab Operator',
      description: `${profile.labsCompleted} labs completed`,
      tier: 'silver',
    });
  } else if (profile.labsCompleted >= 1) {
    trophies.push({
      id: 'first-lab',
      title: 'First Lab',
      description: 'Completed first lab',
      tier: 'bronze',
    });
  }

  if (profile.coursesCompleted >= 5) {
    trophies.push({
      id: 'scholar',
      title: 'Scholar',
      description: `${profile.coursesCompleted} courses completed`,
      tier: 'platinum',
    });
  } else if (profile.coursesCompleted >= 2) {
    trophies.push({
      id: 'course-graduate',
      title: 'Course Graduate',
      description: `${profile.coursesCompleted} courses completed`,
      tier: 'silver',
    });
  } else if (profile.coursesCompleted >= 1) {
    trophies.push({
      id: 'first-course',
      title: 'First Course',
      description: 'Completed first course',
      tier: 'bronze',
    });
  }

  // Progression rank trophy — driven by the backend (ProfileData.progression),
  // never by client-side CP thresholds or hardcoded rank names. The rank name
  // and points come straight from the server response.
  const progression = profile.progression;
  if (progression && progression.points > 0 && progression.rank) {
    trophies.push({
      id: `rank-${progression.tierId || 'tier'}`,
      title: progression.rank,
      description: `${progression.points.toLocaleString()} Progression Points`,
      tier: 'gold',
      earnedAt: undefined,
    });
  }

  return trophies;
}

/**
 * Derives recent activity events from available profile data.
 * Since the backend doesn't have a dedicated activity feed endpoint,
 * we synthesize events from rooms completed, bootcamp status, etc.
 */
export function deriveActivityEvents(profile: ProfileData): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  // Completed rooms → lab events
  if (profile.completedRooms.length > 0) {
    const recent = profile.completedRooms.slice(-5).reverse();
    recent.forEach((room, i) => {
      events.push({
        id: `room-${room.roomId}`,
        type: 'lab_completed',
        title: room.title,
        description: 'Lab completed',
        timestamp: new Date(Date.now() - i * 86400000 * (i + 1)).toISOString(),
      });
    });
  }

  // Bootcamp completed
  if (profile.bootcampCompleted) {
    events.push({
      id: 'bootcamp-done',
      type: 'bootcamp_completed',
      title: 'Hacker Protocol Bootcamp',
      description: 'Graduated from HPB',
      timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    });
  }

  // Courses completed
  if (profile.coursesCompleted > 0) {
    events.push({
      id: 'courses-done',
      type: 'course_completed',
      title: `${profile.coursesCompleted} course${profile.coursesCompleted !== 1 ? 's' : ''} completed`,
      description: 'Course milestone reached',
      timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
    });
  }

  // Sort by timestamp descending
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return events.slice(0, 10);
}
