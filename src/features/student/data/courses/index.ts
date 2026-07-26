export type {
  Course,
  Lesson,
  QuizQuestion,
  CourseCategory,
  CourseCategoryId,
  SkillLevel,
  UserCourseProgress,
} from './types';

export {
  COURSE_CATEGORIES,
  COURSES,
  getCoursesByCategory,
  getCourseById,
  getCategoryById,
} from './courseData';

export { ALL_LESSONS } from './lessons';
