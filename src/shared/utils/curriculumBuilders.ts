/**
 * Curriculum builders - Transform learning data into curriculum tree structures
 * for the documentation-style navigation system.
 */

import type { CurriculumItem, LearningItemStatus } from '@/shared/types/learning';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { getCourseById } from '@/features/student/data/courses';

/**
 * Build bootcamp curriculum tree structure.
 * Groups rooms by phase, shows completion and lock status.
 */
export function buildBootcampCurriculum(
  bootcampId: string,
  currentPhaseId: string,
  currentRoomId: string
): CurriculumItem[] {
  // TODO: Fetch API data for completion status
  // For now, use static config with placeholder status logic
  
  return BOOTCAMP_CONFIG.phases.map((phase, phaseIdx) => {
    const isCurrentPhase = phase.id === currentPhaseId;
    
    const children: CurriculumItem[] = phase.rooms.map((room, roomIdx) => {
      const isCurrentRoom = room.id === currentRoomId && isCurrentPhase;
      
      // Status logic (simplified - will integrate with API data)
      let status: LearningItemStatus = 'upcoming';
      if (isCurrentRoom) {
        status = 'active';
      } else if (phaseIdx === 0 && roomIdx < phase.rooms.findIndex(r => r.id === currentRoomId)) {
        status = 'completed';
      }
      // Rooms in future phases are locked
      if (phaseIdx > BOOTCAMP_CONFIG.phases.findIndex(p => p.id === currentPhaseId)) {
        status = 'locked';
      }

      return {
        id: room.id,
        number: roomIdx + 1,
        title: room.title,
        type: 'item',
        status,
        href: `/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`,
      };
    });

    // Section status based on children
    let sectionStatus: LearningItemStatus = 'upcoming';
    if (isCurrentPhase) {
      sectionStatus = 'active';
    } else if (phaseIdx < BOOTCAMP_CONFIG.phases.findIndex(p => p.id === currentPhaseId)) {
      sectionStatus = 'completed';
    } else if (phaseIdx > BOOTCAMP_CONFIG.phases.findIndex(p => p.id === currentPhaseId)) {
      sectionStatus = 'locked';
    }

    return {
      id: phase.id,
      number: phaseIdx + 1,
      title: phase.title,
      type: 'section',
      status: sectionStatus,
      href: '#',
      children,
    };
  });
}

/**
 * Build course curriculum tree structure.
 * Simple flat list of lessons with completion status.
 */
export function buildCourseCurriculum(
  courseId: string,
  currentLessonIdx: number
): CurriculumItem[] {
  const course = getCourseById(courseId);
  
  if (!course) return [];

  // Get completed lessons from localStorage
  const storageKey = `qyvora_course_progress_${courseId}`;
  let completedLessons = new Set<string>();
  
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      completedLessons = new Set(parsed.completedLessons || []);
    }
  } catch {
    // Ignore storage errors
  }

  return course.lessons.map((lesson, idx) => {
    let status: LearningItemStatus = 'upcoming';
    
    if (idx === currentLessonIdx) {
      status = 'active';
    } else if (completedLessons.has(lesson.id)) {
      status = 'completed';
    } else if (idx < currentLessonIdx) {
      status = 'completed';
    }

    return {
      id: lesson.id,
      number: idx + 1,
      title: lesson.title,
      type: 'item',
      status,
      href: `/dashboard/courses/${courseId}?lesson=${idx}`,
    };
  });
}

/**
 * Build lab curriculum tree structure.
 * Simple flat list of scenarios with completion status.
 */
export function buildLabCurriculum(
  labType: string,
  currentScenarioIdx: number
): CurriculumItem[] {
  // TODO: Integrate with actual lab scenario data
  // For now, return placeholder structure
  
  // This is a simplified version - actual implementation will pull from
  // src/features/student/data/simulations/ based on labType
  
  const scenarioCount = getLabScenarioCount(labType);
  
  return Array.from({ length: scenarioCount }, (_, idx) => {
    let status: LearningItemStatus = 'upcoming';
    
    if (idx === currentScenarioIdx) {
      status = 'active';
    } else if (idx < currentScenarioIdx) {
      status = 'completed';
    }

    return {
      id: `scenario-${idx}`,
      number: idx + 1,
      title: `Scenario ${idx + 1}`,
      type: 'item',
      status,
      href: `/dashboard/labs/${labType}?scenario=${idx}`,
    };
  });
}

/**
 * Helper to get scenario count for a lab type.
 * TODO: Replace with actual scenario data lookup.
 */
function getLabScenarioCount(labType: string): number {
  // Placeholder counts - will be replaced with actual data
  const counts: Record<string, number> = {
    'privesc': 5,
    'passwords': 4,
    'sql-injection': 6,
    'osint': 4,
    'kill-chain': 8,
    'web-access-control': 5,
    'api-security': 5,
    'automation': 3,
    'methodology': 4,
    'network-security': 6,
    'wlan-security': 5,
    'ad-enum': 6,
  };
  
  return counts[labType] || 3;
}
