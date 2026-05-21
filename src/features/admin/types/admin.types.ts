export type AdminTab =
  | 'users' | 'bootcamps' | 'zero_day' | 'cp'
  | 'security' | 'contacts' | 'applications' | 'quizzes' | 'chain' | 'assignments';

export type AdminUser = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  role: string;
  cpPoints: number;
  bootcampAccessRevoked: boolean;
  blockedUntil?: string | null;
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
  modules: any[];
};

export type CPProduct = {
  _id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  productUrl: string;
  type: string;
  isActive: boolean;
  isFree: boolean;
  sortOrder: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  createdAt?: string;
};

export type SecurityEventItem = {
  id: string;
  createdAt: string;
  eventType: string;
  action: string;
  path: string;
  statusCode: number;
  ipAddress: string;
};

export const isUserBlocked = (u: AdminUser) =>
  Boolean(u.blockedUntil && new Date(u.blockedUntil).getTime() > Date.now());

// Shared form input / button class strings
export const INPUT_CLS = 'w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted';
export const BTN_CLS   = 'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-colors min-h-[44px]';
