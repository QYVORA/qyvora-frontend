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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg lg:max-w-4xl z-50 p-4 sm:p-6 focus:outline-none"
              >
                <div className="bg-bg-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                  {/* Header Decoration */}
                  <div className={`h-1.5 w-full ${
                    achievement.rarity === 'common' ? 'bg-slate-400' :
                    achievement.rarity === 'uncommon' ? 'bg-emerald-400' :
                    achievement.rarity === 'rare' ? 'bg-blue-400' :
                    achievement.rarity === 'epic' ? 'bg-purple-400' :
                    achievement.rarity === 'legendary' ? 'bg-amber-400' :
                    'bg-red-400'
                  }`} />

                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-text-secondary hover:text-text-primary transition-all border border-white/5 backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                      
                      {/* Left: Badge Visual */}
                      <div className="flex flex-col items-center gap-6">
                        <RarityFrame rarity={achievement.rarity} isLocked={achievement.isLocked} className="w-48 h-48 lg:w-64 lg:h-64 drop-shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.15)]">
                          <BadgeImage
                            src={achievement.image}
                            alt={achievement.title}
                            rarity={achievement.rarity}
                            isLocked={achievement.isLocked}
                            className="w-full h-full"
                          />
                        </RarityFrame>

                        <div className="flex flex-col items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-sm border ${
                            achievement.rarity === 'common' ? 'text-slate-400 border-slate-400/20' :
                            achievement.rarity === 'uncommon' ? 'text-emerald-400 border-emerald-400/20' :
                            achievement.rarity === 'rare' ? 'text-blue-400 border-blue-400/20' :
                            achievement.rarity === 'epic' ? 'text-purple-400 border-purple-400/20' :
                            achievement.rarity === 'legendary' ? 'text-amber-400 border-amber-400/20' :
                            'text-red-400 border-red-400/20'
                          }`}>
                            {achievement.rarity} Rank
                          </span>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="space-y-8 text-center lg:text-left">
                        <div className="space-y-3">
                          <h2 className="text-3xl lg:text-4xl font-black text-text-primary uppercase tracking-tight leading-none">
                            {achievement.title}
                          </h2>
                          <p className="text-base text-text-secondary max-w-md mx-auto lg:mx-0 leading-relaxed opacity-80">
                            {achievement.description}
                          </p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col items-center lg:items-start gap-2 backdrop-blur-sm">
                            <Calendar className="w-4 h-4 text-accent/60" />
                            <span className="text-[10px] uppercase text-text-muted font-bold tracking-[0.2em]">Acquired</span>
                            <span className="text-xs text-text-primary font-mono font-bold">
                              {achievement.earnedAt || 'NOT YET EARNED'}
                            </span>
                          </div>
                          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col items-center lg:items-start gap-2 backdrop-blur-sm">
                            <Shield className="w-4 h-4 text-accent/60" />
                            <span className="text-[10px] uppercase text-text-muted font-bold tracking-[0.2em]">Scarcity</span>
                            <span className="text-xs text-text-primary font-mono font-bold">
                              {achievement.rarity === 'mythic' ? '0.1%' : 
                               achievement.rarity === 'legendary' ? '2.5%' :
                               achievement.rarity === 'epic' ? '8.0%' :
                               achievement.rarity === 'rare' ? '15.0%' :
                               achievement.rarity === 'uncommon' ? '45.0%' : '85.0%'}
                            </span>
                          </div>
                        </div>

                        {achievement.isLocked && achievement.progress !== undefined && achievement.total !== undefined && (
                          <div className="w-full space-y-3 pt-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                              <span>Requirement Progress</span>
                              <span className="text-accent">{achievement.progress} / {achievement.total}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                className="h-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
                              />
                            </div>
                          </div>
                        )}

                        {!achievement.isLocked && (
                          <div className="flex items-center justify-center lg:justify-start gap-3 text-emerald-400 bg-emerald-400/5 px-5 py-3 rounded-2xl border border-emerald-400/10 backdrop-blur-sm">
                            <Zap className="w-4 h-4 fill-current animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Protocol Synchronized with Chain</span>
                          </div>
                        )}
                      </div>
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
