export type Room = {
  roomId: number;
  title: string;
  overview: string;
  meetingLink: string;
  cpReward: number;
};

export type Module = {
  moduleId: number;
  title: string;
  description: string;
  codename: string;
  ctf: string;
  rooms: Room[];
};

export type Bootcamp = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  priceLabel: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  modules: Module[];
};

export type AccessConfig = {
  started: boolean;
  unlockedModules: number[];
  unlockedRooms: Record<string, number[]>;
  quizRelease: {
    enabled: boolean;
    modules: number[];
    rooms: Record<string, number[]>;
  };
};

export type ApiClient = {
  get: (url: string) => Promise<{ data: any }>;
  post: (url: string, data?: any) => Promise<{ data: any }>;
  patch: (url: string, data?: any) => Promise<{ data: any }>;
  delete: (url: string) => Promise<{ data: any }>;
};
