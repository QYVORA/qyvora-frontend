export type AdminTab =
  | 'overview' | 'users' | 'bootcamps' | 'instructor' | 'zero_day' | 'cp'
  | 'inbox' | 'broadcast' | 'audit' | 'security' | 'incidents'
  | 'certificates';

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
  lastLoginAt?: string | null;
  lastLoginIp?: string;
  lastLoginUserAgent?: string;
  lastLoginDeviceId?: string;
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
  /** Same value as SecurityEvent.requestId for the originating HTTP request. */
  correlationId?: string;
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
  requestId?: string;
};

export type IncidentStatus = 'open' | 'monitoring' | 'resolved';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentItem = {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  /** Published on the public status page when true. */
  isPublic: boolean;
  correlationId: string;
  createdBy: { id: string; name: string; email: string } | null;
  resolvedBy: { id: string; name: string; email: string } | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InstructorRisk = 'blocked' | 'stalled' | 'on_track' | 'completed';
export type InstructorEscalationReason =
  | 'blocked_access' | 'no_progress' | 'missed_sessions' | 'technical_issue' | 'other';
export type InstructorEscalationStatus = 'open' | 'acknowledged' | 'resolved';

export type InstructorEscalationItem = {
  id: string;
  cohortId: string;
  studentId: string;
  instructorId: string;
  reason: InstructorEscalationReason;
  note: string;
  status: InstructorEscalationStatus;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InstructorLearner = {
  id: string;
  name: string;
  email: string;
  hackerHandle: string;
  bootcampId: string;
  bootcampStatus: string;
  cpPoints: number;
  progressPercent: number;
  completedRooms: number;
  totalRooms: number;
  completedModules: number;
  totalModules: number;
  currentModule: { moduleId: number; title: string } | null;
  lastActivityAt: string | null;
  daysSinceActivity: number | null;
  risk: InstructorRisk;
  escalations: InstructorEscalationItem[];
};

export type InstructorCohortSummary = {
  id: string;
  name: string;
  description: string;
  capacity: number | null;
  memberCount: number;
  completedCount: number;
  blockedCount: number;
  stalledCount: number;
  openEscalations: number;
  activeEscalations: number;
  averageProgress: number;
  startDate: string | null;
  endDate: string | null;
};

export type InstructorCohortDetail = InstructorCohortSummary & {
  members: InstructorLearner[];
};

export const isUserBlocked = (u: AdminUser) =>
  Boolean(u.blockedUntil && new Date(u.blockedUntil).getTime() > Date.now());

// Shared form input / button class strings
export const INPUT_CLS = 'w-full bg-surface-raised border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted';
export const BTN_CLS   = 'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-colors min-h-[44px]';
