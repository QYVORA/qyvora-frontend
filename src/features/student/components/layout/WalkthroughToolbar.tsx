import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

/**
 * Collapsible vertical toolbar for mobile walkthrough pages (courses, labs, bootcamp rooms).
 * Appears on the right side, contains icon-only buttons stacked vertically.
 * Improves mobile UX by removing clutter from the topbar.
 */
const WalkthroughToolbar: React.FC<WalkthroughToolbarProps> = ({
  onOpenTerminal,
  onOpenIDE,
  onOpenNetworkVisualizer,
  showTerminal = true,
  showIDE = false,
  showNetworkVisualizer = false,
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
  ].filter((btn) => btn.show);

  // Don't render if no buttons to show
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
        className="w-11 h-11 rounded-full border border-border/50 bg-bg-card/95 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300 shadow-lg"
        aria-label={isExpanded ? t('aria.closeToolbar', 'Close toolbar') : t('aria.openToolbar', 'Open toolbar')}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.div>
      </motion.button>

      {/* Tool buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2"
          >
            {buttons.map((button, index) => {
              const Icon = button.icon;
              return (
                <motion.button
                  key={button.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => handleButtonClick(button.onClick)}
                  className="w-11 h-11 rounded-xl border border-border/50 bg-bg-card/95 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300 shadow-lg"
                  aria-label={t(button.labelKey)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} strokeWidth={2.5} />
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
