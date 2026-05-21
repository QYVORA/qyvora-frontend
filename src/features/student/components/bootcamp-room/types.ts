export interface ApiRoom {
  roomId: number;
  title: string;
  overview: string;
  locked: boolean;
  completed?: boolean;
}

export interface ApiAssignment {
  title: string;
  description: string;
  details: string;
}

export interface ApiModule {
  moduleId: number;
  title: string;
  description: string;
  locked: boolean;
  ctfCompleted?: boolean;
  assignmentCompleted?: boolean;
  assignment?: ApiAssignment;
  rooms: ApiRoom[];
}

export interface ApiCourse {
  id: string;
  title: string;
  modules: ApiModule[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex?: number;
}

export interface RoomQuiz {
  scope?: { type?: string; id?: string | number; moduleId?: string | number; courseId?: string };
  questions: QuizQuestion[];
}

export interface StepNote {
  phaseId: string;
  roomId: string;
  stepIdx: number;
  note: string;
  bookmarked: boolean;
  timestamp: number;
}
