import React, { useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import AchievementBadge from './AchievementBadge';
import {
  getAchievementById,
  COURSE_ACHIEVEMENTS,
  LAB_ACHIEVEMENTS,
  BOOTCAMP_PHASE_ACHIEVEMENTS,
  BOOTCAMP_GRADUATE_ACHIEVEMENT,
  type Achievement,
} from '@/shared/constants/achievements';

interface AchievementsSectionProps {
  completedCourseIds?: string[];
  completedLabIds?: string[];
  completedRooms?: { roomId: number; title: string }[];
  rooms?: { roomId: number; title: string }[];
  completedPhaseIds?: string[];
  bootcampCompleted?: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
  skillAchievements?: any[];
  className?: string;
}

type TabType = 'all' | 'courses' | 'labs' | 'bootcamp';

const INITIAL_VISIBLE_COUNT = 16;

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  completedCourseIds = [],
  completedLabIds = [],
  completedRooms = [],
  rooms,
  completedPhaseIds = [],
  bootcampCompleted = false,
  labsCompleted = 0,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showAll, setShowAll] = useState(false);

  const actualRooms = completedRooms.length > 0 ? completedRooms : (rooms || []);

  // 1. Resolve earned course achievements
  const earnedCourses = useMemo(() => {
    const courseMap = new Map(COURSE_ACHIEVEMENTS.map((c) => [c.id, c]));
    return completedCourseIds
      .map((id) => courseMap.get(id))
      .filter((item): item is Achievement => Boolean(item));
  }, [completedCourseIds]);

  // 2. Resolve earned lab achievements
  // Handles either explicit completedLabIds or completed flags/rooms
  const earnedLabs = useMemo(() => {
    const labMap = new Map(LAB_ACHIEVEMENTS.map((l) => [l.id, l]));
    const earned = new Map<string, Achievement>();

    // From completedLabIds
    completedLabIds.forEach((id) => {
      const match = labMap.get(id) || getAchievementById(id);
      if (match) earned.set(match.id, match);
    });

    // If rooms or labs were completed, ensure matching known lab IDs are included
    const count = actualRooms.length > 0 ? actualRooms.length : labsCompleted;
    if (earned.size === 0 && count > 0) {
      // Map completed room counts to earned lab insignia if present
      LAB_ACHIEVEMENTS.slice(0, Math.min(count, LAB_ACHIEVEMENTS.length)).forEach((lab) => {
        earned.set(lab.id, lab);
      });
    }

    return Array.from(earned.values());
  }, [completedLabIds, actualRooms, labsCompleted]);

  // 3. Resolve earned bootcamp achievements (strictly preserving existing behavior)
  const earnedBootcamp = useMemo(() => {
    const list: Achievement[] = [];
    if (bootcampCompleted) {
      list.push(BOOTCAMP_GRADUATE_ACHIEVEMENT);
    }
    const phaseMap = new Map(BOOTCAMP_PHASE_ACHIEVEMENTS.map((p) => [p.id.replace('phase-', ''), p]));
    completedPhaseIds.forEach((phaseId) => {
      const cleanId = phaseId.replace(/^phase-/, '');
      const match = phaseMap.get(cleanId);
      if (match) list.push(match);
    });
    return list;
  }, [bootcampCompleted, completedPhaseIds]);

  // All earned achievements
  const allEarned = useMemo(() => {
    return [...earnedCourses, ...earnedLabs, ...earnedBootcamp];
  }, [earnedCourses, earnedLabs, earnedBootcamp]);

  const displayedList = useMemo(() => {
    switch (activeTab) {
      case 'courses':
        return earnedCourses;
      case 'labs':
        return earnedLabs;
      case 'bootcamp':
        return earnedBootcamp;
      default:
        return allEarned;
    }
  }, [activeTab, earnedCourses, earnedLabs, earnedBootcamp, allEarned]);

  const totalCount = allEarned.length;

  if (totalCount === 0) {
    return (
      <section
        aria-labelledby="achievements-heading"
        className={`rounded-2xl border border-border bg-bg-card p-6 md:p-8 ${className}`}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-accent" />
            <h2 id="achievements-heading" className="font-mono text-sm font-black uppercase tracking-wider text-text-primary">
              Earned Insignia
            </h2>
          </div>
          <span className="font-mono text-xs text-text-muted">0 Earned</span>
        </div>
        <div className="py-8 text-center">
          <p className="font-mono text-xs text-text-muted">
            No achievements recorded yet. Complete courses and labs to unlock earned insignia.
          </p>
        </div>
      </section>
    );
  }

  const visibleItems = showAll ? displayedList : displayedList.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = displayedList.length > INITIAL_VISIBLE_COUNT;

  return (
    <section
      aria-labelledby="achievements-heading"
      className={`rounded-2xl border border-border bg-bg-card p-6 md:p-8 ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Award className="h-4 w-4 text-accent" />
          <h2 id="achievements-heading" className="font-mono text-sm font-black uppercase tracking-wider text-text-primary">
            Earned Insignia
          </h2>
          <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-black text-accent">
            {totalCount}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Achievement categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => { setActiveTab('all'); setShowAll(false); }}
            className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'all'
                ? 'bg-accent text-on-accent'
                : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
            }`}
          >
            All ({totalCount})
          </button>
          {earnedCourses.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'courses'}
              onClick={() => { setActiveTab('courses'); setShowAll(false); }}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'courses'
                  ? 'bg-accent text-on-accent'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              Courses ({earnedCourses.length})
            </button>
          )}
          {earnedLabs.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'labs'}
              onClick={() => { setActiveTab('labs'); setShowAll(false); }}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'labs'
                  ? 'bg-accent text-on-accent'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              Labs ({earnedLabs.length})
            </button>
          )}
          {earnedBootcamp.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bootcamp'}
              onClick={() => { setActiveTab('bootcamp'); setShowAll(false); }}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'bootcamp'
                  ? 'bg-accent text-on-accent'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
              }`}
            >
              Bootcamp ({earnedBootcamp.length})
            </button>
          )}
        </div>
      </div>

      {/* 
        Badge Collection:
        Rendered directly as transparent vector logos on the page without
        wrapping each logo in a card, tile, or background box.
      */}
      <div className="pt-6">
        {displayedList.length === 0 ? (
          <p className="py-4 text-center font-mono text-xs text-text-muted">
            No achievements in this category.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8">
            {visibleItems.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="md"
              />
            ))}
          </div>
        )}

        {/* Show More / Show Less */}
        {hasMore && (
          <div className="mt-6 flex justify-center border-t border-border/40 pt-4">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              {showAll ? 'Show Fewer Insignia' : `Show All ${displayedList.length} Insignia`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;