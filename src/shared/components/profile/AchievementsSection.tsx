import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Trophy, Shield } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import BootcampBadge from '@/shared/components/BootcampBadge';
import { getRoomCoverImage } from '@/shared/utils/walkthroughImages';

interface CompletedRoom {
  roomId: number;
  title: string;
}

interface AchievementsSectionProps {
  rooms: CompletedRoom[];
  bootcampCompleted: boolean;
  achievementCount: number;
  i18nPrefix?: string;
  viewRoomLabel?: string;
  roomsLabel?: string;
  badgesLabel?: string;
  badgesEmptyLabel?: string;
  hpbGraduateLabel?: string;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  rooms,
  bootcampCompleted,
  achievementCount,
  i18nPrefix,
  viewRoomLabel,
  roomsLabel,
  badgesLabel,
  badgesEmptyLabel,
  hpbGraduateLabel,
}) => {
  const { t } = useTranslation();
  const [showAchievements, setShowAchievements] = useState(false);

  const prefix = i18nPrefix || 'student.profile';
  const tViewRoom = viewRoomLabel || t(`${prefix}.viewRoom`);
  const tRoomsLabel = roomsLabel || t(`${prefix}.stats.rooms`);
  const tBadgesLabel = badgesLabel || t(`${prefix}.badges`);
  const tBadgesEmpty = badgesEmptyLabel || t(`${prefix}.badgesEmpty`);
  const tHpbGraduate = hpbGraduateLabel || t(`${prefix}.hpbGraduate`);
  const tAchievements = t(`${prefix}.achievements`);
  const tCollapse = t(`${prefix}.collapse`);
  const tExpand = t(`${prefix}.expand`);

  const getRoomImage = (roomId: number) => String(getRoomCoverImage(roomId));

  return (
    <>
      {/* Achievements Strip */}
      <button
        onClick={() => setShowAchievements(!showAchievements)}
        className="w-full border border-border/30 rounded-xl bg-bg-card px-4 py-3 flex items-center gap-3 hover:bg-accent-dim/5 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Trophy className="w-4 h-4 text-accent" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-text-primary">{tAchievements}</span>
        <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-lg">{achievementCount}</span>
        <div className="ml-auto flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          {showAchievements ? tCollapse : tExpand}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAchievements ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Achievements Content */}
      <AnimatePresence initial={false}>
        {showAchievements && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6">
              {/* Badges */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">{tBadgesLabel}</h3>
                {bootcampCompleted ? (
                  <div className="flex items-center gap-3">
                    <BootcampBadge completed className="w-20 h-20" />
                    <span className="text-xs font-bold text-text-primary">{tHpbGraduate}</span>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">{tBadgesEmpty}</p>
                )}
              </div>

              {/* Completed Rooms */}
              {rooms.length > 0 && (
                <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/30">
                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
                      {tRoomsLabel}
                      <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-lg">{rooms.length}</span>
                    </h3>
                  </div>
                  <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {rooms.map((room: CompletedRoom, idx: number) => (
                      <div
                        key={`${room.roomId}-${idx}`}
                        className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)] hover:scale-[1.02]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={getRoomImage(room.roomId)}
                            alt=""
                            width={800}
                            height={600}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-card to-transparent pointer-events-none" />
                          <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg border border-accent/25 bg-bg/80 backdrop-blur-sm font-mono text-[9px] font-black text-accent uppercase tracking-wider">
                            <Shield className="w-2.5 h-2.5" /> HPB
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2 break-words">{room.title}</h3>
                          <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                            {tViewRoom} <IconArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementsSection;
