/**
 * QYVORA Icons - Export Index
 * Re-exports lucide-react icons aliased to the legacy Icon* names.
 * All existing `import { IconXxx } from '@/shared/components/icons'` paths continue to work.
 */

export {
  // Layout / navigation
  LayoutGrid as IconDashboard,
  Menu as IconMenu,

  // Domain
  Terminal as IconBootcamp,
  FlaskConical as IconLabs,
  Flag as IconCTF,
  CircuitBoard as IconChallenges,
  Trophy as IconLeaderboard,
  ShoppingBag as IconMarketplace,
  Coins as IconWallet,
  User as IconProfile,
  Settings as IconSettings,

  // Security
  Lock as IconLock,
  Unlock as IconUnlock,
  Shield as IconShield,
  Award as IconBadge,
  Target as IconTarget,
  Award as IconCertificate,

  // Dev / terminal
  Terminal as IconTerminal,
  FileCode as IconCode,
  Skull as IconHack,
  Network as IconNetwork,
  Binary as IconBinary,
  Bug as IconExploit,
  Bug as IconBug,

  // Status / time
  Clock as IconClock,
  BarChart3 as IconRank,
  FlameKindling as IconFire,
  Bell as IconNotification,

  // Actions
  Search as IconSearch,
  Star as IconStar,
  Heart as IconHeart,
  Download as IconDownload,
  Upload as IconUpload,
  Play as IconPlay,
  Square as IconStop,

  // Feedback
  CheckCircle as IconCheck,
  XCircle as IconX,
  PlusCircle as IconPlus,
  Minus as IconMinus,
  Info as IconInfo,
  AlertTriangle as IconWarning,

  // Navigation arrows
  ArrowRight as IconArrowRight,
  ArrowLeft as IconArrowLeft,
  ChevronRight as IconChevronRight,

  // Visibility
  Eye as IconEye,
  EyeOff as IconEyeOff,
} from 'lucide-react';

import type { LucideProps } from 'lucide-react';

/** Backward-compatible alias — all custom icons used this interface. */
export type IconProps = LucideProps;

// Brand icons (custom SVGs — lucide lacks full brand coverage)
export { default as BrandXIcon } from './BrandXIcon';
export { default as BrandWhatsAppIcon } from './BrandWhatsAppIcon';
export { default as BrandLinkedinIcon } from './BrandLinkedinIcon';
export { default as BrandYoutubeIcon } from './BrandYoutubeIcon';
export { default as BrandGithubIcon } from './BrandGithubIcon';
