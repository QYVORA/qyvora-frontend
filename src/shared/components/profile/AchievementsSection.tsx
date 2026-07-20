import React from 'react';
import { useTranslation } from 'react-i18next';
import AchievementCard, { type Achievement } from './AchievementCard';
import BootcampBadge from '@/shared/components/BootcampBadge';

interface CompletedRoom {
  roomId: number;
  title: string;
}

interface AchievementsSectionProps {
  rooms: CompletedRoom[];
  bootcampCompleted: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
  i18nPrefix?: string;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  rooms,
  bootcampCompleted,
  labsCompleted = 0,
  coursesCompleted = 0,
  i18nPrefix,
}) => {
  const { t } = useTranslation();
  const prefix = i18nPrefix || 'student.profile';

  // Transform data into achievements
  const achievements: Achievement[] = React.useMemo(() => {
    const result: Achievement[] = [];

    // Bootcamp achievement
    if (bootcampCompleted) {
      result.push({
        id: 'bootcamp-hpb',
        type: 'bootcamp',
        title: t(`${prefix}.achievements.hpbGraduate`, 'HPB Graduate'),
        description: t(`${prefix}.achievements.hpbGraduateDesc`, 'Completed the Hacker Protocol Bootcamp'),
        rarity: 'epic',
        earnedAt: undefined, // Would need API data
      });
    }

    // Lab achievements (derived from rooms if no explicit lab count)
    const labCount = labsCompleted || rooms.length;
    if (labCount > 0) {
      result.push({
        id: 'labs-completed',
        type: 'lab',
        title: t(`${prefix}.achievements.labsCompleted`, 'Lab Operator'),
        description: t(`${prefix}.achievements.labsCompletedDesc`, `${labCount} lab${labCount !== 1 ? 's' : ''} completed`),
        rarity: labCount >= 10 ? 'rare' : labCount >= 5 ? 'uncommon' : 'common',
      });
    }

    // Course achievements
    if (coursesCompleted > 0) {
      result.push({
        id: 'courses-completed',
        type: 'course',
        title: t(`${prefix}.achievements.coursesCompleted`, 'Course Graduate'),
        description: t(`${prefix}.achievements.coursesCompletedDesc`, `${coursesCompleted} course${coursesCompleted !== 1 ? 's' : ''} completed`),
        rarity: coursesCompleted >= 5 ? 'rare' : coursesCompleted >= 2 ? 'uncommon' : 'common',
      });
    }

    // Room-specific achievements (from bootcamp rooms)
    rooms.forEach((room) => {
      result.push({
        id: `room-${room.roomId}`,
        type: 'challenge',
        title: room.title,
        description: t(`${prefix}.achievements.roomCompleted`, 'Room completed'),
        rarity: 'common',
      });
    });

    return result;
  }, [rooms, bootcampCompleted, labsCompleted, coursesCompleted, t, prefix]);

  return (
    <div className="space-y-4">
      {/* Bootcamp Badge (if completed) */}
      {bootcampCompleted && (
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5 flex items-center gap-4">
          <BootcampBadge completed className="w-16 h-16" />
          <div>
            <h3 className="text-sm font-black text-text-primary">
              {t(`${prefix}.achievements.hpbGraduate`, 'HPB Graduate')}
            </h3>
            <p className="text-xs text-text-muted">
              {t(`${prefix}.achievements.hpbGraduateDesc`, 'Completed the Hacker Protocol Bootcamp')}
            </p>
          </div>
        </div>
      )}

      {/* Achievement Grid */}
      <AchievementCard achievements={achievements} />
    </div>
  );
};

export default AchievementsSection;
