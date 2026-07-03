export interface Lesson {
  id: string;
  title: string;
  instruction: string;
  image: string | null;
  hasQuiz?: boolean;
}

export interface Course {
  id: string;
  title: string;
  categoryId: CourseCategoryId;
  description: string;
  overview: string;
  coverSvg: string;
  estimatedMinutes: number;
  cpCost: number;
  lessons: Lesson[];
  learningObjectives: string[];
}

export type CourseCategoryId =
  | 'terminal'
  | 'networking'
  | 'programming'
  | 'web-security'
  | 'wireless'
  | 'tools';

export interface CourseCategory {
  id: CourseCategoryId;
  name: string;
  description: string;
  icon: string;
}

export interface UserCourseProgress {
  courseId: string;
  completedLessons: string[];
  purchased: boolean;
}

export function isCoursePurchased(
  courseId: string,
  purchases: Set<string>,
): boolean {
  return purchases.has(courseId);
}

export function getCourseProgress(
  courseId: string,
  completedLessons: string[],
): number {
  return completedLessons.length;
}
