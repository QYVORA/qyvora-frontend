/**
 * Decorative illustration paths used across the student app.
 * All paths are relative to /public — OptionalDecorImage hides missing assets silently.
 */
export const STUDENT_DECOR = {
  /** Dashboard hub card — bottom-right corner, operator identity visual */
  hubPanelMascot: '/assets/illustrations/bootcamp-operator.webp',
  /** Learn hub hero — right side, mid height */
  learnHubMascot: '/assets/illustrations/hero-operator.webp',
  /** /bootcamps listing hero — operator at workstation */
  bootcampListMascot: '/assets/illustrations/bootcamp-operator.webp',
  /** Course curriculum header + enroll gate */
  courseCurriculumMascot: '/assets/illustrations/phase-complete-badge.webp',
  /** Wallet balance card — right side */
  walletMascot: '/assets/illustrations/hero-operator.webp',
  /** Bootcamp operator illustration — used in dashboard program section */
  bootcampOperator: '/assets/illustrations/bootcamp-operator.webp',
  /** Hero terminal panel — used in learn/dashboard sections */
  heroTerminalPanel: '/assets/illustrations/hero-terminal-panel.webp',
  /** Phase complete badge — used in progress/milestone sections */
  phaseCompleteBadge: '/assets/illustrations/phase-complete-badge.webp',
} as const;
