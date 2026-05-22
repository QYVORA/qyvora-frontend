import React, { useState } from 'react';
import { AchievementCategory } from '../components/achievements/AchievementCategory';
import { AchievementModal } from '../components/achievements/AchievementModal';
import { Achievement } from '../components/achievements/AchievementCard';
import { Trophy, Target, Book, Terminal, Shield, Zap, Flame, Award } from 'lucide-react';
import { motion } from 'motion/react';

// Mock Data - In a real app, this would come from an API
const MOCK_ACHIEVEMENTS: Record<string, Achievement[]> = {
  "CP Milestones": [
    { id: 'cp_2000', title: 'Seed Fund', description: 'Begin your journey with 2000 Community Points.', image: '/assets/achievements/badges/common/cp_2000.png', rarity: 'common', isLocked: false, earnedAt: '2024-01-01' },
    { id: 'cp_5000', title: 'Accumulator', description: 'Reach a balance of 5000 Community Points.', image: '/assets/achievements/badges/rare/cp_5000.png', rarity: 'rare', isLocked: true, progress: 3450, total: 5000 },
    { id: 'cp_10000', title: 'Capitalist', description: 'Reach a balance of 10000 Community Points.', image: '/assets/achievements/badges/epic/cp_10000.png', rarity: 'epic', isLocked: true, progress: 3450, total: 10000 },
  ],
  "Content Mastery": [
    { id: 'first_room', title: 'First Step', description: 'Complete your first bootcamp room.', image: '/assets/achievements/badges/common/first_room.png', rarity: 'common', isLocked: false, earnedAt: '2024-01-05' },
    { id: 'linux_specialist', title: 'Linux Specialist', description: 'Complete all rooms in the Linux Foundations module.', image: '/assets/achievements/badges/uncommon/linux_specialist.png', rarity: 'uncommon', isLocked: false, earnedAt: '2024-02-12' },
    { id: 'networking_ninja', title: 'Networking Ninja', description: 'Complete all rooms in the Networking module.', image: '/assets/achievements/badges/uncommon/networking_ninja.png', rarity: 'uncommon', isLocked: true, progress: 2, total: 4 },
  ],
  "Elite Status": [
    { id: 'protocol_ascendant', title: 'Protocol Ascendant', description: 'Reach the highest rank in the Hacker Protocol bootcamp.', image: '/assets/achievements/badges/legendary/protocol_ascendant.png', rarity: 'legendary', isLocked: true },
    { id: 'zero_day', title: 'Zero Day Pioneer', description: 'Discover and report a critical platform vulnerability.', image: '/assets/achievements/badges/mythic/zero_day.png', rarity: 'mythic', isLocked: true },
  ]
};

const CATEGORY_ICONS = {
  "CP Milestones": Zap,
  "Content Mastery": Book,
  "Elite Status": Shield,
};

const AchievementsPage: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const totalEarned = Object.values(MOCK_ACHIEVEMENTS).flat().filter(a => !a.isLocked).length;
  const totalPossible = Object.values(MOCK_ACHIEVEMENTS).flat().length;

  return (
    <div className="min-h-screen bg-bg p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-[0.3em]">
            <Trophy className="w-4 h-4" />
            <span>Operational Milestones</span>
          </div>
          <h1 className="text-4xl font-black text-text-primary uppercase tracking-tight italic">
            Achievements
          </h1>
          <p className="text-text-secondary max-w-md">
            Track your progress through the protocol. Each badge represents a verified operational capability or milestone.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <span className="block text-2xl font-black text-text-primary font-mono">{totalEarned}</span>
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Earned</span>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <span className="block text-2xl font-black text-accent font-mono">
              {Math.round((totalEarned / totalPossible) * 100)}%
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Complete</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {Object.entries(MOCK_ACHIEVEMENTS).map(([category, achievements]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AchievementCategory
              title={category}
              icon={CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Award}
              achievements={achievements}
              onAchievementClick={handleAchievementClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-accent/5 border border-accent/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-accent/10 rounded-full">
          <Zap className="w-8 h-8 text-accent fill-accent/20" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-text-primary uppercase">Blockchain Verified</h3>
          <p className="text-sm text-text-secondary max-w-xl">
            All achievements are cryptographically signed and stored on the HSOCIETY internal chain. Once earned, they are permanent records of your professional development.
          </p>
        </div>
      </div>

      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AchievementsPage;
