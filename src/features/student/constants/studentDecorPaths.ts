/**
 * Transparent PNG illustrations used as decorative overlays in student app sections.
 * All images live under public/images/student/ — OptionalDecorImage hides missing assets.
 *
 * Source illustrations are also available at public/assets/illustrations/ for reference.
 */
export const STUDENT_DECOR = {
  /** Dashboard hub card — bottom-right corner, operator identity visual */
  hubPanelMascot: '/images/student/hub-panel-mascot.png',
  /** Learn hub hero — right side, mid height */
  learnHubMascot: '/images/student/learn-hub-mascot.png',
  /** /bootcamps listing hero — operator at workstation */
  bootcampListMascot: '/images/student/bootcamp-list-mascot.png',
  /** Course curriculum header + enroll gate */
  courseCurriculumMascot: '/images/student/course-curriculum-mascot.png',
  /** Wallet balance card — right side */
  walletMascot: '/images/student/wallet-economy-mascot.png',
  /** Bootcamp operator illustration — used in dashboard program section */
  bootcampOperator: '/assets/illustrations/bootcamp-operator.png',
  /** Hero terminal panel — used in learn/dashboard sections */
  heroTerminalPanel: '/assets/illustrations/hero-terminal-panel.png',
  /** Phase complete badge — used in progress/milestone sections */
  phaseCompleteBadge: '/assets/illustrations/phase-complete-badge.png',
} as const;
