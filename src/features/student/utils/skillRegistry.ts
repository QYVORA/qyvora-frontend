/**
 * SKILL MATRIX REGISTRY
 * =====================
 * Single source of truth for all learning content mapped to skill categories.
 *
 * Adding new content:
 *   1. Add the content item to the appropriate source array below
 *   2. Map it to a skill category
 *   3. The SkillMatrix component automatically picks it up
 *
 * No changes to SkillMatrix.tsx needed when adding new content.
 */

import { COURSES } from '@/features/student/data/courses/courseData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SkillDefinition {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
}

export interface LearningItem {
  id: string;
  source: 'bootcamp' | 'course' | 'lab';
  sourceLabel: string;
  skillKey: string;
}

export interface SkillProgress {
  total: number;
  completed: number;
  percentage: number;
}

// ── Skill Categories ───────────────────────────────────────────────────────────

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  { key: 'mindset',     label: 'Security Mindset', shortLabel: 'Mindset',  color: '#06B66F' },
  { key: 'linux',       label: 'Linux / Terminal',  shortLabel: 'Linux',    color: '#60A5FA' },
  { key: 'networking',  label: 'Networking',        shortLabel: 'Network',  color: '#A78BFA' },
  { key: 'web',         label: 'Web Security',      shortLabel: 'Web',      color: '#F59E0B' },
  { key: 'social',      label: 'Social Engineering', shortLabel: 'Social',  color: '#EF4444' },
  { key: 'tools',       label: 'Tools Proficiency', shortLabel: 'Tools',    color: '#8B5CF6' },
  { key: 'programming', label: 'Programming',       shortLabel: 'Code',     color: '#10B981' },
];

// ── Learning Item Registry ─────────────────────────────────────────────────────
// Every learning item on the platform. New content goes here.

function buildBootcampItems(): LearningItem[] {
  const items: LearningItem[] = [];
  const phaseToSkill: Record<number, string> = {
    1: 'mindset',
    2: 'linux',
    3: 'networking',
    4: 'web',
    5: 'social',
  };

  for (const phase of BOOTCAMP_CONFIG.phases) {
    const phaseNum = parseInt(phase.id.replace('phase', ''), 10);
    const skillKey = phaseToSkill[phaseNum];
    if (!skillKey) continue;

    for (const room of phase.rooms) {
      items.push({
        id: `bootcamp:${phase.id}:${room.id}`,
        source: 'bootcamp',
        sourceLabel: phase.codename,
        skillKey,
      });
    }
  }

  return items;
}

function buildCourseItems(): LearningItem[] {
  const items: LearningItem[] = [];
  const categoryToSkill: Record<string, string> = {
    terminal: 'linux',
    networking: 'networking',
    programming: 'programming',
    'web-security': 'web',
    wireless: 'social',
    tools: 'tools',
  };

  for (const course of COURSES) {
    const skillKey = categoryToSkill[course.categoryId];
    if (!skillKey) continue;

    items.push({
      id: `course:${course.id}`,
      source: 'course',
      sourceLabel: 'Course',
      skillKey,
    });
  }

  return items;
}

function buildLabItems(): LearningItem[] {
  const items: LearningItem[] = [];

  const LAB_CATEGORIES: { id: string; scenarios: string[]; skillKey: string }[] = [
    { id: 'privesc',           scenarios: ['privesc-001','privesc-002','privesc-003','privesc-004','privesc-005','privesc-006','privesc-007','privesc-008','privesc-009','privesc-010'], skillKey: 'linux' },
    { id: 'passwords',         scenarios: ['pwd-crack-md5-simple','pwd-crack-sha256-common','pwd-crack-bcrypt','pwd-crack-ntlm-windows','pwd-crack-shadow-extract','pwd-crack-multi-hash'], skillKey: 'tools' },
    { id: 'sql-injection',     scenarios: ['sqli-union-1','sqli-blind-1','sqli-time-1','sqli-error-1','sqli-second-1','sqli-stacked-1'], skillKey: 'web' },
    { id: 'osint',             scenarios: ['osint-email-1','osint-social-1','osint-subdomain-1','osint-breach-1','osint-full-1'], skillKey: 'mindset' },
    { id: 'kill-chain',        scenarios: ['kc-internal-1','kc-web-1'], skillKey: 'mindset' },
  ];

  for (const cat of LAB_CATEGORIES) {
    for (const scenarioId of cat.scenarios) {
      items.push({
        id: `lab:${cat.id}:${scenarioId}`,
        source: 'lab',
        sourceLabel: cat.id,
        skillKey: cat.skillKey,
      });
    }
  }

  return items;
}

// ── All Learning Items ─────────────────────────────────────────────────────────

export const ALL_LEARNING_ITEMS: LearningItem[] = [
  ...buildBootcampItems(),
  ...buildCourseItems(),
  ...buildLabItems(),
];

// ── Items grouped by skill ─────────────────────────────────────────────────────

export function getItemsForSkill(skillKey: string): LearningItem[] {
  return ALL_LEARNING_ITEMS.filter((item) => item.skillKey === skillKey);
}

// ── Progress calculation ───────────────────────────────────────────────────────

export function getCompletedItemIds(): Set<string> {
  const completed = new Set<string>();

  // 1. Bootcamp rooms — from API (passed as param, not read here)
  //    Caller passes bootcampCompletedIds

  // 2. Course lessons — from localStorage
  for (const course of COURSES) {
    try {
      const raw = localStorage.getItem(`qyvora_course_progress_${course.id}`);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const completedLessons: string[] = parsed.completedLessons || [];
      if (completedLessons.length > 0) {
        completed.add(`course:${course.id}`);
      }
    } catch {
      // ignore
    }
  }

  // 3. Lab scenarios — from localStorage
  try {
    const raw = localStorage.getItem('qyvora_lab_progress');
    if (raw) {
      const labProgress: Record<string, { completed: boolean }> = JSON.parse(raw);
      for (const [scenarioId, progress] of Object.entries(labProgress)) {
        if (progress.completed) {
          // Find the lab item by scenario ID
          const item = ALL_LEARNING_ITEMS.find(
            (i) => i.source === 'lab' && i.id.endsWith(`:${scenarioId}`),
          );
          if (item) completed.add(item.id);
        }
      }
    }
  } catch {
    // ignore
  }

  return completed;
}

export function computeSkillProgress(
  skillKey: string,
  bootcampCompletedIds: Set<string>,
  allCompletedIds: Set<string>,
): SkillProgress {
  const items = getItemsForSkill(skillKey);
  const total = items.length;
  if (total === 0) return { total: 0, completed: 0, percentage: 0 };

  let completed = 0;
  for (const item of items) {
    if (allCompletedIds.has(item.id) || bootcampCompletedIds.has(item.id)) {
      completed++;
    }
  }

  return {
    total,
    completed,
    percentage: Math.round((completed / total) * 100),
  };
}

export function computeAllSkills(
  bootcampCompletedIds: Set<string>,
): { skillKey: string; progress: SkillProgress }[] {
  const allCompleted = getCompletedItemIds();

  return SKILL_DEFINITIONS.map((def) => ({
    skillKey: def.key,
    progress: computeSkillProgress(def.key, bootcampCompletedIds, allCompleted),
  }));
}

// ── Helpers for bootcamp completion IDs ────────────────────────────────────────

interface OverviewModule {
  moduleId?: number;
  roomsCompleted?: number;
  roomsTotal?: number;
}

/**
 * Extract completed bootcamp room IDs from the overview API response.
 * Since the API only gives counts (not individual room IDs), we approximate
 * by marking the phase as partially complete based on roomsCompleted.
 */
export function extractBootcampCompletedIds(modules: OverviewModule[]): Set<string> {
  const completed = new Set<string>();

  for (const mod of modules) {
    if (!mod.moduleId) continue;
    const phaseNum = mod.moduleId;
    const phase = BOOTCAMP_CONFIG.phases.find(
      (p) => parseInt(p.id.replace('phase', ''), 10) === phaseNum,
    );
    if (!phase) continue;

    const roomsCompleted = mod.roomsCompleted ?? 0;
    // Mark the first N rooms as completed (approximation)
    for (let i = 0; i < roomsCompleted && i < phase.rooms.length; i++) {
      completed.add(`bootcamp:${phase.id}:${phase.rooms[i].id}`);
    }
  }

  return completed;
}
