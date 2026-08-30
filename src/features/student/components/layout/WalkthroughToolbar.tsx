import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import { useTranslation } from 'react-i18next';

interface ToolbarButton {
  key: string;
  icon: React.ElementType;
  labelKey: string;
  onClick: () => void;
  show?: boolean;
}

interface WalkthroughToolbarProps {
  onOpenTerminal: () => void;
  onOpenIDE: () => void;
  onOpenNetworkVisualizer: () => void;
  showTerminal?: boolean;
  showIDE?: boolean;
  showNetworkVisualizer?: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const WalkthroughToolbar: React.FC<WalkthroughToolbarProps> = ({
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
  showTerminal = true,
  showIDE = false,
  showNetworkVisualizer = false,
  fullscreen = false,
  onToggleFullscreen,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const buttons: ToolbarButton[] = [
    {
      key: 'terminal',
      icon: IconTerminal,
      labelKey: 'aria.openTerminal',
      onClick: onOpenTerminal,
      show: showTerminal,
    },
    {
      key: 'ide',
      icon: IconCode,
      labelKey: 'aria.openIDE',
      onClick: onOpenIDE,
      show: showIDE,
    },
    {
      key: 'network',
      icon: IconNetwork,
      labelKey: 'aria.openNetworkVisualizer',
      onClick: onOpenNetworkVisualizer,
      show: showNetworkVisualizer,
    },
    {
      key: 'fullscreen',
      icon: fullscreen ? Minimize2 : Maximize2,
      labelKey: fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
      onClick: onToggleFullscreen || (() => {}),
      show: Boolean(onToggleFullscreen),
    },
  ].filter((btn) => btn.show);

  if (buttons.length === 0) return null;

  const handleButtonClick = (onClick: () => void) => {
    onClick();
    setIsExpanded(false);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[45] flex flex-col items-end gap-2">
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-11 h-11 rounded-full border border-border/50 bg-bg-card/95 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-[border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] shadow-lg"
        aria-label={isExpanded ? t('aria.closeToolbar', 'Close toolbar') : t('aria.openToolbar', 'Open toolbar')}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.div>
      </motion.button>

      {/* Tool buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.9 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1.5"
          >
            {buttons.map((button, index) => {
              const Icon = button.icon;
              return (
                <motion.button
                  key={button.key}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{
                    duration: 0.15,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => handleButtonClick(button.onClick)}
                  className="w-11 h-11 rounded-xl border border-border/50 bg-bg-card/95 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-[border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] shadow-lg"
                  aria-label={typeof button.labelKey === 'string' && button.labelKey.startsWith('aria.') ? t(button.labelKey) : button.labelKey}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalkthroughToolbar;
