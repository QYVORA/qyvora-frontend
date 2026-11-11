import React, { useMemo, useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import AchievementBadge from './AchievementBadge';
import SectionCard from '@/shared/components/ui/SectionCard';
import UnderlineTabs, { type TabItem } from '@/shared/components/ui/UnderlineTabs';
import {
  getAchievementById,
  BOOTCAMP_PHASE_ACHIEVEMENTS,
  BOOTCAMP_GRADUATE_ACHIEVEMENT,
  type Achievement,
} from '@/shared/constants/achievements';

export interface SkillAchievementSummary {
  skill: string;
  label: string;
  color: string;
  scenariosCompleted: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsSectionProps {
  completedCourseIds?: string[];
  completedLabIds?: string[];
  completedPhaseIds?: string[];
  bootcampCompleted?: boolean;
  skillAchievements?: SkillAchievementSummary[];
  className?: string;
}

type TabType = 'all' | 'labs' | 'bootcamp' | 'skills';

const RARITY_LABELS: Record<SkillAchievementSummary['rarity'], string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

const INITIAL_VISIBLE_COUNT = 16;

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  completedCourseIds = [],
  completedLabIds = [],
  completedPhaseIds = [],
  bootcampCompleted = false,
  skillAchievements = [],
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showAll, setShowAll] = useState(false);

  // Content and hands-on Labs share one earned collection.
  const earnedLabs = useMemo(() => {
    const earned = new Map<string, Achievement>();
    [...completedCourseIds, ...completedLabIds].forEach((id) => {
      const match = getAchievementById(id);
      if (match && (match.type === 'course' || match.type === 'lab')) {
        earned.set(match.id, match);
      }
    });
    return Array.from(earned.values());
  }, [completedCourseIds, completedLabIds]);

  // Bootcamp achievements remain distinct from Labs.
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
    return Array.from(
      new Map([...earnedLabs, ...earnedBootcamp].map((achievement) => [achievement.id, achievement])).values()
    );
  }, [earnedLabs, earnedBootcamp]);

  const displayedList = useMemo(() => {
    switch (activeTab) {
      case 'labs':
        return earnedLabs;
      case 'bootcamp':
        return earnedBootcamp;
      default:
        return allEarned;
    }
  }, [activeTab, earnedLabs, earnedBootcamp, allEarned]);

  // LEARN-BUG-001: skill achievements come from /student/skill-achievements and
  // previously never rendered. They are a distinct badge type, not an
  // `Achievement`, because the earned skill is derived from scenario counts.
  const earnedSkills = useMemo(
    () =>
      (skillAchievements || []).filter(
        (skill): skill is SkillAchievementSummary =>
          Boolean(skill?.skill) && Boolean(skill?.label) && Number(skill?.scenariosCompleted) > 0
      ),
    [skillAchievements]
  );

  const totalCount = allEarned.length + earnedSkills.length;
  const showSkills = activeTab === 'all' || activeTab === 'skills';
  const showInsignia = activeTab !== 'skills';

  if (totalCount === 0) {
    return (
      <SectionCard
        id="achievements-heading"
        title="Achievements"
        icon={<Award />}
        actions={<span className="text-sm text-text-muted">0 earned</span>}
        className={className}
      >
        <p className="py-6 text-center text-sm text-text-muted">
          No achievements recorded yet. Complete Labs to unlock earned insignia.
        </p>
      </SectionCard>
    );
  }

  const visibleItems = showAll ? displayedList : displayedList.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = displayedList.length > INITIAL_VISIBLE_COUNT;

  const tabs: TabItem[] = [
    { value: 'all', label: 'All', count: totalCount },
    ...(earnedLabs.length > 0 ? [{ value: 'labs', label: 'Labs', count: earnedLabs.length }] : []),
    ...(earnedBootcamp.length > 0 ? [{ value: 'bootcamp', label: 'Bootcamp', count: earnedBootcamp.length }] : []),
    ...(earnedSkills.length > 0 ? [{ value: 'skills', label: 'Skills', count: earnedSkills.length }] : []),
  ];

  return (
    <SectionCard
      id="achievements-heading"
      title="Achievements"
      icon={<Award />}
      actions={<span className="text-sm text-text-muted">{totalCount} earned</span>}
      className={className}
    >
      <UnderlineTabs
        tabs={tabs}
        value={activeTab}
        onChange={(next) => { setActiveTab(next as TabType); setShowAll(false); }}
        ariaLabel="Achievement categories"
        className="mb-2"
      />

      {/* 
        Badge Collection:
        Rendered directly as transparent vector logos on the page without
        wrapping each logo in a card, tile, or background box.
      */}
      <div className="pt-6">
        {showInsignia && (
          displayedList.length === 0 ? (
            (showSkills && earnedSkills.length > 0) ? null : (
              <p className="py-4 text-center text-xs text-text-muted">
                No achievements in this category.
              </p>
            )
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
          )
        )}

        {showSkills && earnedSkills.length > 0 && (
          <div
            className={
              showInsignia && displayedList.length > 0
                ? 'mt-6 border-t border-border/40 pt-6'
                : ''
            }
          >
            <ul className="flex flex-wrap gap-2.5" aria-label="Skill achievements">
              {earnedSkills.map((skill) => (
                <li
                  key={skill.skill}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-1.5"
                  style={{ borderColor: `${skill.color}66` }}
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: skill.color }} aria-hidden="true" />
                  <span className="text-[11px] font-bold text-text-primary">
                    {skill.label}
                  </span>
                  <span className="text-[12px] text-text-muted">
                    {RARITY_LABELS[skill.rarity] || skill.rarity} · {skill.scenariosCompleted}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show More / Show Less */}
        {showInsignia && hasMore && (
          <div className="mt-6 flex justify-center border-t border-border/40 pt-4">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="rounded-md border border-border-subtle px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {showAll ? 'Show fewer insignia' : `Show all ${displayedList.length} insignia`}
            </button>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default AchievementsSection;