/**
 * Unified learning catalogue — ONE learning entity: the Lab.
 *
 * QYVORA no longer separates Courses, Rooms and Labs into competing learning
 * destinations. Every learning experience is a Lab. The Lab `format` is internal
 * metadata that describes how the experience is delivered:
 *
 *   - `content`   — structured lessons, markdown, knowledge checks (former courses)
 *   - `hands-on`  — practical exercises, terminals, flags (former labs/rooms)
 *   - `hybrid`    — theory plus hands-on practice in the same Lab
 *
 * Existing routes are preserved: content Labs keep the `/dashboard/courses/:id`
 * learning page and hands-on Labs keep their `/dashboard/labs/*` walkthroughs.
 * The catalogue only unifies discovery, navigation and terminology.
 */
import { LABS, type LabDef } from '@/features/student/constants/labs';
import type { BootcampConfig } from '@/features/student/constants/bootcampStructure';
import { COURSES } from '@/features/student/data/courses';
import type { Course } from '@/features/student/data/courses/types';
import { LAB_CATALOGUE } from './lab-module-matrix';
export { HACKER_PROTOCOL_BOOTCAMP_ID } from '@/features/student/constants/bootcampIds';

export type LabFormat = 'content' | 'hands-on' | 'hybrid';

export interface UnifiedLab {
  /** Stable id used by progress, saved items and routes. */
  id: string;
  title: string;
  description: string;
  format: LabFormat;
  difficulty?: string;
  route: string;
  accentColor?: string;
  cpReward?: string;
  estimatedMinutes?: number;
  lessonsCount?: number;
  /** Newly published practical Labs (from the lab ↔ module matrix). */
  isNew?: boolean;
  /** Where the underlying content comes from — kept for analytics only. */
  source: 'content' | 'practical' | 'bootcamp';
  tags: string[];
  phaseId?: string;
  phaseTitle?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
}

export interface BootcampCatalogueCourse {
  modules?: Array<{
    moduleId: number;
    locked?: boolean;
    rooms?: Array<{
      title: string;
      locked?: boolean;
      completed?: boolean;
      cpReward?: number;
    }>;
  }>;
}

export const LAB_FORMAT_LABELS: Record<LabFormat, string> = {
  content: 'Content Lab',
  'hands-on': 'Hands-on Lab',
  hybrid: 'Hybrid Lab',
};

export const LAB_FORMAT_SHORT_LABELS: Record<LabFormat, string> = {
  content: 'Content',
  'hands-on': 'Hands-on',
  hybrid: 'Hybrid',
};

const labStatusById = new Map(LAB_CATALOGUE.map((entry) => [entry.labId, entry.status]));

const formatForCourse = (course: Course): LabFormat =>
  course.lessons.some((lesson) => lesson.hasTerminal || lesson.hasCodePlayground)
    ? 'hybrid'
    : 'content';

export const CONTENT_LABS: UnifiedLab[] = COURSES.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.overview || course.description,
  format: formatForCourse(course),
  difficulty: course.skillLevel,
  route: `/dashboard/courses/${course.id}`,
  estimatedMinutes: course.estimatedMinutes,
  lessonsCount: course.lessons.length,
  source: 'content',
  tags: [course.categoryId],
}));

export const PRACTICAL_LABS: UnifiedLab[] = LABS.map((lab: LabDef) => ({
  id: lab.id,
  title: lab.title,
  description: lab.desc,
  format: 'hands-on',
  difficulty: lab.difficulty,
  route: lab.route,
  accentColor: lab.accentColor,
  cpReward: lab.cpReward,
  isNew: labStatusById.get(lab.id) === 'new',
  source: 'practical',
  tags: ['hands-on'],
}));

export const UNIFIED_LABS: UnifiedLab[] = [...PRACTICAL_LABS, ...CONTENT_LABS];

export const buildBootcampRoomLabs = (
  config: BootcampConfig,
  bootcampId: string,
  course?: BootcampCatalogueCourse,
): UnifiedLab[] =>
  config.phases.flatMap((phase, phaseIndex) => {
    const module = course?.modules?.find((item) => item.moduleId === phaseIndex + 1);

    return phase.rooms.map((room) => {
      const apiRoom = module?.rooms?.find(
        (item) => item.title.trim().toLowerCase() === room.title.trim().toLowerCase(),
      );

      return {
        id: `${config.id}:${phase.id}:${room.id}`,
        title: room.title,
        description: room.overview,
        format: 'hybrid',
        route: `/dashboard/bootcamps/${bootcampId}/phases/${phase.id}/rooms/${room.id}`,
        cpReward: apiRoom?.cpReward === undefined ? undefined : String(apiRoom.cpReward),
        estimatedMinutes: room.estimatedMinutes,
        lessonsCount: room.steps.length,
        source: 'bootcamp',
        tags: [phase.codename, phase.title],
        phaseId: phase.id,
        phaseTitle: phase.title,
        isLocked: !module || !apiRoom || Boolean(module.locked || apiRoom.locked),
        isCompleted: Boolean(apiRoom?.completed),
      };
    });
  });

export const getUnifiedLabById = (id: string): UnifiedLab | undefined =>
  UNIFIED_LABS.find((lab) => lab.id === id);

/** Recommended = foundational content/hybrid Labs that teach a topic end to end. */
export const getRecommendedLabs = (limit?: number): UnifiedLab[] => {
  const recommended = CONTENT_LABS.filter((lab) => lab.format !== 'hands-on');
  return typeof limit === 'number' ? recommended.slice(0, limit) : recommended;
};

/** New = recently published practical Labs from the QOSE lab matrix. */
export const getNewLabs = (limit?: number): UnifiedLab[] => {
  const fresh = PRACTICAL_LABS.filter((lab) => lab.isNew);
  return typeof limit === 'number' ? fresh.slice(0, limit) : fresh;
};

export const getLabsByFormat = (format: LabFormat): UnifiedLab[] =>
  UNIFIED_LABS.filter((lab) => lab.format === format);
