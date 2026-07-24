export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  instruction: string;
  image: string | null;
  hasQuiz?: boolean;
  quiz?: QuizQuestion[];
  hasTerminal?: boolean;
  terminalCommands?: string[];
  terminalTitle?: string;
  hasCodePlayground?: boolean;
  codePlaygroundInitial?: string;
  codePlaygroundLanguage?: string;
  codePlaygroundExpectedOutput?: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

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
}

export interface Course {
  id: string;
  title: string;
  categoryId: CourseCategoryId;
  description: string;
  overview: string;
  estimatedMinutes: number;
  cpCost: number;
  lessons: Lesson[];
  learningObjectives: string[];
  skillLevel: SkillLevel;
  prerequisites?: string[];
  popular?: boolean;
  lessonCount?: number;
}

export interface UserCourseProgress {
  courseId: string;
  completedLessons: string[];
  purchased: boolean;
}
