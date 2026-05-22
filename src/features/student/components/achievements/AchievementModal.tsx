import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Achievement } from './AchievementCard';
import { BadgeImage } from './BadgeImage';
import { RarityFrame } from './RarityFrame';
import { X, Calendar, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AchievementModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  isOpen,
  onClose,
}) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-bg/80 backdrop-blur-md z-50"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6 focus:outline-none"
              >
                <div className="bg-bg-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Header Decoration */}
                  <div className={`h-2 w-full ${
                    achievement.rarity === 'common' ? 'bg-slate-400' :
                    achievement.rarity === 'uncommon' ? 'bg-emerald-400' :
                    achievement.rarity === 'rare' ? 'bg-blue-400' :
                    achievement.rarity === 'epic' ? 'bg-purple-400' :
                    achievement.rarity === 'legendary' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`} />

                  <div className="p-8">
                    <button
                      onClick={onClose}
                      className="absolute top-10 right-10 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center text-center space-y-6">
                      <RarityFrame rarity={achievement.rarity} isLocked={achievement.isLocked} className="w-40 h-40">
                        <BadgeImage
                          src={achievement.image}
                          alt={achievement.title}
                          rarity={achievement.rarity}
                          isLocked={achievement.isLocked}
                          className="w-full h-full"
                        />
                      </RarityFrame>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${
                            achievement.rarity === 'common' ? 'text-slate-400 border-slate-400/20' :
                            achievement.rarity === 'uncommon' ? 'text-emerald-400 border-emerald-400/20' :
                            achievement.rarity === 'rare' ? 'text-blue-400 border-blue-400/20' :
                            achievement.rarity === 'epic' ? 'text-purple-400 border-purple-400/20' :
                            achievement.rarity === 'legendary' ? 'text-amber-400 border-amber-400/20' :
                            'text-red-400 border-red-400/20'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">
                          {achievement.title}
                        </h2>
                        <p className="text-sm text-text-secondary max-w-sm">
                          {achievement.description}
                        </p>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="text-[10px] uppercase text-text-secondary font-bold tracking-widest">Earned On</span>
                          <span className="text-xs text-text-primary font-mono">
                            {achievement.earnedAt || 'Not yet earned'}
                          </span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="text-[10px] uppercase text-text-secondary font-bold tracking-widest">Global Rarity</span>
                          <span className="text-xs text-text-primary font-mono">
                            {achievement.rarity === 'mythic' ? '0.1%' : 
                             achievement.rarity === 'legendary' ? '2.5%' :
                             achievement.rarity === 'epic' ? '8.0%' :
                             achievement.rarity === 'rare' ? '15.0%' :
                             achievement.rarity === 'uncommon' ? '45.0%' : '85.0%'}
                          </span>
                        </div>
                      </div>

                      {achievement.isLocked && achievement.progress !== undefined && achievement.total !== undefined && (
                        <div className="w-full space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                            <span>Progress</span>
                            <span>{achievement.progress} / {achievement.total}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              className="h-full bg-accent"
                            />
                          </div>
                        </div>
                      )}

                      {!achievement.isLocked && (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-4 py-2 rounded-full border border-emerald-400/10">
                          <Zap className="w-4 h-4 fill-current" />
                          <span className="text-xs font-bold uppercase tracking-widest">Achievement Synchronized with Chain</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};
