export interface MissionTemplate {
  id: string;
  title: string;
  brief: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cpReward: number;
  actionType: 'lab_flag' | 'course_quiz' | 'standalone_check';
}

export type MissionStatus = 'not_started' | 'in_progress' | 'completed';

export interface WeeklyOperationStep {
  id: string;
  label: string;
  cpReward: number;
  completed: boolean;
}

export interface WeeklyOperation {
  id: string;
  title: string;
  brief: string;
  steps: WeeklyOperationStep[];
  badge: string;
  cpReward: number;
}

export interface EngagementResponse {
  mission: MissionTemplate;
  status: MissionStatus;
  completedAt: string | null;
  cpAwarded: number;
  weeklyOperation: WeeklyOperation;
  weeklyStatus: MissionStatus;
  weeklyCompletedAt: string | null;
  weeklyCpAwarded: number;
  weeklyDaysRemaining: number;
  weeklyProgress: number;
}
