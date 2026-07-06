export type AdminTab =
  | 'overview' | 'users' | 'bootcamps' | 'zero_day' | 'cp'
  | 'inbox' | 'broadcast' | 'audit' | 'security';

export type AdminUser = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  role: string;
  cpPoints: number;
  bootcampAccessRevoked: boolean;
  blockedUntil?: string | null;
  recoveryToken?: string;
  recoveryTokenCreatedAt?: string | null;
  recoveryTokenAcknowledgedAt?: string | null;
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

export type ServiceRequestItem = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  websiteUrl: string;
  message: string;
  serviceType: string;
  packageTier: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'archived';
  handledBy: { id: string; name: string; email: string } | null;
  handledAt: string | null;
  createdAt: string;
};

export type AuditLogEntry = {
  id: string;
  admin: { id: string; name: string; email: string } | null;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  ipAddress: string;
  createdAt: string;
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
