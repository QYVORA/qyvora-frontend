/**
 * Shared types for the learning system redesign.
 * These types support the documentation-style navigation architecture.
 */

export type LearningItemStatus = 'locked' | 'upcoming' | 'active' | 'completed';

export interface CurriculumItem {
  id: string;
  number: number;
  title: string;
  type: 'section' | 'item';
  status: LearningItemStatus;
  href: string;
  children?: CurriculumItem[];
}

export interface LearningContext {
  type: 'bootcamp' | 'course' | 'lab';
  title: string;
  curriculum: CurriculumItem[];
  exitPath: string;
  // Type-specific data
  bootcampId?: string;
  phaseId?: string;
  roomId?: string;
  courseId?: string;
  currentLessonIdx?: number;
  labType?: string;
  currentScenarioIdx?: number;
}

export interface BreadcrumbSegment {
  label: string;
  href?: string; // undefined = current page (not clickable)
}
