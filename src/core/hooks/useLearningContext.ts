import { useMemo } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import type { LearningContext } from '@/shared/types/learning';
import { buildBootcampCurriculum, buildCourseCurriculum, buildLabCurriculum } from '@/shared/utils/curriculumBuilders';
import { getCourseById } from '@/features/student/data/courses';

/**
 * useLearningContext - Detects if the current route is a learning page
 * and provides the appropriate curriculum navigation structure.
 * 
 * Returns null when not on a learning page (dashboard, settings, etc.)
 * Returns LearningContext when on bootcamp room, course lesson, or lab page.
 * 
 * This hook is used by StudentSidebar to switch between dashboard and learning modes.
 */
export function useLearningContext(): LearningContext | null {
  const { pathname } = useLocation();
  const params = useParams<{
    bootcampId?: string;
    phaseId?: string;
    moduleId?: string;
    roomId?: string;
    courseId?: string;
    labType?: string;
  }>();
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    // ──────────────────────────────────────────────────────────────
    // BOOTCAMP ROOM DETECTION
    // ──────────────────────────────────────────────────────────────
    // Match: /dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId
    const bootcampMatch = pathname.match(/\/dashboard\/bootcamps\/([^/]+)\/phases\/([^/]+)\/rooms\/([^/]+)/);
    
    // Legacy route: /dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId
    const bootcampLegacyMatch = pathname.match(/\/dashboard\/bootcamps\/([^/]+)\/modules\/([^/]+)\/rooms\/([^/]+)/);
    
    if (bootcampMatch || bootcampLegacyMatch) {
      const match = bootcampMatch || bootcampLegacyMatch;
      if (!match) return null;
      
      const bootcampId = params.bootcampId || match[1];
      const phaseId = params.phaseId || (params.moduleId ? `phase${params.moduleId}` : match[2]);
      const roomId = params.roomId || match[3];
      
      if (!bootcampId || !phaseId || !roomId) return null;

      return {
        type: 'bootcamp',
        bootcampId,
        phaseId,
        roomId,
        title: 'Hacker Protocol Bootcamp',
        curriculum: buildBootcampCurriculum(bootcampId, phaseId, roomId),
        exitPath: `/dashboard/bootcamps/${bootcampId}`,
      };
    }

    // ──────────────────────────────────────────────────────────────
    // COURSE LESSON DETECTION
    // ──────────────────────────────────────────────────────────────
    // Match: /dashboard/courses/:courseId
    const courseMatch = pathname.match(/\/dashboard\/courses\/([^/]+)/);
    
    if (courseMatch && params.courseId) {
      const courseId = params.courseId;
      const course = getCourseById(courseId);
      
      if (!course) return null;
      
      // Get current lesson from ?lesson=N query param
      const lessonParam = searchParams.get('lesson');
      const currentLessonIdx = lessonParam ? Math.max(0, parseInt(lessonParam, 10) || 0) : 0;

      return {
        type: 'course',
        courseId,
        currentLessonIdx,
        title: course.title,
        curriculum: buildCourseCurriculum(courseId, currentLessonIdx),
        exitPath: '/dashboard/labs',
      };
    }

    // ──────────────────────────────────────────────────────────────
    // LAB DETECTION
    // ──────────────────────────────────────────────────────────────
    // Match: /dashboard/labs/:labType (but NOT /dashboard/labs exactly)
    const labMatch = pathname.match(/\/dashboard\/labs\/([^/]+)/);
    
    if (labMatch && params.labType) {
      const labType = params.labType;
      
      // Get current scenario from ?scenario=N query param
      const scenarioParam = searchParams.get('scenario');
      const currentScenarioIdx = scenarioParam ? Math.max(0, parseInt(scenarioParam, 10) || 0) : 0;
      
      // Format lab title (e.g., "privesc" -> "Privilege Escalation")
      const labTitle = labType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        type: 'lab',
        labType,
        currentScenarioIdx,
        title: `${labTitle} Lab`,
        curriculum: buildLabCurriculum(labType, currentScenarioIdx),
        exitPath: '/dashboard/labs',
      };
    }

    // Not a learning page
    return null;
  }, [pathname, params, searchParams]);
}
