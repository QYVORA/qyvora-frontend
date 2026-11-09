/**
 * Breadcrumb builders - Create breadcrumb trails for learning pages
 */

import type { BreadcrumbItem } from '@/shared/components/ui/Breadcrumb';
import type { LearningContext } from '@/shared/types/learning';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { getCourseById } from '@/features/student/data/courses';

/**
 * Build breadcrumbs for bootcamp room pages
 * Format: Hacker Protocol Bootcamp > Phase 1: Reconnaissance > Room 2: OSINT
 */
export function buildBootcampBreadcrumbs(
  context: LearningContext & { type: 'bootcamp' }
): BreadcrumbItem[] {
  const { bootcampId, phaseId, roomId } = context;
  
  const phase = BOOTCAMP_CONFIG.phases.find(p => p.id === phaseId);
  const room = phase?.rooms.find(r => r.id === roomId);
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'HPB',
      href: `/dashboard/bootcamps/${bootcampId}`,
    },
  ];
  
  if (phase) {
    breadcrumbs.push({
      label: phase.title,
      href: `/dashboard/bootcamps/${bootcampId}#${phaseId}`,
    });
  }
  
  if (room) {
    breadcrumbs.push({
      label: room.title,
      // Current page - no href
    });
  }
  
  return breadcrumbs;
}

/**
 * Build breadcrumbs for course lesson pages
 * Format: Course Title > Lesson 3: Title
 */
export function buildCourseBreadcrumbs(
  context: LearningContext & { type: 'course' }
): BreadcrumbItem[] {
  const { courseId, currentLessonIdx = 0 } = context;
  
  const course = getCourseById(courseId);
  
  if (!course) {
    return [{ label: 'Lab' }];
  }
  
  const currentLesson = course.lessons[currentLessonIdx];
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: course.title,
      href: '/dashboard/labs',
    },
  ];
  
  if (currentLesson) {
    breadcrumbs.push({
      label: currentLesson.title,
      // Current page - no href
    });
  }
  
  return breadcrumbs;
}

/**
 * Build breadcrumbs for lab pages
 * Format: Attack Labs > SQL Injection Lab
 */
export function buildLabBreadcrumbs(
  context: LearningContext & { type: 'lab' }
): BreadcrumbItem[] {
  return [
    {
      label: 'Attack Labs',
      href: '/dashboard/labs',
    },
    {
      label: context.title,
      // Current page - no href
    },
  ];
}

/**
 * Build breadcrumbs from learning context
 */
export function buildLearningBreadcrumbs(context: LearningContext): BreadcrumbItem[] {
  switch (context.type) {
    case 'bootcamp':
      return buildBootcampBreadcrumbs(context as LearningContext & { type: 'bootcamp' });
    case 'course':
      return buildCourseBreadcrumbs(context as LearningContext & { type: 'course' });
    case 'lab':
      return buildLabBreadcrumbs(context as LearningContext & { type: 'lab' });
    default:
      return [];
  }
}
