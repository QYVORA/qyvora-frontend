export interface ApiRoom {
  roomId: number;
  title: string;
  overview: string;
  locked: boolean;
  completed?: boolean;
}

export interface ApiModule {
  moduleId: number;
  title: string;
  description: string;
  locked: boolean;
  ctfCompleted?: boolean;
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
}

export interface RoomQuiz {
  scope?: { type?: string; id?: string | number; moduleId?: string | number; courseId?: string; roomId?: string };
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
