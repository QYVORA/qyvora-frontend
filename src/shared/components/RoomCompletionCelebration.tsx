import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Trophy, Star } from 'lucide-react';
import CpLogo from './CpLogo';
import { useScrollLock } from '../core/hooks/useScrollLock';

interface Props {
  show: boolean;
  roomTitle: string;
  cpEarned: number;
  onClose: () => void;
}

// Hacker-themed confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
  type: 'square' | 'circle' | 'triangle' | 'line';
}

const HACKER_COLORS = [
  '#00ff41', // Matrix green
  '#00d9ff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#ff6b00', // Orange
  '#00ff88', // Mint
];

const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * -100 - 20,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      color: HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)],
      delay: Math.random() * 0.3,
      duration: Math.random() * 1.5 + 1.5,
      type: ['square', 'circle', 'triangle', 'line'][Math.floor(Math.random() * 4)] as Particle['type'],
    });
  }
  return particles;
};

const RoomCompletionCelebration: React.FC<Props> = ({ show, roomTitle, cpEarned, onClose }) => {
  useScrollLock(show);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles(50));
      setPlaySound(true);
      
      // Play celebration sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a simple celebratory sound (ascending notes)
        const playNote = (frequency: number, startTime: number, duration: number) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.1, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };
        
        // Play a quick celebratory melody
        const now = audioContext.currentTime;
        playNote(523.25, now, 0.15);        // C5
        playNote(659.25, now + 0.1, 0.15);  // E5
        playNote(783.99, now + 0.2, 0.25);  // G5
        
      } catch (e) {
        // Audio API not supported or blocked
        console.log('Audio celebration not available');
      }

      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const renderParticle = (particle: Particle) => {
    const baseClasses = "absolute";
    const size = 8 * particle.scale;

    switch (particle.type) {
      case 'square':
        return (
          <div
            className={baseClasses}
            style={{
              width: size,
              height: size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${size * 2}px ${particle.color}`,
            }}
          />
        );
      case 'circle':
        return (
          <div
            className={baseClasses}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 ${size * 2}px ${particle.color}`,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            className={baseClasses}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${particle.color}`,
              filter: `drop-shadow(0 0 ${size}px ${particle.color})`,
            }}
          />
        );
      case 'line':
        return (
          <div
            className={baseClasses}
            style={{
              width: size * 2,
              height: 2,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${size}px ${particle.color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop with glow effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: '50vw',
                  y: '50vh',
                  opacity: 0,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  x: `calc(50vw + ${particle.x}vw)`,
                  y: `calc(100vh + ${particle.y}vh)`,
                  opacity: [0, 1, 1, 0],
                  rotate: particle.rotation * 3,
                  scale: [0, particle.scale, particle.scale, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                }}
              >
                {renderParticle(particle)}
              </motion.div>
            ))}
          </div>

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
            className="relative z-10 pointer-events-auto"
          >
            <div className="relative overflow-hidden rounded-3xl border-2 border-accent bg-bg-card p-8 md:p-12 max-w-md mx-4 shadow-2xl">
              {/* Animated glow background */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/20 blur-3xl"
              />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon with pulse animation */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent shadow-lg"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-bg" />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-3xl font-black text-accent uppercase tracking-wide md:text-4xl"
                >
                  Room Cleared!
                </motion.h2>

                {/* Room title */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 text-lg font-bold text-text-primary"
                >
                  {roomTitle}
                </motion.p>

                {/* CP Reward */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.5,
                  }}
                  className="mb-6 inline-flex items-center gap-3 rounded-2xl border-2 border-accent/30 bg-accent-dim px-6 py-4"
                >
                  <Zap className="h-6 w-6 text-accent" />
                  <span className="font-mono text-2xl font-black text-accent">+{cpEarned}</span>
                  <CpLogo className="h-6 w-6" />
                </motion.div>

                {/* Stats badges */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-3 mb-6"
                >
                  <div className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-dim/40 px-3 py-1.5">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span className="text-xs font-black uppercase tracking-wider text-accent">Progress++</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-dim/40 px-3 py-1.5">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-xs font-black uppercase tracking-wider text-accent">Skills++</span>
                  </div>
                </motion.div>

                {/* Message */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-text-muted"
                >
                  Keep pushing forward, operator.
                </motion.p>

                {/* Close button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={onClose}
                  className="mt-6 btn-secondary px-8 py-2.5 text-sm font-black uppercase"
                >
                  Continue
                </motion.button>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 h-20 w-20 border-t-2 border-l-2 border-accent/30 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-accent/30 rounded-br-3xl" />
            </div>
          </motion.div>

          {/* Scan line effect */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoomCompletionCelebration;
