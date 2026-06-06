export interface LiveClass {
  title: string;
  instructor?: string;
  time?: string;
  link: string;
}

export interface Room {
  roomId: number;
  title: string;
  overview: string;
  locked: boolean;
  completed?: boolean;
  readingContent?: string;
  bullets?: string[];
  meetingLink?: string;
  liveClass?: LiveClass;
}

export interface Module {
  moduleId: number;
  title: string;
  description: string;
  codename: string;
  roleTitle: string;
  badge: string;
  locked: boolean;
  rooms: Room[];
  progress?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

export interface Course {
  id: string;
  title: string;
  modules: Module[];
}
